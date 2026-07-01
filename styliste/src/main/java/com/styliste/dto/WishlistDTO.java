/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.ProductDTO
 *  com.styliste.dto.WishlistDTO
 *  com.styliste.dto.WishlistDTO$WishlistDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.ProductDTO;
import com.styliste.dto.WishlistDTO;
import java.util.List;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class WishlistDTO {
    private Long id;
    private Long userId;
    private List<ProductDTO> products;

    

    public Long getId() {
        return this.id;
    }

    public Long getUserId() {
        return this.userId;
    }

    public List<ProductDTO> getProducts() {
        return this.products;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setProducts(List<ProductDTO> products) {
        this.products = products;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof WishlistDTO)) {
            return false;
        }
        WishlistDTO other = (WishlistDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        Long this$userId = this.getUserId();
        Long other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !(this$userId).equals(other$userId)) {
            return false;
        }
        List this$products = this.getProducts();
        List other$products = other.getProducts();
        return !(this$products == null ? other$products != null : !(this$products).equals(other$products));
    }

    protected boolean canEqual(Object other) {
        return other instanceof WishlistDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Long $userId = this.getUserId();
        result = result * 59 + ($userId == null ? 43 : ($userId).hashCode());
        List $products = this.getProducts();
        result = result * 59 + ($products == null ? 43 : ($products).hashCode());
        return result;
    }

    public String toString() {
        return "WishlistDTO(id=" + this.getId() + ", userId=" + this.getUserId() + ", products=" + String.valueOf(this.getProducts()) + ")";
    }

    public WishlistDTO() {
    }

    public WishlistDTO(Long id, Long userId, List<ProductDTO> products) {
        this.id = id;
        this.userId = userId;
        this.products = products;
    }
}

