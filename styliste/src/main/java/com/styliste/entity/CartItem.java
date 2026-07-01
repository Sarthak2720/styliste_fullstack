/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Cart
 *  com.styliste.entity.CartItem
 *  com.styliste.entity.CartItem$CartItemBuilder
 *  com.styliste.entity.Product
 *  jakarta.persistence.Entity
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.ManyToOne
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Cart;
import com.styliste.entity.CartItem;
import com.styliste.entity.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="cart_items")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class CartItem {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="cart_id")
    private Cart cart;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="product_id")
    private Product product;
    private Integer quantity;
    private String selectedSize;
    private String selectedColor;

    

    public Long getId() {
        return this.id;
    }

    public Cart getCart() {
        return this.cart;
    }

    public Product getProduct() {
        return this.product;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public String getSelectedSize() {
        return this.selectedSize;
    }

    public String getSelectedColor() {
        return this.selectedColor;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setSelectedSize(String selectedSize) {
        this.selectedSize = selectedSize;
    }

    public void setSelectedColor(String selectedColor) {
        this.selectedColor = selectedColor;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof CartItem)) {
            return false;
        }
        CartItem other = (CartItem)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        Integer this$quantity = this.getQuantity();
        Integer other$quantity = other.getQuantity();
        if (this$quantity == null ? other$quantity != null : !(this$quantity).equals(other$quantity)) {
            return false;
        }
        Cart this$cart = this.getCart();
        Cart other$cart = other.getCart();
        if (this$cart == null ? other$cart != null : !this$cart.equals(other$cart)) {
            return false;
        }
        Product this$product = this.getProduct();
        Product other$product = other.getProduct();
        if (this$product == null ? other$product != null : !this$product.equals(other$product)) {
            return false;
        }
        String this$selectedSize = this.getSelectedSize();
        String other$selectedSize = other.getSelectedSize();
        if (this$selectedSize == null ? other$selectedSize != null : !this$selectedSize.equals(other$selectedSize)) {
            return false;
        }
        String this$selectedColor = this.getSelectedColor();
        String other$selectedColor = other.getSelectedColor();
        return !(this$selectedColor == null ? other$selectedColor != null : !this$selectedColor.equals(other$selectedColor));
    }

    protected boolean canEqual(Object other) {
        return other instanceof CartItem;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Integer $quantity = this.getQuantity();
        result = result * 59 + ($quantity == null ? 43 : ($quantity).hashCode());
        Cart $cart = this.getCart();
        result = result * 59 + ($cart == null ? 43 : $cart.hashCode());
        Product $product = this.getProduct();
        result = result * 59 + ($product == null ? 43 : $product.hashCode());
        String $selectedSize = this.getSelectedSize();
        result = result * 59 + ($selectedSize == null ? 43 : $selectedSize.hashCode());
        String $selectedColor = this.getSelectedColor();
        result = result * 59 + ($selectedColor == null ? 43 : $selectedColor.hashCode());
        return result;
    }

    public String toString() {
        return "CartItem(id=" + this.getId() + ", cart=" + String.valueOf(this.getCart()) + ", product=" + String.valueOf(this.getProduct()) + ", quantity=" + this.getQuantity() + ", selectedSize=" + this.getSelectedSize() + ", selectedColor=" + this.getSelectedColor() + ")";
    }

    public CartItem() {
    }

    public CartItem(Long id, Cart cart, Product product, Integer quantity, String selectedSize, String selectedColor) {
        this.id = id;
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
        this.selectedSize = selectedSize;
        this.selectedColor = selectedColor;
    }
}

