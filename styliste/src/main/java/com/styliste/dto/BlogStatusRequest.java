/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.BlogStatusRequest
 */
package com.styliste.dto;

public class BlogStatusRequest {
    private String status;

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof BlogStatusRequest)) {
            return false;
        }
        BlogStatusRequest other = (BlogStatusRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$status = this.getStatus();
        String other$status = other.getStatus();
        return !(this$status == null ? other$status != null : !this$status.equals(other$status));
    }

    protected boolean canEqual(Object other) {
        return other instanceof BlogStatusRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        return result;
    }

    public String toString() {
        return "BlogStatusRequest(status=" + this.getStatus() + ")";
    }

    public BlogStatusRequest() {
    }

    public BlogStatusRequest(String status) {
        this.status = status;
    }
}

