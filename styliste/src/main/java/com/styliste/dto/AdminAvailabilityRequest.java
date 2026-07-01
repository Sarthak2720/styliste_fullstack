/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AdminAvailabilityRequest
 *  com.styliste.dto.AdminAvailabilityRequest$AdminAvailabilityRequestBuilder
 *  jakarta.validation.constraints.NotNull
 */
package com.styliste.dto;

import com.styliste.dto.AdminAvailabilityRequest;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class AdminAvailabilityRequest {
    @NotNull(message="Blocked date is required")
    private @NotNull(message="Blocked date is required") LocalDate blockedDate;
    private LocalTime blockedTimeStart;
    private LocalTime blockedTimeEnd;
    @NotNull(message="Full day blocked flag is required")
    private @NotNull(message="Full day blocked flag is required") Boolean isFullDayBlocked;
    private String reason;

    

    public LocalDate getBlockedDate() {
        return this.blockedDate;
    }

    public LocalTime getBlockedTimeStart() {
        return this.blockedTimeStart;
    }

    public LocalTime getBlockedTimeEnd() {
        return this.blockedTimeEnd;
    }

    public Boolean getIsFullDayBlocked() {
        return this.isFullDayBlocked;
    }

    public String getReason() {
        return this.reason;
    }

    public void setBlockedDate(LocalDate blockedDate) {
        this.blockedDate = blockedDate;
    }

    public void setBlockedTimeStart(LocalTime blockedTimeStart) {
        this.blockedTimeStart = blockedTimeStart;
    }

    public void setBlockedTimeEnd(LocalTime blockedTimeEnd) {
        this.blockedTimeEnd = blockedTimeEnd;
    }

    public void setIsFullDayBlocked(Boolean isFullDayBlocked) {
        this.isFullDayBlocked = isFullDayBlocked;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof AdminAvailabilityRequest)) {
            return false;
        }
        AdminAvailabilityRequest other = (AdminAvailabilityRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Boolean this$isFullDayBlocked = this.getIsFullDayBlocked();
        Boolean other$isFullDayBlocked = other.getIsFullDayBlocked();
        if (this$isFullDayBlocked == null ? other$isFullDayBlocked != null : !(this$isFullDayBlocked).equals(other$isFullDayBlocked)) {
            return false;
        }
        LocalDate this$blockedDate = this.getBlockedDate();
        LocalDate other$blockedDate = other.getBlockedDate();
        if (this$blockedDate == null ? other$blockedDate != null : !(this$blockedDate).equals(other$blockedDate)) {
            return false;
        }
        LocalTime this$blockedTimeStart = this.getBlockedTimeStart();
        LocalTime other$blockedTimeStart = other.getBlockedTimeStart();
        if (this$blockedTimeStart == null ? other$blockedTimeStart != null : !(this$blockedTimeStart).equals(other$blockedTimeStart)) {
            return false;
        }
        LocalTime this$blockedTimeEnd = this.getBlockedTimeEnd();
        LocalTime other$blockedTimeEnd = other.getBlockedTimeEnd();
        if (this$blockedTimeEnd == null ? other$blockedTimeEnd != null : !(this$blockedTimeEnd).equals(other$blockedTimeEnd)) {
            return false;
        }
        String this$reason = this.getReason();
        String other$reason = other.getReason();
        return !(this$reason == null ? other$reason != null : !this$reason.equals(other$reason));
    }

    protected boolean canEqual(Object other) {
        return other instanceof AdminAvailabilityRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Boolean $isFullDayBlocked = this.getIsFullDayBlocked();
        result = result * 59 + ($isFullDayBlocked == null ? 43 : ($isFullDayBlocked).hashCode());
        LocalDate $blockedDate = this.getBlockedDate();
        result = result * 59 + ($blockedDate == null ? 43 : ($blockedDate).hashCode());
        LocalTime $blockedTimeStart = this.getBlockedTimeStart();
        result = result * 59 + ($blockedTimeStart == null ? 43 : ($blockedTimeStart).hashCode());
        LocalTime $blockedTimeEnd = this.getBlockedTimeEnd();
        result = result * 59 + ($blockedTimeEnd == null ? 43 : ($blockedTimeEnd).hashCode());
        String $reason = this.getReason();
        result = result * 59 + ($reason == null ? 43 : $reason.hashCode());
        return result;
    }

    public String toString() {
        return "AdminAvailabilityRequest(blockedDate=" + String.valueOf(this.getBlockedDate()) + ", blockedTimeStart=" + String.valueOf(this.getBlockedTimeStart()) + ", blockedTimeEnd=" + String.valueOf(this.getBlockedTimeEnd()) + ", isFullDayBlocked=" + this.getIsFullDayBlocked() + ", reason=" + this.getReason() + ")";
    }

    public AdminAvailabilityRequest() {
    }

    public AdminAvailabilityRequest(LocalDate blockedDate, LocalTime blockedTimeStart, LocalTime blockedTimeEnd, Boolean isFullDayBlocked, String reason) {
        this.blockedDate = blockedDate;
        this.blockedTimeStart = blockedTimeStart;
        this.blockedTimeEnd = blockedTimeEnd;
        this.isFullDayBlocked = isFullDayBlocked;
        this.reason = reason;
    }
}

