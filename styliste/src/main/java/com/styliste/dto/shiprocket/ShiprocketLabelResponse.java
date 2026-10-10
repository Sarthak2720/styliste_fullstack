package com.styliste.dto.shiprocket;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ShiprocketLabelResponse {

    @JsonProperty("label_created")
    private Integer labelCreated;

    @JsonProperty("label_url")
    private String labelUrl;

    @JsonProperty("response")
    private String response;
}
