package com.momcare.momcare_backend.controller;

import com.momcare.momcare_backend.dto.AuthResponse;
import com.momcare.momcare_backend.dto.LoginRequest;
import com.momcare.momcare_backend.dto.RegisterRequest;
import com.momcare.momcare_backend.dto.UserProfileDTO;
import com.momcare.momcare_backend.exception.AuthenticationException;
import com.momcare.momcare_backend.model.User;
import com.momcare.momcare_backend.security.JwtUtil;
import com.momcare.momcare_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/auth/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        User user = userService.register(
            request.name(), 
            request.email(), 
            request.password()
        );
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getName()));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return userService.authenticate(request.email(), request.password())
                .map(user -> ResponseEntity.ok(new AuthResponse(jwtUtil.generateToken(user.getEmail()), user.getEmail(), user.getName())))
                .orElseThrow(() -> new AuthenticationException("Invalid credentials"));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(@RequestHeader("Authorization") String token) {
        String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
        UserProfileDTO profile = userService.getUserProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody UserProfileDTO profileDTO) {
        String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
        UserProfileDTO updatedProfile = userService.updateUserProfileByEmail(email, profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }
    
    @PostMapping("/profile/image")
    public ResponseEntity<String> uploadProfileImage(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) throws IOException {
        String email = jwtUtil.getEmailFromToken(token.replace("Bearer ", ""));
        String fileName = userService.updateProfileImageByEmail(email, file);
        return ResponseEntity.ok(fileName);
    }
    
    // Test endpoint to verify controller is working
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is running!");
    }
} 