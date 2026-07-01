/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Review
 *  com.styliste.repository.ReviewRepository
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.stereotype.Repository
 */
package com.styliste.repository;

import com.styliste.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository
extends JpaRepository<Review, Long> {
    public Page<Review> findByProductIdAndIsDeletedFalse(Long var1, Pageable var2);

    public Page<Review> findByProductId(Long var1, Pageable var2);

    public boolean existsByUserIdAndProductIdAndIsDeletedFalse(Long var1, Long var2);
}

