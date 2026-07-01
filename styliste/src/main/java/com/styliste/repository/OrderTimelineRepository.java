/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.OrderTimeline
 *  com.styliste.repository.OrderTimelineRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.stereotype.Repository
 */
package com.styliste.repository;

import com.styliste.entity.OrderTimeline;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderTimelineRepository
extends JpaRepository<OrderTimeline, Long> {
    public List<OrderTimeline> findByOrderIdOrderByTimestampAsc(Long var1);
}

