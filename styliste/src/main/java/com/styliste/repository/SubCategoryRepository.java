/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.SubCategory
 *  com.styliste.repository.SubCategoryRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 */
package com.styliste.repository;

import com.styliste.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubCategoryRepository
extends JpaRepository<SubCategory, Long> {
    public boolean existsByNameAndCategoryId(String var1, Long var2);
}

