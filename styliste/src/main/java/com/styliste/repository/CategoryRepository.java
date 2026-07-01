/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Category
 *  com.styliste.repository.CategoryRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 */
package com.styliste.repository;

import com.styliste.entity.Category;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository
extends JpaRepository<Category, Long> {
    public boolean existsByName(String var1);

    public List<Category> findByIsActiveTrue();
}

