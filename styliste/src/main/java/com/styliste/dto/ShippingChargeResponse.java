/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ShippingChargeResponse
 */
package com.styliste.dto;

import java.math.BigDecimal;

public class ShippingChargeResponse {
    private BigDecimal shippingCharges;

    public BigDecimal getShippingCharges() {
        return this.shippingCharges;
    }

    public void setShippingCharges(BigDecimal shippingCharges) {
        this.shippingCharges = shippingCharges;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof ShippingChargeResponse)) {
            return false;
        }
        ShippingChargeResponse other = (ShippingChargeResponse)o;
        if (!other.canEqual(this)) {
            return false;
        }
        BigDecimal this$shippingCharges = this.getShippingCharges();
        BigDecimal other$shippingCharges = other.getShippingCharges();
        return !(this$shippingCharges == null ? other$shippingCharges != null : !(this$shippingCharges).equals(other$shippingCharges));
    }

    protected boolean canEqual(Object other) {
        return other instanceof ShippingChargeResponse;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        BigDecimal $shippingCharges = this.getShippingCharges();
        result = result * 59 + ($shippingCharges == null ? 43 : ($shippingCharges).hashCode());
        return result;
    }

    public String toString() {
        return "ShippingChargeResponse(shippingCharges=" + String.valueOf(this.getShippingCharges()) + ")";
    }

    public ShippingChargeResponse(BigDecimal shippingCharges) {
        this.shippingCharges = shippingCharges;
    }

    public ShippingChargeResponse() {
    }
}

