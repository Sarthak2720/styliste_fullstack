/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.AuthController
 *  com.styliste.dto.AuthRequest
 *  com.styliste.dto.AuthResponse
 *  com.styliste.dto.ForgotPasswordRequest
 *  com.styliste.dto.ResetPasswordRequest
 *  com.styliste.dto.SignUpRequest
 *  com.styliste.dto.VerifyOtpRequest
 *  com.styliste.service.AuthService
 *  jakarta.validation.Valid
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.http.HttpStatus
 *  org.springframework.http.HttpStatusCode
 *  org.springframework.http.ResponseEntity
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.styliste.dto.AuthRequest;
import com.styliste.dto.AuthResponse;
import com.styliste.dto.ForgotPasswordRequest;
import com.styliste.dto.GoogleAuthRequest;
import com.styliste.dto.ResetPasswordRequest;
import com.styliste.dto.SignUpRequest;
import com.styliste.dto.TokenRefreshRequest;
import com.styliste.dto.TokenRefreshResponse;
import com.styliste.dto.VerifyOtpRequest;
import com.styliste.service.AuthService;
import com.styliste.security.CookieHelper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/auth"})
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private AuthService authService;

    @Value("${jwt.expiration:900000}")
    private long jwtExpirationMs;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshTokenExpirationMs;

    private void setAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        if (accessToken != null) {
            CookieHelper.setCookie(response, "accessToken", accessToken, (int) (jwtExpirationMs / 1000));
        }
        if (refreshToken != null) {
            CookieHelper.setCookie(response, "refreshToken", refreshToken, (int) (refreshTokenExpirationMs / 1000));
        }
    }

    @PostMapping(value={"/login"})
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request, HttpServletResponse response) {
        log.info("Login attempt for email: {}", request.getEmail());
        AuthResponse authResponse = this.authService.login(request);
        setAuthCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        authResponse.setToken(null);
        authResponse.setRefreshToken(null);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping(value={"/signup"})
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignUpRequest request, HttpServletResponse response) {
        log.info("Signup attempt for email: {}", request.getEmail());
        AuthResponse authResponse = this.authService.signup(request);
        setAuthCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        authResponse.setToken(null);
        authResponse.setRefreshToken(null);
        return ResponseEntity.status((HttpStatusCode)HttpStatus.CREATED).body(authResponse);
    }

    @PostMapping(value={"/google"})
    public ResponseEntity<AuthResponse> googleLogin(@Valid @RequestBody GoogleAuthRequest request, 
                                                   @RequestHeader(value="Origin", required=false) String origin, 
                                                   @RequestHeader(value="X-Requested-With", required=false) String requestedWith,
                                                   HttpServletResponse response) {
        log.info("Google login attempt received");
        AuthResponse authResponse = this.authService.googleLogin(request.getCode(), origin, requestedWith);
        setAuthCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        authResponse.setToken(null);
        authResponse.setRefreshToken(null);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping(value={"/refresh"})
    public ResponseEntity<TokenRefreshResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        log.info("Refresh token request received");
        String refreshTokenValue = CookieHelper.getCookieValue(request, "refreshToken");
        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            throw new com.styliste.exception.BadRequestException("Refresh token is missing");
        }
        TokenRefreshResponse refreshResponse = this.authService.refreshToken(refreshTokenValue);
        setAuthCookies(response, refreshResponse.getAccessToken(), refreshResponse.getRefreshToken());
        return ResponseEntity.ok(new TokenRefreshResponse(null, null));
    }

    @PostMapping(value={"/logout"})
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenValue = CookieHelper.getCookieValue(request, "refreshToken");
        if (refreshTokenValue != null && !refreshTokenValue.isBlank()) {
            this.authService.logout(refreshTokenValue);
        }
        CookieHelper.clearCookie(response, "accessToken");
        CookieHelper.clearCookie(response, "refreshToken");
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping(value={"/forgot-password"})
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Processing forgot password request for email: {}", request.getEmail());
        this.authService.sendOtp(request.getEmail());
        return ResponseEntity.ok("OTP sent to your email.");
    }

    @PostMapping(value={"/verify-otp"})
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        log.info("Verifying OTP for email: {}", request.getEmail());
        this.authService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok("OTP verified successfully.");
    }

    @PostMapping(value={"/reset-password"})
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Resetting password for email: {}", request.getEmail());
        this.authService.resetPassword(request.getEmail(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successful.");
    }
}

