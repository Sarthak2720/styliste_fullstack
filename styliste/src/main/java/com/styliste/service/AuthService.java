package com.styliste.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.styliste.dto.AuthRequest;
import com.styliste.dto.AuthResponse;
import com.styliste.dto.SignUpRequest;
import com.styliste.dto.TokenRefreshResponse;
import com.styliste.entity.PasswordReset;
import com.styliste.entity.User;
import com.styliste.entity.UserRole;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceAlreadyExistsException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.PasswordResetRepository;
import com.styliste.repository.UserRepository;
import com.styliste.security.JwtTokenProvider;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final String GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_REQUEST_HEADER_VALUE = "XmlHttpRequest";

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
    private RefreshTokenService refreshTokenService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Value(value="${google.oauth.client-id}")
    private String googleClientId;
    @Value(value="${google.oauth.client-secret}")
    private String googleClientSecret;

    public AuthResponse login(AuthRequest request) {
        try {
            this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            User user = (User)this.userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
            this.appointmentService.linkAppointmentsToUser(user);
            log.info("Login successful for user: {}", user.getEmail());
            return this.buildAuthResponse(user, "Login successful");
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
        this.appointmentService.linkAppointmentsToUser(savedUser);
        log.info("User registered successfully: {}", savedUser.getEmail());
        return this.buildAuthResponse(savedUser, "Signup successful");
    }

    public AuthResponse googleLogin(String code, String origin, String requestedWith) {
        this.validateGoogleLoginRequest(origin, requestedWith);

        String redirectUri = origin.trim();
        Map<String, Object> tokenResponse = this.exchangeGoogleCodeForTokens(code, redirectUri);
        String idTokenValue = (String)tokenResponse.get("id_token");
        if (idTokenValue == null || idTokenValue.isBlank()) {
            throw new BadCredentialsException("Google authentication failed");
        }

        GoogleIdToken.Payload payload = this.verifyGoogleIdToken(idTokenValue);
        if (payload.getEmail() == null || payload.getEmail().isBlank()) {
            throw new BadCredentialsException("Google account did not return an email");
        }
        if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
            throw new BadCredentialsException("Google email address is not verified");
        }

        String email = this.normalizeEmail(payload.getEmail());
        String googleName = this.resolveGoogleDisplayName(payload, email);

        User user = (User)this.userRepository.findByEmailIgnoreCase(email).map(existing -> {
            existing.setName(googleName);
            return this.userRepository.save(existing);
        }).orElseGet(() -> this.userRepository.save(User.builder().name(googleName).email(email).password(this.passwordEncoder.encode((CharSequence)UUID.randomUUID().toString())).role(UserRole.CUSTOMER).isActive(Boolean.valueOf(true)).build()));

        this.appointmentService.linkAppointmentsToUser(user);
        log.info("Google login successful for user: {}", user.getEmail());
        return this.buildAuthResponse(user, "Google login successful");
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

    private void validateGoogleLoginRequest(String origin, String requestedWith) {
        if (!GOOGLE_REQUEST_HEADER_VALUE.equals(requestedWith)) {
            throw new BadRequestException("Invalid Google login request");
        }
        if (origin == null || origin.isBlank()) {
            throw new BadRequestException("Missing request origin");
        }
    }

    private Map<String, Object> exchangeGoogleCodeForTokens(String code, String redirectUri) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("code", code);
            form.add("client_id", this.googleClientId);
            form.add("client_secret", this.googleClientSecret);
            form.add("grant_type", "authorization_code");
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);
            Map<String, Object> responseBody = (Map<String, Object>)restTemplate.postForObject(GOOGLE_TOKEN_ENDPOINT, request, Map.class);
            if (responseBody == null) {
                throw new BadCredentialsException("Google authentication failed");
            }
            return responseBody;
        }
        catch (RestClientException ex) {
            log.error("Google token exchange failed: {}", ex.getMessage());
            throw new BadCredentialsException("Google authentication failed");
        }
    }

    private GoogleIdToken.Payload verifyGoogleIdToken(String idTokenValue) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance()).setAudience(Collections.singletonList(this.googleClientId)).build();
            GoogleIdToken idToken = verifier.verify(idTokenValue);
            if (idToken == null) {
                throw new BadCredentialsException("Unable to verify Google token");
            }
            return idToken.getPayload();
        }
        catch (Exception ex) {
            log.error("Google token verification failed: {}", ex.getMessage());
            throw new BadCredentialsException("Unable to verify Google token");
        }
    }

    private String resolveGoogleDisplayName(GoogleIdToken.Payload payload, String email) {
        Object nameClaim = payload.get("name");
        if (nameClaim instanceof String) {
            String name = ((String)nameClaim).trim();
            if (!name.isBlank()) {
                return name;
            }
        }
        int atIndex = email.indexOf("@");
        return atIndex > 0 ? email.substring(0, atIndex) : email;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    public TokenRefreshResponse refreshToken(String refreshTokenValue) {
        var refreshToken = refreshTokenService.validateAndGetRefreshToken(refreshTokenValue);
        var rotatedToken = refreshTokenService.rotateRefreshToken(refreshTokenValue);
        String accessToken = this.tokenProvider.generateTokenFromUsername(refreshToken.getUser().getEmail());
        return new TokenRefreshResponse(accessToken, rotatedToken.getToken());
    }

    public void logout(String refreshTokenValue) {
        if (refreshTokenValue != null && !refreshTokenValue.isBlank()) {
            refreshTokenService.revokeRefreshToken(refreshTokenValue);
            return;
        }

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getName() != null) {
            User user = this.userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found."));
            refreshTokenService.revokeAllRefreshTokensForUser(user);
            return;
        }

        throw new BadRequestException("Refresh token is required");
    }

    private AuthResponse buildAuthResponse(User user, String message) {
        String accessToken = this.tokenProvider.generateTokenFromUsername(user.getEmail());
        var refreshToken = this.refreshTokenService.createRefreshToken(user);
        return AuthResponse.builder()
                .token(accessToken)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .message(message)
                .refreshToken(refreshToken.getToken())
                .build();
    }
}
