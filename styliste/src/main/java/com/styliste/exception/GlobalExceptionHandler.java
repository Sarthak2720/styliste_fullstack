/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ErrorResponse
 *  com.styliste.exception.GlobalExceptionHandler
 *  com.styliste.exception.ResourceAlreadyExistsException
 *  com.styliste.exception.ResourceNotFoundException
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.dao.OptimisticLockingFailureException
 *  org.springframework.http.HttpStatus
 *  org.springframework.http.HttpStatusCode
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.AccessDeniedException
 *  org.springframework.security.authentication.BadCredentialsException
 *  org.springframework.security.core.AuthenticationException
 *  org.springframework.web.bind.MethodArgumentNotValidException
 *  org.springframework.web.bind.annotation.ExceptionHandler
 *  org.springframework.web.bind.annotation.RestControllerAdvice
 *  org.springframework.web.context.request.WebRequest
 */
package com.styliste.exception;

import com.styliste.exception.BadRequestException;
import com.styliste.exception.ErrorResponse;
import com.styliste.exception.ResourceAlreadyExistsException;
import com.styliste.exception.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(value={ResourceNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        log.error("Resource not found: {}", ex.getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.NOT_FOUND.value()).message(ex.getMessage()).path(request.getDescription(false).replace("uri=", "")).build();
        return new ResponseEntity(errorResponse, (HttpStatusCode)HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value={ResourceAlreadyExistsException.class})
    public ResponseEntity<ErrorResponse> handleResourceAlreadyExists(ResourceAlreadyExistsException ex, WebRequest request) {
        log.error("Resource already exists: {}", ex.getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.CONFLICT.value()).message(ex.getMessage()).path(request.getDescription(false).replace("uri=", "")).build();
        return new ResponseEntity(errorResponse, (HttpStatusCode)HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value={BadRequestException.class})
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex, WebRequest request) {
        log.error("Bad request: {}", ex.getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.BAD_REQUEST.value()).message(ex.getMessage()).path(request.getDescription(false).replace("uri=", "")).build();
        return new ResponseEntity(errorResponse, (HttpStatusCode)HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value={BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, WebRequest request) {
        log.error("Bad credentials: {}", ex.getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.UNAUTHORIZED.value()).message("Invalid email or password").path(request.getDescription(false).replace("uri=", "")).build();
        return new ResponseEntity(errorResponse, (HttpStatusCode)HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value={AuthenticationException.class})
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        log.error("Authentication failed: {}", ex.getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.UNAUTHORIZED.value()).message("Authentication failed").path(request.getDescription(false).replace("uri=", "")).build();
        return new ResponseEntity(errorResponse, (HttpStatusCode)HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value={AccessDeniedException.class})
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, WebRequest request) {
        log.error("Access denied: {}", ex.getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.FORBIDDEN.value()).message("You do not have permission to perform this action").path(request.getDescription(false).replace("uri=", "")).build();
        return new ResponseEntity(errorResponse, (HttpStatusCode)HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value={OptimisticLockingFailureException.class})
    public ResponseEntity<ErrorResponse> handleOptimisticLock(OptimisticLockingFailureException ex, WebRequest request) {
        log.error("Concurrent modification conflict: {}", ex.getMessage());
        ErrorResponse errorResponse = ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.CONFLICT.value()).message("This item was modified by another request. Please try again.").path(request.getDescription(false).replace("uri=", "")).build();
        return new ResponseEntity(errorResponse, (HttpStatusCode)HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value={MethodArgumentNotValidException.class})
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
        log.error("Validation failed");
        HashMap errors = new HashMap();
        ex.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        ErrorResponse errorResponse = ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.BAD_REQUEST.value()).message("Validation failed").validationErrors(errors).path(request.getDescription(false).replace("uri=", "")).build();
        return new ResponseEntity(errorResponse, (HttpStatusCode)HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value={Exception.class})
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        log.error("Internal server error: ", (Throwable)ex);
        ErrorResponse errorResponse = ErrorResponse.builder().timestamp(LocalDateTime.now()).status(HttpStatus.INTERNAL_SERVER_ERROR.value()).message("Internal server error").path(request.getDescription(false).replace("uri=", "")).build();
        return new ResponseEntity(errorResponse, (HttpStatusCode)HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

