package com.momcare.momcare_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CalorieEstimatorService {

    @Value("${python.food.url}")
    private String pythonFoodUrl;

    private final RestTemplate restTemplate;

    public CalorieEstimatorService() {
        this.restTemplate = new RestTemplate();
    }

    public ResponseEntity<String> estimateCalories(MultipartFile file) {
        try {
            // Set up headers for multipart request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Create multipart body
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Make request to Python service
            String url = pythonFoodUrl + "/api/calorie-estimate";
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            return response;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Failed to analyze food\"}");
        }
    }
} 