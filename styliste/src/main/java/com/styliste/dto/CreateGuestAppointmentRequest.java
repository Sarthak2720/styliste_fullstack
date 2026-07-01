/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.CreateGuestAppointmentRequest
 *  jakarta.validation.constraints.Email
 *  jakarta.validation.constraints.NotBlank
 *  jakarta.validation.constraints.NotNull
 */
package com.styliste.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class CreateGuestAppointmentRequest {
    @NotBlank
    private String guestName;
    @Email
    @NotBlank
    private String guestEmail;
    @NotBlank
    private String guestPhone;
    @NotNull
    private LocalDate appointmentDate;
    @NotNull
    private LocalTime appointmentTime;
    @NotBlank
    private String serviceType;
    private String notes;

    public String getGuestName() {
        return this.guestName;
    }

    public String getGuestEmail() {
        return this.guestEmail;
    }

    public String getGuestPhone() {
        return this.guestPhone;
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

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public void setGuestEmail(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    public void setGuestPhone(String guestPhone) {
        this.guestPhone = guestPhone;
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
        if (!(o instanceof CreateGuestAppointmentRequest)) {
            return false;
        }
        CreateGuestAppointmentRequest other = (CreateGuestAppointmentRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$guestName = this.getGuestName();
        String other$guestName = other.getGuestName();
        if (this$guestName == null ? other$guestName != null : !this$guestName.equals(other$guestName)) {
            return false;
        }
        String this$guestEmail = this.getGuestEmail();
        String other$guestEmail = other.getGuestEmail();
        if (this$guestEmail == null ? other$guestEmail != null : !this$guestEmail.equals(other$guestEmail)) {
            return false;
        }
        String this$guestPhone = this.getGuestPhone();
        String other$guestPhone = other.getGuestPhone();
        if (this$guestPhone == null ? other$guestPhone != null : !this$guestPhone.equals(other$guestPhone)) {
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
        return other instanceof CreateGuestAppointmentRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $guestName = this.getGuestName();
        result = result * 59 + ($guestName == null ? 43 : $guestName.hashCode());
        String $guestEmail = this.getGuestEmail();
        result = result * 59 + ($guestEmail == null ? 43 : $guestEmail.hashCode());
        String $guestPhone = this.getGuestPhone();
        result = result * 59 + ($guestPhone == null ? 43 : $guestPhone.hashCode());
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
        return "CreateGuestAppointmentRequest(guestName=" + this.getGuestName() + ", guestEmail=" + this.getGuestEmail() + ", guestPhone=" + this.getGuestPhone() + ", appointmentDate=" + String.valueOf(this.getAppointmentDate()) + ", appointmentTime=" + String.valueOf(this.getAppointmentTime()) + ", serviceType=" + this.getServiceType() + ", notes=" + this.getNotes() + ")";
    }
}

