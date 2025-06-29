package com.momcare.momcare_backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserProfileDTO {
    private String name;
    private String email;
    private String address;
    private String phoneNumber;
    private String bloodType;
    private String pregnancyStatus;
    private LocalDate dueDate;
    private String profileImageUrl;
} 