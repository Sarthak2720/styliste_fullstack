/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.exception.ErrorResponse
 *  com.styliste.exception.ErrorResponse$ErrorResponseBuilder
 */
package com.styliste.exception;

import com.styliste.exception.ErrorResponse;
import java.time.LocalDateTime;
import java.util.Map;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private String path;
    private Map<String, String> validationErrors;

    

    public LocalDateTime getTimestamp() {
        return this.timestamp;
    }

    public int getStatus() {
        return this.status;
    }

    public String getMessage() {
        return this.message;
    }

    public String getPath() {
        return this.path;
    }

    public Map<String, String> getValidationErrors() {
        return this.validationErrors;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setValidationErrors(Map<String, String> validationErrors) {
        this.validationErrors = validationErrors;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ErrorResponse)) {
            return false;
        }
        ErrorResponse other = (ErrorResponse)o;
        if (!other.canEqual(this)) {
            return false;
        }
        if (this.getStatus() != other.getStatus()) {
            return false;
        }
        LocalDateTime this$timestamp = this.getTimestamp();
        LocalDateTime other$timestamp = other.getTimestamp();
        if (this$timestamp == null ? other$timestamp != null : !(this$timestamp).equals(other$timestamp)) {
            return false;
        }
        String this$message = this.getMessage();
        String other$message = other.getMessage();
        if (this$message == null ? other$message != null : !this$message.equals(other$message)) {
            return false;
        }
        String this$path = this.getPath();
        String other$path = other.getPath();
        if (this$path == null ? other$path != null : !this$path.equals(other$path)) {
            return false;
        }
        Map this$validationErrors = this.getValidationErrors();
        Map other$validationErrors = other.getValidationErrors();
        return !(this$validationErrors == null ? other$validationErrors != null : !(this$validationErrors).equals(other$validationErrors));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ErrorResponse;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * 59 + this.getStatus();
        LocalDateTime $timestamp = this.getTimestamp();
        result = result * 59 + ($timestamp == null ? 43 : ($timestamp).hashCode());
        String $message = this.getMessage();
        result = result * 59 + ($message == null ? 43 : $message.hashCode());
        String $path = this.getPath();
        result = result * 59 + ($path == null ? 43 : $path.hashCode());
        Map $validationErrors = this.getValidationErrors();
        result = result * 59 + ($validationErrors == null ? 43 : ($validationErrors).hashCode());
        return result;
    }

    public String toString() {
        return "ErrorResponse(timestamp=" + String.valueOf(this.getTimestamp()) + ", status=" + this.getStatus() + ", message=" + this.getMessage() + ", path=" + this.getPath() + ", validationErrors=" + String.valueOf(this.getValidationErrors()) + ")";
    }

    public ErrorResponse() {
    }

    public ErrorResponse(LocalDateTime timestamp, int status, String message, String path, Map<String, String> validationErrors) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.path = path;
        this.validationErrors = validationErrors;
    }
}

