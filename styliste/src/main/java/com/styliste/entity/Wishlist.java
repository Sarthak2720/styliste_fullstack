/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Product
 *  com.styliste.entity.User
 *  com.styliste.entity.Wishlist
 *  com.styliste.entity.Wishlist$WishlistBuilder
 *  jakarta.persistence.Entity
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.JoinTable
 *  jakarta.persistence.ManyToMany
 *  jakarta.persistence.OneToOne
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Product;
import com.styliste.entity.User;
import com.styliste.entity.Wishlist;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;

/*
 * Exception performing whole class analysis ignored.
 */
@Entity
@Table(name="wishlists")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class Wishlist {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;
    @ManyToMany
    @JoinTable(name="wishlist_products", joinColumns={@JoinColumn(name="wishlist_id")}, inverseJoinColumns={@JoinColumn(name="product_id")})
    private Set<Product> products;

    private static Set<Product> $default$products() {
        return new HashSet<Product>();
    }

    

    public Long getId() {
        return this.id;
    }

    public User getUser() {
        return this.user;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    public Wishlist() {
        this.products = Wishlist.$default$products();
    }

    public Wishlist(Long id, User user, Set<Product> products) {
        this.id = id;
        this.user = user;
        this.products = products;
    }
}

