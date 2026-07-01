/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.BlogPostRequest
 */
package com.styliste.dto;

import java.util.List;
import java.util.Map;

public class BlogPostRequest {
    private String title;
    private String category;
    private String excerpt;
    private String coverUrl;
    private String author;
    private String readTime;
    private String status;
    private List<Map<String, Object>> sections;

    public String getTitle() {
        return this.title;
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

    public List<Map<String, Object>> getSections() {
        return this.sections;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public void setSections(List<Map<String, Object>> sections) {
        this.sections = sections;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof BlogPostRequest)) {
            return false;
        }
        BlogPostRequest other = (BlogPostRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        String this$title = this.getTitle();
        String other$title = other.getTitle();
        if (this$title == null ? other$title != null : !this$title.equals(other$title)) {
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
        List this$sections = this.getSections();
        List other$sections = other.getSections();
        return !(this$sections == null ? other$sections != null : !(this$sections).equals(other$sections));
    }

    protected boolean canEqual(Object other) {
        return other instanceof BlogPostRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        String $title = this.getTitle();
        result = result * 59 + ($title == null ? 43 : $title.hashCode());
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
        List $sections = this.getSections();
        result = result * 59 + ($sections == null ? 43 : ($sections).hashCode());
        return result;
    }

    public String toString() {
        return "BlogPostRequest(title=" + this.getTitle() + ", category=" + this.getCategory() + ", excerpt=" + this.getExcerpt() + ", coverUrl=" + this.getCoverUrl() + ", author=" + this.getAuthor() + ", readTime=" + this.getReadTime() + ", status=" + this.getStatus() + ", sections=" + String.valueOf(this.getSections()) + ")";
    }

    public BlogPostRequest() {
    }

    public BlogPostRequest(String title, String category, String excerpt, String coverUrl, String author, String readTime, String status, List<Map<String, Object>> sections) {
        this.title = title;
        this.category = category;
        this.excerpt = excerpt;
        this.coverUrl = coverUrl;
        this.author = author;
        this.readTime = readTime;
        this.status = status;
        this.sections = sections;
    }
}

