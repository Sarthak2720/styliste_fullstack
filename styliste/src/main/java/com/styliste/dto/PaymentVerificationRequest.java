/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.PaymentVerificationRequest
 *  jakarta.validation.constraints.NotBlank
 */
package com.styliste.dto;

import jakarta.validation.constraints.NotBlank;

public class PaymentVerificationRequest {
    @NotBlank
    private String razorpayOrderId;
    @NotBlank
    private String razorpayPaymentId;
    @NotBlank
    private String razorpaySignature;

    public String getRazorpayOrderId() {
        return this.razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return this.razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return this.razorpaySignature;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof PaymentVerificationRequest)) {
            return false;
        }
        PaymentVerificationRequest other = (PaymentVerificationRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$razorpayOrderId = this.getRazorpayOrderId();
        String other$razorpayOrderId = other.getRazorpayOrderId();
        if (this$razorpayOrderId == null ? other$razorpayOrderId != null : !this$razorpayOrderId.equals(other$razorpayOrderId)) {
            return false;
        }
        String this$razorpayPaymentId = this.getRazorpayPaymentId();
        String other$razorpayPaymentId = other.getRazorpayPaymentId();
        if (this$razorpayPaymentId == null ? other$razorpayPaymentId != null : !this$razorpayPaymentId.equals(other$razorpayPaymentId)) {
            return false;
        }
        String this$razorpaySignature = this.getRazorpaySignature();
        String other$razorpaySignature = other.getRazorpaySignature();
        return !(this$razorpaySignature == null ? other$razorpaySignature != null : !this$razorpaySignature.equals(other$razorpaySignature));
    }

    protected boolean canEqual(Object other) {
        return other instanceof PaymentVerificationRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $razorpayOrderId = this.getRazorpayOrderId();
        result = result * 59 + ($razorpayOrderId == null ? 43 : $razorpayOrderId.hashCode());
        String $razorpayPaymentId = this.getRazorpayPaymentId();
        result = result * 59 + ($razorpayPaymentId == null ? 43 : $razorpayPaymentId.hashCode());
        String $razorpaySignature = this.getRazorpaySignature();
        result = result * 59 + ($razorpaySignature == null ? 43 : $razorpaySignature.hashCode());
        return result;
    }

    public String toString() {
        return "PaymentVerificationRequest(razorpayOrderId=" + this.getRazorpayOrderId() + ", razorpayPaymentId=" + this.getRazorpayPaymentId() + ", razorpaySignature=" + this.getRazorpaySignature() + ")";
    }
}

