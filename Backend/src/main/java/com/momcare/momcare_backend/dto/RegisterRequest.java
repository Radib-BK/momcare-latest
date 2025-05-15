package com.momcare.momcare_backend.dto;

public record RegisterRequest(
    String name,
    String email,
    String password
) {} 