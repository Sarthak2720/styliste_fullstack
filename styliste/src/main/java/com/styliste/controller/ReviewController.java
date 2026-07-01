/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.ReviewController
 *  com.styliste.dto.ReviewRequestDTO
 *  com.styliste.dto.ReviewResponseDTO
 *  com.styliste.entity.User
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.ReviewService
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.PageRequest
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.domain.Sort
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.security.core.Authentication
 *  org.springframework.web.bind.annotation.DeleteMapping
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.PutMapping
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RequestPart
 *  org.springframework.web.bind.annotation.RestController
 *  org.springframework.web.multipart.MultipartFile
 */
package com.styliste.controller;

import com.styliste.dto.ReviewRequestDTO;
import com.styliste.dto.ReviewResponseDTO;
import com.styliste.entity.User;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.UserRepository;
import com.styliste.service.ReviewService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value={"/api/reviews"})
public class ReviewController {
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping(consumes={"multipart/form-data"})
    @PreAuthorize(value="hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponseDTO> addReview(@RequestPart(value="review") ReviewRequestDTO reviewDTO, @RequestPart(value="images", required=false) List<MultipartFile> images, @RequestPart(value="videos", required=false) List<MultipartFile> videos, Authentication authentication) {
        reviewDTO.setUserId(this.extractUserIdFromAuth(authentication));
        return ResponseEntity.ok(this.reviewService.createReview(reviewDTO, images, videos));
    }

    @PutMapping(value={"/{reviewId}"}, consumes={"multipart/form-data"})
    @PreAuthorize(value="hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponseDTO> updateReview(@PathVariable Long reviewId, @RequestPart(value="review") ReviewRequestDTO reviewDTO, @RequestPart(value="images", required=false) List<MultipartFile> images, @RequestPart(value="videos", required=false) List<MultipartFile> videos, Authentication authentication) {
        reviewDTO.setUserId(this.extractUserIdFromAuth(authentication));
        return ResponseEntity.ok(this.reviewService.updateReview(reviewId, reviewDTO, images, videos));
    }

    @GetMapping(value={"/product/{productId}"})
    public ResponseEntity<Page<ReviewResponseDTO>> getReviews(@PathVariable Long productId, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        PageRequest pageRequest = PageRequest.of((int)page, (int)size, (Sort)Sort.by((String[])new String[]{"createdAt"}).descending());
        return ResponseEntity.ok(this.reviewService.getProductReviews(productId, (Pageable)pageRequest));
    }

    @DeleteMapping(value={"/{reviewId}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        this.reviewService.softDeleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    private Long extractUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        User user = (User)this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}

