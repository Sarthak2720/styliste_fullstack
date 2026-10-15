package com.styliste.controller;

import com.styliste.service.GoogleReviewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/reviews")
public class AdminReviewsController {

    @Autowired
    private GoogleReviewsService googleReviewsService;

    /**
     * Admin on-demand trigger to refresh reviews from Outscraper with custom limit.
     * Example: POST /api/admin/reviews/refresh?limit=3
     */
    @PostMapping("/refresh")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> refreshGoogleReviews(
            @RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(googleReviewsService.manualRefresh(limit));
    }
}
