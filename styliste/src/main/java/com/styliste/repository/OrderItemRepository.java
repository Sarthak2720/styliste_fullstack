/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.OrderItem
 *  com.styliste.repository.OrderItemRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.stereotype.Repository
 */
package com.styliste.repository;

import com.styliste.entity.OrderItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository
extends JpaRepository<OrderItem, Long> {
    public List<OrderItem> findByOrderId(Long var1);
}

