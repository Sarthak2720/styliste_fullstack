/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ProcessMeasurementJobResponse
 *  com.styliste.dto.ProcessMeasurementJobResponse$ProcessMeasurementJobResponseBuilder
 *  com.styliste.entity.MeasurementJobStatus
 */
package com.styliste.dto;

import com.styliste.dto.ProcessMeasurementJobResponse;
import com.styliste.entity.MeasurementJobStatus;
import java.util.Map;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class ProcessMeasurementJobResponse {
    private Long jobId;
    private MeasurementJobStatus status;
    private Long measurementId;
    private String error;
    private Map<String, Object> validationDetails;
    private Map<String, Object> measurements;

    

    public Long getJobId() {
        return this.jobId;
    }

    public MeasurementJobStatus getStatus() {
        return this.status;
    }

    public Long getMeasurementId() {
        return this.measurementId;
    }

    public String getError() {
        return this.error;
    }

    public Map<String, Object> getValidationDetails() {
        return this.validationDetails;
    }

    public Map<String, Object> getMeasurements() {
        return this.measurements;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public void setStatus(MeasurementJobStatus status) {
        this.status = status;
    }

    public void setMeasurementId(Long measurementId) {
        this.measurementId = measurementId;
    }

    public void setError(String error) {
        this.error = error;
    }

    public void setValidationDetails(Map<String, Object> validationDetails) {
        this.validationDetails = validationDetails;
    }

    public void setMeasurements(Map<String, Object> measurements) {
        this.measurements = measurements;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ProcessMeasurementJobResponse)) {
            return false;
        }
        ProcessMeasurementJobResponse other = (ProcessMeasurementJobResponse)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$jobId = this.getJobId();
        Long other$jobId = other.getJobId();
        if (this$jobId == null ? other$jobId != null : !(this$jobId).equals(other$jobId)) {
            return false;
        }
        Long this$measurementId = this.getMeasurementId();
        Long other$measurementId = other.getMeasurementId();
        if (this$measurementId == null ? other$measurementId != null : !(this$measurementId).equals(other$measurementId)) {
            return false;
        }
        MeasurementJobStatus this$status = this.getStatus();
        MeasurementJobStatus other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        String this$error = this.getError();
        String other$error = other.getError();
        if (this$error == null ? other$error != null : !this$error.equals(other$error)) {
            return false;
        }
        Map this$validationDetails = this.getValidationDetails();
        Map other$validationDetails = other.getValidationDetails();
        if (this$validationDetails == null ? other$validationDetails != null : !(this$validationDetails).equals(other$validationDetails)) {
            return false;
        }
        Map this$measurements = this.getMeasurements();
        Map other$measurements = other.getMeasurements();
        return !(this$measurements == null ? other$measurements != null : !(this$measurements).equals(other$measurements));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ProcessMeasurementJobResponse;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $jobId = this.getJobId();
        result = result * 59 + ($jobId == null ? 43 : ($jobId).hashCode());
        Long $measurementId = this.getMeasurementId();
        result = result * 59 + ($measurementId == null ? 43 : ($measurementId).hashCode());
        MeasurementJobStatus $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        String $error = this.getError();
        result = result * 59 + ($error == null ? 43 : $error.hashCode());
        Map $validationDetails = this.getValidationDetails();
        result = result * 59 + ($validationDetails == null ? 43 : ($validationDetails).hashCode());
        Map $measurements = this.getMeasurements();
        result = result * 59 + ($measurements == null ? 43 : ($measurements).hashCode());
        return result;
    }

    public String toString() {
        return "ProcessMeasurementJobResponse(jobId=" + this.getJobId() + ", status=" + String.valueOf(this.getStatus()) + ", measurementId=" + this.getMeasurementId() + ", error=" + this.getError() + ", validationDetails=" + String.valueOf(this.getValidationDetails()) + ", measurements=" + String.valueOf(this.getMeasurements()) + ")";
    }

    public ProcessMeasurementJobResponse() {
    }

    public ProcessMeasurementJobResponse(Long jobId, MeasurementJobStatus status, Long measurementId, String error, Map<String, Object> validationDetails, Map<String, Object> measurements) {
        this.jobId = jobId;
        this.status = status;
        this.measurementId = measurementId;
        this.error = error;
        this.validationDetails = validationDetails;
        this.measurements = measurements;
    }
}

