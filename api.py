import csv
import io
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from lib.pineconeDB import DB
import requests
import uuid
import uvicorn
import socket
from typing import List, Optional
import base64
import os
import pdfplumber
from tqdm import tqdm
import re


load_dotenv()

LMSTUDIO_HOST= os.getenv("LMSTUDIO_HOST")
LMSTUDIO_PORT= int(os.getenv("LMSTUDIO_PORT"))

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
EMBED_MODEL = os.getenv("EMBED_MODEL")
LLM_MODEL = os.getenv("LLM_MODEL")
WINDOW_SIZE = 1000
STEP_SIZE = 100

   
app = FastAPI()

def get_embedding(text):
    url = f"{LMSTUDIO_HOST}:{LMSTUDIO_PORT}/v1/embeddings"
    response = requests.post(
        url,
        json={"model": EMBED_MODEL, "input": text}
    )
    response.raise_for_status()
    return response.json()["data"][0]["embedding"]

def ask_llm(context, question, files: Optional[List[UploadFile]] = None):
    images = [
        {
            "type": "image_url",
            "image_url": {
                "url": f"data:{file.content_type};base64,{base64.b64encode(file.file.read()).decode()}"
            }
        }
        for file in files if hasattr(file, "content_type") and file.content_type and file.content_type.startswith("image/")
    ] if files else []

    user_message = {
        "role": "user",
        "content": f"Context:\n{context}\n\nQuestion: {question}"
    }
    if images:
        user_message["content"] = [
            {"type": "text", "text": f"Context:\n{context}\n\nQuestion: {question}"},
            *images
        ]

    messages = [
        {"role": "system", "content": "You are a helpful assistant MomCare, made by MomCare. Answer the question based on the context. Context can have several medcines inforamtion, answer them in seperate paragraph. If context is insufficient, answer from your knowledge logically. If you find any url give like this at first- 'Image_Url:<>'"},
        user_message
    ]
    payload = {
        "model": LLM_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": -1,
        "stream": False
    }

    response = requests.post(
        f"{LMSTUDIO_HOST}:{LMSTUDIO_PORT}/v1/chat/completions",
        json=payload
    )
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"].strip()

def search_index(index, query, top_k=5, score_threshold=0.5):
    query_emb = get_embedding(query)
    results = index.query(vector=query_emb, top_k=top_k, include_metadata=True)
    filtered = [match["metadata"]["text"] for match in results["matches"] if match["score"] >= score_threshold]
    return filtered

def sliding_window_chunking(text, window_size, step_size):
    words = text.split()
    chunks = []
    
    for i in range(0, len(words) - window_size + 1, step_size):
        chunk = ' '.join(words[i:i + window_size])
        chunks.append(chunk)
    
    return chunks

def load_and_chunk_pdf_uploadfile(upload_file: UploadFile, window_size=WINDOW_SIZE, step_size=STEP_SIZE):
    chunks = []
    upload_file.file.seek(0)
    with pdfplumber.open(upload_file.file) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            text = text.strip()
            if text:
                page_chunks = sliding_window_chunking(text, window_size, step_size)
                chunks.extend(page_chunks)
    return chunks


def upload_to_pinecone(index, chunks):
    vectors = []
    for chunk in tqdm(chunks, desc="Embedding & Uploading"):
        embedding = get_embedding(chunk)
        vectors.append({
            "id": str(uuid.uuid4()),
            "values": embedding,
            "metadata": {"text": chunk}
        })
    index.upsert(vectors)

@app.post("/v1/nlp/rag-upload/")
async def rag_upload(file: UploadFile = File(...)):
    filename = file.filename.lower()
    chunks = []
    if filename.endswith(".csv"):
        content = await file.read()
        csvfile = io.StringIO(content.decode("utf-8"))
        reader = csv.DictReader(csvfile)
        for row in reader:
            chunk = []
            for col, val in row.items():
                chunk.append(f"{col}: {val}")
            chunk_text = " | ".join(chunk)
            chunks.append(chunk_text)
    elif filename.endswith(".pdf"):
        chunks = load_and_chunk_pdf_uploadfile(file)
    else:
        return JSONResponse({"status": "error", "message": "Unsupported file type"}, status_code=400)
    pinecone_index = DB.get_index(dimension=1024)
    upload_to_pinecone(pinecone_index, chunks)
    return JSONResponse({"status": "success", "chunks_uploaded": len(chunks)})

@app.post("/v1/nlp/rag-query/")
async def rag_query(
    request: Request,
    query: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None),
    context: Optional[str] = Form(None)
):
    if request.headers.get("content-type", "").startswith("application/json"):
        data = await request.json()
        query = data.get("content") or data.get("query")
        images = data.get("images", [])
        files = []
        for img in images:
            if isinstance(img, dict) and "data" in img and "mime_type" in img:
                from starlette.datastructures import UploadFile as StarletteUploadFile
                import io
                file_bytes = base64.b64decode(img["data"])
                upload_file = StarletteUploadFile(filename="image", file=io.BytesIO(file_bytes), content_type=img["mime_type"])
                files.append(upload_file)
            elif isinstance(img, str):
                from starlette.datastructures import UploadFile as StarletteUploadFile
                import io
                file_bytes = base64.b64decode(img)
                upload_file = StarletteUploadFile(filename="image", file=io.BytesIO(file_bytes), content_type="image/png")
                files.append(upload_file)
        context = data.get("context", None)
    elif files or context is not None:
        pass

    if context is not None:
        context_chunks = context
    else:
        pinecone_index = DB.get_index(dimension=1024)
        context_chunks = set(search_index(pinecone_index, query))
        context_chunks = list(context_chunks)

    # Extract medicine_name, price_per_unit, description, and image_urls from context_chunks if available
    medicine_name = set()
    price_per_unit = set()
    description = set()
    extracted_image_urls = set()
    if 'context_chunks' in locals() and context_chunks:
        entity_contexts = []
        chunks_iter = context_chunks if isinstance(context_chunks, list) else [context_chunks]
        for chunk in chunks_iter:
            parts = {k.strip().lower(): v.strip() for k, v in (
                (p.split(':', 1)[0], p.split(':', 1)[1]) for p in chunk.split('|') if ':' in p
            )}
            entity_contexts.append(
                f"medicine_name: {parts.get('medicine_name', '')}, price_per_unit: {parts.get('price_per_unit', '')}, description: {parts.get('description', '')}"
            )

            if 'medicine_name' in parts:
                medicine_name.add(parts['medicine_name'])
            if 'price_per_unit' in parts:
                price_per_unit.add(parts['price_per_unit'])
            if 'description' in parts:
                description.add(parts['description'])
            if 'image_url' in parts:
                extracted_image_urls.add(parts['image_url'])
        used_context = "\n".join(entity_contexts)
    else:
        used_context = ""
      

    # print(used_context)
    answer = ask_llm(used_context, query, files)

    return JSONResponse({
        "answer": answer,
        "medicine_name": list(medicine_name),
        "price_per_unit": list(price_per_unit),
        "description": list(description),
        "image_url": list(extracted_image_urls)
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9010, reload=False)

