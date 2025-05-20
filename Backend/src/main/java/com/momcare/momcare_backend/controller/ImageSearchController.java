package com.momcare.momcare_backend.controller;

import com.momcare.momcare_backend.service.ImageSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/image-search")
@CrossOrigin(origins = "*")
public class ImageSearchController {

    @Autowired
    private ImageSearchService imageSearchService;

    @PostMapping
    public ResponseEntity<?> searchByImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "top_k", required = false, defaultValue = "5") int top_k) {
        try {
            Map<String, Object> result = imageSearchService.searchByImage(file, top_k);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // Log the exception for debugging
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Image search failed");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(error);
        }
    }
}