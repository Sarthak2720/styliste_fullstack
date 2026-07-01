/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Review
 *  com.styliste.entity.Review$ReviewBuilder
 *  com.styliste.entity.ReviewMedia
 *  jakarta.persistence.CascadeType
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.Index
 *  jakarta.persistence.OneToMany
 *  jakarta.persistence.Table
 *  org.hibernate.annotations.CreationTimestamp
 *  org.hibernate.annotations.UpdateTimestamp
 */
package com.styliste.entity;

import com.styliste.entity.Review;
import com.styliste.entity.ReviewMedia;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/*
 * Exception performing whole class analysis ignored.
 */
@Entity
@Table(name="reviews", indexes={@Index(name="idx_product_created", columnList="product_id, created_at")})
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class Review {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(name="user_id", nullable=false)
    private Long userId;
    @Column(name="product_id", nullable=false)
    private Long productId;
    @Column(name="order_id")
    private Long orderId;
    @Column(nullable=false)
    private Integer rating;
    @Column(length=255)
    private String title;
    @Column(columnDefinition="TEXT")
    private String body;
    @Column(name="is_deleted", nullable=false)
    private boolean isDeleted = false;
    @OneToMany(mappedBy="review", cascade={CascadeType.ALL}, orphanRemoval=true, fetch=FetchType.LAZY)
    private List<ReviewMedia> media;
    @CreationTimestamp
    @Column(name="created_at", updatable=false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    public void addMedia(ReviewMedia item) {
        this.media.add(item);
        item.setReview(this);
    }

    private static List<ReviewMedia> $default$media() {
        return new ArrayList<ReviewMedia>();
    }

    

    public Long getId() {
        return this.id;
    }

    public Long getUserId() {
        return this.userId;
    }

    public Long getProductId() {
        return this.productId;
    }

    public Long getOrderId() {
        return this.orderId;
    }

    public Integer getRating() {
        return this.rating;
    }

    public String getTitle() {
        return this.title;
    }

    public String getBody() {
        return this.body;
    }

    public boolean isDeleted() {
        return this.isDeleted;
    }

    public List<ReviewMedia> getMedia() {
        return this.media;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public void setDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public void setMedia(List<ReviewMedia> media) {
        this.media = media;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Review() {
        this.media = Review.$default$media();
    }

    public Review(Long id, Long userId, Long productId, Long orderId, Integer rating, String title, String body, boolean isDeleted, List<ReviewMedia> media, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.productId = productId;
        this.orderId = orderId;
        this.rating = rating;
        this.title = title;
        this.body = body;
        this.isDeleted = isDeleted;
        this.media = media;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

