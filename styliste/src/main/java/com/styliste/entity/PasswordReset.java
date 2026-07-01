/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.PasswordReset
 *  com.styliste.entity.PasswordReset$PasswordResetBuilder
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.PasswordReset;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name="password_resets")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class PasswordReset {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private String email;
    @Column(nullable=false)
    private String otp;
    @Column(nullable=false)
    private LocalDateTime expiryTime;
    @Column(nullable=false)
    private boolean verified = false;

    

    public Long getId() {
        return this.id;
    }

    public String getEmail() {
        return this.email;
    }

    public String getOtp() {
        return this.otp;
    }

    public LocalDateTime getExpiryTime() {
        return this.expiryTime;
    }

    public boolean isVerified() {
        return this.verified;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof PasswordReset)) {
            return false;
        }
        PasswordReset other = (PasswordReset)o;
        if (!other.canEqual(this)) {
            return false;
        }
        if (this.isVerified() != other.isVerified()) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        String this$email = this.getEmail();
        String other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) {
            return false;
        }
        String this$otp = this.getOtp();
        String other$otp = other.getOtp();
        if (this$otp == null ? other$otp != null : !this$otp.equals(other$otp)) {
            return false;
        }
        LocalDateTime this$expiryTime = this.getExpiryTime();
        LocalDateTime other$expiryTime = other.getExpiryTime();
        return !(this$expiryTime == null ? other$expiryTime != null : !(this$expiryTime).equals(other$expiryTime));
    }

    protected boolean canEqual(Object other) {
        return other instanceof PasswordReset;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * 59 + (this.isVerified() ? 79 : 97);
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        String $email = this.getEmail();
        result = result * 59 + ($email == null ? 43 : $email.hashCode());
        String $otp = this.getOtp();
        result = result * 59 + ($otp == null ? 43 : $otp.hashCode());
        LocalDateTime $expiryTime = this.getExpiryTime();
        result = result * 59 + ($expiryTime == null ? 43 : ($expiryTime).hashCode());
        return result;
    }

    public String toString() {
        return "PasswordReset(id=" + this.getId() + ", email=" + this.getEmail() + ", otp=" + this.getOtp() + ", expiryTime=" + String.valueOf(this.getExpiryTime()) + ", verified=" + this.isVerified() + ")";
    }

    public PasswordReset() {
    }

    public PasswordReset(Long id, String email, String otp, LocalDateTime expiryTime, boolean verified) {
        this.id = id;
        this.email = email;
        this.otp = otp;
        this.expiryTime = expiryTime;
        this.verified = verified;
    }
}

