/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.ReturnRequest
 *  com.styliste.entity.ReturnStatus
 *  com.styliste.repository.ReturnRequestRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 */
package com.styliste.repository;

import com.styliste.entity.ReturnRequest;
import com.styliste.entity.ReturnStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReturnRequestRepository
extends JpaRepository<ReturnRequest, Long> {
    public List<ReturnRequest> findByUserId(Long var1);

    public List<ReturnRequest> findByStatus(ReturnStatus var1);
}

