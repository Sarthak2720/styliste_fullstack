/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Appointment
 *  com.styliste.entity.Appointment$AppointmentBuilder
 *  com.styliste.entity.AppointmentStatus
 *  com.styliste.entity.ServiceType
 *  com.styliste.entity.User
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.EnumType
 *  jakarta.persistence.Enumerated
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.ManyToOne
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.PreUpdate
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Appointment;
import com.styliste.entity.AppointmentStatus;
import com.styliste.entity.ServiceType;
import com.styliste.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name="appointments")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class Appointment {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=true)
    private User user;
    @Column(nullable=true)
    private String guestName;
    @Column(nullable=true)
    private String guestEmail;
    @Column(nullable=true)
    private String guestPhone;
    @Column(nullable=false)
    private LocalDate appointmentDate;
    @Column(nullable=false)
    private LocalTime appointmentTime;
    @Enumerated(value=EnumType.STRING)
    @Column(nullable=false, length=30)
    private ServiceType serviceType;
    @Column(columnDefinition="TEXT")
    private String notes;
    @Enumerated(value=EnumType.STRING)
    @Column(nullable=false, length=30)
    private AppointmentStatus status;
    @Column(nullable=false, updatable=false)
    private LocalDateTime createdAt;
    @Column(nullable=false)
    private LocalDateTime updatedAt;
    @Column(name="cancelled_by")
    private String cancelledBy;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    

    public Long getId() {
        return this.id;
    }

    public User getUser() {
        return this.user;
    }

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

    public ServiceType getServiceType() {
        return this.serviceType;
    }

    public String getNotes() {
        return this.notes;
    }

    public AppointmentStatus getStatus() {
        return this.status;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public String getCancelledBy() {
        return this.cancelledBy;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
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

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setCancelledBy(String cancelledBy) {
        this.cancelledBy = cancelledBy;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof Appointment)) {
            return false;
        }
        Appointment other = (Appointment)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        User this$user = this.getUser();
        User other$user = other.getUser();
        if (this$user == null ? other$user != null : !this$user.equals(other$user)) {
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
        ServiceType this$serviceType = this.getServiceType();
        ServiceType other$serviceType = other.getServiceType();
        if (this$serviceType == null ? other$serviceType != null : !this$serviceType.equals(other$serviceType)) {
            return false;
        }
        String this$notes = this.getNotes();
        String other$notes = other.getNotes();
        if (this$notes == null ? other$notes != null : !this$notes.equals(other$notes)) {
            return false;
        }
        AppointmentStatus this$status = this.getStatus();
        AppointmentStatus other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt)) {
            return false;
        }
        LocalDateTime this$updatedAt = this.getUpdatedAt();
        LocalDateTime other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !(this$updatedAt).equals(other$updatedAt)) {
            return false;
        }
        String this$cancelledBy = this.getCancelledBy();
        String other$cancelledBy = other.getCancelledBy();
        return !(this$cancelledBy == null ? other$cancelledBy != null : !this$cancelledBy.equals(other$cancelledBy));
    }

    protected boolean canEqual(Object other) {
        return other instanceof Appointment;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        User $user = this.getUser();
        result = result * 59 + ($user == null ? 43 : $user.hashCode());
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
        ServiceType $serviceType = this.getServiceType();
        result = result * 59 + ($serviceType == null ? 43 : $serviceType.hashCode());
        String $notes = this.getNotes();
        result = result * 59 + ($notes == null ? 43 : $notes.hashCode());
        AppointmentStatus $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        LocalDateTime $updatedAt = this.getUpdatedAt();
        result = result * 59 + ($updatedAt == null ? 43 : ($updatedAt).hashCode());
        String $cancelledBy = this.getCancelledBy();
        result = result * 59 + ($cancelledBy == null ? 43 : $cancelledBy.hashCode());
        return result;
    }

    public String toString() {
        return "Appointment(id=" + this.getId() + ", user=" + String.valueOf(this.getUser()) + ", guestName=" + this.getGuestName() + ", guestEmail=" + this.getGuestEmail() + ", guestPhone=" + this.getGuestPhone() + ", appointmentDate=" + String.valueOf(this.getAppointmentDate()) + ", appointmentTime=" + String.valueOf(this.getAppointmentTime()) + ", serviceType=" + String.valueOf(this.getServiceType()) + ", notes=" + this.getNotes() + ", status=" + String.valueOf(this.getStatus()) + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", updatedAt=" + String.valueOf(this.getUpdatedAt()) + ", cancelledBy=" + this.getCancelledBy() + ")";
    }

    public Appointment() {
    }

    public Appointment(Long id, User user, String guestName, String guestEmail, String guestPhone, LocalDate appointmentDate, LocalTime appointmentTime, ServiceType serviceType, String notes, AppointmentStatus status, LocalDateTime createdAt, LocalDateTime updatedAt, String cancelledBy) {
        this.id = id;
        this.user = user;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.guestPhone = guestPhone;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.serviceType = serviceType;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.cancelledBy = cancelledBy;
    }
}

