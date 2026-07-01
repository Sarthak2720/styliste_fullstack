/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AffectedAppointmentDTO
 *  com.styliste.dto.AffectedAppointmentDTO$AffectedAppointmentDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.AffectedAppointmentDTO;
import java.time.LocalDate;
import java.time.LocalTime;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class AffectedAppointmentDTO {
    private Long appointmentId;
    private String customerName;
    private String customerEmail;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String serviceType;

    AffectedAppointmentDTO(Long appointmentId, String customerName, String customerEmail, LocalDate appointmentDate, LocalTime appointmentTime, String serviceType) {
        this.appointmentId = appointmentId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.serviceType = serviceType;
    }

    

    public Long getAppointmentId() {
        return this.appointmentId;
    }

    public String getCustomerName() {
        return this.customerName;
    }

    public String getCustomerEmail() {
        return this.customerEmail;
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

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
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

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof AffectedAppointmentDTO)) {
            return false;
        }
        AffectedAppointmentDTO other = (AffectedAppointmentDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$appointmentId = this.getAppointmentId();
        Long other$appointmentId = other.getAppointmentId();
        if (this$appointmentId == null ? other$appointmentId != null : !(this$appointmentId).equals(other$appointmentId)) {
            return false;
        }
        String this$customerName = this.getCustomerName();
        String other$customerName = other.getCustomerName();
        if (this$customerName == null ? other$customerName != null : !this$customerName.equals(other$customerName)) {
            return false;
        }
        String this$customerEmail = this.getCustomerEmail();
        String other$customerEmail = other.getCustomerEmail();
        if (this$customerEmail == null ? other$customerEmail != null : !this$customerEmail.equals(other$customerEmail)) {
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
        return !(this$serviceType == null ? other$serviceType != null : !this$serviceType.equals(other$serviceType));
    }

    protected boolean canEqual(Object other) {
        return other instanceof AffectedAppointmentDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $appointmentId = this.getAppointmentId();
        result = result * 59 + ($appointmentId == null ? 43 : ($appointmentId).hashCode());
        String $customerName = this.getCustomerName();
        result = result * 59 + ($customerName == null ? 43 : $customerName.hashCode());
        String $customerEmail = this.getCustomerEmail();
        result = result * 59 + ($customerEmail == null ? 43 : $customerEmail.hashCode());
        LocalDate $appointmentDate = this.getAppointmentDate();
        result = result * 59 + ($appointmentDate == null ? 43 : ($appointmentDate).hashCode());
        LocalTime $appointmentTime = this.getAppointmentTime();
        result = result * 59 + ($appointmentTime == null ? 43 : ($appointmentTime).hashCode());
        String $serviceType = this.getServiceType();
        result = result * 59 + ($serviceType == null ? 43 : $serviceType.hashCode());
        return result;
    }

    public String toString() {
        return "AffectedAppointmentDTO(appointmentId=" + this.getAppointmentId() + ", customerName=" + this.getCustomerName() + ", customerEmail=" + this.getCustomerEmail() + ", appointmentDate=" + String.valueOf(this.getAppointmentDate()) + ", appointmentTime=" + String.valueOf(this.getAppointmentTime()) + ", serviceType=" + this.getServiceType() + ")";
    }
}

