/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ProductDTO
 *  com.styliste.dto.WishlistDTO
 *  com.styliste.entity.Product
 *  com.styliste.entity.User
 *  com.styliste.entity.Wishlist
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.ProductRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.repository.WishlistRepository
 *  com.styliste.service.WishlistService
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 */
package com.styliste.service;

import com.styliste.dto.ProductDTO;
import com.styliste.dto.WishlistDTO;
import com.styliste.entity.Product;
import com.styliste.entity.User;
import com.styliste.entity.Wishlist;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.ProductRepository;
import com.styliste.repository.UserRepository;
import com.styliste.repository.WishlistRepository;
import java.util.HashSet;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistDTO getWishlist(Long userId) {
        Wishlist wishlist = this.wishlistRepository.findByUserId(userId).orElseGet(() -> this.createNewWishlist(userId));
        return this.mapToDTO(wishlist);
    }

    public WishlistDTO toggleWishlist(Long userId, Long productId) {
        Wishlist wishlist = this.wishlistRepository.findByUserId(userId).orElseGet(() -> this.createNewWishlist(userId));
        if (wishlist.getProducts() == null) {
            wishlist.setProducts(new HashSet());
        }
        Product product = (Product)this.productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (wishlist.getProducts().contains(product)) {
            wishlist.getProducts().remove(product);
        } else {
            wishlist.getProducts().add(product);
        }
        return this.mapToDTO((Wishlist)this.wishlistRepository.save(wishlist));
    }

    public void removeFromWishlistInternal(Long userId, Long productId) {
        this.wishlistRepository.findByUserId(userId).ifPresent(wishlist -> {
            wishlist.getProducts().removeIf(p -> p.getId().equals(productId));
            this.wishlistRepository.save(wishlist);
        });
    }

    private Wishlist createNewWishlist(Long userId) {
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return (Wishlist)this.wishlistRepository.save(Wishlist.builder().user(user).build());
    }

    private WishlistDTO mapToDTO(Wishlist wishlist) {
        return WishlistDTO.builder().id(wishlist.getId()).userId(wishlist.getUser().getId()).products(wishlist.getProducts().stream().map(arg_0 -> this.mapToProductDTO(arg_0)).toList()).build();
    }

    private ProductDTO mapToProductDTO(Product product) {
        return ProductDTO.builder().id(product.getId()).name(product.getName()).price(product.getPrice()).salePrice(product.getSalePrice()).images(product.getImages()).build();
    }

    public WishlistService(WishlistRepository wishlistRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }
}

