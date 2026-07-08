/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.fasterxml.jackson.core.JsonProcessingException
 *  com.fasterxml.jackson.core.type.TypeReference
 *  com.fasterxml.jackson.databind.ObjectMapper
 *  com.styliste.dto.MeasurementDTO
 *  com.styliste.dto.SaveMeasurementRequest
 *  com.styliste.entity.Address
 *  com.styliste.entity.Measurement
 *  com.styliste.entity.User
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.MeasurementRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.MeasurementService
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 */
package com.styliste.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.styliste.dto.MeasurementDTO;
import com.styliste.dto.SaveMeasurementRequest;
import com.styliste.entity.Address;
import com.styliste.entity.Measurement;
import com.styliste.entity.User;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.MeasurementRepository;
import com.styliste.repository.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MeasurementService {
    private static final Logger log = LoggerFactory.getLogger(MeasurementService.class);
    @Autowired
    private MeasurementRepository measurementRepository;
    @Autowired
    private UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final int MAX_MEASUREMENTS_PER_USER = 50;

    public MeasurementDTO saveMeasurement(Long userId, SaveMeasurementRequest request) {
        String jsonData;
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (request.getMeasurements() == null || request.getMeasurements().isEmpty()) {
            throw new BadRequestException("Measurements data is required");
        }
        if (request.getGender() == null || request.getGender().isBlank()) {
            throw new BadRequestException("Gender is required");
        }
        if (request.getAge() == null || request.getAge() < 13 || request.getAge() > 100) {
            throw new BadRequestException("Valid age (13-100) is required");
        }
        if (request.getHeight() == null || request.getHeight() <= 0.0) {
            throw new BadRequestException("Valid height is required");
        }
        if (request.getWeight() == null || request.getWeight() <= 0.0) {
            throw new BadRequestException("Valid weight is required");
        }
        long count = this.measurementRepository.countByUserId(userId);
        if (count >= 50L) {
            throw new BadRequestException("Maximum of 50 saved measurements reached. Please delete older ones.");
        }
        BigDecimal heightCm = this.convertHeightToCm(request.getHeight(), request.getHeightUnit());
        if (heightCm.compareTo(BigDecimal.valueOf(50.0)) < 0) {
            throw new BadRequestException("The height value is too small. Please ensure you have provided the height in centimeters rather than another format like feet or meters.");
        }
        BigDecimal weightKg = this.convertWeightToKg(request.getWeight(), request.getWeightUnit());
        Map measurements = request.getMeasurements();
        log.info("Saving measurement payload for user {}: gender={}, age={}, heightCm={}, weightKg={}, measurements={}", userId, request.getGender(), request.getAge(), heightCm, weightKg, measurements);
        String recommendedSize = null;
        BigDecimal bmi = null;
        String bmiCategory = null;
        String bodyType = null;
        Object metadataObj = measurements.get("metadata");
        if (metadataObj instanceof Map) {
            Map metadata = (Map)metadataObj;
            recommendedSize = this.getStringValue(metadata, "recommended_size");
            bmi = this.getBigDecimalValue(metadata, "bmi");
            bmiCategory = this.getStringValue(metadata, "bmi_category");
            bodyType = this.getStringValue(metadata, "body_type");
        }
        try {
            jsonData = this.objectMapper.writeValueAsString(measurements);
        }
        catch (JsonProcessingException e) {
            log.error("Failed to serialize measurement data", (Throwable)e);
            throw new BadRequestException("Invalid measurement data format");
        }
        Measurement measurement = Measurement.builder().user(user).gender(request.getGender()).age(request.getAge()).heightCm(heightCm).weightKg(weightKg).recommendedSize(recommendedSize).bmi(bmi).bmiCategory(bmiCategory).bodyType(bodyType).measurementData(jsonData).build();
        Measurement saved = (Measurement)this.measurementRepository.save(measurement);
        log.info("Measurement {} saved for user {}", saved.getId(), userId);
        return this.mapToDTO(saved);
    }

    @Transactional(readOnly=true)
    public List<MeasurementDTO> getUserMeasurements(Long userId) {
        return this.measurementRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(arg_0 -> this.mapToSummaryDTO(arg_0)).collect(Collectors.toList());
    }

    @Transactional(readOnly=true)
    public MeasurementDTO getMeasurementById(Long userId, Long measurementId) {
        Measurement measurement = (Measurement)this.measurementRepository.findByIdAndUserId(measurementId, userId).orElseThrow(() -> new ResourceNotFoundException("Measurement not found"));
        return this.mapToDTO(measurement);
    }

    public void deleteMeasurement(Long userId, Long measurementId) {
        Measurement measurement = (Measurement)this.measurementRepository.findByIdAndUserId(measurementId, userId).orElseThrow(() -> new ResourceNotFoundException("Measurement not found"));
        this.measurementRepository.delete(measurement);
        log.info("Measurement {} deleted for user {}", measurementId, userId);
    }

    @Transactional(readOnly=true)
    public MeasurementDTO getMeasurementByIdAdmin(Long measurementId) {
        Measurement measurement = (Measurement)this.measurementRepository.findById(measurementId).orElseThrow(() -> new ResourceNotFoundException("Measurement not found"));
        return this.mapToDTOWithUser(measurement);
    }

    public void deleteMeasurementAdmin(Long measurementId) {
        Measurement measurement = (Measurement)this.measurementRepository.findById(measurementId).orElseThrow(() -> new ResourceNotFoundException("Measurement not found"));
        this.measurementRepository.delete(measurement);
        log.info("Measurement {} deleted by admin", measurementId);
    }

    @Transactional(readOnly=true)
    public List<MeasurementDTO> getAllMeasurements() {
        return this.measurementRepository.findAll().stream().map(arg_0 -> this.mapToSummaryDTOWithUser(arg_0)).collect(Collectors.toList());
    }

    private MeasurementDTO mapToDTO(Measurement m) {
        return MeasurementDTO.builder().id(m.getId()).gender(m.getGender()).age(m.getAge()).heightCm(m.getHeightCm()).weightKg(m.getWeightKg()).recommendedSize(m.getRecommendedSize()).bmi(m.getBmi()).bmiCategory(m.getBmiCategory()).bodyType(m.getBodyType()).measurements(this.deserializeJson(m.getMeasurementData())).createdAt(m.getCreatedAt()).build();
    }

    private MeasurementDTO mapToDTOWithUser(Measurement m) {
        MeasurementDTO dto = this.mapToDTO(m);
        this.populateUserDetails(dto, m.getUser());
        return dto;
    }

    private MeasurementDTO mapToSummaryDTO(Measurement m) {
        return MeasurementDTO.builder().id(m.getId()).gender(m.getGender()).age(m.getAge()).heightCm(m.getHeightCm()).weightKg(m.getWeightKg()).recommendedSize(m.getRecommendedSize()).bmi(m.getBmi()).bmiCategory(m.getBmiCategory()).bodyType(m.getBodyType()).createdAt(m.getCreatedAt()).build();
    }

    private MeasurementDTO mapToSummaryDTOWithUser(Measurement m) {
        MeasurementDTO dto = this.mapToSummaryDTO(m);
        this.populateUserDetails(dto, m.getUser());
        return dto;
    }

    private void populateUserDetails(MeasurementDTO dto, User user) {
        dto.setUserId(user.getId());
        dto.setUserName(user.getName());
        dto.setUserEmail(user.getEmail());
        dto.setUserPhone(user.getPhone());
        List<com.styliste.entity.Address> addresses = user.getAddresses();
        if (addresses != null && !addresses.isEmpty()) {
            Address addr = addresses.stream().filter(Address::getIsDefault).findFirst().orElse((Address)addresses.get(0));
            dto.setUserAddress(String.format("%s, %s, %s, %s - %s", addr.getAddressLine1(), addr.getCity(), addr.getState(), addr.getCountry(), addr.getPostalCode()));
        }
    }

    private Map<String, Object> deserializeJson(String json) {
        try {
            return (Map)this.objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        }
        catch (JsonProcessingException e) {
            log.error("Failed to deserialize measurement data", (Throwable)e);
            return Map.of();
        }
    }

    private BigDecimal convertHeightToCm(Double height, String unit) {
        if ("m".equalsIgnoreCase(unit)) {
            return BigDecimal.valueOf(height * 100.0).setScale(2, RoundingMode.HALF_UP);
        }
        return BigDecimal.valueOf(height).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal convertWeightToKg(Double weight, String unit) {
        if ("lbs".equalsIgnoreCase(unit)) {
            return BigDecimal.valueOf(weight * 0.453592).setScale(2, RoundingMode.HALF_UP);
        }
        return BigDecimal.valueOf(weight).setScale(2, RoundingMode.HALF_UP);
    }

    private String getStringValue(Map<?, ?> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString() : null;
    }

    private BigDecimal getBigDecimalValue(Map<?, ?> map, String key) {
        Object val = map.get(key);
        if (val instanceof Number) {
            Number num = (Number)val;
            return BigDecimal.valueOf(num.doubleValue()).setScale(2, RoundingMode.HALF_UP);
        }
        return null;
    }
}

