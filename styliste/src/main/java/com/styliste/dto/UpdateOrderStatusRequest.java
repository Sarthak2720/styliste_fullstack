/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.UpdateOrderStatusRequest
 *  com.styliste.dto.UpdateOrderStatusRequest$UpdateOrderStatusRequestBuilder
 *  jakarta.validation.constraints.NotBlank
 */
package com.styliste.dto;

import com.styliste.dto.UpdateOrderStatusRequest;
import jakarta.validation.constraints.NotBlank;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class UpdateOrderStatusRequest {
    @NotBlank(message="Status cannot be blank")
    private @NotBlank(message="Status cannot be blank") String status;
    private String trackingNumber;
    private String timelineMessage;

    

    public String getStatus() {
        return this.status;
    }

    public String getTrackingNumber() {
        return this.trackingNumber;
    }

    public String getTimelineMessage() {
        return this.timelineMessage;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public void setTimelineMessage(String timelineMessage) {
        this.timelineMessage = timelineMessage;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof UpdateOrderStatusRequest)) {
            return false;
        }
        UpdateOrderStatusRequest other = (UpdateOrderStatusRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$status = this.getStatus();
        String other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        String this$trackingNumber = this.getTrackingNumber();
        String other$trackingNumber = other.getTrackingNumber();
        if (this$trackingNumber == null ? other$trackingNumber != null : !this$trackingNumber.equals(other$trackingNumber)) {
            return false;
        }
        String this$timelineMessage = this.getTimelineMessage();
        String other$timelineMessage = other.getTimelineMessage();
        return !(this$timelineMessage == null ? other$timelineMessage != null : !this$timelineMessage.equals(other$timelineMessage));
    }

    protected boolean canEqual(Object other) {
        return other instanceof UpdateOrderStatusRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        String $trackingNumber = this.getTrackingNumber();
        result = result * 59 + ($trackingNumber == null ? 43 : $trackingNumber.hashCode());
        String $timelineMessage = this.getTimelineMessage();
        result = result * 59 + ($timelineMessage == null ? 43 : $timelineMessage.hashCode());
        return result;
    }

    public String toString() {
        return "UpdateOrderStatusRequest(status=" + this.getStatus() + ", trackingNumber=" + this.getTrackingNumber() + ", timelineMessage=" + this.getTimelineMessage() + ")";
    }

    public UpdateOrderStatusRequest() {
    }

    public UpdateOrderStatusRequest(String status, String trackingNumber, String timelineMessage) {
        this.status = status;
        this.trackingNumber = trackingNumber;
        this.timelineMessage = timelineMessage;
    }
}

