package com.styliste.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordTryOnRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "User image URL is required")
    private String userImageUrl;

    @NotBlank(message = "Result image URL is required")
    private String resultImageUrl;
}
