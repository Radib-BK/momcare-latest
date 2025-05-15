package com.momcare.momcare_backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    @PostConstruct
    public void init() {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }
    
    public String storeFile(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        
        // Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName != null ? 
            originalFileName.substring(originalFileName.lastIndexOf(".")) : ".jpg";
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        // Copy file to upload directory
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        try {
            // Try to set file permissions (only works on POSIX systems)
            Set<PosixFilePermission> permissions = PosixFilePermissions.fromString("rw-r--r--");
            Files.setPosixFilePermissions(targetLocation, permissions);
        } catch (Exception e) {
            // Ignore permission setting errors on non-POSIX systems
        }
        
        return fileName;
    }
    
    public void deleteFile(String fileName) throws IOException {
        if (fileName == null) return;
        
        Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
        Files.deleteIfExists(filePath);
    }
    
    public Path getFilePath(String fileName) {
        return Paths.get(uploadDir).resolve(fileName).normalize();
    }
} 