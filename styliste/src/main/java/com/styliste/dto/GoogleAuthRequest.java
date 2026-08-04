package com.styliste.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleAuthRequest {
    @NotBlank(message = "Google authorization code cannot be blank")
    private String code;

    public GoogleAuthRequest() {
    }

    public GoogleAuthRequest(String code) {
        this.code = code;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
