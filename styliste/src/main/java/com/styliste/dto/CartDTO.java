/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.CartDTO
 *  com.styliste.dto.CartDTO$CartDTOBuilder
 *  com.styliste.dto.CartItemDTO
 */
package com.styliste.dto;

import com.styliste.dto.CartDTO;
import com.styliste.dto.CartItemDTO;
import java.math.BigDecimal;
import java.util.List;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class CartDTO {
    private Long id;
    private Long userId;
    private List<CartItemDTO> items;
    private BigDecimal totalAmount;

    

    public Long getId() {
        return this.id;
    }

    public Long getUserId() {
        return this.userId;
    }

    public List<CartItemDTO> getItems() {
        return this.items;
    }

    public BigDecimal getTotalAmount() {
        return this.totalAmount;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof CartDTO)) {
            return false;
        }
        CartDTO other = (CartDTO)o;
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
        List this$items = this.getItems();
        List other$items = other.getItems();
        if (this$items == null ? other$items != null : !(this$items).equals(other$items)) {
            return false;
        }
        BigDecimal this$totalAmount = this.getTotalAmount();
        BigDecimal other$totalAmount = other.getTotalAmount();
        return !(this$totalAmount == null ? other$totalAmount != null : !(this$totalAmount).equals(other$totalAmount));
    }

    protected boolean canEqual(Object other) {
        return other instanceof CartDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Long $userId = this.getUserId();
        result = result * 59 + ($userId == null ? 43 : ($userId).hashCode());
        List $items = this.getItems();
        result = result * 59 + ($items == null ? 43 : ($items).hashCode());
        BigDecimal $totalAmount = this.getTotalAmount();
        result = result * 59 + ($totalAmount == null ? 43 : ($totalAmount).hashCode());
        return result;
    }

    public String toString() {
        return "CartDTO(id=" + this.getId() + ", userId=" + this.getUserId() + ", items=" + String.valueOf(this.getItems()) + ", totalAmount=" + String.valueOf(this.getTotalAmount()) + ")";
    }

    public CartDTO() {
    }

    public CartDTO(Long id, Long userId, List<CartItemDTO> items, BigDecimal totalAmount) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.totalAmount = totalAmount;
    }
}

