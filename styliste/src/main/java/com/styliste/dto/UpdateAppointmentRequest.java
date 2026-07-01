/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.UpdateAppointmentRequest
 *  com.styliste.dto.UpdateAppointmentRequest$UpdateAppointmentRequestBuilder
 */
package com.styliste.dto;

import com.styliste.dto.UpdateAppointmentRequest;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class UpdateAppointmentRequest {
    private String status;
    private String notes;

    

    public String getStatus() {
        return this.status;
    }

    public String getNotes() {
        return this.notes;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof UpdateAppointmentRequest)) {
            return false;
        }
        UpdateAppointmentRequest other = (UpdateAppointmentRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$status = this.getStatus();
        String other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        String this$notes = this.getNotes();
        String other$notes = other.getNotes();
        return !(this$notes == null ? other$notes != null : !this$notes.equals(other$notes));
    }

    protected boolean canEqual(Object other) {
        return other instanceof UpdateAppointmentRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        String $notes = this.getNotes();
        result = result * 59 + ($notes == null ? 43 : $notes.hashCode());
        return result;
    }

    public String toString() {
        return "UpdateAppointmentRequest(status=" + this.getStatus() + ", notes=" + this.getNotes() + ")";
    }

    public UpdateAppointmentRequest() {
    }

    public UpdateAppointmentRequest(String status, String notes) {
        this.status = status;
        this.notes = notes;
    }
}

