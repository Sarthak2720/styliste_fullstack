/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.OrderStatisticsDTO
 *  com.styliste.dto.OrderStatisticsDTO$OrderStatisticsDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.OrderStatisticsDTO;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class OrderStatisticsDTO {
    private Long totalOrders;
    private Long pendingOrders;
    private Long processingOrders;
    private Long shippedOrders;
    private Long outForDeliveryOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private Long returnedOrders;

    

    public Long getTotalOrders() {
        return this.totalOrders;
    }

    public Long getPendingOrders() {
        return this.pendingOrders;
    }

    public Long getProcessingOrders() {
        return this.processingOrders;
    }

    public Long getShippedOrders() {
        return this.shippedOrders;
    }

    public Long getOutForDeliveryOrders() {
        return this.outForDeliveryOrders;
    }

    public Long getDeliveredOrders() {
        return this.deliveredOrders;
    }

    public Long getCancelledOrders() {
        return this.cancelledOrders;
    }

    public Long getReturnedOrders() {
        return this.returnedOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public void setProcessingOrders(Long processingOrders) {
        this.processingOrders = processingOrders;
    }

    public void setShippedOrders(Long shippedOrders) {
        this.shippedOrders = shippedOrders;
    }

    public void setOutForDeliveryOrders(Long outForDeliveryOrders) {
        this.outForDeliveryOrders = outForDeliveryOrders;
    }

    public void setDeliveredOrders(Long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public void setCancelledOrders(Long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public void setReturnedOrders(Long returnedOrders) {
        this.returnedOrders = returnedOrders;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof OrderStatisticsDTO)) {
            return false;
        }
        OrderStatisticsDTO other = (OrderStatisticsDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$totalOrders = this.getTotalOrders();
        Long other$totalOrders = other.getTotalOrders();
        if (this$totalOrders == null ? other$totalOrders != null : !(this$totalOrders).equals(other$totalOrders)) {
            return false;
        }
        Long this$pendingOrders = this.getPendingOrders();
        Long other$pendingOrders = other.getPendingOrders();
        if (this$pendingOrders == null ? other$pendingOrders != null : !(this$pendingOrders).equals(other$pendingOrders)) {
            return false;
        }
        Long this$processingOrders = this.getProcessingOrders();
        Long other$processingOrders = other.getProcessingOrders();
        if (this$processingOrders == null ? other$processingOrders != null : !(this$processingOrders).equals(other$processingOrders)) {
            return false;
        }
        Long this$shippedOrders = this.getShippedOrders();
        Long other$shippedOrders = other.getShippedOrders();
        if (this$shippedOrders == null ? other$shippedOrders != null : !(this$shippedOrders).equals(other$shippedOrders)) {
            return false;
        }
        Long this$outForDeliveryOrders = this.getOutForDeliveryOrders();
        Long other$outForDeliveryOrders = other.getOutForDeliveryOrders();
        if (this$outForDeliveryOrders == null ? other$outForDeliveryOrders != null : !(this$outForDeliveryOrders).equals(other$outForDeliveryOrders)) {
            return false;
        }
        Long this$deliveredOrders = this.getDeliveredOrders();
        Long other$deliveredOrders = other.getDeliveredOrders();
        if (this$deliveredOrders == null ? other$deliveredOrders != null : !(this$deliveredOrders).equals(other$deliveredOrders)) {
            return false;
        }
        Long this$cancelledOrders = this.getCancelledOrders();
        Long other$cancelledOrders = other.getCancelledOrders();
        if (this$cancelledOrders == null ? other$cancelledOrders != null : !(this$cancelledOrders).equals(other$cancelledOrders)) {
            return false;
        }
        Long this$returnedOrders = this.getReturnedOrders();
        Long other$returnedOrders = other.getReturnedOrders();
        return !(this$returnedOrders == null ? other$returnedOrders != null : !(this$returnedOrders).equals(other$returnedOrders));
    }

    protected boolean canEqual(Object other) {
        return other instanceof OrderStatisticsDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $totalOrders = this.getTotalOrders();
        result = result * 59 + ($totalOrders == null ? 43 : ($totalOrders).hashCode());
        Long $pendingOrders = this.getPendingOrders();
        result = result * 59 + ($pendingOrders == null ? 43 : ($pendingOrders).hashCode());
        Long $processingOrders = this.getProcessingOrders();
        result = result * 59 + ($processingOrders == null ? 43 : ($processingOrders).hashCode());
        Long $shippedOrders = this.getShippedOrders();
        result = result * 59 + ($shippedOrders == null ? 43 : ($shippedOrders).hashCode());
        Long $outForDeliveryOrders = this.getOutForDeliveryOrders();
        result = result * 59 + ($outForDeliveryOrders == null ? 43 : ($outForDeliveryOrders).hashCode());
        Long $deliveredOrders = this.getDeliveredOrders();
        result = result * 59 + ($deliveredOrders == null ? 43 : ($deliveredOrders).hashCode());
        Long $cancelledOrders = this.getCancelledOrders();
        result = result * 59 + ($cancelledOrders == null ? 43 : ($cancelledOrders).hashCode());
        Long $returnedOrders = this.getReturnedOrders();
        result = result * 59 + ($returnedOrders == null ? 43 : ($returnedOrders).hashCode());
        return result;
    }

    public String toString() {
        return "OrderStatisticsDTO(totalOrders=" + this.getTotalOrders() + ", pendingOrders=" + this.getPendingOrders() + ", processingOrders=" + this.getProcessingOrders() + ", shippedOrders=" + this.getShippedOrders() + ", outForDeliveryOrders=" + this.getOutForDeliveryOrders() + ", deliveredOrders=" + this.getDeliveredOrders() + ", cancelledOrders=" + this.getCancelledOrders() + ", returnedOrders=" + this.getReturnedOrders() + ")";
    }

    public OrderStatisticsDTO() {
    }

    public OrderStatisticsDTO(Long totalOrders, Long pendingOrders, Long processingOrders, Long shippedOrders, Long outForDeliveryOrders, Long deliveredOrders, Long cancelledOrders, Long returnedOrders) {
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.processingOrders = processingOrders;
        this.shippedOrders = shippedOrders;
        this.outForDeliveryOrders = outForDeliveryOrders;
        this.deliveredOrders = deliveredOrders;
        this.cancelledOrders = cancelledOrders;
        this.returnedOrders = returnedOrders;
    }
}

