/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.OrderItem
 *  com.styliste.entity.ReturnRequest
 *  com.styliste.entity.ReturnRequest$ReturnRequestBuilder
 *  com.styliste.entity.ReturnStatus
 *  com.styliste.entity.User
 *  jakarta.persistence.CollectionTable
 *  jakarta.persistence.Column
 *  jakarta.persistence.ElementCollection
 *  jakarta.persistence.Entity
 *  jakarta.persistence.EnumType
 *  jakarta.persistence.Enumerated
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.ManyToOne
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.PreUpdate
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.OrderItem;
import com.styliste.entity.ReturnRequest;
import com.styliste.entity.ReturnStatus;
import com.styliste.entity.User;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="return_requests")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class ReturnRequest {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="order_item_id", nullable=false)
    private OrderItem orderItem;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;
    @Enumerated(value=EnumType.STRING)
    @Column(length=30)
    private ReturnStatus status;
    @Column(columnDefinition="TEXT")
    private String reason;
    @Column(columnDefinition="TEXT")
    private String adminComment;
    @Column(precision=10, scale=2)
    private BigDecimal refundAmount;
    private int requestedQuantity;
    @ElementCollection
    @CollectionTable(name="return_proof_images", joinColumns={@JoinColumn(name="return_request_id")})
    @Column(name="image_url", columnDefinition="TEXT")
    private List<String> proofImageUrls = new ArrayList();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime pickupScheduledAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime refundedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    

    public Long getId() {
        return this.id;
    }

    public OrderItem getOrderItem() {
        return this.orderItem;
    }

    public User getUser() {
        return this.user;
    }

    public ReturnStatus getStatus() {
        return this.status;
    }

    public String getReason() {
        return this.reason;
    }

    public String getAdminComment() {
        return this.adminComment;
    }

    public BigDecimal getRefundAmount() {
        return this.refundAmount;
    }

    public int getRequestedQuantity() {
        return this.requestedQuantity;
    }

    public List<String> getProofImageUrls() {
        return this.proofImageUrls;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public LocalDateTime getPickupScheduledAt() {
        return this.pickupScheduledAt;
    }

    public LocalDateTime getPickedUpAt() {
        return this.pickedUpAt;
    }

    public LocalDateTime getRefundedAt() {
        return this.refundedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setStatus(ReturnStatus status) {
        this.status = status;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setAdminComment(String adminComment) {
        this.adminComment = adminComment;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public void setRequestedQuantity(int requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public void setProofImageUrls(List<String> proofImageUrls) {
        this.proofImageUrls = proofImageUrls;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setPickupScheduledAt(LocalDateTime pickupScheduledAt) {
        this.pickupScheduledAt = pickupScheduledAt;
    }

    public void setPickedUpAt(LocalDateTime pickedUpAt) {
        this.pickedUpAt = pickedUpAt;
    }

    public void setRefundedAt(LocalDateTime refundedAt) {
        this.refundedAt = refundedAt;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ReturnRequest)) {
            return false;
        }
        ReturnRequest other = (ReturnRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        if (this.getRequestedQuantity() != other.getRequestedQuantity()) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        OrderItem this$orderItem = this.getOrderItem();
        OrderItem other$orderItem = other.getOrderItem();
        if (this$orderItem == null ? other$orderItem != null : !this$orderItem.equals(other$orderItem)) {
            return false;
        }
        User this$user = this.getUser();
        User other$user = other.getUser();
        if (this$user == null ? other$user != null : !this$user.equals(other$user)) {
            return false;
        }
        ReturnStatus this$status = this.getStatus();
        ReturnStatus other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
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
        BigDecimal this$refundAmount = this.getRefundAmount();
        BigDecimal other$refundAmount = other.getRefundAmount();
        if (this$refundAmount == null ? other$refundAmount != null : !(this$refundAmount).equals(other$refundAmount)) {
            return false;
        }
        List this$proofImageUrls = this.getProofImageUrls();
        List other$proofImageUrls = other.getProofImageUrls();
        if (this$proofImageUrls == null ? other$proofImageUrls != null : !(this$proofImageUrls).equals(other$proofImageUrls)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt)) {
            return false;
        }
        LocalDateTime this$updatedAt = this.getUpdatedAt();
        LocalDateTime other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !(this$updatedAt).equals(other$updatedAt)) {
            return false;
        }
        LocalDateTime this$pickupScheduledAt = this.getPickupScheduledAt();
        LocalDateTime other$pickupScheduledAt = other.getPickupScheduledAt();
        if (this$pickupScheduledAt == null ? other$pickupScheduledAt != null : !(this$pickupScheduledAt).equals(other$pickupScheduledAt)) {
            return false;
        }
        LocalDateTime this$pickedUpAt = this.getPickedUpAt();
        LocalDateTime other$pickedUpAt = other.getPickedUpAt();
        if (this$pickedUpAt == null ? other$pickedUpAt != null : !(this$pickedUpAt).equals(other$pickedUpAt)) {
            return false;
        }
        LocalDateTime this$refundedAt = this.getRefundedAt();
        LocalDateTime other$refundedAt = other.getRefundedAt();
        return !(this$refundedAt == null ? other$refundedAt != null : !(this$refundedAt).equals(other$refundedAt));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ReturnRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * 59 + this.getRequestedQuantity();
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        OrderItem $orderItem = this.getOrderItem();
        result = result * 59 + ($orderItem == null ? 43 : $orderItem.hashCode());
        User $user = this.getUser();
        result = result * 59 + ($user == null ? 43 : $user.hashCode());
        ReturnStatus $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        String $reason = this.getReason();
        result = result * 59 + ($reason == null ? 43 : $reason.hashCode());
        String $adminComment = this.getAdminComment();
        result = result * 59 + ($adminComment == null ? 43 : $adminComment.hashCode());
        BigDecimal $refundAmount = this.getRefundAmount();
        result = result * 59 + ($refundAmount == null ? 43 : ($refundAmount).hashCode());
        List $proofImageUrls = this.getProofImageUrls();
        result = result * 59 + ($proofImageUrls == null ? 43 : ($proofImageUrls).hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        LocalDateTime $updatedAt = this.getUpdatedAt();
        result = result * 59 + ($updatedAt == null ? 43 : ($updatedAt).hashCode());
        LocalDateTime $pickupScheduledAt = this.getPickupScheduledAt();
        result = result * 59 + ($pickupScheduledAt == null ? 43 : ($pickupScheduledAt).hashCode());
        LocalDateTime $pickedUpAt = this.getPickedUpAt();
        result = result * 59 + ($pickedUpAt == null ? 43 : ($pickedUpAt).hashCode());
        LocalDateTime $refundedAt = this.getRefundedAt();
        result = result * 59 + ($refundedAt == null ? 43 : ($refundedAt).hashCode());
        return result;
    }

    public String toString() {
        return "ReturnRequest(id=" + this.getId() + ", orderItem=" + String.valueOf(this.getOrderItem()) + ", user=" + String.valueOf(this.getUser()) + ", status=" + String.valueOf(this.getStatus()) + ", reason=" + this.getReason() + ", adminComment=" + this.getAdminComment() + ", refundAmount=" + String.valueOf(this.getRefundAmount()) + ", requestedQuantity=" + this.getRequestedQuantity() + ", proofImageUrls=" + String.valueOf(this.getProofImageUrls()) + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", updatedAt=" + String.valueOf(this.getUpdatedAt()) + ", pickupScheduledAt=" + String.valueOf(this.getPickupScheduledAt()) + ", pickedUpAt=" + String.valueOf(this.getPickedUpAt()) + ", refundedAt=" + String.valueOf(this.getRefundedAt()) + ")";
    }

    public ReturnRequest() {
    }

    public ReturnRequest(Long id, OrderItem orderItem, User user, ReturnStatus status, String reason, String adminComment, BigDecimal refundAmount, int requestedQuantity, List<String> proofImageUrls, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime pickupScheduledAt, LocalDateTime pickedUpAt, LocalDateTime refundedAt) {
        this.id = id;
        this.orderItem = orderItem;
        this.user = user;
        this.status = status;
        this.reason = reason;
        this.adminComment = adminComment;
        this.refundAmount = refundAmount;
        this.requestedQuantity = requestedQuantity;
        this.proofImageUrls = proofImageUrls;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.pickupScheduledAt = pickupScheduledAt;
        this.pickedUpAt = pickedUpAt;
        this.refundedAt = refundedAt;
    }
}

