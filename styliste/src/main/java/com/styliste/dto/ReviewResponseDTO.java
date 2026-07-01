/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ReviewResponseDTO
 *  com.styliste.dto.ReviewResponseDTO$ReviewResponseDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.ReviewResponseDTO;
import java.time.LocalDateTime;
import java.util.List;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class ReviewResponseDTO {
    private Long id;
    private String title;
    private String body;
    private Long userId;
    private Long productId;
    private Long orderId;
    private Integer rating;
    private String username;
    private LocalDateTime createdAt;
    private List<String> imageUrls;
    private List<String> videoUrls;

    ReviewResponseDTO(Long id, String title, String body, Long userId, Long productId, Long orderId, Integer rating, String username, LocalDateTime createdAt, List<String> imageUrls, List<String> videoUrls) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.userId = userId;
        this.productId = productId;
        this.orderId = orderId;
        this.rating = rating;
        this.username = username;
        this.createdAt = createdAt;
        this.imageUrls = imageUrls;
        this.videoUrls = videoUrls;
    }

    

    public Long getId() {
        return this.id;
    }

    public String getTitle() {
        return this.title;
    }

    public String getBody() {
        return this.body;
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

    public String getUsername() {
        return this.username;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public List<String> getImageUrls() {
        return this.imageUrls;
    }

    public List<String> getVideoUrls() {
        return this.videoUrls;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setBody(String body) {
        this.body = body;
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

    public void setUsername(String username) {
        this.username = username;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public void setVideoUrls(List<String> videoUrls) {
        this.videoUrls = videoUrls;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ReviewResponseDTO)) {
            return false;
        }
        ReviewResponseDTO other = (ReviewResponseDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
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
        String this$username = this.getUsername();
        String other$username = other.getUsername();
        if (this$username == null ? other$username != null : !this$username.equals(other$username)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt)) {
            return false;
        }
        List this$imageUrls = this.getImageUrls();
        List other$imageUrls = other.getImageUrls();
        if (this$imageUrls == null ? other$imageUrls != null : !(this$imageUrls).equals(other$imageUrls)) {
            return false;
        }
        List this$videoUrls = this.getVideoUrls();
        List other$videoUrls = other.getVideoUrls();
        return !(this$videoUrls == null ? other$videoUrls != null : !(this$videoUrls).equals(other$videoUrls));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ReviewResponseDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
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
        String $username = this.getUsername();
        result = result * 59 + ($username == null ? 43 : $username.hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        List $imageUrls = this.getImageUrls();
        result = result * 59 + ($imageUrls == null ? 43 : ($imageUrls).hashCode());
        List $videoUrls = this.getVideoUrls();
        result = result * 59 + ($videoUrls == null ? 43 : ($videoUrls).hashCode());
        return result;
    }

    public String toString() {
        return "ReviewResponseDTO(id=" + this.getId() + ", title=" + this.getTitle() + ", body=" + this.getBody() + ", userId=" + this.getUserId() + ", productId=" + this.getProductId() + ", orderId=" + this.getOrderId() + ", rating=" + this.getRating() + ", username=" + this.getUsername() + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", imageUrls=" + String.valueOf(this.getImageUrls()) + ", videoUrls=" + String.valueOf(this.getVideoUrls()) + ")";
    }
}

