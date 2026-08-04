package com.styliste.controller;

import com.styliste.entity.SystemSetting;
import com.styliste.entity.Testimonial;
import com.styliste.entity.VideoTestimonial;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.SystemSettingRepository;
import com.styliste.repository.TestimonialRepository;
import com.styliste.repository.VideoTestimonialRepository;
import com.styliste.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/testimonials")
public class TestimonialController {

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private VideoTestimonialRepository videoTestimonialRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Helper class to convert base64 payload to MultipartFile so we can reuse FileStorageService
    private static class Base64MultipartFile implements MultipartFile {
        private final byte[] content;
        private final String name;
        private final String originalFilename;
        private final String contentType;

        public Base64MultipartFile(byte[] content, String name, String originalFilename, String contentType) {
            this.content = content;
            this.name = name;
            this.originalFilename = originalFilename;
            this.contentType = contentType;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getOriginalFilename() {
            return originalFilename;
        }

        @Override
        public String getContentType() {
            return contentType;
        }

        @Override
        public boolean isEmpty() {
            return content == null || content.length == 0;
        }

        @Override
        public long getSize() {
            return content.length;
        }

        @Override
        public byte[] getBytes() throws IOException {
            return content;
        }

        @Override
        public InputStream getInputStream() throws IOException {
            return new ByteArrayInputStream(content);
        }

        @Override
        public void transferTo(File dest) throws IOException, IllegalStateException {
            Files.write(dest.toPath(), content);
        }
    }

    private String processBase64Data(String data, String type) {
        if (data == null || !data.startsWith("data:")) {
            return data;
        }
        try {
            int commaIdx = data.indexOf(",");
            if (commaIdx == -1) return data;

            String header = data.substring(0, commaIdx);
            String base64Content = data.substring(commaIdx + 1);

            String mimeType = header.substring(header.indexOf(":") + 1, header.indexOf(";"));
            String extension = "";
            if (mimeType.contains("/")) {
                extension = "." + mimeType.split("/")[1];
            }
            if (extension.contains("+")) {
                extension = extension.substring(0, extension.indexOf("+"));
            }

            byte[] decodedBytes = Base64.getDecoder().decode(base64Content.trim());
            String fileName = "upload_" + System.currentTimeMillis() + extension;

            Base64MultipartFile multipartFile = new Base64MultipartFile(
                    decodedBytes,
                    "file",
                    fileName,
                    mimeType
            );

            return fileStorageService.saveFile(multipartFile, type);
        } catch (Exception e) {
            // Log error and return original data in case of error
            System.err.println("Error processing base64 testimonial upload: " + e.getMessage());
            return data;
        }
    }

    // ==========================================
    // TEXT/PHOTO TESTIMONIALS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Testimonial>> getAllTestimonials() {
        return ResponseEntity.ok(testimonialRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
        if (testimonial.getPhoto() != null) {
            testimonial.setPhoto(processBase64Data(testimonial.getPhoto(), "image"));
        }
        return ResponseEntity.ok(testimonialRepository.save(testimonial));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Testimonial> updateTestimonial(@PathVariable Long id, @RequestBody Testimonial testimonialDetails) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with id: " + id));

        testimonial.setName(testimonialDetails.getName());
        testimonial.setLocation(testimonialDetails.getLocation());
        testimonial.setRating(testimonialDetails.getRating());
        testimonial.setTag(testimonialDetails.getTag());
        testimonial.setMessage(testimonialDetails.getMessage());
        
        if (testimonialDetails.getPhoto() != null) {
            testimonial.setPhoto(processBase64Data(testimonialDetails.getPhoto(), "image"));
        }

        return ResponseEntity.ok(testimonialRepository.save(testimonial));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteTestimonial(@PathVariable Long id) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with id: " + id));

        testimonialRepository.delete(testimonial);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // VIDEO TESTIMONIALS
    // ==========================================

    @GetMapping("/videos")
    public ResponseEntity<List<VideoTestimonial>> getAllVideos() {
        return ResponseEntity.ok(videoTestimonialRepository.findAll());
    }

    @PostMapping("/videos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VideoTestimonial> createVideo(@RequestBody VideoTestimonial videoTestimonial) {
        if (videoTestimonial.getVideoUrl() != null) {
            videoTestimonial.setVideoUrl(processBase64Data(videoTestimonial.getVideoUrl(), "video"));
        }
        return ResponseEntity.ok(videoTestimonialRepository.save(videoTestimonial));
    }

    @PutMapping("/videos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VideoTestimonial> updateVideo(@PathVariable Long id, @RequestBody VideoTestimonial videoDetails) {
        VideoTestimonial video = videoTestimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video testimonial not found with id: " + id));

        video.setCaption(videoDetails.getCaption());
        if (videoDetails.getVideoUrl() != null) {
            video.setVideoUrl(processBase64Data(videoDetails.getVideoUrl(), "video"));
        }

        return ResponseEntity.ok(videoTestimonialRepository.save(video));
    }

    @DeleteMapping("/videos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteVideo(@PathVariable Long id) {
        VideoTestimonial video = videoTestimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video testimonial not found with id: " + id));

        videoTestimonialRepository.delete(video);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type) {
        String fileUrl = fileStorageService.saveFile(file, type);
        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // FEATURED QUOTE BANNER
    // ==========================================

    @GetMapping("/quote")
    public ResponseEntity<Map<String, String>> getFeaturedQuote() {
        SystemSetting setting = systemSettingRepository.findById("featured_quote").orElse(null);
        Map<String, String> response = new HashMap<>();
        response.put("quote", setting != null ? setting.getValue() : "");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/quote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> updateFeaturedQuote(@RequestBody Map<String, String> request) {
        String quoteValue = request.get("quote");
        SystemSetting setting = systemSettingRepository.findById("featured_quote").orElse(null);
        if (setting == null) {
            setting = SystemSetting.builder()
                    .key("featured_quote")
                    .value(quoteValue)
                    .build();
        } else {
            setting.setValue(quoteValue);
        }
        systemSettingRepository.save(setting);

        Map<String, String> response = new HashMap<>();
        response.put("quote", quoteValue);
        return ResponseEntity.ok(response);
    }
}
