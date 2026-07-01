/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.fasterxml.jackson.core.type.TypeReference
 *  com.fasterxml.jackson.databind.ObjectMapper
 *  com.styliste.service.ExternalMeasurementApiClient
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Value
 *  org.springframework.core.io.ByteArrayResource
 *  org.springframework.http.HttpEntity
 *  org.springframework.http.HttpHeaders
 *  org.springframework.http.HttpMethod
 *  org.springframework.http.MediaType
 *  org.springframework.http.ResponseEntity
 *  org.springframework.http.client.ClientHttpRequestFactory
 *  org.springframework.http.client.SimpleClientHttpRequestFactory
 *  org.springframework.stereotype.Component
 *  org.springframework.util.LinkedMultiValueMap
 *  org.springframework.util.MultiValueMap
 *  org.springframework.web.client.RestTemplate
 *  org.springframework.web.multipart.MultipartFile
 */
package com.styliste.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ExternalMeasurementApiClient {
    private static final Logger log = LoggerFactory.getLogger(ExternalMeasurementApiClient.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Value(value="${measurement.python.api.url:http://213.210.21.155:5000/process}")
    private String apiUrl;

    public ExternalMeasurementApiClient(@Value(value="${measurement.python.api.timeout:300000}") int timeoutMs) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(15000);
        factory.setReadTimeout(Math.max(timeoutMs, 120000));
        this.restTemplate = new RestTemplate((ClientHttpRequestFactory)factory);
    }

    public Map<String, Object> processMeasurements(String gender, Integer age, Double height, String heightUnit, Double weight, String weightUnit, String ageGroup, String fatDistribution, String bodyType, String activityLevel, String muscleLevel, String shoulderType, String measurementGoal, String fitPreference, MultipartFile frontImage, MultipartFile sideImage) {
        if (this.apiUrl == null || this.apiUrl.isBlank()) {
            throw new IllegalArgumentException("Measurement Python API URL is not configured");
        }
        if (frontImage == null || frontImage.isEmpty()) {
            throw new IllegalArgumentException("Front image is required");
        }
        if (sideImage == null || sideImage.isEmpty()) {
            throw new IllegalArgumentException("Side image is required");
        }
        try {
            return this.processMeasurements(gender, age, height, heightUnit, weight, weightUnit, ageGroup, fatDistribution, bodyType, activityLevel, muscleLevel, shoulderType, measurementGoal, fitPreference, frontImage.getBytes(), frontImage.getOriginalFilename(), sideImage.getBytes(), sideImage.getOriginalFilename());
        }
        catch (IOException e) {
            throw new RuntimeException("Failed to read image: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> processMeasurements(String gender, Integer age, Double height, String heightUnit, Double weight, String weightUnit, String ageGroup, String fatDistribution, String bodyType, String activityLevel, String muscleLevel, String shoulderType, String measurementGoal, String fitPreference, byte[] frontImageBytes, String frontImageFilename, byte[] sideImageBytes, String sideImageFilename) {
        if (this.apiUrl == null || this.apiUrl.isBlank()) {
            throw new IllegalArgumentException("Measurement Python API URL is not configured");
        }
        if (frontImageBytes == null || frontImageBytes.length == 0) {
            throw new IllegalArgumentException("Front image is required");
        }
        if (sideImageBytes == null || sideImageBytes.length == 0) {
            throw new IllegalArgumentException("Side image is required");
        }
        LinkedMultiValueMap body = new LinkedMultiValueMap();
        body.add("gender", gender);
        body.add("age", String.valueOf(age));
        body.add("height", String.valueOf(height));
        body.add("height_unit", (heightUnit != null ? heightUnit : "cm"));
        body.add("weight", String.valueOf(weight));
        body.add("weight_unit", (weightUnit != null ? weightUnit : "kg"));
        this.appendOptional((MultiValueMap)body, "age_group", ageGroup);
        this.appendOptional((MultiValueMap)body, "fat_distribution", fatDistribution);
        this.appendOptional((MultiValueMap)body, "body_type", bodyType);
        this.appendOptional((MultiValueMap)body, "activity_level", activityLevel);
        this.appendOptional((MultiValueMap)body, "muscle_level", muscleLevel);
        this.appendOptional((MultiValueMap)body, "shoulder_type", shoulderType);
        this.appendOptional((MultiValueMap)body, "measurement_goal", measurementGoal);
        this.appendOptional((MultiValueMap)body, "fit_preference", fitPreference);
        body.add("front_image", this.toResource(frontImageBytes, frontImageFilename, "front_image"));
        body.add("side_image", this.toResource(sideImageBytes, sideImageFilename, "side_image"));
        return this.executeRequest((MultiValueMap)body);
    }

    private Map<String, Object> executeRequest(MultiValueMap<String, Object> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity entity = new HttpEntity(body, (MultiValueMap)headers);
        try {
            ResponseEntity response = this.restTemplate.exchange(this.apiUrl, HttpMethod.POST, entity, String.class, new Object[0]);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (Map)this.objectMapper.readValue((String)response.getBody(), new TypeReference<Map<String, Object>>() {});
            }
            throw new RuntimeException("Measurement API returned " + String.valueOf(response.getStatusCode()));
        }
        catch (Exception e) {
            log.error("Measurement Python API call failed: {}", e.getMessage());
            throw new RuntimeException("Measurement processing failed: " + e.getMessage(), e);
        }
    }

    private void appendOptional(MultiValueMap<String, Object> body, String key, String value) {
        if (value != null && !value.isBlank()) {
            body.add(key, value);
        }
    }

    private ByteArrayResource toResource(byte[] bytes, String filename, String fallbackName) {
        String name = filename != null && !filename.isBlank() ? filename : fallbackName + ".jpg";
        return new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return name;
            }
        };
    }
}

