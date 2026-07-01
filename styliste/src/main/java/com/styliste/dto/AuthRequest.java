/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AuthRequest
 *  com.styliste.dto.AuthRequest$AuthRequestBuilder
 *  jakarta.validation.constraints.Email
 *  jakarta.validation.constraints.NotBlank
 *  jakarta.validation.constraints.Size
 */
package com.styliste.dto;

import com.styliste.dto.AuthRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class AuthRequest {
    @Email(message="Email should be valid")
    @NotBlank(message="Email cannot be blank")
    private @Email(message="Email should be valid") @NotBlank(message="Email cannot be blank") String email;
    @NotBlank(message="Password cannot be blank")
    @Size(min=6, message="Password must be at least 6 characters")
    private @NotBlank(message="Password cannot be blank") @Size(min=6, message="Password must be at least 6 characters") String password;

    

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof AuthRequest)) {
            return false;
        }
        AuthRequest other = (AuthRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$email = this.getEmail();
        String other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) {
            return false;
        }
        String this$password = this.getPassword();
        String other$password = other.getPassword();
        return !(this$password == null ? other$password != null : !this$password.equals(other$password));
    }

    protected boolean canEqual(Object other) {
        return other instanceof AuthRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $email = this.getEmail();
        result = result * 59 + ($email == null ? 43 : $email.hashCode());
        String $password = this.getPassword();
        result = result * 59 + ($password == null ? 43 : $password.hashCode());
        return result;
    }

    public String toString() {
        return "AuthRequest(email=" + this.getEmail() + ", password=" + this.getPassword() + ")";
    }

    public AuthRequest() {
    }

    public AuthRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
}

