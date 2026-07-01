/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.BlogPost
 *  com.styliste.entity.BlogStatus
 *  com.styliste.repository.BlogPostRepository
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.data.jpa.repository.Query
 */
package com.styliste.repository;

import com.styliste.entity.BlogPost;
import com.styliste.entity.BlogStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BlogPostRepository
extends JpaRepository<BlogPost, Long> {
    public List<BlogPost> findAllByOrderByUpdatedAtDesc();

    public Page<BlogPost> findByStatus(BlogStatus var1, Pageable var2);

    public Page<BlogPost> findByStatusAndCategory(BlogStatus var1, String var2, Pageable var3);

    public Optional<BlogPost> findBySlug(String var1);

    public Optional<BlogPost> findBySlugAndStatus(String var1, BlogStatus var2);

    public boolean existsBySlug(String var1);

    @Query(value="SELECT DISTINCT b.category FROM BlogPost b WHERE b.status = 'PUBLISHED' ORDER BY b.category")
    public List<String> findDistinctCategoriesPublished();
}

