/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.RefundResult
 */
package com.styliste.dto;

public class RefundResult {
    private boolean success;
    private String providerRefundId;
    private String message;

    public boolean isSuccess() {
        return this.success;
    }

    public String getProviderRefundId() {
        return this.providerRefundId;
    }

    public String getMessage() {
        return this.message;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setProviderRefundId(String providerRefundId) {
        this.providerRefundId = providerRefundId;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof RefundResult)) {
            return false;
        }
        RefundResult other = (RefundResult)o;
        if (!other.canEqual(this)) {
            return false;
        }
        if (this.isSuccess() != other.isSuccess()) {
            return false;
        }
        String this$providerRefundId = this.getProviderRefundId();
        String other$providerRefundId = other.getProviderRefundId();
        if (this$providerRefundId == null ? other$providerRefundId != null : !this$providerRefundId.equals(other$providerRefundId)) {
            return false;
        }
        String this$message = this.getMessage();
        String other$message = other.getMessage();
        return !(this$message == null ? other$message != null : !this$message.equals(other$message));
    }

    protected boolean canEqual(Object other) {
        return other instanceof RefundResult;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * 59 + (this.isSuccess() ? 79 : 97);
        String $providerRefundId = this.getProviderRefundId();
        result = result * 59 + ($providerRefundId == null ? 43 : $providerRefundId.hashCode());
        String $message = this.getMessage();
        result = result * 59 + ($message == null ? 43 : $message.hashCode());
        return result;
    }

    public String toString() {
        return "RefundResult(success=" + this.isSuccess() + ", providerRefundId=" + this.getProviderRefundId() + ", message=" + this.getMessage() + ")";
    }

    public RefundResult(boolean success, String providerRefundId, String message) {
        this.success = success;
        this.providerRefundId = providerRefundId;
        this.message = message;
    }
}

