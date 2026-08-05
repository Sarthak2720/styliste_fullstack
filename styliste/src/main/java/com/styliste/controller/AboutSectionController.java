package com.styliste.controller;

import com.styliste.entity.AboutSection;
import com.styliste.service.AboutSectionService;
import com.styliste.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/about-sections")
public class AboutSectionController {

    @Autowired
    private AboutSectionService aboutSectionService;

    @Autowired
    private FileStorageService fileStorageService;

    // Public GET endpoints
    @GetMapping
    public ResponseEntity<List<AboutSection>> getAllSections() {
        return ResponseEntity.ok(aboutSectionService.getAllSections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AboutSection> getSectionById(@PathVariable Long id) {
        return ResponseEntity.ok(aboutSectionService.getSectionById(id));
    }

    // Admin-only endpoints
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AboutSection> createSection(@RequestBody AboutSection section) {
        return ResponseEntity.ok(aboutSectionService.createSection(section));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AboutSection> updateSection(@PathVariable Long id, @RequestBody AboutSection sectionDetails) {
        return ResponseEntity.ok(aboutSectionService.updateSection(id, sectionDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteSection(@PathVariable Long id) {
        aboutSectionService.deleteSection(id);
        return ResponseEntity.ok(Map.of("deleted", Boolean.TRUE));
    }

    @PutMapping("/reorder")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> reorderSections(@RequestBody List<Long> sectionIds) {
        aboutSectionService.reorderSections(sectionIds);
        return ResponseEntity.ok(Map.of("reordered", Boolean.TRUE));
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "image") String type) {
        String fileUrl = fileStorageService.saveFile(file, type);
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
