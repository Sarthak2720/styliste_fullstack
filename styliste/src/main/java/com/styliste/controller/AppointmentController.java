/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.AppointmentController
 *  com.styliste.dto.ApiResponse
 *  com.styliste.dto.AppointmentDTO
 *  com.styliste.dto.AppointmentStatisticsDTO
 *  com.styliste.dto.CreateAppointmentRequest
 *  com.styliste.dto.CreateGuestAppointmentRequest
 *  com.styliste.dto.UpdateAppointmentRequest
 *  com.styliste.entity.ServiceType
 *  com.styliste.entity.User
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.AppointmentService
 *  jakarta.validation.Valid
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.format.annotation.DateTimeFormat
 *  org.springframework.format.annotation.DateTimeFormat$ISO
 *  org.springframework.http.HttpStatus
 *  org.springframework.http.HttpStatusCode
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.security.core.Authentication
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.DeleteMapping
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.PutMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.styliste.dto.ApiResponse;
import com.styliste.dto.AppointmentDTO;
import com.styliste.dto.AppointmentStatisticsDTO;
import com.styliste.dto.CreateAppointmentRequest;
import com.styliste.dto.CreateGuestAppointmentRequest;
import com.styliste.dto.UpdateAppointmentRequest;
import com.styliste.entity.ServiceType;
import com.styliste.entity.User;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.UserRepository;
import com.styliste.service.AppointmentService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/appointments"})
@CrossOrigin(origins={"*"})
public class AppointmentController {
    private static final Logger log = LoggerFactory.getLogger(AppointmentController.class);
    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize(value="hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<AppointmentDTO>> createAppointment(@Valid @RequestBody CreateAppointmentRequest request, Authentication authentication) {
        Long userId = this.extractUserIdFromAuth(authentication);
        AppointmentDTO dto = this.appointmentService.createAppointment(userId, request);
        return ResponseEntity.status((HttpStatusCode)HttpStatus.CREATED).body(ApiResponse.<AppointmentDTO>builder().success(true).message("Appointment request submitted. You will receive confirmation via email.").data(dto).build());
    }

    @GetMapping(value={"/available-slots"})
    public ResponseEntity<List<LocalTime>> getAvailableSlots(@RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(this.appointmentService.getAvailableSlots(date));
    }

    @PutMapping(value={"/{id}/approve"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<AppointmentDTO> approveAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(this.appointmentService.approveAppointment(id));
    }

    @PutMapping(value={"/{id}/reject"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<AppointmentDTO> rejectAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(this.appointmentService.rejectAppointment(id));
    }

    @PostMapping(value={"/guest"})
    public ResponseEntity<ApiResponse<AppointmentDTO>> bookGuestAppointment(@Valid @RequestBody CreateGuestAppointmentRequest request) {
        AppointmentDTO dto = this.appointmentService.createGuestAppointment(request);
        return ResponseEntity.status((HttpStatusCode)HttpStatus.CREATED).body(ApiResponse.<AppointmentDTO>builder().success(true).message("Your appointment request has been received. You will get a confirmation email after admin approval.").data(dto).build());
    }

    @GetMapping(value={"/{id}"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id, Authentication authentication) {
        log.info("Fetching appointment with ID: {}", id);
        AppointmentDTO appointment = this.appointmentService.getAppointmentById(id);
        Long currentUserId = this.extractUserIdFromAuth(authentication);
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!(isAdmin || appointment.getUserId() != null && appointment.getUserId().equals(currentUserId))) {
            return ResponseEntity.status((HttpStatusCode)HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(appointment);
    }

    @GetMapping(value={"/types"})
    public ResponseEntity<List<ServiceType>> getAllServiceTypes() {
        return ResponseEntity.ok(Arrays.asList(ServiceType.values()));
    }

    @PutMapping(value={"/{id}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<AppointmentDTO> updateAppointment(@PathVariable Long id, @Valid @RequestBody UpdateAppointmentRequest request) {
        log.info("Updating appointment with ID: {}", id);
        return ResponseEntity.ok(this.appointmentService.updateAppointment(id, request));
    }

    @DeleteMapping(value={"/{id}"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long id) {
        log.info("Cancelling appointment with ID: {}", id);
        this.appointmentService.cancelAppointment(id);
        return ResponseEntity.ok("Appointment cancelled successfully");
    }

    @GetMapping(value={"/user/{userId}"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Page<AppointmentDTO>> getUserAppointments(@PathVariable Long userId, @RequestParam(required=false) Integer page, @RequestParam(required=false) Integer pageSize, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Long currentUserId = this.extractUserIdFromAuth(authentication);
        if (!isAdmin && !currentUserId.equals(userId)) {
            return ResponseEntity.status((HttpStatusCode)HttpStatus.FORBIDDEN).build();
        }
        log.info("Fetching appointments for user: {}", userId);
        return ResponseEntity.ok(this.appointmentService.getUserAppointments(userId, page, pageSize));
    }

    @GetMapping
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<Page<AppointmentDTO>> getAllAppointments(@RequestParam(required=false) Integer page, @RequestParam(required=false) Integer pageSize) {
        log.info("Fetching all appointments");
        return ResponseEntity.ok(this.appointmentService.getAllAppointments(page, pageSize));
    }

    @GetMapping(value={"/date/{date}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDate(@PathVariable @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate date) {
        log.info("Fetching appointments for date: {}", date);
        return ResponseEntity.ok(this.appointmentService.getAppointmentsByDate(date));
    }

    @GetMapping(value={"/statistics"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<AppointmentStatisticsDTO> getAppointmentStatistics() {
        log.info("Fetching appointment statistics");
        return ResponseEntity.ok(this.appointmentService.getAppointmentStatistics());
    }

    private Long extractUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        User user = (User)this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        return user.getId();
    }
}

