/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.BlogPostListDTO
 *  com.styliste.dto.BlogPostListDTO$BlogPostListDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.BlogPostListDTO;
import java.time.LocalDateTime;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class BlogPostListDTO {
    private Long id;
    private String title;
    private String slug;
    private String category;
    private String excerpt;
    private String coverUrl;
    private String author;
    private String readTime;
    private String status;
    private int sectionsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    

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

    public String getStatus() {
        return this.status;
    }

    public int getSectionsCount() {
        return this.sectionsCount;
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

    public void setStatus(String status) {
        this.status = status;
    }

    public void setSectionsCount(int sectionsCount) {
        this.sectionsCount = sectionsCount;
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
        if (!(o instanceof BlogPostListDTO)) {
            return false;
        }
        BlogPostListDTO other = (BlogPostListDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        if (this.getSectionsCount() != other.getSectionsCount()) {
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
        String this$status = this.getStatus();
        String other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
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
        return other instanceof BlogPostListDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * 59 + this.getSectionsCount();
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
        String $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        LocalDateTime $updatedAt = this.getUpdatedAt();
        result = result * 59 + ($updatedAt == null ? 43 : ($updatedAt).hashCode());
        return result;
    }

    public String toString() {
        return "BlogPostListDTO(id=" + this.getId() + ", title=" + this.getTitle() + ", slug=" + this.getSlug() + ", category=" + this.getCategory() + ", excerpt=" + this.getExcerpt() + ", coverUrl=" + this.getCoverUrl() + ", author=" + this.getAuthor() + ", readTime=" + this.getReadTime() + ", status=" + this.getStatus() + ", sectionsCount=" + this.getSectionsCount() + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", updatedAt=" + String.valueOf(this.getUpdatedAt()) + ")";
    }

    public BlogPostListDTO() {
    }

    public BlogPostListDTO(Long id, String title, String slug, String category, String excerpt, String coverUrl, String author, String readTime, String status, int sectionsCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.category = category;
        this.excerpt = excerpt;
        this.coverUrl = coverUrl;
        this.author = author;
        this.readTime = readTime;
        this.status = status;
        this.sectionsCount = sectionsCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

