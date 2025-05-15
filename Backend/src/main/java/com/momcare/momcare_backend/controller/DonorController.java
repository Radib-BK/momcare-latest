package com.momcare.momcare_backend.controller;

import com.momcare.momcare_backend.model.Donor;
import com.momcare.momcare_backend.service.DonorService;
import com.momcare.momcare_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class DonorController {
    private final DonorService donorService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Donor> registerAsDonor(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Double> location) {
        String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
        Donor donor = donorService.registerAsDonor(email, location.get("latitude"), location.get("longitude"));
        return ResponseEntity.ok(donor);
    }

    @PutMapping("/status")
    public ResponseEntity<Void> updateDonorStatus(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Boolean> status) {
        String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
        donorService.updateDonorStatus(email, status.get("isAvailable"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Donor>> findNearbyDonors(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(required = false) String bloodType,
            @RequestParam(defaultValue = "10.0") double radiusKm,
            @RequestParam(defaultValue = "20") int limit) {
        List<Donor> donors = donorService.findNearbyDonors(latitude, longitude, bloodType, radiusKm, limit);
        return ResponseEntity.ok(donors);
    }

    @PutMapping("/location")
    public ResponseEntity<Void> updateDonorLocation(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Double> location) {
        String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
        donorService.updateDonorLocation(email, location.get("latitude"), location.get("longitude"));
        return ResponseEntity.ok().build();
    }
} 