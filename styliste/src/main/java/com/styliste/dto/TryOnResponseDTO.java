package com.styliste.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TryOnResponseDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private Long productId;
    private String productName;
    private String productImage;
    private String userImageUrl;
    private String resultImageUrl;
    private LocalDateTime createdAt;
}
