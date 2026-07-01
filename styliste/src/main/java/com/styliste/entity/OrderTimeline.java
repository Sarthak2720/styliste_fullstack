/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Order
 *  com.styliste.entity.OrderStatus
 *  com.styliste.entity.OrderTimeline
 *  com.styliste.entity.OrderTimeline$OrderTimelineBuilder
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
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Order;
import com.styliste.entity.OrderStatus;
import com.styliste.entity.OrderTimeline;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name="order_timeline")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class OrderTimeline {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="order_id", nullable=false)
    private Order order;
    @Enumerated(value=EnumType.STRING)
    @Column(length=30)
    private OrderStatus status;
    private String message;
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
    }

    

    public Long getId() {
        return this.id;
    }

    public Order getOrder() {
        return this.order;
    }

    public OrderStatus getStatus() {
        return this.status;
    }

    public String getMessage() {
        return this.message;
    }

    public LocalDateTime getTimestamp() {
        return this.timestamp;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof OrderTimeline)) {
            return false;
        }
        OrderTimeline other = (OrderTimeline)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        Order this$order = this.getOrder();
        Order other$order = other.getOrder();
        if (this$order == null ? other$order != null : !this$order.equals(other$order)) {
            return false;
        }
        OrderStatus this$status = this.getStatus();
        OrderStatus other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        String this$message = this.getMessage();
        String other$message = other.getMessage();
        if (this$message == null ? other$message != null : !this$message.equals(other$message)) {
            return false;
        }
        LocalDateTime this$timestamp = this.getTimestamp();
        LocalDateTime other$timestamp = other.getTimestamp();
        return !(this$timestamp == null ? other$timestamp != null : !(this$timestamp).equals(other$timestamp));
    }

    protected boolean canEqual(Object other) {
        return other instanceof OrderTimeline;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Order $order = this.getOrder();
        result = result * 59 + ($order == null ? 43 : $order.hashCode());
        OrderStatus $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        String $message = this.getMessage();
        result = result * 59 + ($message == null ? 43 : $message.hashCode());
        LocalDateTime $timestamp = this.getTimestamp();
        result = result * 59 + ($timestamp == null ? 43 : ($timestamp).hashCode());
        return result;
    }

    public String toString() {
        return "OrderTimeline(id=" + this.getId() + ", order=" + String.valueOf(this.getOrder()) + ", status=" + String.valueOf(this.getStatus()) + ", message=" + this.getMessage() + ", timestamp=" + String.valueOf(this.getTimestamp()) + ")";
    }

    public OrderTimeline() {
    }

    public OrderTimeline(Long id, Order order, OrderStatus status, String message, LocalDateTime timestamp) {
        this.id = id;
        this.order = order;
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }
}

