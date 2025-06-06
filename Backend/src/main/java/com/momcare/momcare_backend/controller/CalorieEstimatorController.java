package com.momcare.momcare_backend.controller;

import com.momcare.momcare_backend.service.CalorieEstimatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CalorieEstimatorController {

    @Autowired
    private CalorieEstimatorService calorieEstimatorService;

    @PostMapping("/calorie-estimate")
    public ResponseEntity<String> estimateCalories(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"No file uploaded\"}");
            }

            return calorieEstimatorService.estimateCalories(file);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("{\"error\": \"Internal server error\"}");
        }
    }
} 