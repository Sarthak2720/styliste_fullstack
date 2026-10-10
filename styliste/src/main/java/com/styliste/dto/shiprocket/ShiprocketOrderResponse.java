package com.styliste.dto.shiprocket;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ShiprocketOrderResponse {

    @JsonProperty("order_id")
    private Long orderId;

    @JsonProperty("shipment_id")
    private Long shipmentId;

    @JsonProperty("status")
    private String status;

    @JsonProperty("status_code")
    private Integer statusCode;

    @JsonProperty("awb_code")
    private String awbCode;

    @JsonProperty("courier_name")
    private String courierName;
}
