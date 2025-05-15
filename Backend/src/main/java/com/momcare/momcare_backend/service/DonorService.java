package com.momcare.momcare_backend.service;

import com.momcare.momcare_backend.model.Donor;
import com.momcare.momcare_backend.model.User;
import com.momcare.momcare_backend.repository.DonorRepository;
import com.momcare.momcare_backend.repository.UserRepository;
import com.momcare.momcare_backend.exception.AuthenticationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonorService {
    private final DonorRepository donorRepository;
    private final UserRepository userRepository;

    @Transactional
    public Donor registerAsDonor(String email, Double latitude, Double longitude) {
        log.info("Registering user as donor: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new AuthenticationException("User not found"));

        // Check if user already registered as donor
        List<Donor> existingDonors = donorRepository.findByUserId(user.getId());
        if (!existingDonors.isEmpty()) {
            Donor existingDonor = existingDonors.get(0);
            existingDonor.setLatitude(latitude);
            existingDonor.setLongitude(longitude);
            existingDonor.setIsAvailable(true);
            return donorRepository.save(existingDonor);
        }

        // Create new donor
        Donor donor = Donor.builder()
            .user(user)
            .bloodType(user.getBloodType())
            .latitude(latitude)
            .longitude(longitude)
            .isAvailable(true)
            .build();

        return donorRepository.save(donor);
    }

    @Transactional
    public void updateDonorStatus(String email, Boolean isAvailable) {
        log.info("Updating donor status for user: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new AuthenticationException("User not found"));

        List<Donor> donors = donorRepository.findByUserId(user.getId());
        if (donors.isEmpty()) {
            throw new IllegalStateException("User is not registered as a donor");
        }

        Donor donor = donors.get(0);
        donor.setIsAvailable(isAvailable);
        donorRepository.save(donor);
    }

    public List<Donor> findNearbyDonors(double latitude, double longitude, String bloodType, double radiusKm, int limit) {
        log.info("Finding nearby donors: lat={}, lng={}, bloodType={}, radius={}km", latitude, longitude, bloodType, radiusKm);
        
        if (bloodType != null && !bloodType.equals("UNSPECIFIED")) {
            return donorRepository.findNearbyDonors(latitude, longitude, bloodType, radiusKm, limit);
        } else {
            return donorRepository.findNearbyDonorsAnyBloodType(latitude, longitude, radiusKm, limit);
        }
    }

    @Transactional
    public void updateDonorLocation(String email, Double latitude, Double longitude) {
        log.info("Updating donor location for user: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new AuthenticationException("User not found"));

        List<Donor> donors = donorRepository.findByUserId(user.getId());
        if (donors.isEmpty()) {
            throw new IllegalStateException("User is not registered as a donor");
        }

        Donor donor = donors.get(0);
        donor.setLatitude(latitude);
        donor.setLongitude(longitude);
        donorRepository.save(donor);
    }
} 