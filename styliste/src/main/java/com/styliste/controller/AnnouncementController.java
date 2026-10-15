package com.styliste.controller;

import com.styliste.entity.AnnouncementPopup;
import com.styliste.service.AnnouncementPopupService;
import com.styliste.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AnnouncementController {

    @Autowired
    private AnnouncementPopupService popupService;

    @Autowired
    private FileStorageService fileStorageService;

    // ==========================================
    // Public Endpoints
    // ==========================================

    @GetMapping("/announcements/active")
    public ResponseEntity<AnnouncementPopup> getActiveAnnouncement() {
        return popupService.getActiveAnnouncement()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // ==========================================
    // Admin Endpoints
    // ==========================================

    @GetMapping("/admin/announcements")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnnouncementPopup>> getAllAnnouncements() {
        return ResponseEntity.ok(popupService.getAllAnnouncements());
    }

    @GetMapping("/admin/announcements/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementPopup> getAnnouncementById(@PathVariable Long id) {
        return ResponseEntity.ok(popupService.getAnnouncementById(id));
    }

    @PostMapping("/admin/announcements")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementPopup> createAnnouncement(@RequestBody AnnouncementPopup popup) {
        return ResponseEntity.ok(popupService.createAnnouncement(popup));
    }

    @PutMapping("/admin/announcements/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementPopup> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody AnnouncementPopup popupDetails) {
        return ResponseEntity.ok(popupService.updateAnnouncement(id, popupDetails));
    }

    @PatchMapping("/admin/announcements/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementPopup> toggleEnabled(@PathVariable Long id) {
        return ResponseEntity.ok(popupService.toggleEnabled(id));
    }

    @DeleteMapping("/admin/announcements/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteAnnouncement(@PathVariable Long id) {
        popupService.deleteAnnouncement(id);
        return ResponseEntity.ok(Map.of("deleted", Boolean.TRUE));
    }

    @PostMapping(value = "/admin/announcements/upload", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadPopupImage(
            @RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.saveFile(file, "image");
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
