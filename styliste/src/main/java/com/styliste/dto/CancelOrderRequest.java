/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.CancelOrderRequest
 */
package com.styliste.dto;

import java.util.List;

public class CancelOrderRequest {
    private List<Long> orderItemIds;
    private String reason;

    public List<Long> getOrderItemIds() {
        return this.orderItemIds;
    }

    public String getReason() {
        return this.reason;
    }

    public void setOrderItemIds(List<Long> orderItemIds) {
        this.orderItemIds = orderItemIds;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof CancelOrderRequest)) {
            return false;
        }
        CancelOrderRequest other = (CancelOrderRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        List this$orderItemIds = this.getOrderItemIds();
        List other$orderItemIds = other.getOrderItemIds();
        if (this$orderItemIds == null ? other$orderItemIds != null : !(this$orderItemIds).equals(other$orderItemIds)) {
            return false;
        }
        String this$reason = this.getReason();
        String other$reason = other.getReason();
        return !(this$reason == null ? other$reason != null : !this$reason.equals(other$reason));
    }

    protected boolean canEqual(Object other) {
        return other instanceof CancelOrderRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        List $orderItemIds = this.getOrderItemIds();
        result = result * 59 + ($orderItemIds == null ? 43 : ($orderItemIds).hashCode());
        String $reason = this.getReason();
        result = result * 59 + ($reason == null ? 43 : $reason.hashCode());
        return result;
    }

    public String toString() {
        return "CancelOrderRequest(orderItemIds=" + String.valueOf(this.getOrderItemIds()) + ", reason=" + this.getReason() + ")";
    }
}

