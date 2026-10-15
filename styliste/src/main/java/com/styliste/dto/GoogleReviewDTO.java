package com.styliste.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleReviewDTO {
    private String reviewId;
    private String authorName;
    private String authorPhotoUrl;
    private Integer rating;
    private String text;
    private String date;
    private Long timestamp;
    private String reviewUrl;
}
