package com.momcare.momcare_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Remove any trailing slashes from uploadDir
        String normalizedPath = uploadDir.endsWith("/") || uploadDir.endsWith("\\") 
            ? uploadDir.substring(0, uploadDir.length() - 1) 
            : uploadDir;
            
        registry.addResourceHandler("/api/uploads/**")
                .addResourceLocations("file:" + normalizedPath + "/")
                .setCachePeriod(3600)
                .resourceChain(true);
    }
} 