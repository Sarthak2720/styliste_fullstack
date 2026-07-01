/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.AdminAvailability
 *  com.styliste.entity.AdminAvailability$AdminAvailabilityBuilder
 *  com.styliste.entity.User
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.ManyToOne
 *  jakarta.persistence.Table
 *  org.hibernate.annotations.CreationTimestamp
 */
package com.styliste.entity;

import com.styliste.entity.AdminAvailability;
import com.styliste.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name="admin_availability")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class AdminAvailability {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private LocalDate blockedDate;
    private LocalTime blockedTimeStart;
    private LocalTime blockedTimeEnd;
    @Column(nullable=false)
    private Boolean isFullDayBlocked = false;
    private String reason;
    @CreationTimestamp
    private ZonedDateTime createdAt;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="created_by")
    private User createdBy;

    

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

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public User getCreatedBy() {
        return this.createdBy;
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

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public AdminAvailability() {
    }

    public AdminAvailability(Long id, LocalDate blockedDate, LocalTime blockedTimeStart, LocalTime blockedTimeEnd, Boolean isFullDayBlocked, String reason, ZonedDateTime createdAt, User createdBy) {
        this.id = id;
        this.blockedDate = blockedDate;
        this.blockedTimeStart = blockedTimeStart;
        this.blockedTimeEnd = blockedTimeEnd;
        this.isFullDayBlocked = isFullDayBlocked;
        this.reason = reason;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }
}

