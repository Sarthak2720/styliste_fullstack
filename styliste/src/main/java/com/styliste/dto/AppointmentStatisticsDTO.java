/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AppointmentStatisticsDTO
 *  com.styliste.dto.AppointmentStatisticsDTO$AppointmentStatisticsDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.AppointmentStatisticsDTO;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class AppointmentStatisticsDTO {
    private Long totalAppointments;
    private Long pendingAppointments;
    private Long confirmedAppointments;
    private Long completedAppointments;

    

    public Long getTotalAppointments() {
        return this.totalAppointments;
    }

    public Long getPendingAppointments() {
        return this.pendingAppointments;
    }

    public Long getConfirmedAppointments() {
        return this.confirmedAppointments;
    }

    public Long getCompletedAppointments() {
        return this.completedAppointments;
    }

    public void setTotalAppointments(Long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public void setPendingAppointments(Long pendingAppointments) {
        this.pendingAppointments = pendingAppointments;
    }

    public void setConfirmedAppointments(Long confirmedAppointments) {
        this.confirmedAppointments = confirmedAppointments;
    }

    public void setCompletedAppointments(Long completedAppointments) {
        this.completedAppointments = completedAppointments;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof AppointmentStatisticsDTO)) {
            return false;
        }
        AppointmentStatisticsDTO other = (AppointmentStatisticsDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$totalAppointments = this.getTotalAppointments();
        Long other$totalAppointments = other.getTotalAppointments();
        if (this$totalAppointments == null ? other$totalAppointments != null : !(this$totalAppointments).equals(other$totalAppointments)) {
            return false;
        }
        Long this$pendingAppointments = this.getPendingAppointments();
        Long other$pendingAppointments = other.getPendingAppointments();
        if (this$pendingAppointments == null ? other$pendingAppointments != null : !(this$pendingAppointments).equals(other$pendingAppointments)) {
            return false;
        }
        Long this$confirmedAppointments = this.getConfirmedAppointments();
        Long other$confirmedAppointments = other.getConfirmedAppointments();
        if (this$confirmedAppointments == null ? other$confirmedAppointments != null : !(this$confirmedAppointments).equals(other$confirmedAppointments)) {
            return false;
        }
        Long this$completedAppointments = this.getCompletedAppointments();
        Long other$completedAppointments = other.getCompletedAppointments();
        return !(this$completedAppointments == null ? other$completedAppointments != null : !(this$completedAppointments).equals(other$completedAppointments));
    }

    protected boolean canEqual(Object other) {
        return other instanceof AppointmentStatisticsDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $totalAppointments = this.getTotalAppointments();
        result = result * 59 + ($totalAppointments == null ? 43 : ($totalAppointments).hashCode());
        Long $pendingAppointments = this.getPendingAppointments();
        result = result * 59 + ($pendingAppointments == null ? 43 : ($pendingAppointments).hashCode());
        Long $confirmedAppointments = this.getConfirmedAppointments();
        result = result * 59 + ($confirmedAppointments == null ? 43 : ($confirmedAppointments).hashCode());
        Long $completedAppointments = this.getCompletedAppointments();
        result = result * 59 + ($completedAppointments == null ? 43 : ($completedAppointments).hashCode());
        return result;
    }

    public String toString() {
        return "AppointmentStatisticsDTO(totalAppointments=" + this.getTotalAppointments() + ", pendingAppointments=" + this.getPendingAppointments() + ", confirmedAppointments=" + this.getConfirmedAppointments() + ", completedAppointments=" + this.getCompletedAppointments() + ")";
    }

    public AppointmentStatisticsDTO() {
    }

    public AppointmentStatisticsDTO(Long totalAppointments, Long pendingAppointments, Long confirmedAppointments, Long completedAppointments) {
        this.totalAppointments = totalAppointments;
        this.pendingAppointments = pendingAppointments;
        this.confirmedAppointments = confirmedAppointments;
        this.completedAppointments = completedAppointments;
    }
}

