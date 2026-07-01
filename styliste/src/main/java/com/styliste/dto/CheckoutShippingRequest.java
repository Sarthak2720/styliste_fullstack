/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AddressDTO
 *  com.styliste.dto.CheckoutShippingRequest
 */
package com.styliste.dto;

import com.styliste.dto.AddressDTO;
import java.math.BigDecimal;

public class CheckoutShippingRequest {
    private AddressDTO address;
    private BigDecimal subtotal;

    public AddressDTO getAddress() {
        return this.address;
    }

    public BigDecimal getSubtotal() {
        return this.subtotal;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof CheckoutShippingRequest)) {
            return false;
        }
        CheckoutShippingRequest other = (CheckoutShippingRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        AddressDTO this$address = this.getAddress();
        AddressDTO other$address = other.getAddress();
        if (this$address == null ? other$address != null : !this$address.equals(other$address)) {
            return false;
        }
        BigDecimal this$subtotal = this.getSubtotal();
        BigDecimal other$subtotal = other.getSubtotal();
        return !(this$subtotal == null ? other$subtotal != null : !(this$subtotal).equals(other$subtotal));
    }

    protected boolean canEqual(Object other) {
        return other instanceof CheckoutShippingRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        AddressDTO $address = this.getAddress();
        result = result * 59 + ($address == null ? 43 : $address.hashCode());
        BigDecimal $subtotal = this.getSubtotal();
        result = result * 59 + ($subtotal == null ? 43 : ($subtotal).hashCode());
        return result;
    }

    public String toString() {
        return "CheckoutShippingRequest(address=" + String.valueOf(this.getAddress()) + ", subtotal=" + String.valueOf(this.getSubtotal()) + ")";
    }
}

