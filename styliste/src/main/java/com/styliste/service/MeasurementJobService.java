package com.styliste.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.styliste.dto.MeasurementDTO;
import com.styliste.dto.ProcessMeasurementJobResponse;
import com.styliste.dto.ProcessMeasurementSubmitResponse;
import com.styliste.dto.SaveMeasurementRequest;
import com.styliste.entity.MeasurementJob;
import com.styliste.entity.MeasurementJobStatus;
import com.styliste.entity.User;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.MeasurementJobRepository;
import com.styliste.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
public class MeasurementJobService {

@Autowired
private MeasurementJobRepository jobRepository;

@Autowired
private MeasurementService measurementService;

@Autowired
private ExternalMeasurementApiClient externalApiClient;

@Autowired
private UserRepository userRepository;

/** Self-injection so processJobAsync is called via proxy (required for @Async to work). */
@Autowired
@Lazy
private MeasurementJobService self;

private final ObjectMapper objectMapper = new ObjectMapper();

/**
* Submits a measurement job. Returns immediately with jobId (202).
* Processing runs asynchronously in a separate thread.
*/
@Transactional
public ProcessMeasurementSubmitResponse submitJob(Long userId, ProcessJobParams params) {
User user = userRepository.findById(userId)
.orElseThrow(() -> new ResourceNotFoundException("User not found"));

MeasurementJob job = MeasurementJob.builder()
.user(user)
.status(MeasurementJobStatus.PENDING)
.build();
job = jobRepository.save(job);

log.info("Measurement job {} created for user {}", job.getId(), userId);

// Copy image bytes before request completes (multipart is cleaned up after response)
ProcessJobParams asyncParams = copyParamsWithBytes(params);
// Call via proxy so @Async runs in background thread (self-invocation would block)
self.processJobAsync(job.getId(), asyncParams);

return ProcessMeasurementSubmitResponse.builder()
.jobId(job.getId())
.message("Measurement processing started. Your results will be ready shortly. Poll the status endpoint or you will be notified when complete.")
.pollUrl("/api/measurements/process/" + job.getId())
.build();
}

@Async("taskExecutor")
public void processJobAsync(Long jobId, ProcessJobParams params) {
try {
updateJobStatus(jobId, MeasurementJobStatus.PROCESSING, null, null);

Map<String, Object> apiResponse = externalApiClient.processMeasurements(
params.getGender(),
params.getAge(),
params.getHeight(),
params.getHeightUnit(),
params.getWeight(),
params.getWeightUnit(),
params.getAgeGroup(),
params.getFatDistribution(),
params.getBodyType(),
params.getActivityLevel(),
params.getMuscleLevel(),
params.getShoulderType(),
params.getMeasurementGoal(),
params.getFitPreference(),
params.getFrontImageBytes(),
params.getFrontImageFilename(),
params.getSideImageBytes(),
params.getSideImageFilename()
);

Boolean success = (Boolean) apiResponse.get("success");
if (Boolean.TRUE.equals(success)) {
@SuppressWarnings("unchecked")
Map<String, Object> measurements = (Map<String, Object>) apiResponse.get("measurements");
if (measurements != null) {
SaveMeasurementRequest saveRequest = buildSaveRequest(params, measurements);
MeasurementDTO saved = measurementService.saveMeasurement(params.getUserId(), saveRequest);
updateJobStatus(jobId, MeasurementJobStatus.COMPLETED, saved.getId(), null);
log.info("Measurement job {} completed, measurement {} saved", jobId, saved.getId());
} else {
updateJobStatus(jobId, MeasurementJobStatus.FAILED, null, "No measurements in API response");
}
} else {
String error = (String) apiResponse.get("error");
Object validationDetails = apiResponse.get("validation_details");
String validationJson = null;
if (validationDetails != null) {
try {
validationJson = objectMapper.writeValueAsString(validationDetails);
} catch (JsonProcessingException ignored) {}
}
updateJobStatus(jobId, MeasurementJobStatus.FAILED, null, error, validationJson);
log.warn("Measurement job {} failed: {}", jobId, error);
}
} catch (Exception e) {
log.error("Measurement job {} failed with exception", jobId, e);
updateJobStatus(jobId, MeasurementJobStatus.FAILED, null, e.getMessage());
}
}

@Transactional
protected void updateJobStatus(Long jobId, MeasurementJobStatus status, Long measurementId, String error) {
updateJobStatus(jobId, status, measurementId, error, null);
}

@Transactional
protected void updateJobStatus(Long jobId, MeasurementJobStatus status, Long measurementId, String error, String validationDetailsJson) {
MeasurementJob job = jobRepository.findById(jobId).orElse(null);
if (job != null) {
job.setStatus(status);
job.setMeasurementId(measurementId);
job.setErrorMessage(error);
job.setValidationDetailsJson(validationDetailsJson);
jobRepository.save(job);
}
}

@Transactional(readOnly = true)
public ProcessMeasurementJobResponse getJobStatus(Long jobId, Long userId) {
MeasurementJob job = jobRepository.findByIdAndUser_Id(jobId, userId)
.orElseThrow(() -> new ResourceNotFoundException("Measurement job not found"));

ProcessMeasurementJobResponse.ProcessMeasurementJobResponseBuilder builder = ProcessMeasurementJobResponse.builder()
.jobId(job.getId())
.status(job.getStatus())
.measurementId(job.getMeasurementId())
.error(job.getErrorMessage());

Map<String, Object> validationDetails = null;
if (job.getValidationDetailsJson() != null && !job.getValidationDetailsJson().isBlank()) {
try {
validationDetails = objectMapper.readValue(job.getValidationDetailsJson(), new com.fasterxml.jackson.core.type.TypeReference<>() {});
} catch (Exception ignored) {}
}
builder.validationDetails(validationDetails);

if (job.getStatus() == MeasurementJobStatus.COMPLETED && job.getMeasurementId() != null) {
MeasurementDTO dto = measurementService.getMeasurementById(userId, job.getMeasurementId());
builder.measurements(dto.getMeasurements());
}

return builder.build();
}

/** Copy MultipartFile content to bytes so async thread has data after request completes. */
private ProcessJobParams copyParamsWithBytes(ProcessJobParams params) {
try {
return ProcessJobParams.builder()
.userId(params.getUserId())
.gender(params.getGender())
.age(params.getAge())
.height(params.getHeight())
.heightUnit(params.getHeightUnit())
.weight(params.getWeight())
.weightUnit(params.getWeightUnit())
.ageGroup(params.getAgeGroup())
.fatDistribution(params.getFatDistribution())
.bodyType(params.getBodyType())
.activityLevel(params.getActivityLevel())
.muscleLevel(params.getMuscleLevel())
.shoulderType(params.getShoulderType())
.measurementGoal(params.getMeasurementGoal())
.fitPreference(params.getFitPreference())
.frontImageBytes(params.getFrontImage().getBytes())
.frontImageFilename(params.getFrontImage().getOriginalFilename())
.sideImageBytes(params.getSideImage().getBytes())
.sideImageFilename(params.getSideImage().getOriginalFilename())
.build();
} catch (IOException e) {
throw new RuntimeException("Failed to read image: " + e.getMessage(), e);
}
}

private SaveMeasurementRequest buildSaveRequest(ProcessJobParams params, Map<String, Object> measurements) {
SaveMeasurementRequest req = new SaveMeasurementRequest();
req.setGender(params.getGender());
req.setAge(params.getAge());
req.setHeight(params.getHeight());
req.setHeightUnit(params.getHeightUnit());
req.setWeight(params.getWeight());
req.setWeightUnit(params.getWeightUnit());
req.setMeasurements(measurements);
return req;
}

/**
* Immutable params for async processing. Holds MultipartFiles and form data.
*/
@lombok.Data
@lombok.Builder
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public static class ProcessJobParams {
private Long userId;
private String gender;
private Integer age;
private Double height;
private String heightUnit;
private Double weight;
private String weightUnit;
private String ageGroup;
private String fatDistribution;
private String bodyType;
private String activityLevel;
private String muscleLevel;
private String shoulderType;
private String measurementGoal;
private String fitPreference;
/** From controller; used only before async. */
private MultipartFile frontImage;
private MultipartFile sideImage;
/** Copied bytes for async thread (multipart cleaned up after request). */
private byte[] frontImageBytes;
private String frontImageFilename;
private byte[] sideImageBytes;
private String sideImageFilename;
}
}
