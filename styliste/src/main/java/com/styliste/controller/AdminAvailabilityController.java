/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.AdminAvailabilityController
 *  com.styliste.dto.AdminAvailabilityDTO
 *  com.styliste.dto.AdminAvailabilityRequest
 *  com.styliste.dto.ApiResponse
 *  com.styliste.entity.User
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.AdminAvailabilityService
 *  jakarta.validation.Valid
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.format.annotation.DateTimeFormat
 *  org.springframework.format.annotation.DateTimeFormat$ISO
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.security.core.Authentication
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.DeleteMapping
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.styliste.dto.AdminAvailabilityDTO;
import com.styliste.dto.AdminAvailabilityRequest;
import com.styliste.dto.ApiResponse;
import com.styliste.entity.User;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.UserRepository;
import com.styliste.service.AdminAvailabilityService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/admin/availability"})
@CrossOrigin(origins={"*"})
@PreAuthorize(value="hasRole('ADMIN')")
public class AdminAvailabilityController {
    private static final Logger log = LoggerFactory.getLogger(AdminAvailabilityController.class);
    @Autowired
    private AdminAvailabilityService availabilityService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<AdminAvailabilityDTO>> createUnavailability(@Valid @RequestBody AdminAvailabilityRequest request, Authentication authentication) {
        Long adminId = this.extractUserIdFromAuth(authentication);
        AdminAvailabilityDTO dto = this.availabilityService.createUnavailability(request, adminId);
        return ResponseEntity.ok(ApiResponse.<AdminAvailabilityDTO>builder().success(true).message("Unavailability created successfully").data(dto).build());
    }

    @GetMapping(value={"/upcoming"})
    public ResponseEntity<List<AdminAvailabilityDTO>> getUpcomingUnavailability() {
        return ResponseEntity.ok(this.availabilityService.getUpcomingUnavailability());
    }

    @GetMapping(value={"/date/{date}"})
    public ResponseEntity<List<AdminAvailabilityDTO>> getUnavailabilityForDate(@PathVariable @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(this.availabilityService.getUnavailabilityForDate(date));
    }

    @DeleteMapping(value={"/{id}"})
    public ResponseEntity<ApiResponse<Void>> deleteUnavailability(@PathVariable Long id) {
        this.availabilityService.deleteUnavailability(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Unavailability removed successfully").build());
    }

    private Long extractUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        User user = (User)this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        return user.getId();
    }
}

