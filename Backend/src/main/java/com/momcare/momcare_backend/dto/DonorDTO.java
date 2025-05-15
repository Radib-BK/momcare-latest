package com.momcare.momcare_backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class DonorDTO {
    private Long id;
    private String name;
    private String bloodType;
    private String phoneNumber;
    private Double latitude;
    private Double longitude;
    private Boolean isAvailable;
    private LocalDate lastDonationDate;
} 