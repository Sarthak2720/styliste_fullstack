/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.PasswordReset
 *  com.styliste.repository.PasswordResetRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 */
package com.styliste.repository;

import com.styliste.entity.PasswordReset;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetRepository
extends JpaRepository<PasswordReset, Long> {
    public Optional<PasswordReset> findByEmailAndOtp(String var1, String var2);

    public Optional<PasswordReset> findTopByEmailOrderByExpiryTimeDesc(String var1);

    public void deleteByEmail(String var1);
}

