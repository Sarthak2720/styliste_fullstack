package com.styliste.dto.shiprocket;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ShiprocketAwbResponse {

    @JsonProperty("awb_assign_status")
    private Integer awbAssignStatus;

    @JsonProperty("response")
    private AwbData response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AwbData {
        @JsonProperty("data")
        private AwbDetails data;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AwbDetails {
        @JsonProperty("awb_code")
        private String awbCode;

        @JsonProperty("courier_name")
        private String courierName;

        @JsonProperty("courier_company_id")
        private Integer courierCompanyId;
    }
}
