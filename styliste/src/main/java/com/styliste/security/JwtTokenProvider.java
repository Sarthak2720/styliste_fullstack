/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.security.JwtTokenProvider
 *  io.jsonwebtoken.Claims
 *  io.jsonwebtoken.ExpiredJwtException
 *  io.jsonwebtoken.Jwts
 *  io.jsonwebtoken.Jwts$SIG
 *  io.jsonwebtoken.MalformedJwtException
 *  io.jsonwebtoken.UnsupportedJwtException
 *  io.jsonwebtoken.security.Keys
 *  io.jsonwebtoken.security.SecureDigestAlgorithm
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Value
 *  org.springframework.security.core.Authentication
 *  org.springframework.stereotype.Component
 */
package com.styliste.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecureDigestAlgorithm;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {
    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);
    @Value(value="${jwt.secret}")
    private String jwtSecret;
    @Value(value="${jwt.expiration}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = this.jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor((byte[])keyBytes);
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        return this.generateTokenFromUsername(username);
    }

    public String generateTokenFromUsername(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + this.jwtExpirationMs);
        return Jwts.builder().subject(username).issuedAt(now).expiration(expiryDate).signWith((Key)this.getSigningKey(), (SecureDigestAlgorithm)Jwts.SIG.HS512).compact();
    }

    public String getUsernameFromJwt(String token) {
        return ((Claims)Jwts.parser().verifyWith(this.getSigningKey()).build().parseSignedClaims((CharSequence)token).getPayload()).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(this.getSigningKey()).build().parseSignedClaims((CharSequence)token);
            return true;
        }
        catch (MalformedJwtException ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
        }
        catch (ExpiredJwtException ex) {
            log.error("Expired JWT token: {}", ex.getMessage());
        }
        catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token: {}", ex.getMessage());
        }
        catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty: {}", ex.getMessage());
        }
        catch (SecurityException ex) {
            log.error("JWT signature does not match locally computed signature", (Throwable)ex);
        }
        return false;
    }
}

