/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.MeasurementJob
 *  com.styliste.repository.MeasurementJobRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 */
package com.styliste.repository;

import com.styliste.entity.MeasurementJob;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeasurementJobRepository
extends JpaRepository<MeasurementJob, Long> {
    public Optional<MeasurementJob> findByIdAndUser_Id(Long var1, Long var2);
}

