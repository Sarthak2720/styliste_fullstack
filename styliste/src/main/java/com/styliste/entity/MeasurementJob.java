/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.MeasurementJob
 *  com.styliste.entity.MeasurementJob$MeasurementJobBuilder
 *  com.styliste.entity.MeasurementJobStatus
 *  com.styliste.entity.User
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.EnumType
 *  jakarta.persistence.Enumerated
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.Index
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.ManyToOne
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.PreUpdate
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.MeasurementJob;
import com.styliste.entity.MeasurementJobStatus;
import com.styliste.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name="measurement_jobs", indexes={@Index(name="idx_measurement_job_user", columnList="user_id"), @Index(name="idx_measurement_job_status", columnList="status"), @Index(name="idx_measurement_job_created", columnList="created_at")})
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class MeasurementJob {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;
    @Enumerated(value=EnumType.STRING)
    @Column(nullable=false, length=20)
    private MeasurementJobStatus status;
    @Column(name="measurement_id")
    private Long measurementId;
    @Column(name="error_message", length=1000)
    private String errorMessage;
    @Column(name="validation_details", columnDefinition="TEXT")
    private String validationDetailsJson;
    @Column(name="created_at", nullable=false, updatable=false)
    private LocalDateTime createdAt;
    @Column(name="updated_at", nullable=false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now;
        this.createdAt = now = LocalDateTime.now();
        this.updatedAt = now;
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

    public MeasurementJobStatus getStatus() {
        return this.status;
    }

    public Long getMeasurementId() {
        return this.measurementId;
    }

    public String getErrorMessage() {
        return this.errorMessage;
    }

    public String getValidationDetailsJson() {
        return this.validationDetailsJson;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setStatus(MeasurementJobStatus status) {
        this.status = status;
    }

    public void setMeasurementId(Long measurementId) {
        this.measurementId = measurementId;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public void setValidationDetailsJson(String validationDetailsJson) {
        this.validationDetailsJson = validationDetailsJson;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof MeasurementJob)) {
            return false;
        }
        MeasurementJob other = (MeasurementJob)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        Long this$measurementId = this.getMeasurementId();
        Long other$measurementId = other.getMeasurementId();
        if (this$measurementId == null ? other$measurementId != null : !(this$measurementId).equals(other$measurementId)) {
            return false;
        }
        User this$user = this.getUser();
        User other$user = other.getUser();
        if (this$user == null ? other$user != null : !this$user.equals(other$user)) {
            return false;
        }
        MeasurementJobStatus this$status = this.getStatus();
        MeasurementJobStatus other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        String this$errorMessage = this.getErrorMessage();
        String other$errorMessage = other.getErrorMessage();
        if (this$errorMessage == null ? other$errorMessage != null : !this$errorMessage.equals(other$errorMessage)) {
            return false;
        }
        String this$validationDetailsJson = this.getValidationDetailsJson();
        String other$validationDetailsJson = other.getValidationDetailsJson();
        if (this$validationDetailsJson == null ? other$validationDetailsJson != null : !this$validationDetailsJson.equals(other$validationDetailsJson)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt)) {
            return false;
        }
        LocalDateTime this$updatedAt = this.getUpdatedAt();
        LocalDateTime other$updatedAt = other.getUpdatedAt();
        return !(this$updatedAt == null ? other$updatedAt != null : !(this$updatedAt).equals(other$updatedAt));
    }

    protected boolean canEqual(Object other) {
        return other instanceof MeasurementJob;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Long $measurementId = this.getMeasurementId();
        result = result * 59 + ($measurementId == null ? 43 : ($measurementId).hashCode());
        User $user = this.getUser();
        result = result * 59 + ($user == null ? 43 : $user.hashCode());
        MeasurementJobStatus $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        String $errorMessage = this.getErrorMessage();
        result = result * 59 + ($errorMessage == null ? 43 : $errorMessage.hashCode());
        String $validationDetailsJson = this.getValidationDetailsJson();
        result = result * 59 + ($validationDetailsJson == null ? 43 : $validationDetailsJson.hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        LocalDateTime $updatedAt = this.getUpdatedAt();
        result = result * 59 + ($updatedAt == null ? 43 : ($updatedAt).hashCode());
        return result;
    }

    public String toString() {
        return "MeasurementJob(id=" + this.getId() + ", user=" + String.valueOf(this.getUser()) + ", status=" + String.valueOf(this.getStatus()) + ", measurementId=" + this.getMeasurementId() + ", errorMessage=" + this.getErrorMessage() + ", validationDetailsJson=" + this.getValidationDetailsJson() + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", updatedAt=" + String.valueOf(this.getUpdatedAt()) + ")";
    }

    public MeasurementJob() {
    }

    public MeasurementJob(Long id, User user, MeasurementJobStatus status, Long measurementId, String errorMessage, String validationDetailsJson, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.status = status;
        this.measurementId = measurementId;
        this.errorMessage = errorMessage;
        this.validationDetailsJson = validationDetailsJson;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

