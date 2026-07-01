/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Order
 *  com.styliste.entity.OrderStatus
 *  com.styliste.repository.OrderRepository
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.stereotype.Repository
 */
package com.styliste.repository;

import com.styliste.entity.Order;
import com.styliste.entity.OrderStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository
extends JpaRepository<Order, Long> {
    public Page<Order> findByUserId(Long var1, Pageable var2);

    public List<Order> findByStatus(OrderStatus var1);

    public List<Order> findByUserIdOrderByCreatedAtDesc(Long var1);

    public Optional<Order> findByTrackingNumber(String var1);

    public long countByStatus(OrderStatus var1);

    public Optional<Order> findByRazorpayOrderId(String var1);
}

