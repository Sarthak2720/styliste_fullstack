/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.CartDTO
 *  com.styliste.dto.CartItemDTO
 *  com.styliste.entity.Cart
 *  com.styliste.entity.CartItem
 *  com.styliste.entity.Product
 *  com.styliste.entity.User
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.CartRepository
 *  com.styliste.repository.ProductRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.CartService
 *  com.styliste.service.WishlistService
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Propagation
 *  org.springframework.transaction.annotation.Transactional
 */
package com.styliste.service;

import com.styliste.dto.CartDTO;
import com.styliste.dto.CartItemDTO;
import com.styliste.entity.Cart;
import com.styliste.entity.CartItem;
import com.styliste.entity.Product;
import com.styliste.entity.User;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.CartRepository;
import com.styliste.repository.ProductRepository;
import com.styliste.repository.UserRepository;
import com.styliste.service.WishlistService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final WishlistService wishlistService;

    public CartDTO addItemToCart(Long userId, CartItemDTO itemDto) {
        Cart cart = this.cartRepository.findByUserId(userId).orElseGet(() -> this.createNewCart(userId));
        Optional<CartItem> existing = cart.getItems().stream().filter(item -> item.getProduct().getId().equals(itemDto.getProductId()) && Objects.equals(item.getSelectedSize(), itemDto.getSelectedSize()) && Objects.equals(item.getSelectedColor(), itemDto.getSelectedColor())).findFirst();
        Product product = (Product)this.productRepository.findById(itemDto.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (existing.isPresent()) {
            int totalRequested = existing.get().getQuantity() + itemDto.getQuantity();
            if (product.getStock() < totalRequested) {
                throw new BadRequestException("Only " + product.getStock() + " units available. You already have " + existing.get().getQuantity() + " in your cart.");
            }
            existing.get().setQuantity(Integer.valueOf(totalRequested));
        } else {
            if (product.getStock() < itemDto.getQuantity()) {
                throw new BadRequestException("Only " + product.getStock() + " units available in stock.");
            }
            cart.getItems().add(CartItem.builder().cart(cart).product(product).quantity(itemDto.getQuantity()).selectedSize(itemDto.getSelectedSize()).selectedColor(itemDto.getSelectedColor()).build());
        }
        this.wishlistService.removeFromWishlistInternal(userId, itemDto.getProductId());
        return this.mapToDTO((Cart)this.cartRepository.save(cart));
    }

    public CartDTO updateItemQuantity(Long userId, Long itemId, Integer quantity) {
        Cart cart = (Cart)this.cartRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        CartItem item = cart.getItems().stream().filter(i -> i.getId().equals(itemId)).findFirst().orElseThrow(() -> new ResourceNotFoundException("Item not found in cart"));
        Product product = item.getProduct();
        if (product.getStock() < quantity) {
            throw new BadRequestException("Only " + product.getStock() + " units available in stock.");
        }
        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }
        return this.mapToDTO((Cart)this.cartRepository.save(cart));
    }

    public CartDTO getCartByUserId(Long userId) {
        Cart cart = this.cartRepository.findByUserId(userId).orElseGet(() -> this.createNewCart(userId));
        return this.mapToDTO(cart);
    }

    public CartDTO mergeCart(Long userId, List<CartItemDTO> guestItems) {
        Cart cart = this.cartRepository.findByUserId(userId).orElseGet(() -> this.createNewCart(userId));
        for (CartItemDTO guestItem : guestItems) {
            Optional<CartItem> existing = cart.getItems().stream().filter(item -> item.getProduct().getId().equals(guestItem.getProductId()) && Objects.equals(item.getSelectedSize(), guestItem.getSelectedSize()) && Objects.equals(item.getSelectedColor(), guestItem.getSelectedColor())).findFirst();
            Product product = (Product)this.productRepository.findById(guestItem.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            if (existing.isPresent()) {
                int totalRequested = existing.get().getQuantity() + guestItem.getQuantity();
                if (product.getStock() < totalRequested) {
                    existing.get().setQuantity(product.getStock());
                    continue;
                }
                existing.get().setQuantity(Integer.valueOf(totalRequested));
                continue;
            }
            int quantityToAdd = guestItem.getQuantity();
            if (product.getStock() < quantityToAdd) {
                quantityToAdd = product.getStock();
            }
            if (quantityToAdd <= 0) continue;
            cart.getItems().add(CartItem.builder().cart(cart).product(product).quantity(Integer.valueOf(quantityToAdd)).selectedSize(guestItem.getSelectedSize()).selectedColor(guestItem.getSelectedColor()).build());
        }
        return this.mapToDTO((Cart)this.cartRepository.save(cart));
    }

    public void removeItem(Long userId, Long itemId) {
        Cart cart = (Cart)this.cartRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        this.cartRepository.save(cart);
    }

    @Transactional(propagation=Propagation.REQUIRES_NEW)
    public void clearCart(Long userId) {
        this.cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            this.cartRepository.save(cart);
        });
    }

    private Cart createNewCart(Long userId) {
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = Cart.builder().user(user).items(new ArrayList()).build();
        return (Cart)this.cartRepository.save(cart);
    }

    private CartDTO mapToDTO(Cart cart) {
        boolean cartNeedsSave = false;
        ArrayList<CartItemDTO> itemDTOs = new ArrayList<CartItemDTO>();
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            int currentStock = product.getStock();
            boolean adjusted = false;
            boolean soldOut = false;
            if (currentStock <= 0) {
                if (item.getQuantity() != 0) {
                    item.setQuantity(Integer.valueOf(0));
                    cartNeedsSave = true;
                }
                soldOut = true;
            } else if (currentStock < item.getQuantity()) {
                item.setQuantity(Integer.valueOf(currentStock));
                cartNeedsSave = true;
                adjusted = true;
            }
            CartItemDTO dto = this.mapItemToDTO(item);
            dto.setSoldOut(soldOut);
            dto.setQuantityAdjusted(adjusted);
            if (soldOut) {
                dto.setTotalPrice(BigDecimal.ZERO);
            }
            itemDTOs.add(dto);
        }
        if (cartNeedsSave) {
            this.cartRepository.save(cart);
        }
        BigDecimal totalAmount = itemDTOs.stream().map(CartItemDTO::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        return CartDTO.builder().id(cart.getId()).userId(cart.getUser().getId()).items(itemDTOs).totalAmount(totalAmount).build();
    }

    private CartItemDTO mapItemToDTO(CartItem item) {
        Product product = item.getProduct();
        BigDecimal unitPrice = product.getSalePrice() != null ? product.getSalePrice() : product.getPrice();
        return CartItemDTO.builder().id(item.getId()).productId(product.getId()).productName(product.getName()).productImage(product.getImages() != null && !product.getImages().isEmpty() ? (String)product.getImages().get(0) : null).quantity(item.getQuantity()).unitPrice(unitPrice).totalPrice(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity().intValue()))).selectedSize(item.getSelectedSize()).selectedColor(item.getSelectedColor()).build();
    }

    public CartService(CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository, WishlistService wishlistService) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.wishlistService = wishlistService;
    }
}

