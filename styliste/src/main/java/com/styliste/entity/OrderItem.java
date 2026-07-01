/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Order
 *  com.styliste.entity.OrderItem
 *  com.styliste.entity.OrderItem$OrderItemBuilder
 *  com.styliste.entity.OrderItemStatus
 *  com.styliste.entity.Product
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.EnumType
 *  jakarta.persistence.Enumerated
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.ManyToOne
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Order;
import com.styliste.entity.OrderItem;
import com.styliste.entity.OrderItemStatus;
import com.styliste.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

/*
 * Exception performing whole class analysis ignored.
 */
@Entity
@Table(name="order_items")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class OrderItem {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="order_id", nullable=false)
    private Order order;
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="product_id", nullable=false)
    private Product product;
    @Column(nullable=false)
    private Integer quantity;
    @Column(name="unit_price", precision=10, scale=2, nullable=false)
    private BigDecimal unitPrice;
    @Column(precision=10, scale=2, nullable=false)
    private BigDecimal totalPrice;
    @Column(length=50)
    private String selectedSize;
    @Column(length=50)
    private String selectedColor;
    @Enumerated(value=EnumType.STRING)
    @Column(name="item_status", nullable=false, length=30)
    private OrderItemStatus itemStatus;
    @Column(name="returned_quantity")
    private Integer returnedQuantity;

    private static OrderItemStatus $default$itemStatus() {
        return OrderItemStatus.ACTIVE;
    }

    private static Integer $default$returnedQuantity() {
        return 0;
    }

    

    public Long getId() {
        return this.id;
    }

    public Order getOrder() {
        return this.order;
    }

    public Product getProduct() {
        return this.product;
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

    public OrderItemStatus getItemStatus() {
        return this.itemStatus;
    }

    public Integer getReturnedQuantity() {
        return this.returnedQuantity;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setProduct(Product product) {
        this.product = product;
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

    public void setItemStatus(OrderItemStatus itemStatus) {
        this.itemStatus = itemStatus;
    }

    public void setReturnedQuantity(Integer returnedQuantity) {
        this.returnedQuantity = returnedQuantity;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof OrderItem)) {
            return false;
        }
        OrderItem other = (OrderItem)o;
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
        Integer this$returnedQuantity = this.getReturnedQuantity();
        Integer other$returnedQuantity = other.getReturnedQuantity();
        if (this$returnedQuantity == null ? other$returnedQuantity != null : !(this$returnedQuantity).equals(other$returnedQuantity)) {
            return false;
        }
        Order this$order = this.getOrder();
        Order other$order = other.getOrder();
        if (this$order == null ? other$order != null : !this$order.equals(other$order)) {
            return false;
        }
        Product this$product = this.getProduct();
        Product other$product = other.getProduct();
        if (this$product == null ? other$product != null : !this$product.equals(other$product)) {
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
        OrderItemStatus this$itemStatus = this.getItemStatus();
        OrderItemStatus other$itemStatus = other.getItemStatus();
        return !(this$itemStatus == null ? other$itemStatus != null : !this$itemStatus.equals(other$itemStatus));
    }

    protected boolean canEqual(Object other) {
        return other instanceof OrderItem;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Integer $quantity = this.getQuantity();
        result = result * 59 + ($quantity == null ? 43 : ($quantity).hashCode());
        Integer $returnedQuantity = this.getReturnedQuantity();
        result = result * 59 + ($returnedQuantity == null ? 43 : ($returnedQuantity).hashCode());
        Order $order = this.getOrder();
        result = result * 59 + ($order == null ? 43 : $order.hashCode());
        Product $product = this.getProduct();
        result = result * 59 + ($product == null ? 43 : $product.hashCode());
        BigDecimal $unitPrice = this.getUnitPrice();
        result = result * 59 + ($unitPrice == null ? 43 : ($unitPrice).hashCode());
        BigDecimal $totalPrice = this.getTotalPrice();
        result = result * 59 + ($totalPrice == null ? 43 : ($totalPrice).hashCode());
        String $selectedSize = this.getSelectedSize();
        result = result * 59 + ($selectedSize == null ? 43 : $selectedSize.hashCode());
        String $selectedColor = this.getSelectedColor();
        result = result * 59 + ($selectedColor == null ? 43 : $selectedColor.hashCode());
        OrderItemStatus $itemStatus = this.getItemStatus();
        result = result * 59 + ($itemStatus == null ? 43 : $itemStatus.hashCode());
        return result;
    }

    public String toString() {
        return "OrderItem(id=" + this.getId() + ", order=" + String.valueOf(this.getOrder()) + ", product=" + String.valueOf(this.getProduct()) + ", quantity=" + this.getQuantity() + ", unitPrice=" + String.valueOf(this.getUnitPrice()) + ", totalPrice=" + String.valueOf(this.getTotalPrice()) + ", selectedSize=" + this.getSelectedSize() + ", selectedColor=" + this.getSelectedColor() + ", itemStatus=" + String.valueOf(this.getItemStatus()) + ", returnedQuantity=" + this.getReturnedQuantity() + ")";
    }

    public OrderItem() {
        this.itemStatus = OrderItem.$default$itemStatus();
        this.returnedQuantity = OrderItem.$default$returnedQuantity();
    }

    public OrderItem(Long id, Order order, Product product, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice, String selectedSize, String selectedColor, OrderItemStatus itemStatus, Integer returnedQuantity) {
        this.id = id;
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.selectedSize = selectedSize;
        this.selectedColor = selectedColor;
        this.itemStatus = itemStatus;
        this.returnedQuantity = returnedQuantity;
    }
}

