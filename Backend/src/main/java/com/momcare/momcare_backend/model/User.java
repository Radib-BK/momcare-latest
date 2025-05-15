package com.momcare.momcare_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "blood_type")
    @Builder.Default
    private String bloodType = "UNSPECIFIED";

    @Column(name = "pregnancy_status")
    @Builder.Default
    private String pregnancyStatus = "UNSPECIFIED";

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
        updatedAt = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDate.now();
    }
} 