/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ReviewRequestDTO
 *  com.styliste.dto.ReviewResponseDTO
 *  com.styliste.entity.Review
 *  com.styliste.entity.ReviewMedia
 *  com.styliste.entity.ReviewMedia$MediaType
 *  com.styliste.entity.User
 *  com.styliste.repository.ReviewRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.FileStorageService
 *  com.styliste.service.ReviewService
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 *  org.springframework.web.multipart.MultipartFile
 */
package com.styliste.service;

import com.styliste.dto.ReviewRequestDTO;
import com.styliste.dto.ReviewResponseDTO;
import com.styliste.entity.Review;
import com.styliste.entity.ReviewMedia;
import com.styliste.entity.User;
import com.styliste.repository.ReviewRepository;
import com.styliste.repository.UserRepository;
import com.styliste.service.FileStorageService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileStorageService fileStorageService;

    @Transactional
    public ReviewResponseDTO createReview(ReviewRequestDTO request, List<MultipartFile> images, List<MultipartFile> videos) {
        String path;
        if (this.reviewRepository.existsByUserIdAndProductIdAndIsDeletedFalse(request.getUserId(), request.getProductId())) {
            throw new RuntimeException("You have already reviewed this product.");
        }
        Review review = Review.builder().userId(request.getUserId()).productId(request.getProductId()).orderId(request.getOrderId()).rating(request.getRating()).title(request.getTitle()).body(request.getBody()).isDeleted(false).build();
        ArrayList<ReviewMedia> mediaList = new ArrayList<ReviewMedia>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file.isEmpty()) continue;
                path = this.fileStorageService.saveFile(file, "image");
                mediaList.add(ReviewMedia.builder().review(review).mediaType(ReviewMedia.MediaType.IMAGE).url(path).build());
            }
        }
        if (videos != null && !videos.isEmpty()) {
            for (MultipartFile file : videos) {
                if (file.isEmpty()) continue;
                path = this.fileStorageService.saveFile(file, "video");
                mediaList.add(ReviewMedia.builder().review(review).mediaType(ReviewMedia.MediaType.VIDEO).url(path).build());
            }
        }
        review.setMedia(mediaList);
        Review savedReview = (Review)this.reviewRepository.save(review);
        String reviewerName = this.userRepository.findById(request.getUserId()).map(User::getName).orElse("Anonymous");
        return this.mapToResponse(savedReview, reviewerName);
    }

    @Transactional
    public ReviewResponseDTO updateReview(Long reviewId, ReviewRequestDTO request, List<MultipartFile> newImages, List<MultipartFile> newVideos) {
        String path;
        Review review = (Review)this.reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));
        if (!review.getUserId().equals(request.getUserId())) {
            throw new RuntimeException("You are not authorized to edit this review");
        }
        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }
        if (request.getTitle() != null) {
            review.setTitle(request.getTitle());
        }
        if (request.getBody() != null) {
            review.setBody(request.getBody());
        }
        review.setUpdatedAt(LocalDateTime.now());
        HashSet urlsToDelete = new HashSet();
        if (request.getImagesToDelete() != null) {
            urlsToDelete.addAll(request.getImagesToDelete());
        }
        if (request.getVideosToDelete() != null) {
            urlsToDelete.addAll(request.getVideosToDelete());
        }
        System.out.println("URLs requested for deletion: " + String.valueOf(urlsToDelete));
        if (!urlsToDelete.isEmpty()) {
            boolean removed = review.getMedia().removeIf(media -> {
                boolean match = urlsToDelete.contains(media.getUrl());
                if (match) {
                    media.setReview(null);
                }
                return match;
            });
            System.out.println("Were items removed? " + removed);
            this.reviewRepository.saveAndFlush(review);
        }
        List currentMedia = review.getMedia();
        if (newImages != null) {
            for (MultipartFile file : newImages) {
                if (file.isEmpty()) continue;
                path = this.fileStorageService.saveFile(file, "image");
                ReviewMedia image = ReviewMedia.builder().review(review).mediaType(ReviewMedia.MediaType.IMAGE).url(path).build();
                currentMedia.add(image);
            }
        }
        if (newVideos != null) {
            for (MultipartFile file : newVideos) {
                if (file.isEmpty()) continue;
                path = this.fileStorageService.saveFile(file, "video");
                ReviewMedia video = ReviewMedia.builder().review(review).mediaType(ReviewMedia.MediaType.VIDEO).url(path).build();
                currentMedia.add(video);
            }
        }
        Review updatedReview = (Review)this.reviewRepository.save(review);
        String reviewerName = this.userRepository.findById(updatedReview.getUserId()).map(User::getName).orElse("Anonymous");
        return this.mapToResponse(updatedReview, reviewerName);
    }

    @Transactional(readOnly=true)
    public Page<ReviewResponseDTO> getProductReviews(Long productId, Pageable pageable) {
        Page<com.styliste.entity.Review> reviewPage = this.reviewRepository.findByProductIdAndIsDeletedFalse(productId, pageable);
        Set<Long> userIds = reviewPage.getContent().stream().map(Review::getUserId).collect(Collectors.toSet());
        Map<Long, String> userNames = this.userRepository.findAllById(userIds).stream().collect(Collectors.toMap(User::getId, User::getName));
        return reviewPage.map(review -> {
            String name = userNames.getOrDefault(review.getUserId(), "Anonymous User");
            return this.mapToResponse(review, name);
        });
    }

    @Transactional
    public void softDeleteReview(Long reviewId) {
        Review review = (Review)this.reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not found"));
        review.setDeleted(true);
        this.reviewRepository.save(review);
    }

    private ReviewResponseDTO mapToResponse(Review review, String reviewerName) {
        ArrayList<String> imgUrls = new ArrayList<String>();
        ArrayList<String> vidUrls = new ArrayList<String>();
        for (ReviewMedia m : review.getMedia()) {
            if (m.getMediaType() == ReviewMedia.MediaType.IMAGE) {
                imgUrls.add(m.getUrl());
                continue;
            }
            vidUrls.add(m.getUrl());
        }
        return ReviewResponseDTO.builder().id(review.getId()).title(review.getTitle()).body(review.getBody()).username(reviewerName).userId(review.getUserId()).orderId(review.getOrderId()).rating(review.getRating()).createdAt(review.getCreatedAt()).imageUrls(imgUrls).videoUrls(vidUrls).build();
    }
}

