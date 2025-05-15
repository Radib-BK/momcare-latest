package com.momcare.momcare_backend.service;

import com.momcare.momcare_backend.dto.UserProfileDTO;
import com.momcare.momcare_backend.exception.AuthenticationException;
import com.momcare.momcare_backend.model.User;
import com.momcare.momcare_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final FileStorageService fileStorageService;

    public User register(String name, String email, String password) {
        log.info("Attempting to register user with email: {}", email);
        
        if (userRepository.findByEmail(email).isPresent()) {
            log.warn("Registration failed: Email already exists: {}", email);
            throw new AuthenticationException("Email already registered");
        }

        try {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .build();
            User savedUser = userRepository.save(user);
            log.info("Successfully registered user with email: {}", email);
            return savedUser;
        } catch (Exception e) {
            log.error("Error during user registration: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to register user: " + e.getMessage());
        }
    }

    public Optional<User> authenticate(String email, String password) {
        log.info("Attempting to authenticate user with email: {}", email);
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.warn("Authentication failed: User not found with email: {}", email);
            return Optional.empty();
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            log.warn("Authentication failed: Invalid password for email: {}", email);
            return Optional.empty();
        }

        log.info("Successfully authenticated user with email: {}", email);
        return Optional.of(user);
    }

    public UserProfileDTO getUserProfileByEmail(String email) {
        log.info("Fetching profile for user email: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new AuthenticationException("User not found"));
            
        UserProfileDTO profileDTO = new UserProfileDTO();
        profileDTO.setName(user.getName());
        profileDTO.setEmail(user.getEmail());
        profileDTO.setAddress(user.getAddress());
        profileDTO.setPhoneNumber(user.getPhoneNumber());
        profileDTO.setBloodType(user.getBloodType());
        profileDTO.setPregnancyStatus(user.getPregnancyStatus());
        profileDTO.setDueDate(user.getDueDate());
        profileDTO.setProfileImageUrl(user.getProfileImageUrl());
        
        return profileDTO;
    }
    
    public UserProfileDTO updateUserProfileByEmail(String email, UserProfileDTO profileDTO) {
        log.info("Updating profile for user email: {}", email);
        
        try {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("User not found"));
                
            user.setName(profileDTO.getName());
            user.setAddress(profileDTO.getAddress());
            user.setPhoneNumber(profileDTO.getPhoneNumber());
            
            // Handle null values for status fields
            user.setBloodType(profileDTO.getBloodType() != null ? 
                profileDTO.getBloodType() : "UNSPECIFIED");
            user.setPregnancyStatus(profileDTO.getPregnancyStatus() != null ? 
                profileDTO.getPregnancyStatus() : "UNSPECIFIED");
            
            // Handle due date
            user.setDueDate(profileDTO.getDueDate());
            
            user = userRepository.save(user);
            log.info("Successfully updated profile for user: {}", email);
            
            // Update DTO with saved values
            profileDTO.setEmail(user.getEmail()); // Email cannot be changed
            profileDTO.setProfileImageUrl(user.getProfileImageUrl());
            profileDTO.setBloodType(user.getBloodType());
            profileDTO.setPregnancyStatus(user.getPregnancyStatus());
            return profileDTO;
            
        } catch (Exception e) {
            log.error("Error updating profile for user {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to update profile: " + e.getMessage());
        }
    }
    
    public String updateProfileImageByEmail(String email, MultipartFile file) throws IOException {
        log.info("Updating profile image for user email: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new AuthenticationException("User not found"));
            
        // Delete old profile image if exists
        if (user.getProfileImageUrl() != null) {
            fileStorageService.deleteFile(user.getProfileImageUrl());
        }
        
        // Store new file
        String fileName = fileStorageService.storeFile(file);
        user.setProfileImageUrl(fileName);
        userRepository.save(user);
        
        return fileName;
    }
} 