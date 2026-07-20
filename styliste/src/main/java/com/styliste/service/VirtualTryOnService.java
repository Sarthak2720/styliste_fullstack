package com.styliste.service;

import com.styliste.dto.RecordTryOnRequest;
import com.styliste.dto.TryOnResponseDTO;
import com.styliste.entity.Product;
import com.styliste.entity.User;
import com.styliste.entity.VirtualTryOn;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.ProductRepository;
import com.styliste.repository.UserRepository;
import com.styliste.repository.VirtualTryOnRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class VirtualTryOnService {

    @Autowired
    private VirtualTryOnRepository tryOnRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public TryOnResponseDTO recordTryOn(Long userId, RecordTryOnRequest request) {
        log.info("Recording virtual try-on for user {} and product {}", userId, request.getProductId());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        VirtualTryOn tryOn = VirtualTryOn.builder()
                .user(user)
                .product(product)
                .userImageUrl(request.getUserImageUrl())
                .resultImageUrl(request.getResultImageUrl())
                .build();

        tryOn = tryOnRepository.save(tryOn);
        return mapToDTO(tryOn);
    }

    @Transactional(readOnly = true)
    public List<TryOnResponseDTO> getUserTryOnHistory(Long userId) {
        log.info("Fetching try-on history for user {}", userId);
        return tryOnRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TryOnResponseDTO> getAllTryOnHistory() {
        log.info("Fetching all try-on history (admin)");
        return tryOnRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private TryOnResponseDTO mapToDTO(VirtualTryOn tryOn) {
        String productImage = null;
        if (tryOn.getProduct().getImages() != null && !tryOn.getProduct().getImages().isEmpty()) {
            productImage = tryOn.getProduct().getImages().get(0);
        }

        return TryOnResponseDTO.builder()
                .id(tryOn.getId())
                .userId(tryOn.getUser().getId())
                .userName(tryOn.getUser().getName())
                .userEmail(tryOn.getUser().getEmail())
                .userPhone(tryOn.getUser().getPhone())
                .productId(tryOn.getProduct().getId())
                .productName(tryOn.getProduct().getName())
                .productImage(productImage)
                .userImageUrl(tryOn.getUserImageUrl())
                .resultImageUrl(tryOn.getResultImageUrl())
                .createdAt(tryOn.getCreatedAt())
                .build();
    }
}
