package com.momcare.momcare_backend.dto;

public record DonorRegistrationRequest(
    String name,
    String phone,
    String bloodType,
    Double latitude,
    Double longitude
) {} 