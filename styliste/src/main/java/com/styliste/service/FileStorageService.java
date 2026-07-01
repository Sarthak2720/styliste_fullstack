/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.service.FileStorageService
 *  jakarta.annotation.PostConstruct
 *  org.springframework.beans.factory.annotation.Value
 *  org.springframework.stereotype.Service
 *  org.springframework.web.multipart.MultipartFile
 */
package com.styliste.service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.FileAttribute;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
    @Value(value="${file.upload-dir}")
    private String uploadDir;
    @Value(value="${file.video-dir}")
    private String videoDir;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(this.uploadDir, new String[0]), new FileAttribute[0]);
            Files.createDirectories(Paths.get(this.videoDir, new String[0]), new FileAttribute[0]);
        }
        catch (IOException e) {
            throw new RuntimeException("Could not create upload folders!");
        }
    }

    public String saveFile(MultipartFile file, String type) {
        try {
            String targetDir = type.equalsIgnoreCase("video") ? this.videoDir : this.uploadDir;
            Path root = Paths.get(targetDir, new String[0]);
            String originalName = file.getOriginalFilename();
            if (originalName == null || originalName.isEmpty()) {
                originalName = "file";
            }
            String cleanName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
            String fileName = UUID.randomUUID().toString() + "_" + cleanName;
            Path destinationFile = root.resolve(fileName).normalize().toAbsolutePath();
            if (!destinationFile.getParent().equals(root.toAbsolutePath())) {
                throw new RuntimeException("Cannot store file outside current directory.");
            }
            try (InputStream inputStream = file.getInputStream();){
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
            String subFolder = type.equalsIgnoreCase("video") ? "videos/" : "images/";
            return "/uploads/" + subFolder + fileName;
        }
        catch (Exception e) {
            throw new RuntimeException("Could not store " + type + ". Error: " + e.getMessage());
        }
    }
}

