package com.momcare.momcare_backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.converter.HttpMessageNotReadableException;
import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException ex) {
        log.error("Authentication error: {}", ex.getMessage());
        return ResponseEntity.status(401).body(ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log.error("Invalid request format: {}", ex.getMessage());
        if (ex.getMessage().contains("BloodType")) {
            return ResponseEntity.status(400).body("Invalid blood type value provided");
        } else if (ex.getMessage().contains("PregnancyStatus")) {
            return ResponseEntity.status(400).body("Invalid pregnancy status value provided");
        }
        return ResponseEntity.status(400).body("Invalid request format");
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        log.error("Runtime error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(500).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(500).body("An unexpected error occurred. Please try again later.");
    }
} 