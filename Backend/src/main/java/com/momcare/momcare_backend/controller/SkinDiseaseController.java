package com.momcare.momcare_backend.controller;

import com.momcare.momcare_backend.service.SkinDiseaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/skin-disease")
public class SkinDiseaseController {

    @Autowired
    private SkinDiseaseService skinDiseaseService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeSkinDisease(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(skinDiseaseService.analyzeImage(file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error analyzing image: " + e.getMessage());
        }
    }
} 