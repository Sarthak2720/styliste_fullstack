/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Refund
 *  com.styliste.entity.Refund$RefundBuilder
 *  jakarta.persistence.Entity
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Refund;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="refunds")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class Refund {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    private Long orderItemId;
    private BigDecimal amount;
    private String paymentProvider;
    private String providerRefundId;
    private String providerPaymentId;
    private LocalDateTime createdAt;

    

    public Long getId() {
        return this.id;
    }

    public Long getOrderId() {
        return this.orderId;
    }

    public Long getOrderItemId() {
        return this.orderItemId;
    }

    public BigDecimal getAmount() {
        return this.amount;
    }

    public String getPaymentProvider() {
        return this.paymentProvider;
    }

    public String getProviderRefundId() {
        return this.providerRefundId;
    }

    public String getProviderPaymentId() {
        return this.providerPaymentId;
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

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setPaymentProvider(String paymentProvider) {
        this.paymentProvider = paymentProvider;
    }

    public void setProviderRefundId(String providerRefundId) {
        this.providerRefundId = providerRefundId;
    }

    public void setProviderPaymentId(String providerPaymentId) {
        this.providerPaymentId = providerPaymentId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof Refund)) {
            return false;
        }
        Refund other = (Refund)o;
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
        BigDecimal this$amount = this.getAmount();
        BigDecimal other$amount = other.getAmount();
        if (this$amount == null ? other$amount != null : !(this$amount).equals(other$amount)) {
            return false;
        }
        String this$paymentProvider = this.getPaymentProvider();
        String other$paymentProvider = other.getPaymentProvider();
        if (this$paymentProvider == null ? other$paymentProvider != null : !this$paymentProvider.equals(other$paymentProvider)) {
            return false;
        }
        String this$providerRefundId = this.getProviderRefundId();
        String other$providerRefundId = other.getProviderRefundId();
        if (this$providerRefundId == null ? other$providerRefundId != null : !this$providerRefundId.equals(other$providerRefundId)) {
            return false;
        }
        String this$providerPaymentId = this.getProviderPaymentId();
        String other$providerPaymentId = other.getProviderPaymentId();
        if (this$providerPaymentId == null ? other$providerPaymentId != null : !this$providerPaymentId.equals(other$providerPaymentId)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        return !(this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt));
    }

    protected boolean canEqual(Object other) {
        return other instanceof Refund;
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
        BigDecimal $amount = this.getAmount();
        result = result * 59 + ($amount == null ? 43 : ($amount).hashCode());
        String $paymentProvider = this.getPaymentProvider();
        result = result * 59 + ($paymentProvider == null ? 43 : $paymentProvider.hashCode());
        String $providerRefundId = this.getProviderRefundId();
        result = result * 59 + ($providerRefundId == null ? 43 : $providerRefundId.hashCode());
        String $providerPaymentId = this.getProviderPaymentId();
        result = result * 59 + ($providerPaymentId == null ? 43 : $providerPaymentId.hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        return result;
    }

    public String toString() {
        return "Refund(id=" + this.getId() + ", orderId=" + this.getOrderId() + ", orderItemId=" + this.getOrderItemId() + ", amount=" + String.valueOf(this.getAmount()) + ", paymentProvider=" + this.getPaymentProvider() + ", providerRefundId=" + this.getProviderRefundId() + ", providerPaymentId=" + this.getProviderPaymentId() + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ")";
    }

    public Refund() {
    }

    public Refund(Long id, Long orderId, Long orderItemId, BigDecimal amount, String paymentProvider, String providerRefundId, String providerPaymentId, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.orderItemId = orderItemId;
        this.amount = amount;
        this.paymentProvider = paymentProvider;
        this.providerRefundId = providerRefundId;
        this.providerPaymentId = providerPaymentId;
        this.createdAt = createdAt;
    }
}

