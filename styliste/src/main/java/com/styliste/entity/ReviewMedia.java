/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Review
 *  com.styliste.entity.ReviewMedia
 *  com.styliste.entity.ReviewMedia$MediaType
 *  com.styliste.entity.ReviewMedia$ReviewMediaBuilder
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.EnumType
 *  jakarta.persistence.Enumerated
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.ManyToOne
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Review;
import com.styliste.entity.ReviewMedia;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="review_media")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class ReviewMedia {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="review_id", nullable=false)
    private Review review;
    @Enumerated(value=EnumType.STRING)
    @Column(name="media_type", length=10)
    private MediaType mediaType;
    @Column(nullable=false, length=500)
    private String url;

    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReviewMedia)) {
            return false;
        }
        return this.id != null && this.id.equals(((ReviewMedia)o).getId());
    }

    public int hashCode() {
        return this.getClass().hashCode();
    }

    

    public Long getId() {
        return this.id;
    }

    public Review getReview() {
        return this.review;
    }

    public MediaType getMediaType() {
        return this.mediaType;
    }

    public String getUrl() {
        return this.url;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    public void setMediaType(MediaType mediaType) {
        this.mediaType = mediaType;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public ReviewMedia() {
    }

    public ReviewMedia(Long id, Review review, MediaType mediaType, String url) {
        this.id = id;
        this.review = review;
        this.mediaType = mediaType;
        this.url = url;
    }

    public enum MediaType {
        IMAGE,
        VIDEO
    }
}

