/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.CreateAppointmentRequest
 *  com.styliste.dto.CreateAppointmentRequest$CreateAppointmentRequestBuilder
 *  jakarta.validation.constraints.FutureOrPresent
 *  jakarta.validation.constraints.NotBlank
 *  jakarta.validation.constraints.NotNull
 */
package com.styliste.dto;

import com.styliste.dto.CreateAppointmentRequest;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class CreateAppointmentRequest {
    @NotNull(message="Appointment date cannot be null")
    @FutureOrPresent(message="Appointment date must be in the future")
    private @NotNull(message="Appointment date cannot be null") @FutureOrPresent(message="Appointment date must be in the future") LocalDate appointmentDate;
    @NotNull(message="Appointment time cannot be null")
    private @NotNull(message="Appointment time cannot be null") LocalTime appointmentTime;
    @NotBlank(message="Service type cannot be blank")
    private @NotBlank(message="Service type cannot be blank") String serviceType;
    private String notes;

    

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

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof CreateAppointmentRequest)) {
            return false;
        }
        CreateAppointmentRequest other = (CreateAppointmentRequest)o;
        if (!other.canEqual(this)) {
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
        return !(this$notes == null ? other$notes != null : !this$notes.equals(other$notes));
    }

    protected boolean canEqual(Object other) {
        return other instanceof CreateAppointmentRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        LocalDate $appointmentDate = this.getAppointmentDate();
        result = result * 59 + ($appointmentDate == null ? 43 : ($appointmentDate).hashCode());
        LocalTime $appointmentTime = this.getAppointmentTime();
        result = result * 59 + ($appointmentTime == null ? 43 : ($appointmentTime).hashCode());
        String $serviceType = this.getServiceType();
        result = result * 59 + ($serviceType == null ? 43 : $serviceType.hashCode());
        String $notes = this.getNotes();
        result = result * 59 + ($notes == null ? 43 : $notes.hashCode());
        return result;
    }

    public String toString() {
        return "CreateAppointmentRequest(appointmentDate=" + String.valueOf(this.getAppointmentDate()) + ", appointmentTime=" + String.valueOf(this.getAppointmentTime()) + ", serviceType=" + this.getServiceType() + ", notes=" + this.getNotes() + ")";
    }

    public CreateAppointmentRequest() {
    }

    public CreateAppointmentRequest(LocalDate appointmentDate, LocalTime appointmentTime, String serviceType, String notes) {
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.serviceType = serviceType;
        this.notes = notes;
    }
}

