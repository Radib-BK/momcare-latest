package com.momcare.momcare_backend.dto;

public record AuthResponse(
    String token,
    String email,
    String name
) {} 