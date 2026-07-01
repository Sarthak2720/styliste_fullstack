package com.styliste.controller;

import com.styliste.dto.MeasurementDTO;
import com.styliste.dto.ProcessMeasurementJobResponse;
import com.styliste.dto.ProcessMeasurementSubmitResponse;
import com.styliste.dto.SaveMeasurementRequest;
import com.styliste.entity.User;
import com.styliste.entity.UserRole;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.UserRepository;
import com.styliste.service.MeasurementJobService;
import com.styliste.service.MeasurementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/measurements")
public class MeasurementController {

@Autowired
private MeasurementService measurementService;

@Autowired
private MeasurementJobService measurementJobService;

@Autowired
private UserRepository userRepository;

/**
* Submit measurement processing (async). Returns immediately with jobId.
* Frontend should poll GET /api/measurements/process/{jobId} for status.
* When status is COMPLETED, show popup notification and optionally fetch full measurement.
*/
@PostMapping(value = "/process", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
@PreAuthorize("hasRole('CUSTOMER')")
public ResponseEntity<ProcessMeasurementSubmitResponse> submitMeasurementProcess(
@RequestParam("gender") String gender,
@RequestParam("age") Integer age,
@RequestParam("height") Double height,
@RequestParam(value = "height_unit", defaultValue = "cm") String heightUnit,
@RequestParam("weight") Double weight,
@RequestParam(value = "weight_unit", defaultValue = "kg") String weightUnit,
@RequestParam(value = "age_group", required = false) String ageGroup,
@RequestParam(value = "fat_distribution", required = false) String fatDistribution,
@RequestParam(value = "body_type", required = false) String bodyType,
@RequestParam(value = "activity_level", required = false) String activityLevel,
@RequestParam(value = "muscle_level", required = false) String muscleLevel,
@RequestParam(value = "shoulder_type", required = false) String shoulderType,
@RequestParam(value = "measurement_goal", required = false) String measurementGoal,
@RequestParam(value = "fit_preference", required = false) String fitPreference,
@RequestParam("front_image") MultipartFile frontImage,
@RequestParam("side_image") MultipartFile sideImage,
Authentication authentication) {

if (gender == null || (!"male".equalsIgnoreCase(gender) && !"female".equalsIgnoreCase(gender))) {
throw new BadRequestException("gender must be 'male' or 'female'");
}
if (age == null || age < 13 || age > 100) {
throw new BadRequestException("age must be between 13 and 100");
}
if (height == null || height <= 0) {
throw new BadRequestException("Valid height is required");
}
if (weight == null || weight <= 0) {
throw new BadRequestException("Valid weight is required");
}
if (frontImage == null || frontImage.isEmpty()) {
throw new BadRequestException("Front image is required");
}
if (sideImage == null || sideImage.isEmpty()) {
throw new BadRequestException("Side image is required");
}

Long userId = extractUserId(authentication);
MeasurementJobService.ProcessJobParams params = MeasurementJobService.ProcessJobParams.builder()
.userId(userId)
.gender(gender.toLowerCase())
.age(age)
.height(height)
.heightUnit(heightUnit)
.weight(weight)
.weightUnit(weightUnit)
.ageGroup(ageGroup)
.fatDistribution(fatDistribution)
.bodyType(bodyType)
.activityLevel(activityLevel)
.muscleLevel(muscleLevel)
.shoulderType(shoulderType)
.measurementGoal(measurementGoal)
.fitPreference(fitPreference)
.frontImage(frontImage)
.sideImage(sideImage)
.build();

ProcessMeasurementSubmitResponse response = measurementJobService.submitJob(userId, params);
return ResponseEntity.accepted().body(response);
}

/**
* Poll for measurement job status. When status is COMPLETED, measurements are included.
*/
@GetMapping("/process/{jobId}")
@PreAuthorize("hasRole('CUSTOMER')")
public ResponseEntity<ProcessMeasurementJobResponse> getMeasurementProcessStatus(
@PathVariable Long jobId,
Authentication authentication) {
Long userId = extractUserId(authentication);
ProcessMeasurementJobResponse response = measurementJobService.getJobStatus(jobId, userId);
return ResponseEntity.ok(response);
}

@PostMapping
@PreAuthorize("hasRole('CUSTOMER')")
public ResponseEntity<MeasurementDTO> saveMeasurement(
@RequestBody SaveMeasurementRequest request,
Authentication authentication) {
Long userId = extractUserId(authentication);
MeasurementDTO saved = measurementService.saveMeasurement(userId, request);
return ResponseEntity.ok(saved);
}

@GetMapping
@PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
public ResponseEntity<List<MeasurementDTO>> getUserMeasurements(Authentication authentication) {
User user = extractUser(authentication);
if (user.getRole() == UserRole.ADMIN) {
return ResponseEntity.ok(measurementService.getAllMeasurements());
}
return ResponseEntity.ok(measurementService.getUserMeasurements(user.getId()));
}

@GetMapping("/{id}")
@PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
public ResponseEntity<MeasurementDTO> getMeasurement(
@PathVariable Long id,
Authentication authentication) {
User user = extractUser(authentication);
if (user.getRole() == UserRole.ADMIN) {
return ResponseEntity.ok(measurementService.getMeasurementByIdAdmin(id));
}
return ResponseEntity.ok(measurementService.getMeasurementById(user.getId(), id));
}

@DeleteMapping("/{id}")
@PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
public ResponseEntity<Void> deleteMeasurement(
@PathVariable Long id,
Authentication authentication) {
User user = extractUser(authentication);
if (user.getRole() == UserRole.ADMIN) {
measurementService.deleteMeasurementAdmin(id);
} else {
measurementService.deleteMeasurement(user.getId(), id);
}
return ResponseEntity.noContent().build();
}

@GetMapping("/admin/all")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<MeasurementDTO>> getAllMeasurementsAdmin() {
return ResponseEntity.ok(measurementService.getAllMeasurements());
}

@GetMapping("/user/{userId}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<MeasurementDTO>> getMeasurementsForUser(@PathVariable Long userId) {
return ResponseEntity.ok(measurementService.getUserMeasurements(userId));
}

private User extractUser(Authentication authentication) {
String email = authentication.getName();
return userRepository.findByEmail(email)
.orElseThrow(()  -> new ResourceNotFoundException("User not found"));
}

private Long extractUserId(Authentication authentication) {
return extractUser(authentication).getId();
}
}
