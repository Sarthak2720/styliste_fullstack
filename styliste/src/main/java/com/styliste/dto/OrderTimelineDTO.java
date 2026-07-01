/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.OrderTimelineDTO
 *  com.styliste.dto.OrderTimelineDTO$OrderTimelineDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.OrderTimelineDTO;
import java.time.LocalDateTime;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class OrderTimelineDTO {
    private String status;
    private String message;
    private LocalDateTime timestamp;

    OrderTimelineDTO(String status, String message, LocalDateTime timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }

    

    public String getStatus() {
        return this.status;
    }

    public String getMessage() {
        return this.message;
    }

    public LocalDateTime getTimestamp() {
        return this.timestamp;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof OrderTimelineDTO)) {
            return false;
        }
        OrderTimelineDTO other = (OrderTimelineDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$status = this.getStatus();
        String other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        String this$message = this.getMessage();
        String other$message = other.getMessage();
        if (this$message == null ? other$message != null : !this$message.equals(other$message)) {
            return false;
        }
        LocalDateTime this$timestamp = this.getTimestamp();
        LocalDateTime other$timestamp = other.getTimestamp();
        return !(this$timestamp == null ? other$timestamp != null : !(this$timestamp).equals(other$timestamp));
    }

    protected boolean canEqual(Object other) {
        return other instanceof OrderTimelineDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        String $message = this.getMessage();
        result = result * 59 + ($message == null ? 43 : $message.hashCode());
        LocalDateTime $timestamp = this.getTimestamp();
        result = result * 59 + ($timestamp == null ? 43 : ($timestamp).hashCode());
        return result;
    }

    public String toString() {
        return "OrderTimelineDTO(status=" + this.getStatus() + ", message=" + this.getMessage() + ", timestamp=" + String.valueOf(this.getTimestamp()) + ")";
    }
}

