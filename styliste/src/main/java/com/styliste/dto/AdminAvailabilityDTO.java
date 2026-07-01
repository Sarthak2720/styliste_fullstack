/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AdminAvailabilityDTO
 *  com.styliste.dto.AdminAvailabilityDTO$AdminAvailabilityDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.AdminAvailabilityDTO;
import java.time.LocalDate;
import java.time.LocalTime;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class AdminAvailabilityDTO {
    private Long id;
    private LocalDate blockedDate;
    private LocalTime blockedTimeStart;
    private LocalTime blockedTimeEnd;
    private Boolean isFullDayBlocked;
    private String reason;
    private String createdByName;

    AdminAvailabilityDTO(Long id, LocalDate blockedDate, LocalTime blockedTimeStart, LocalTime blockedTimeEnd, Boolean isFullDayBlocked, String reason, String createdByName) {
        this.id = id;
        this.blockedDate = blockedDate;
        this.blockedTimeStart = blockedTimeStart;
        this.blockedTimeEnd = blockedTimeEnd;
        this.isFullDayBlocked = isFullDayBlocked;
        this.reason = reason;
        this.createdByName = createdByName;
    }

    

    public Long getId() {
        return this.id;
    }

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

    public String getCreatedByName() {
        return this.createdByName;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof AdminAvailabilityDTO)) {
            return false;
        }
        AdminAvailabilityDTO other = (AdminAvailabilityDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
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
        if (this$reason == null ? other$reason != null : !this$reason.equals(other$reason)) {
            return false;
        }
        String this$createdByName = this.getCreatedByName();
        String other$createdByName = other.getCreatedByName();
        return !(this$createdByName == null ? other$createdByName != null : !this$createdByName.equals(other$createdByName));
    }

    protected boolean canEqual(Object other) {
        return other instanceof AdminAvailabilityDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
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
        String $createdByName = this.getCreatedByName();
        result = result * 59 + ($createdByName == null ? 43 : $createdByName.hashCode());
        return result;
    }

    public String toString() {
        return "AdminAvailabilityDTO(id=" + this.getId() + ", blockedDate=" + String.valueOf(this.getBlockedDate()) + ", blockedTimeStart=" + String.valueOf(this.getBlockedTimeStart()) + ", blockedTimeEnd=" + String.valueOf(this.getBlockedTimeEnd()) + ", isFullDayBlocked=" + this.getIsFullDayBlocked() + ", reason=" + this.getReason() + ", createdByName=" + this.getCreatedByName() + ")";
    }
}

