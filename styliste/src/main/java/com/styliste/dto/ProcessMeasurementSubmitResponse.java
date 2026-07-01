/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ProcessMeasurementSubmitResponse
 *  com.styliste.dto.ProcessMeasurementSubmitResponse$ProcessMeasurementSubmitResponseBuilder
 */
package com.styliste.dto;

import com.styliste.dto.ProcessMeasurementSubmitResponse;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class ProcessMeasurementSubmitResponse {
    private Long jobId;
    private String message;
    private String pollUrl;

    

    public Long getJobId() {
        return this.jobId;
    }

    public String getMessage() {
        return this.message;
    }

    public String getPollUrl() {
        return this.pollUrl;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setPollUrl(String pollUrl) {
        this.pollUrl = pollUrl;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ProcessMeasurementSubmitResponse)) {
            return false;
        }
        ProcessMeasurementSubmitResponse other = (ProcessMeasurementSubmitResponse)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$jobId = this.getJobId();
        Long other$jobId = other.getJobId();
        if (this$jobId == null ? other$jobId != null : !(this$jobId).equals(other$jobId)) {
            return false;
        }
        String this$message = this.getMessage();
        String other$message = other.getMessage();
        if (this$message == null ? other$message != null : !this$message.equals(other$message)) {
            return false;
        }
        String this$pollUrl = this.getPollUrl();
        String other$pollUrl = other.getPollUrl();
        return !(this$pollUrl == null ? other$pollUrl != null : !this$pollUrl.equals(other$pollUrl));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ProcessMeasurementSubmitResponse;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $jobId = this.getJobId();
        result = result * 59 + ($jobId == null ? 43 : ($jobId).hashCode());
        String $message = this.getMessage();
        result = result * 59 + ($message == null ? 43 : $message.hashCode());
        String $pollUrl = this.getPollUrl();
        result = result * 59 + ($pollUrl == null ? 43 : $pollUrl.hashCode());
        return result;
    }

    public String toString() {
        return "ProcessMeasurementSubmitResponse(jobId=" + this.getJobId() + ", message=" + this.getMessage() + ", pollUrl=" + this.getPollUrl() + ")";
    }

    public ProcessMeasurementSubmitResponse() {
    }

    public ProcessMeasurementSubmitResponse(Long jobId, String message, String pollUrl) {
        this.jobId = jobId;
        this.message = message;
        this.pollUrl = pollUrl;
    }
}

