/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.CartItemDTO
 *  com.styliste.dto.CartItemDTO$CartItemDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.CartItemDTO;
import java.math.BigDecimal;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private boolean isSoldOut;
    private String selectedSize;
    private String selectedColor;
    private boolean isQuantityAdjusted;

    

    public Long getId() {
        return this.id;
    }

    public Long getProductId() {
        return this.productId;
    }

    public String getProductName() {
        return this.productName;
    }

    public String getProductImage() {
        return this.productImage;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public BigDecimal getUnitPrice() {
        return this.unitPrice;
    }

    public BigDecimal getTotalPrice() {
        return this.totalPrice;
    }

    public boolean isSoldOut() {
        return this.isSoldOut;
    }

    public String getSelectedSize() {
        return this.selectedSize;
    }

    public String getSelectedColor() {
        return this.selectedColor;
    }

    public boolean isQuantityAdjusted() {
        return this.isQuantityAdjusted;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public void setSoldOut(boolean isSoldOut) {
        this.isSoldOut = isSoldOut;
    }

    public void setSelectedSize(String selectedSize) {
        this.selectedSize = selectedSize;
    }

    public void setSelectedColor(String selectedColor) {
        this.selectedColor = selectedColor;
    }

    public void setQuantityAdjusted(boolean isQuantityAdjusted) {
        this.isQuantityAdjusted = isQuantityAdjusted;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof CartItemDTO)) {
            return false;
        }
        CartItemDTO other = (CartItemDTO)o;
        if (!other.canEqual(this)) {
            return false;
        }
        if (this.isSoldOut() != other.isSoldOut()) {
            return false;
        }
        if (this.isQuantityAdjusted() != other.isQuantityAdjusted()) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        Long this$productId = this.getProductId();
        Long other$productId = other.getProductId();
        if (this$productId == null ? other$productId != null : !(this$productId).equals(other$productId)) {
            return false;
        }
        Integer this$quantity = this.getQuantity();
        Integer other$quantity = other.getQuantity();
        if (this$quantity == null ? other$quantity != null : !(this$quantity).equals(other$quantity)) {
            return false;
        }
        String this$productName = this.getProductName();
        String other$productName = other.getProductName();
        if (this$productName == null ? other$productName != null : !this$productName.equals(other$productName)) {
            return false;
        }
        String this$productImage = this.getProductImage();
        String other$productImage = other.getProductImage();
        if (this$productImage == null ? other$productImage != null : !this$productImage.equals(other$productImage)) {
            return false;
        }
        BigDecimal this$unitPrice = this.getUnitPrice();
        BigDecimal other$unitPrice = other.getUnitPrice();
        if (this$unitPrice == null ? other$unitPrice != null : !(this$unitPrice).equals(other$unitPrice)) {
            return false;
        }
        BigDecimal this$totalPrice = this.getTotalPrice();
        BigDecimal other$totalPrice = other.getTotalPrice();
        if (this$totalPrice == null ? other$totalPrice != null : !(this$totalPrice).equals(other$totalPrice)) {
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
        return other instanceof CartItemDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        result = result * 59 + (this.isSoldOut() ? 79 : 97);
        result = result * 59 + (this.isQuantityAdjusted() ? 79 : 97);
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Long $productId = this.getProductId();
        result = result * 59 + ($productId == null ? 43 : ($productId).hashCode());
        Integer $quantity = this.getQuantity();
        result = result * 59 + ($quantity == null ? 43 : ($quantity).hashCode());
        String $productName = this.getProductName();
        result = result * 59 + ($productName == null ? 43 : $productName.hashCode());
        String $productImage = this.getProductImage();
        result = result * 59 + ($productImage == null ? 43 : $productImage.hashCode());
        BigDecimal $unitPrice = this.getUnitPrice();
        result = result * 59 + ($unitPrice == null ? 43 : ($unitPrice).hashCode());
        BigDecimal $totalPrice = this.getTotalPrice();
        result = result * 59 + ($totalPrice == null ? 43 : ($totalPrice).hashCode());
        String $selectedSize = this.getSelectedSize();
        result = result * 59 + ($selectedSize == null ? 43 : $selectedSize.hashCode());
        String $selectedColor = this.getSelectedColor();
        result = result * 59 + ($selectedColor == null ? 43 : $selectedColor.hashCode());
        return result;
    }

    public String toString() {
        return "CartItemDTO(id=" + this.getId() + ", productId=" + this.getProductId() + ", productName=" + this.getProductName() + ", productImage=" + this.getProductImage() + ", quantity=" + this.getQuantity() + ", unitPrice=" + String.valueOf(this.getUnitPrice()) + ", totalPrice=" + String.valueOf(this.getTotalPrice()) + ", isSoldOut=" + this.isSoldOut() + ", selectedSize=" + this.getSelectedSize() + ", selectedColor=" + this.getSelectedColor() + ", isQuantityAdjusted=" + this.isQuantityAdjusted() + ")";
    }

    public CartItemDTO() {
    }

    public CartItemDTO(Long id, Long productId, String productName, String productImage, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice, boolean isSoldOut, String selectedSize, String selectedColor, boolean isQuantityAdjusted) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.isSoldOut = isSoldOut;
        this.selectedSize = selectedSize;
        this.selectedColor = selectedColor;
        this.isQuantityAdjusted = isQuantityAdjusted;
    }
}

