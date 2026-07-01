/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ReviewRequestDTO
 */
package com.styliste.dto;

import java.util.List;

public class ReviewRequestDTO {
    private Long userId;
    private Long productId;
    private Long orderId;
    private Integer rating;
    private String title;
    private String body;
    private List<String> imagesToDelete;
    private List<String> videosToDelete;

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

    public List<String> getImagesToDelete() {
        return this.imagesToDelete;
    }

    public List<String> getVideosToDelete() {
        return this.videosToDelete;
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

    public void setImagesToDelete(List<String> imagesToDelete) {
        this.imagesToDelete = imagesToDelete;
    }

    public void setVideosToDelete(List<String> videosToDelete) {
        this.videosToDelete = videosToDelete;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ReviewRequestDTO)) {
            return false;
        }
        ReviewRequestDTO other = (ReviewRequestDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$userId = this.getUserId();
        Long other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !(this$userId).equals(other$userId)) {
            return false;
        }
        Long this$productId = this.getProductId();
        Long other$productId = other.getProductId();
        if (this$productId == null ? other$productId != null : !(this$productId).equals(other$productId)) {
            return false;
        }
        Long this$orderId = this.getOrderId();
        Long other$orderId = other.getOrderId();
        if (this$orderId == null ? other$orderId != null : !(this$orderId).equals(other$orderId)) {
            return false;
        }
        Integer this$rating = this.getRating();
        Integer other$rating = other.getRating();
        if (this$rating == null ? other$rating != null : !(this$rating).equals(other$rating)) {
            return false;
        }
        String this$title = this.getTitle();
        String other$title = other.getTitle();
        if (this$title == null ? other$title != null : !this$title.equals(other$title)) {
            return false;
        }
        String this$body = this.getBody();
        String other$body = other.getBody();
        if (this$body == null ? other$body != null : !this$body.equals(other$body)) {
            return false;
        }
        List this$imagesToDelete = this.getImagesToDelete();
        List other$imagesToDelete = other.getImagesToDelete();
        if (this$imagesToDelete == null ? other$imagesToDelete != null : !(this$imagesToDelete).equals(other$imagesToDelete)) {
            return false;
        }
        List this$videosToDelete = this.getVideosToDelete();
        List other$videosToDelete = other.getVideosToDelete();
        return !(this$videosToDelete == null ? other$videosToDelete != null : !(this$videosToDelete).equals(other$videosToDelete));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ReviewRequestDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $userId = this.getUserId();
        result = result * 59 + ($userId == null ? 43 : ($userId).hashCode());
        Long $productId = this.getProductId();
        result = result * 59 + ($productId == null ? 43 : ($productId).hashCode());
        Long $orderId = this.getOrderId();
        result = result * 59 + ($orderId == null ? 43 : ($orderId).hashCode());
        Integer $rating = this.getRating();
        result = result * 59 + ($rating == null ? 43 : ($rating).hashCode());
        String $title = this.getTitle();
        result = result * 59 + ($title == null ? 43 : $title.hashCode());
        String $body = this.getBody();
        result = result * 59 + ($body == null ? 43 : $body.hashCode());
        List $imagesToDelete = this.getImagesToDelete();
        result = result * 59 + ($imagesToDelete == null ? 43 : ($imagesToDelete).hashCode());
        List $videosToDelete = this.getVideosToDelete();
        result = result * 59 + ($videosToDelete == null ? 43 : ($videosToDelete).hashCode());
        return result;
    }

    public String toString() {
        return "ReviewRequestDTO(userId=" + this.getUserId() + ", productId=" + this.getProductId() + ", orderId=" + this.getOrderId() + ", rating=" + this.getRating() + ", title=" + this.getTitle() + ", body=" + this.getBody() + ", imagesToDelete=" + String.valueOf(this.getImagesToDelete()) + ", videosToDelete=" + String.valueOf(this.getVideosToDelete()) + ")";
    }
}

