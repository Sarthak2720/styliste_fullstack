/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.CartController
 *  com.styliste.dto.CartDTO
 *  com.styliste.dto.CartItemDTO
 *  com.styliste.entity.User
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.CartService
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.security.core.Authentication
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.DeleteMapping
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PatchMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.styliste.dto.CartDTO;
import com.styliste.dto.CartItemDTO;
import com.styliste.entity.User;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.UserRepository;
import com.styliste.service.CartService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/cart"})
@CrossOrigin(origins={"*"})
@PreAuthorize(value="hasRole('CUSTOMER')")
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping(value={"/merge"})
    public ResponseEntity<CartDTO> mergeCart(@RequestBody List<CartItemDTO> guestItems, Authentication auth) {
        Long userId = this.extractUserId(auth);
        return ResponseEntity.ok(this.cartService.mergeCart(userId, guestItems));
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication auth) {
        return ResponseEntity.ok(this.cartService.getCartByUserId(this.extractUserId(auth)));
    }

    @PostMapping(value={"/item"})
    public ResponseEntity<CartDTO> addItem(@RequestBody CartItemDTO itemDto, Authentication auth) {
        return ResponseEntity.ok(this.cartService.addItemToCart(this.extractUserId(auth), itemDto));
    }

    @DeleteMapping(value={"/item/{itemId}"})
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId, Authentication auth) {
        this.cartService.removeItem(this.extractUserId(auth), itemId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(value={"/item/{itemId}"})
    public ResponseEntity<CartDTO> updateQuantity(@PathVariable Long itemId, @RequestParam Integer quantity, Authentication auth) {
        return ResponseEntity.ok(this.cartService.updateItemQuantity(this.extractUserId(auth), itemId, quantity));
    }

    private Long extractUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = (User)this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        return user.getId();
    }
}

