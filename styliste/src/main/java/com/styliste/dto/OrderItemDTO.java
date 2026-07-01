/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.OrderItemDTO
 *  com.styliste.dto.OrderItemDTO$OrderItemDTOBuilder
 */
package com.styliste.dto;

import com.styliste.dto.OrderItemDTO;
import java.math.BigDecimal;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class OrderItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String selectedSize;
    private String selectedColor;
    private String itemStatus;
    private Integer returnedQuantity;

    

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

    public String getSelectedSize() {
        return this.selectedSize;
    }

    public String getSelectedColor() {
        return this.selectedColor;
    }

    public String getItemStatus() {
        return this.itemStatus;
    }

    public Integer getReturnedQuantity() {
        return this.returnedQuantity;
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

    public void setSelectedSize(String selectedSize) {
        this.selectedSize = selectedSize;
    }

    public void setSelectedColor(String selectedColor) {
        this.selectedColor = selectedColor;
    }

    public void setItemStatus(String itemStatus) {
        this.itemStatus = itemStatus;
    }

    public void setReturnedQuantity(Integer returnedQuantity) {
        this.returnedQuantity = returnedQuantity;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof OrderItemDTO)) {
            return false;
        }
        OrderItemDTO other = (OrderItemDTO)o;
        if (!other.canEqual(this)) {
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
        Integer this$returnedQuantity = this.getReturnedQuantity();
        Integer other$returnedQuantity = other.getReturnedQuantity();
        if (this$returnedQuantity == null ? other$returnedQuantity != null : !(this$returnedQuantity).equals(other$returnedQuantity)) {
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
        if (this$selectedColor == null ? other$selectedColor != null : !this$selectedColor.equals(other$selectedColor)) {
            return false;
        }
        String this$itemStatus = this.getItemStatus();
        String other$itemStatus = other.getItemStatus();
        return !(this$itemStatus == null ? other$itemStatus != null : !this$itemStatus.equals(other$itemStatus));
    }

    protected boolean canEqual(Object other) {
        return other instanceof OrderItemDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Long $productId = this.getProductId();
        result = result * 59 + ($productId == null ? 43 : ($productId).hashCode());
        Integer $quantity = this.getQuantity();
        result = result * 59 + ($quantity == null ? 43 : ($quantity).hashCode());
        Integer $returnedQuantity = this.getReturnedQuantity();
        result = result * 59 + ($returnedQuantity == null ? 43 : ($returnedQuantity).hashCode());
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
        String $itemStatus = this.getItemStatus();
        result = result * 59 + ($itemStatus == null ? 43 : $itemStatus.hashCode());
        return result;
    }

    public String toString() {
        return "OrderItemDTO(id=" + this.getId() + ", productId=" + this.getProductId() + ", productName=" + this.getProductName() + ", productImage=" + this.getProductImage() + ", quantity=" + this.getQuantity() + ", unitPrice=" + String.valueOf(this.getUnitPrice()) + ", totalPrice=" + String.valueOf(this.getTotalPrice()) + ", selectedSize=" + this.getSelectedSize() + ", selectedColor=" + this.getSelectedColor() + ", itemStatus=" + this.getItemStatus() + ", returnedQuantity=" + this.getReturnedQuantity() + ")";
    }

    public OrderItemDTO() {
    }

    public OrderItemDTO(Long id, Long productId, String productName, String productImage, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice, String selectedSize, String selectedColor, String itemStatus, Integer returnedQuantity) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.selectedSize = selectedSize;
        this.selectedColor = selectedColor;
        this.itemStatus = itemStatus;
        this.returnedQuantity = returnedQuantity;
    }
}

