package com.styliste.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value(value="${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir != null && !uploadDir.isBlank() ? uploadDir : "uploads/images").toAbsolutePath();
        Path rootUploadPath = uploadPath.getParent() != null && uploadPath.endsWith("images") ? uploadPath.getParent() : uploadPath;
        String absolutePath = rootUploadPath.toFile().getAbsolutePath();
        registry.addResourceHandler("/uploads/**").addResourceLocations("file:" + absolutePath + "/");
    }
}
