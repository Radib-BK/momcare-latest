package com.momcare.momcare_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
public class PrescriptionAnalyzer {

    @Value("${python.rag_chatbot.url}")
    private String pythonServiceUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public PrescriptionAnalyzer() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, Object> analyzeImage(MultipartFile file) throws Exception {
        // Create headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Create request body
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };
        body.add("file", fileResource);

        // Create the HTTP request
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // Make the request to Python service
        ResponseEntity<String> response = restTemplate.exchange(
            pythonServiceUrl + "/v1/nlp/rag-query/",
            HttpMethod.POST,
            requestEntity,
            String.class
        );

        // Parse and return the response
        return objectMapper.readValue(response.getBody(), Map.class);
    }

    public Map<String, Object> ocrImage(MultipartFile file) throws Exception {
        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Prepare body
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };
        body.add("files", fileResource); // 'files' matches FastAPI param
        body.add("query", "Ocr the image");
        body.add("context", "Give OCR");

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // Call FastAPI endpoint
        ResponseEntity<String> response = restTemplate.exchange(
            pythonServiceUrl + "/v1/nlp/rag-query/",
            HttpMethod.POST,
            requestEntity,
            String.class
        );

        return objectMapper.readValue(response.getBody(), Map.class);
    }

    public Map<String, Object> ragQuery(String query, String context, MultipartFile[] files) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        if (query != null) body.add("query", query);
        if (context != null) body.add("context", context);

        if (files != null) {
            for (MultipartFile file : files) {
                ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                    @Override
                    public String getFilename() {
                        return file.getOriginalFilename();
                    }
                };
                body.add("files", fileResource);
            }
        }

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
            pythonServiceUrl + "/v1/nlp/rag-query/",
            HttpMethod.POST,
            requestEntity,
            String.class
        );

        return objectMapper.readValue(response.getBody(), Map.class);
    }
}