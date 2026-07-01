/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.VerifyOtpRequest
 *  jakarta.validation.constraints.Email
 *  jakarta.validation.constraints.NotBlank
 */
package com.styliste.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class VerifyOtpRequest {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String otp;

    public String getEmail() {
        return this.email;
    }

    public String getOtp() {
        return this.otp;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof VerifyOtpRequest)) {
            return false;
        }
        VerifyOtpRequest other = (VerifyOtpRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$email = this.getEmail();
        String other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) {
            return false;
        }
        String this$otp = this.getOtp();
        String other$otp = other.getOtp();
        return !(this$otp == null ? other$otp != null : !this$otp.equals(other$otp));
    }

    protected boolean canEqual(Object other) {
        return other instanceof VerifyOtpRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $email = this.getEmail();
        result = result * 59 + ($email == null ? 43 : $email.hashCode());
        String $otp = this.getOtp();
        result = result * 59 + ($otp == null ? 43 : $otp.hashCode());
        return result;
    }

    public String toString() {
        return "VerifyOtpRequest(email=" + this.getEmail() + ", otp=" + this.getOtp() + ")";
    }
}

