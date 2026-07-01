/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Product
 *  com.styliste.repository.ProductRepository
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.data.jpa.repository.JpaSpecificationExecutor
 *  org.springframework.data.jpa.repository.Query
 *  org.springframework.data.repository.query.Param
 *  org.springframework.stereotype.Repository
 */
package com.styliste.repository;

import com.styliste.entity.Product;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository
extends JpaRepository<Product, Long>,
JpaSpecificationExecutor<Product> {
    public List<Product> findByCategory(String var1);

    public List<Product> findBySubcategory(String var1);

    public List<Product> findByCategoryAndSubcategory(String var1, String var2);

    public boolean existsBySubcategory(String var1);

    public Page<Product> findByNameContainingIgnoreCase(String var1, Pageable var2);

    @Query(value="SELECT p FROM Product p WHERE (:category IS NULL OR p.category = :category) AND (:subcategory IS NULL OR p.subcategory = :subcategory) AND (:minPrice IS NULL OR p.price >= :minPrice) AND (:maxPrice IS NULL OR p.price <= :maxPrice) AND (:searchQuery IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) AND p.isActive = true")
    public Page<Product> searchProducts(@Param(value="category") String var1, @Param(value="subcategory") String var2, @Param(value="minPrice") BigDecimal var3, @Param(value="maxPrice") BigDecimal var4, @Param(value="searchQuery") String var5, Pageable var6);

    public List<Product> findByIsActiveTrueOrderByCreatedAtDesc();
}

