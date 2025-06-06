package com.momcare.momcare_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "product")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "image_url", unique = true)
    private String imageUrl;
    
    @Column(name = "price_per_unit")
    private Double pricePerUnit;
    
    @Column(name = "medicine_name")
    private String medicineName;
    
    private String description;
}
