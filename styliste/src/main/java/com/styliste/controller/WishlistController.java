/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.WishlistController
 *  com.styliste.dto.WishlistDTO
 *  com.styliste.entity.User
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.WishlistService
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.security.core.Authentication
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.styliste.dto.WishlistDTO;
import com.styliste.entity.User;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.UserRepository;
import com.styliste.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/wishlist"})
@CrossOrigin(origins={"*"})
@PreAuthorize(value="hasRole('CUSTOMER')")
public class WishlistController {
    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<WishlistDTO> getWishlist(Authentication auth) {
        return ResponseEntity.ok(this.wishlistService.getWishlist(this.extractUserId(auth)));
    }

    @PostMapping(value={"/toggle/{productId}"})
    public ResponseEntity<WishlistDTO> toggleItem(@PathVariable Long productId, Authentication auth) {
        return ResponseEntity.ok(this.wishlistService.toggleWishlist(this.extractUserId(auth), productId));
    }

    private Long extractUserId(Authentication auth) {
        return ((User)this.userRepository.findByEmail(auth.getName()).orElseThrow(() -> new ResourceNotFoundException("User not found"))).getId();
    }

    public WishlistController(WishlistService wishlistService, UserRepository userRepository) {
        this.wishlistService = wishlistService;
        this.userRepository = userRepository;
    }
}

