/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Cart
 *  com.styliste.entity.Cart$CartBuilder
 *  com.styliste.entity.CartItem
 *  com.styliste.entity.User
 *  jakarta.persistence.CascadeType
 *  jakarta.persistence.Entity
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.OneToMany
 *  jakarta.persistence.OneToOne
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Cart;
import com.styliste.entity.CartItem;
import com.styliste.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="carts")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class Cart {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;
    @OneToMany(mappedBy="cart", cascade={CascadeType.ALL}, orphanRemoval=true)
    private List<CartItem> items = new ArrayList();

    

    public Long getId() {
        return this.id;
    }

    public User getUser() {
        return this.user;
    }

    public List<CartItem> getItems() {
        return this.items;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public Cart() {
    }

    public Cart(Long id, User user, List<CartItem> items) {
        this.id = id;
        this.user = user;
        this.items = items;
    }
}

