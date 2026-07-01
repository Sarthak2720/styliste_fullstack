/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.ReturnTimeline
 *  com.styliste.repository.ReturnTimelineRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 */
package com.styliste.repository;

import com.styliste.entity.ReturnTimeline;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReturnTimelineRepository
extends JpaRepository<ReturnTimeline, Long> {
    public List<ReturnTimeline> findByReturnRequestIdOrderByTimestampAsc(Long var1);
}

