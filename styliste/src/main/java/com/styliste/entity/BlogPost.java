/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.BlogPost
 *  com.styliste.entity.BlogPost$BlogPostBuilder
 *  com.styliste.entity.BlogStatus
 *  com.styliste.entity.User
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.EnumType
 *  jakarta.persistence.Enumerated
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.Index
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.ManyToOne
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.PreUpdate
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.BlogPost;
import com.styliste.entity.BlogStatus;
import com.styliste.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name="blog_posts", indexes={@Index(name="idx_blog_slug", columnList="slug", unique=true), @Index(name="idx_blog_status", columnList="status"), @Index(name="idx_blog_category", columnList="category"), @Index(name="idx_blog_created", columnList="created_at")})
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class BlogPost {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, columnDefinition="VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String title;
    @Column(nullable=false, length=500, unique=true)
    private String slug;
    @Column(nullable=false, columnDefinition="VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String category;
    @Column(nullable=false, columnDefinition="TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String excerpt;
    @Column(name="cover_url", columnDefinition="TEXT")
    private String coverUrl;
    @Column(nullable=false, columnDefinition="VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String author;
    @Column(name="read_time", length=50)
    private String readTime;
    @Enumerated(value=EnumType.STRING)
    @Column(nullable=false, length=20)
    private BlogStatus status;
    @Column(nullable=false, columnDefinition="MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String sections;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="created_by")
    private User createdBy;
    @Column(name="created_at", nullable=false, updatable=false)
    private LocalDateTime createdAt;
    @Column(name="updated_at", nullable=false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now;
        this.createdAt = now = LocalDateTime.now();
        this.updatedAt = now;
        if (this.status == null) {
            this.status = BlogStatus.DRAFT;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    

    public Long getId() {
        return this.id;
    }

    public String getTitle() {
        return this.title;
    }

    public String getSlug() {
        return this.slug;
    }

    public String getCategory() {
        return this.category;
    }

    public String getExcerpt() {
        return this.excerpt;
    }

    public String getCoverUrl() {
        return this.coverUrl;
    }

    public String getAuthor() {
        return this.author;
    }

    public String getReadTime() {
        return this.readTime;
    }

    public BlogStatus getStatus() {
        return this.status;
    }

    public String getSections() {
        return this.sections;
    }

    public User getCreatedBy() {
        return this.createdBy;
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

    public void setTitle(String title) {
        this.title = title;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setReadTime(String readTime) {
        this.readTime = readTime;
    }

    public void setStatus(BlogStatus status) {
        this.status = status;
    }

    public void setSections(String sections) {
        this.sections = sections;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof BlogPost)) {
            return false;
        }
        BlogPost other = (BlogPost)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        String this$title = this.getTitle();
        String other$title = other.getTitle();
        if (this$title == null ? other$title != null : !this$title.equals(other$title)) {
            return false;
        }
        String this$slug = this.getSlug();
        String other$slug = other.getSlug();
        if (this$slug == null ? other$slug != null : !this$slug.equals(other$slug)) {
            return false;
        }
        String this$category = this.getCategory();
        String other$category = other.getCategory();
        if (this$category == null ? other$category != null : !this$category.equals(other$category)) {
            return false;
        }
        String this$excerpt = this.getExcerpt();
        String other$excerpt = other.getExcerpt();
        if (this$excerpt == null ? other$excerpt != null : !this$excerpt.equals(other$excerpt)) {
            return false;
        }
        String this$coverUrl = this.getCoverUrl();
        String other$coverUrl = other.getCoverUrl();
        if (this$coverUrl == null ? other$coverUrl != null : !this$coverUrl.equals(other$coverUrl)) {
            return false;
        }
        String this$author = this.getAuthor();
        String other$author = other.getAuthor();
        if (this$author == null ? other$author != null : !this$author.equals(other$author)) {
            return false;
        }
        String this$readTime = this.getReadTime();
        String other$readTime = other.getReadTime();
        if (this$readTime == null ? other$readTime != null : !this$readTime.equals(other$readTime)) {
            return false;
        }
        BlogStatus this$status = this.getStatus();
        BlogStatus other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        String this$sections = this.getSections();
        String other$sections = other.getSections();
        if (this$sections == null ? other$sections != null : !this$sections.equals(other$sections)) {
            return false;
        }
        User this$createdBy = this.getCreatedBy();
        User other$createdBy = other.getCreatedBy();
        if (this$createdBy == null ? other$createdBy != null : !this$createdBy.equals(other$createdBy)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt)) {
            return false;
        }
        LocalDateTime this$updatedAt = this.getUpdatedAt();
        LocalDateTime other$updatedAt = other.getUpdatedAt();
        return !(this$updatedAt == null ? other$updatedAt != null : !(this$updatedAt).equals(other$updatedAt));
    }

    protected boolean canEqual(Object other) {
        return other instanceof BlogPost;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        String $title = this.getTitle();
        result = result * 59 + ($title == null ? 43 : $title.hashCode());
        String $slug = this.getSlug();
        result = result * 59 + ($slug == null ? 43 : $slug.hashCode());
        String $category = this.getCategory();
        result = result * 59 + ($category == null ? 43 : $category.hashCode());
        String $excerpt = this.getExcerpt();
        result = result * 59 + ($excerpt == null ? 43 : $excerpt.hashCode());
        String $coverUrl = this.getCoverUrl();
        result = result * 59 + ($coverUrl == null ? 43 : $coverUrl.hashCode());
        String $author = this.getAuthor();
        result = result * 59 + ($author == null ? 43 : $author.hashCode());
        String $readTime = this.getReadTime();
        result = result * 59 + ($readTime == null ? 43 : $readTime.hashCode());
        BlogStatus $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        String $sections = this.getSections();
        result = result * 59 + ($sections == null ? 43 : $sections.hashCode());
        User $createdBy = this.getCreatedBy();
        result = result * 59 + ($createdBy == null ? 43 : $createdBy.hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        LocalDateTime $updatedAt = this.getUpdatedAt();
        result = result * 59 + ($updatedAt == null ? 43 : ($updatedAt).hashCode());
        return result;
    }

    public String toString() {
        return "BlogPost(id=" + this.getId() + ", title=" + this.getTitle() + ", slug=" + this.getSlug() + ", category=" + this.getCategory() + ", excerpt=" + this.getExcerpt() + ", coverUrl=" + this.getCoverUrl() + ", author=" + this.getAuthor() + ", readTime=" + this.getReadTime() + ", status=" + String.valueOf(this.getStatus()) + ", sections=" + this.getSections() + ", createdBy=" + String.valueOf(this.getCreatedBy()) + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", updatedAt=" + String.valueOf(this.getUpdatedAt()) + ")";
    }

    public BlogPost() {
    }

    public BlogPost(Long id, String title, String slug, String category, String excerpt, String coverUrl, String author, String readTime, BlogStatus status, String sections, User createdBy, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.category = category;
        this.excerpt = excerpt;
        this.coverUrl = coverUrl;
        this.author = author;
        this.readTime = readTime;
        this.status = status;
        this.sections = sections;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

