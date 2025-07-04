package com.momcare.momcare_backend.controller;

import com.momcare.momcare_backend.service.RagChatbot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/nlp")
public class RagChatbotController {

    @Autowired
    private RagChatbot ragChatbot;

    @PostMapping("/rag-query")
    public ResponseEntity<?> ragQuery(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "context", required = false) String context,
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) {
        try {
            // If files is null, pass an empty array to avoid NPE in service
            MultipartFile[] normalizedFiles = (files != null) ? files : new MultipartFile[0];
            return ResponseEntity.ok(ragChatbot.ragQuery(query, context, normalizedFiles));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error analyzing image: " + e.getMessage());
        }
    }
}