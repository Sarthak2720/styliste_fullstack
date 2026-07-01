/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AuthRequest
 *  com.styliste.dto.AuthResponse
 *  com.styliste.dto.SignUpRequest
 *  com.styliste.entity.PasswordReset
 *  com.styliste.entity.User
 *  com.styliste.entity.UserRole
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceAlreadyExistsException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.PasswordResetRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.security.JwtTokenProvider
 *  com.styliste.service.AppointmentService
 *  com.styliste.service.AuthService
 *  com.styliste.service.EmailService
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.security.authentication.AuthenticationManager
 *  org.springframework.security.authentication.BadCredentialsException
 *  org.springframework.security.authentication.UsernamePasswordAuthenticationToken
 *  org.springframework.security.core.Authentication
 *  org.springframework.security.crypto.password.PasswordEncoder
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 */
package com.styliste.service;

import com.styliste.dto.AuthRequest;
import com.styliste.dto.AuthResponse;
import com.styliste.dto.SignUpRequest;
import com.styliste.entity.PasswordReset;
import com.styliste.entity.User;
import com.styliste.entity.UserRole;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceAlreadyExistsException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.PasswordResetRepository;
import com.styliste.repository.UserRepository;
import com.styliste.security.JwtTokenProvider;
import com.styliste.service.AppointmentService;
import com.styliste.service.EmailService;
import java.time.LocalDateTime;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider tokenProvider;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordResetRepository passwordResetRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(AuthRequest request) {
        try {
            Authentication authentication = this.authenticationManager.authenticate((Authentication)new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            String jwt = this.tokenProvider.generateToken(authentication);
            User user = (User)this.userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
            this.appointmentService.linkAppointmentsToUser(user);
            log.info("Login successful for user: {}", user.getEmail());
            return AuthResponse.builder().token(jwt).id(user.getId()).email(user.getEmail()).name(user.getName()).role(user.getRole().name()).message("Login successful").build();
        }
        catch (Exception ex) {
            log.error("Login failed for email {}: {}", request.getEmail(), ex.getMessage());
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    public AuthResponse signup(SignUpRequest request) {
        if (this.userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("User already exists with this email");
        }
        User user = User.builder().name(request.getName()).email(request.getEmail()).password(this.passwordEncoder.encode((CharSequence)request.getPassword())).phone(request.getPhone()).role(UserRole.CUSTOMER).isActive(Boolean.valueOf(true)).build();
        User savedUser = (User)this.userRepository.save(user);
        String jwt = this.tokenProvider.generateTokenFromUsername(savedUser.getEmail());
        log.info("User registered successfully: {}", savedUser.getEmail());
        this.appointmentService.linkAppointmentsToUser(savedUser);
        return AuthResponse.builder().token(jwt).id(savedUser.getId()).email(savedUser.getEmail()).name(savedUser.getName()).role(savedUser.getRole().name()).message("Signup successful").build();
    }

    public void sendOtp(String email) {
        this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Email not registered with us."));
        String otp = String.format("%06d", new Random().nextInt(999999));
        this.passwordResetRepository.deleteByEmail(email);
        PasswordReset resetRequest = PasswordReset.builder().email(email).otp(otp).expiryTime(LocalDateTime.now().plusMinutes(10L)).verified(false).build();
        this.passwordResetRepository.save(resetRequest);
        this.emailService.sendPasswordResetOtpEmail(email, otp);
    }

    public void verifyOtp(String email, String otp) {
        PasswordReset reset = (PasswordReset)this.passwordResetRepository.findByEmailAndOtp(email, otp).orElseThrow(() -> new BadRequestException("Invalid OTP."));
        if (reset.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired.");
        }
        reset.setVerified(true);
        this.passwordResetRepository.save(reset);
    }

    public void resetPassword(String email, String newPassword) {
        PasswordReset reset = (PasswordReset)this.passwordResetRepository.findTopByEmailOrderByExpiryTimeDesc(email).orElseThrow(() -> new BadRequestException("No reset request found."));
        if (!reset.isVerified()) {
            throw new BadRequestException("Please verify your OTP first.");
        }
        User user = (User)this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found."));
        user.setPassword(this.passwordEncoder.encode((CharSequence)newPassword));
        this.userRepository.save(user);
        this.passwordResetRepository.deleteByEmail(email);
    }
}

