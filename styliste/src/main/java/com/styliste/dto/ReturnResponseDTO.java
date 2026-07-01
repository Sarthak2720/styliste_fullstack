/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ReturnResponseDTO
 *  com.styliste.dto.ReturnResponseDTO$ReturnResponseDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.ReturnResponseDTO;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class ReturnResponseDTO {
    private Long id;
    private Long orderId;
    private Long orderItemId;
    private String productName;
    private String productImage;
    private Integer requestedQuantity;
    private String status;
    private BigDecimal refundAmount;
    private String reason;
    private String adminComment;
    private List<String> proofImageUrls;
    private LocalDateTime createdAt;

    ReturnResponseDTO(Long id, Long orderId, Long orderItemId, String productName, String productImage, Integer requestedQuantity, String status, BigDecimal refundAmount, String reason, String adminComment, List<String> proofImageUrls, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.orderItemId = orderItemId;
        this.productName = productName;
        this.productImage = productImage;
        this.requestedQuantity = requestedQuantity;
        this.status = status;
        this.refundAmount = refundAmount;
        this.reason = reason;
        this.adminComment = adminComment;
        this.proofImageUrls = proofImageUrls;
        this.createdAt = createdAt;
    }

    

    public Long getId() {
        return this.id;
    }

    public Long getOrderId() {
        return this.orderId;
    }

    public Long getOrderItemId() {
        return this.orderItemId;
    }

    public String getProductName() {
        return this.productName;
    }

    public String getProductImage() {
        return this.productImage;
    }

    public Integer getRequestedQuantity() {
        return this.requestedQuantity;
    }

    public String getStatus() {
        return this.status;
    }

    public BigDecimal getRefundAmount() {
        return this.refundAmount;
    }

    public String getReason() {
        return this.reason;
    }

    public String getAdminComment() {
        return this.adminComment;
    }

    public List<String> getProofImageUrls() {
        return this.proofImageUrls;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public void setRequestedQuantity(Integer requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setAdminComment(String adminComment) {
        this.adminComment = adminComment;
    }

    public void setProofImageUrls(List<String> proofImageUrls) {
        this.proofImageUrls = proofImageUrls;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ReturnResponseDTO)) {
            return false;
        }
        ReturnResponseDTO other = (ReturnResponseDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        Long this$orderId = this.getOrderId();
        Long other$orderId = other.getOrderId();
        if (this$orderId == null ? other$orderId != null : !(this$orderId).equals(other$orderId)) {
            return false;
        }
        Long this$orderItemId = this.getOrderItemId();
        Long other$orderItemId = other.getOrderItemId();
        if (this$orderItemId == null ? other$orderItemId != null : !(this$orderItemId).equals(other$orderItemId)) {
            return false;
        }
        Integer this$requestedQuantity = this.getRequestedQuantity();
        Integer other$requestedQuantity = other.getRequestedQuantity();
        if (this$requestedQuantity == null ? other$requestedQuantity != null : !(this$requestedQuantity).equals(other$requestedQuantity)) {
            return false;
        }
        String this$productName = this.getProductName();
        String other$productName = other.getProductName();
        if (this$productName == null ? other$productName != null : !this$productName.equals(other$productName)) {
            return false;
        }
        String this$productImage = this.getProductImage();
        String other$productImage = other.getProductImage();
        if (this$productImage == null ? other$productImage != null : !this$productImage.equals(other$productImage)) {
            return false;
        }
        String this$status = this.getStatus();
        String other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        BigDecimal this$refundAmount = this.getRefundAmount();
        BigDecimal other$refundAmount = other.getRefundAmount();
        if (this$refundAmount == null ? other$refundAmount != null : !(this$refundAmount).equals(other$refundAmount)) {
            return false;
        }
        String this$reason = this.getReason();
        String other$reason = other.getReason();
        if (this$reason == null ? other$reason != null : !this$reason.equals(other$reason)) {
            return false;
        }
        String this$adminComment = this.getAdminComment();
        String other$adminComment = other.getAdminComment();
        if (this$adminComment == null ? other$adminComment != null : !this$adminComment.equals(other$adminComment)) {
            return false;
        }
        List this$proofImageUrls = this.getProofImageUrls();
        List other$proofImageUrls = other.getProofImageUrls();
        if (this$proofImageUrls == null ? other$proofImageUrls != null : !(this$proofImageUrls).equals(other$proofImageUrls)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        return !(this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ReturnResponseDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Long $orderId = this.getOrderId();
        result = result * 59 + ($orderId == null ? 43 : ($orderId).hashCode());
        Long $orderItemId = this.getOrderItemId();
        result = result * 59 + ($orderItemId == null ? 43 : ($orderItemId).hashCode());
        Integer $requestedQuantity = this.getRequestedQuantity();
        result = result * 59 + ($requestedQuantity == null ? 43 : ($requestedQuantity).hashCode());
        String $productName = this.getProductName();
        result = result * 59 + ($productName == null ? 43 : $productName.hashCode());
        String $productImage = this.getProductImage();
        result = result * 59 + ($productImage == null ? 43 : $productImage.hashCode());
        String $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        BigDecimal $refundAmount = this.getRefundAmount();
        result = result * 59 + ($refundAmount == null ? 43 : ($refundAmount).hashCode());
        String $reason = this.getReason();
        result = result * 59 + ($reason == null ? 43 : $reason.hashCode());
        String $adminComment = this.getAdminComment();
        result = result * 59 + ($adminComment == null ? 43 : $adminComment.hashCode());
        List $proofImageUrls = this.getProofImageUrls();
        result = result * 59 + ($proofImageUrls == null ? 43 : ($proofImageUrls).hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        return result;
    }

    public String toString() {
        return "ReturnResponseDTO(id=" + this.getId() + ", orderId=" + this.getOrderId() + ", orderItemId=" + this.getOrderItemId() + ", productName=" + this.getProductName() + ", productImage=" + this.getProductImage() + ", requestedQuantity=" + this.getRequestedQuantity() + ", status=" + this.getStatus() + ", refundAmount=" + String.valueOf(this.getRefundAmount()) + ", reason=" + this.getReason() + ", adminComment=" + this.getAdminComment() + ", proofImageUrls=" + String.valueOf(this.getProofImageUrls()) + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ")";
    }
}

