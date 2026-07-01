/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AddressDTO
 *  com.styliste.dto.CartItemDTO
 *  com.styliste.dto.CreateOrderRequest
 *  com.styliste.dto.CreateOrderRequest$CreateOrderRequestBuilder
 *  com.styliste.entity.PaymentMethod
 *  jakarta.validation.constraints.NotEmpty
 *  jakarta.validation.constraints.NotNull
 */
package com.styliste.dto;

import com.styliste.dto.AddressDTO;
import com.styliste.dto.CartItemDTO;
import com.styliste.dto.CreateOrderRequest;
import com.styliste.entity.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class CreateOrderRequest {
    @NotEmpty(message="Order items cannot be empty")
    private @NotEmpty(message="Order items cannot be empty") List<CartItemDTO> items;
    @NotNull(message="Shipping details are required")
    private @NotNull(message="Shipping details are required") AddressDTO shippingAddress;
    private PaymentMethod paymentMethod;
    private BigDecimal shippingCharges;

    

    public List<CartItemDTO> getItems() {
        return this.items;
    }

    public AddressDTO getShippingAddress() {
        return this.shippingAddress;
    }

    public PaymentMethod getPaymentMethod() {
        return this.paymentMethod;
    }

    public BigDecimal getShippingCharges() {
        return this.shippingCharges;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }

    public void setShippingAddress(AddressDTO shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setShippingCharges(BigDecimal shippingCharges) {
        this.shippingCharges = shippingCharges;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof CreateOrderRequest)) {
            return false;
        }
        CreateOrderRequest other = (CreateOrderRequest)o;
        if (!other.canEqual(this)) {
            return false;
        }
        List this$items = this.getItems();
        List other$items = other.getItems();
        if (this$items == null ? other$items != null : !(this$items).equals(other$items)) {
            return false;
        }
        AddressDTO this$shippingAddress = this.getShippingAddress();
        AddressDTO other$shippingAddress = other.getShippingAddress();
        if (this$shippingAddress == null ? other$shippingAddress != null : !this$shippingAddress.equals(other$shippingAddress)) {
            return false;
        }
        PaymentMethod this$paymentMethod = this.getPaymentMethod();
        PaymentMethod other$paymentMethod = other.getPaymentMethod();
        if (this$paymentMethod == null ? other$paymentMethod != null : !this$paymentMethod.equals(other$paymentMethod)) {
            return false;
        }
        BigDecimal this$shippingCharges = this.getShippingCharges();
        BigDecimal other$shippingCharges = other.getShippingCharges();
        return !(this$shippingCharges == null ? other$shippingCharges != null : !(this$shippingCharges).equals(other$shippingCharges));
    }

    protected boolean canEqual(Object other) {
        return other instanceof CreateOrderRequest;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        List $items = this.getItems();
        result = result * 59 + ($items == null ? 43 : ($items).hashCode());
        AddressDTO $shippingAddress = this.getShippingAddress();
        result = result * 59 + ($shippingAddress == null ? 43 : $shippingAddress.hashCode());
        PaymentMethod $paymentMethod = this.getPaymentMethod();
        result = result * 59 + ($paymentMethod == null ? 43 : $paymentMethod.hashCode());
        BigDecimal $shippingCharges = this.getShippingCharges();
        result = result * 59 + ($shippingCharges == null ? 43 : ($shippingCharges).hashCode());
        return result;
    }

    public String toString() {
        return "CreateOrderRequest(items=" + String.valueOf(this.getItems()) + ", shippingAddress=" + String.valueOf(this.getShippingAddress()) + ", paymentMethod=" + String.valueOf(this.getPaymentMethod()) + ", shippingCharges=" + String.valueOf(this.getShippingCharges()) + ")";
    }

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(List<CartItemDTO> items, AddressDTO shippingAddress, PaymentMethod paymentMethod, BigDecimal shippingCharges) {
        this.items = items;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
        this.shippingCharges = shippingCharges;
    }
}

