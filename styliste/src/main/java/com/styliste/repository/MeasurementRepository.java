/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Measurement
 *  com.styliste.repository.MeasurementRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 */
package com.styliste.repository;

import com.styliste.entity.Measurement;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeasurementRepository
extends JpaRepository<Measurement, Long> {
    public List<Measurement> findByUserIdOrderByCreatedAtDesc(Long var1);

    public Optional<Measurement> findByIdAndUserId(Long var1, Long var2);

    public long countByUserId(Long var1);
}

