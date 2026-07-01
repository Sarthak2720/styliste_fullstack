/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ReturnCreateRequest
 *  org.springframework.web.multipart.MultipartFile
 */
package com.styliste.dto;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public class ReturnCreateRequest {
    private Long orderItemId;
    private String reason;
    private Integer quantity;
    private List<MultipartFile> proofImages;

    public Long getOrderItemId() {
        return this.orderItemId;
    }

    public String getReason() {
        return this.reason;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public List<MultipartFile> getProofImages() {
        return this.proofImages;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setProofImages(List<MultipartFile> proofImages) {
        this.proofImages = proofImages;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ReturnCreateRequest)) {
            return false;
        }
        ReturnCreateRequest other = (ReturnCreateRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$orderItemId = this.getOrderItemId();
        Long other$orderItemId = other.getOrderItemId();
        if (this$orderItemId == null ? other$orderItemId != null : !(this$orderItemId).equals(other$orderItemId)) {
            return false;
        }
        Integer this$quantity = this.getQuantity();
        Integer other$quantity = other.getQuantity();
        if (this$quantity == null ? other$quantity != null : !(this$quantity).equals(other$quantity)) {
            return false;
        }
        String this$reason = this.getReason();
        String other$reason = other.getReason();
        if (this$reason == null ? other$reason != null : !this$reason.equals(other$reason)) {
            return false;
        }
        List this$proofImages = this.getProofImages();
        List other$proofImages = other.getProofImages();
        return !(this$proofImages == null ? other$proofImages != null : !(this$proofImages).equals(other$proofImages));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ReturnCreateRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $orderItemId = this.getOrderItemId();
        result = result * 59 + ($orderItemId == null ? 43 : ($orderItemId).hashCode());
        Integer $quantity = this.getQuantity();
        result = result * 59 + ($quantity == null ? 43 : ($quantity).hashCode());
        String $reason = this.getReason();
        result = result * 59 + ($reason == null ? 43 : $reason.hashCode());
        List $proofImages = this.getProofImages();
        result = result * 59 + ($proofImages == null ? 43 : ($proofImages).hashCode());
        return result;
    }

    public String toString() {
        return "ReturnCreateRequest(orderItemId=" + this.getOrderItemId() + ", reason=" + this.getReason() + ", quantity=" + this.getQuantity() + ", proofImages=" + String.valueOf(this.getProofImages()) + ")";
    }
}

