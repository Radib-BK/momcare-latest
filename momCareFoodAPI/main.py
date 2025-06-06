# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import io
import json
import torch

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model directly
processor = AutoImageProcessor.from_pretrained("nateraw/food")
model = AutoModelForImageClassification.from_pretrained("nateraw/food")

SPOONACULAR_API_KEY = "34827ffe67c644eabaa3459cefebfec6"

@app.post("/api/calorie-estimate")
async def estimate_calories(file: UploadFile = File(...)):
    try:
        # Read and process the uploaded image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Classify the food using Hugging Face model
        inputs = processor(image, return_tensors="pt")
        
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Get predictions
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        predicted_class_id = predictions.argmax().item()
        confidence = predictions[0][predicted_class_id].item()
        
        # Get the food name from model config
        food_name = model.config.id2label[predicted_class_id].replace('_', ' ').title()
        
        # Get calorie information from Spoonacular API
        spoonacular_url = f"https://api.spoonacular.com/food/ingredients/search"
        params = {
            'query': food_name,
            'apiKey': SPOONACULAR_API_KEY,
            'number': 1
        }
        
        response = requests.get(spoonacular_url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            if data['results']:
                ingredient_id = data['results'][0]['id']
                
                # Get nutrition information
                nutrition_url = f"https://api.spoonacular.com/food/ingredients/{ingredient_id}/information"
                nutrition_params = {
                    'apiKey': SPOONACULAR_API_KEY,
                    'amount': 100,
                    'unit': 'grams'
                }
                
                nutrition_response = requests.get(nutrition_url, params=nutrition_params)
                
                if nutrition_response.status_code == 200:
                    nutrition_data = nutrition_response.json()
                    
                    # Extract calories per 100g
                    calories_per_100g = 0
                    if 'nutrition' in nutrition_data and 'nutrients' in nutrition_data['nutrition']:
                        for nutrient in nutrition_data['nutrition']['nutrients']:
                            if nutrient['name'].lower() == 'calories':
                                calories_per_100g = int(nutrient['amount'])
                                break
                    
                    # If we couldn't get calories from detailed nutrition, use a fallback
                    if calories_per_100g == 0:
                        # Fallback calorie estimates for common foods
                        calorie_estimates = {
                            'pizza': 266, 'bread': 265, 'pasta': 131, 'rice': 130,
                            'chicken': 165, 'beef': 250, 'fish': 206, 'egg': 155,
                            'apple': 52, 'banana': 89, 'orange': 47, 'salad': 15,
                            'cheese': 113, 'milk': 42, 'yogurt': 59, 'butter': 717
                        }
                        
                        for key, value in calorie_estimates.items():
                            if key in food_name.lower():
                                calories_per_100g = value
                                break
                        
                        # Default estimate if no match found
                        if calories_per_100g == 0:
                            calories_per_100g = 200
        
        return {
            "food": food_name,
            "calories_per_100g": calories_per_100g if 'calories_per_100g' in locals() else 200,
            "confidence": round(confidence, 3)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/")
async def root():
    return {"message": "MomCare Food Calorie Estimation API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
