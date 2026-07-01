/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AppointmentDTO
 *  com.styliste.dto.AppointmentDTO$AppointmentDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.AppointmentDTO;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class AppointmentDTO {
    private String name;
    private Long id;
    private Long userId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String serviceType;
    private String notes;
    private String status;
    private LocalDateTime createdAt;

    

    public String getName() {
        return this.name;
    }

    public Long getId() {
        return this.id;
    }

    public Long getUserId() {
        return this.userId;
    }

    public LocalDate getAppointmentDate() {
        return this.appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return this.appointmentTime;
    }

    public String getServiceType() {
        return this.serviceType;
    }

    public String getNotes() {
        return this.notes;
    }

    public String getStatus() {
        return this.status;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof AppointmentDTO)) {
            return false;
        }
        AppointmentDTO other = (AppointmentDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        Long this$userId = this.getUserId();
        Long other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !(this$userId).equals(other$userId)) {
            return false;
        }
        String this$name = this.getName();
        String other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) {
            return false;
        }
        LocalDate this$appointmentDate = this.getAppointmentDate();
        LocalDate other$appointmentDate = other.getAppointmentDate();
        if (this$appointmentDate == null ? other$appointmentDate != null : !(this$appointmentDate).equals(other$appointmentDate)) {
            return false;
        }
        LocalTime this$appointmentTime = this.getAppointmentTime();
        LocalTime other$appointmentTime = other.getAppointmentTime();
        if (this$appointmentTime == null ? other$appointmentTime != null : !(this$appointmentTime).equals(other$appointmentTime)) {
            return false;
        }
        String this$serviceType = this.getServiceType();
        String other$serviceType = other.getServiceType();
        if (this$serviceType == null ? other$serviceType != null : !this$serviceType.equals(other$serviceType)) {
            return false;
        }
        String this$notes = this.getNotes();
        String other$notes = other.getNotes();
        if (this$notes == null ? other$notes != null : !this$notes.equals(other$notes)) {
            return false;
        }
        String this$status = this.getStatus();
        String other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        return !(this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt));
    }

    protected boolean canEqual(Object other) {
        return other instanceof AppointmentDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Long $userId = this.getUserId();
        result = result * 59 + ($userId == null ? 43 : ($userId).hashCode());
        String $name = this.getName();
        result = result * 59 + ($name == null ? 43 : $name.hashCode());
        LocalDate $appointmentDate = this.getAppointmentDate();
        result = result * 59 + ($appointmentDate == null ? 43 : ($appointmentDate).hashCode());
        LocalTime $appointmentTime = this.getAppointmentTime();
        result = result * 59 + ($appointmentTime == null ? 43 : ($appointmentTime).hashCode());
        String $serviceType = this.getServiceType();
        result = result * 59 + ($serviceType == null ? 43 : $serviceType.hashCode());
        String $notes = this.getNotes();
        result = result * 59 + ($notes == null ? 43 : $notes.hashCode());
        String $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        return result;
    }

    public String toString() {
        return "AppointmentDTO(name=" + this.getName() + ", id=" + this.getId() + ", userId=" + this.getUserId() + ", appointmentDate=" + String.valueOf(this.getAppointmentDate()) + ", appointmentTime=" + String.valueOf(this.getAppointmentTime()) + ", serviceType=" + this.getServiceType() + ", notes=" + this.getNotes() + ", status=" + this.getStatus() + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ")";
    }

    public AppointmentDTO() {
    }

    public AppointmentDTO(String name, Long id, Long userId, LocalDate appointmentDate, LocalTime appointmentTime, String serviceType, String notes, String status, LocalDateTime createdAt) {
        this.name = name;
        this.id = id;
        this.userId = userId;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.serviceType = serviceType;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt;
    }
}

