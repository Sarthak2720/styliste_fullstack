/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.SignUpRequest
 *  com.styliste.dto.SignUpRequest$SignUpRequestBuilder
 *  jakarta.validation.constraints.Email
 *  jakarta.validation.constraints.NotBlank
 *  jakarta.validation.constraints.Pattern
 *  jakarta.validation.constraints.Size
 */
package com.styliste.dto;

import com.styliste.dto.SignUpRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class SignUpRequest {
    @NotBlank(message="Name cannot be blank")
    @Size(min=2, max=100, message="Name must be between 2 and 100 characters")
    private @NotBlank(message="Name cannot be blank") @Size(min=2, max=100, message="Name must be between 2 and 100 characters") String name;
    @Email(message="Email should be valid")
    @NotBlank(message="Email cannot be blank")
    private @Email(message="Email should be valid") @NotBlank(message="Email cannot be blank") String email;
    @NotBlank(message="Password cannot be blank")
    @Size(min=6, message="Password must be at least 6 characters")
    private @NotBlank(message="Password cannot be blank") @Size(min=6, message="Password must be at least 6 characters") String password;
    @Pattern(regexp="^\\+?[1-9]\\d{1,14}$", message="Phone number should be valid")
    private @Pattern(regexp="^\\+?[1-9]\\d{1,14}$", message="Phone number should be valid") String phone;

    

    public String getName() {
        return this.name;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof SignUpRequest)) {
            return false;
        }
        SignUpRequest other = (SignUpRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$name = this.getName();
        String other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) {
            return false;
        }
        String this$email = this.getEmail();
        String other$email = other.getEmail();
        if (this$email == null ? other$email != null : !this$email.equals(other$email)) {
            return false;
        }
        String this$password = this.getPassword();
        String other$password = other.getPassword();
        if (this$password == null ? other$password != null : !this$password.equals(other$password)) {
            return false;
        }
        String this$phone = this.getPhone();
        String other$phone = other.getPhone();
        return !(this$phone == null ? other$phone != null : !this$phone.equals(other$phone));
    }

    protected boolean canEqual(Object other) {
        return other instanceof SignUpRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $name = this.getName();
        result = result * 59 + ($name == null ? 43 : $name.hashCode());
        String $email = this.getEmail();
        result = result * 59 + ($email == null ? 43 : $email.hashCode());
        String $password = this.getPassword();
        result = result * 59 + ($password == null ? 43 : $password.hashCode());
        String $phone = this.getPhone();
        result = result * 59 + ($phone == null ? 43 : $phone.hashCode());
        return result;
    }

    public String toString() {
        return "SignUpRequest(name=" + this.getName() + ", email=" + this.getEmail() + ", password=" + this.getPassword() + ", phone=" + this.getPhone() + ")";
    }

    public SignUpRequest() {
    }

    public SignUpRequest(String name, String email, String password, String phone) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }
}

