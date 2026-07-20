package com.styliste.controller;

import com.styliste.dto.RecordTryOnRequest;
import com.styliste.dto.TryOnResponseDTO;
import com.styliste.entity.User;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.UserRepository;
import com.styliste.service.VirtualTryOnService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/try-on")
public class VirtualTryOnController {

    @Autowired
    private VirtualTryOnService tryOnService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/record")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<TryOnResponseDTO> recordTryOn(
            @RequestBody @Valid RecordTryOnRequest request,
            Authentication authentication) {
        Long userId = extractUserId(authentication);
        TryOnResponseDTO saved = tryOnService.recordTryOn(userId, request);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<TryOnResponseDTO>> getHistory(Authentication authentication) {
        Long userId = extractUserId(authentication);
        List<TryOnResponseDTO> history = tryOnService.getUserTryOnHistory(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/admin/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TryOnResponseDTO>> getAdminHistory() {
        List<TryOnResponseDTO> history = tryOnService.getAllTryOnHistory();
        return ResponseEntity.ok(history);
    }

    private User extractUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Long extractUserId(Authentication authentication) {
        return extractUser(authentication).getId();
    }
}
