package com.styliste.dto.shiprocket;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiprocketOrderRequest {

    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("order_date")
    private String orderDate;

    @JsonProperty("pickup_location")
    private String pickupLocation;

    @JsonProperty("billing_customer_name")
    private String billingCustomerName;

    @JsonProperty("billing_last_name")
    private String billingLastName;

    @JsonProperty("billing_address")
    private String billingAddress;

    @JsonProperty("billing_city")
    private String billingCity;

    @JsonProperty("billing_pincode")
    private String billingPincode;

    @JsonProperty("billing_state")
    private String billingState;

    @JsonProperty("billing_country")
    private String billingCountry;

    @JsonProperty("billing_email")
    private String billingEmail;

    @JsonProperty("billing_phone")
    private String billingPhone;

    @JsonProperty("shipping_is_billing")
    private boolean shippingIsBilling;

    @JsonProperty("order_items")
    private List<ShiprocketOrderItem> orderItems;

    @JsonProperty("payment_method")
    private String paymentMethod; // Prepaid or COD

    @JsonProperty("sub_total")
    private BigDecimal subTotal;

    @JsonProperty("length")
    private double length;

    @JsonProperty("breadth")
    private double breadth;

    @JsonProperty("height")
    private double height;

    @JsonProperty("weight")
    private double weight; // In kg

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShiprocketOrderItem {
        @JsonProperty("name")
        private String name;

        @JsonProperty("sku")
        private String sku;

        @JsonProperty("units")
        private int units;

        @JsonProperty("selling_price")
        private BigDecimal sellingPrice;
    }
}
