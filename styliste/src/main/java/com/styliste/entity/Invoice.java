/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Invoice
 *  com.styliste.entity.Invoice$InvoiceBuilder
 *  com.styliste.entity.InvoiceStatus
 *  com.styliste.entity.Order
 *  jakarta.persistence.Column
 *  jakarta.persistence.Entity
 *  jakarta.persistence.EnumType
 *  jakarta.persistence.Enumerated
 *  jakarta.persistence.FetchType
 *  jakarta.persistence.GeneratedValue
 *  jakarta.persistence.GenerationType
 *  jakarta.persistence.Id
 *  jakarta.persistence.JoinColumn
 *  jakarta.persistence.OneToOne
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Invoice;
import com.styliste.entity.InvoiceStatus;
import com.styliste.entity.Order;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

/*
 * Exception performing whole class analysis ignored.
 */
@Entity
@Table(name="invoices")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class Invoice {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true, nullable=false, length=50)
    private String invoiceNumber;
    @OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="order_id", nullable=false, unique=true)
    private Order order;
    @Column(name="issued_at", nullable=false)
    private LocalDateTime issuedAt;
    @Column(name="due_at")
    private LocalDateTime dueAt;
    @Enumerated(value=EnumType.STRING)
    @Column(nullable=false, length=30)
    private InvoiceStatus status;
    @Column(name="subtotal", precision=10, scale=2)
    private BigDecimal subtotal;
    @Column(name="shipping_charges", precision=10, scale=2)
    private BigDecimal shippingCharges;
    @Column(name="discount", precision=10, scale=2)
    private BigDecimal discount;
    @Column(name="tax", precision=10, scale=2)
    private BigDecimal tax;
    @Column(name="total_amount", precision=10, scale=2)
    private BigDecimal totalAmount;
    @Column(name="refunded_amount", precision=10, scale=2)
    private BigDecimal refundedAmount;
    @Column(columnDefinition="LONGBLOB")
    private byte[] pdfContent;

    @PrePersist
    public void prePersist() {
        this.issuedAt = LocalDateTime.now();
    }

    private static BigDecimal $default$refundedAmount() {
        return BigDecimal.ZERO;
    }

    

    public Long getId() {
        return this.id;
    }

    public String getInvoiceNumber() {
        return this.invoiceNumber;
    }

    public Order getOrder() {
        return this.order;
    }

    public LocalDateTime getIssuedAt() {
        return this.issuedAt;
    }

    public LocalDateTime getDueAt() {
        return this.dueAt;
    }

    public InvoiceStatus getStatus() {
        return this.status;
    }

    public BigDecimal getSubtotal() {
        return this.subtotal;
    }

    public BigDecimal getShippingCharges() {
        return this.shippingCharges;
    }

    public BigDecimal getDiscount() {
        return this.discount;
    }

    public BigDecimal getTax() {
        return this.tax;
    }

    public BigDecimal getTotalAmount() {
        return this.totalAmount;
    }

    public BigDecimal getRefundedAmount() {
        return this.refundedAmount;
    }

    public byte[] getPdfContent() {
        return this.pdfContent;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public void setDueAt(LocalDateTime dueAt) {
        this.dueAt = dueAt;
    }

    public void setStatus(InvoiceStatus status) {
        this.status = status;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public void setShippingCharges(BigDecimal shippingCharges) {
        this.shippingCharges = shippingCharges;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setRefundedAmount(BigDecimal refundedAmount) {
        this.refundedAmount = refundedAmount;
    }

    public void setPdfContent(byte[] pdfContent) {
        this.pdfContent = pdfContent;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof Invoice)) {
            return false;
        }
        Invoice other = (Invoice)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        String this$invoiceNumber = this.getInvoiceNumber();
        String other$invoiceNumber = other.getInvoiceNumber();
        if (this$invoiceNumber == null ? other$invoiceNumber != null : !this$invoiceNumber.equals(other$invoiceNumber)) {
            return false;
        }
        Order this$order = this.getOrder();
        Order other$order = other.getOrder();
        if (this$order == null ? other$order != null : !this$order.equals(other$order)) {
            return false;
        }
        LocalDateTime this$issuedAt = this.getIssuedAt();
        LocalDateTime other$issuedAt = other.getIssuedAt();
        if (this$issuedAt == null ? other$issuedAt != null : !(this$issuedAt).equals(other$issuedAt)) {
            return false;
        }
        LocalDateTime this$dueAt = this.getDueAt();
        LocalDateTime other$dueAt = other.getDueAt();
        if (this$dueAt == null ? other$dueAt != null : !(this$dueAt).equals(other$dueAt)) {
            return false;
        }
        InvoiceStatus this$status = this.getStatus();
        InvoiceStatus other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        BigDecimal this$subtotal = this.getSubtotal();
        BigDecimal other$subtotal = other.getSubtotal();
        if (this$subtotal == null ? other$subtotal != null : !(this$subtotal).equals(other$subtotal)) {
            return false;
        }
        BigDecimal this$shippingCharges = this.getShippingCharges();
        BigDecimal other$shippingCharges = other.getShippingCharges();
        if (this$shippingCharges == null ? other$shippingCharges != null : !(this$shippingCharges).equals(other$shippingCharges)) {
            return false;
        }
        BigDecimal this$discount = this.getDiscount();
        BigDecimal other$discount = other.getDiscount();
        if (this$discount == null ? other$discount != null : !(this$discount).equals(other$discount)) {
            return false;
        }
        BigDecimal this$tax = this.getTax();
        BigDecimal other$tax = other.getTax();
        if (this$tax == null ? other$tax != null : !(this$tax).equals(other$tax)) {
            return false;
        }
        BigDecimal this$totalAmount = this.getTotalAmount();
        BigDecimal other$totalAmount = other.getTotalAmount();
        if (this$totalAmount == null ? other$totalAmount != null : !(this$totalAmount).equals(other$totalAmount)) {
            return false;
        }
        BigDecimal this$refundedAmount = this.getRefundedAmount();
        BigDecimal other$refundedAmount = other.getRefundedAmount();
        if (this$refundedAmount == null ? other$refundedAmount != null : !(this$refundedAmount).equals(other$refundedAmount)) {
            return false;
        }
        return Arrays.equals(this.getPdfContent(), other.getPdfContent());
    }

    protected boolean canEqual(Object other) {
        return other instanceof Invoice;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        String $invoiceNumber = this.getInvoiceNumber();
        result = result * 59 + ($invoiceNumber == null ? 43 : $invoiceNumber.hashCode());
        Order $order = this.getOrder();
        result = result * 59 + ($order == null ? 43 : $order.hashCode());
        LocalDateTime $issuedAt = this.getIssuedAt();
        result = result * 59 + ($issuedAt == null ? 43 : ($issuedAt).hashCode());
        LocalDateTime $dueAt = this.getDueAt();
        result = result * 59 + ($dueAt == null ? 43 : ($dueAt).hashCode());
        InvoiceStatus $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        BigDecimal $subtotal = this.getSubtotal();
        result = result * 59 + ($subtotal == null ? 43 : ($subtotal).hashCode());
        BigDecimal $shippingCharges = this.getShippingCharges();
        result = result * 59 + ($shippingCharges == null ? 43 : ($shippingCharges).hashCode());
        BigDecimal $discount = this.getDiscount();
        result = result * 59 + ($discount == null ? 43 : ($discount).hashCode());
        BigDecimal $tax = this.getTax();
        result = result * 59 + ($tax == null ? 43 : ($tax).hashCode());
        BigDecimal $totalAmount = this.getTotalAmount();
        result = result * 59 + ($totalAmount == null ? 43 : ($totalAmount).hashCode());
        BigDecimal $refundedAmount = this.getRefundedAmount();
        result = result * 59 + ($refundedAmount == null ? 43 : ($refundedAmount).hashCode());
        result = result * 59 + Arrays.hashCode(this.getPdfContent());
        return result;
    }

    public String toString() {
        return "Invoice(id=" + this.getId() + ", invoiceNumber=" + this.getInvoiceNumber() + ", order=" + String.valueOf(this.getOrder()) + ", issuedAt=" + String.valueOf(this.getIssuedAt()) + ", dueAt=" + String.valueOf(this.getDueAt()) + ", status=" + String.valueOf(this.getStatus()) + ", subtotal=" + String.valueOf(this.getSubtotal()) + ", shippingCharges=" + String.valueOf(this.getShippingCharges()) + ", discount=" + String.valueOf(this.getDiscount()) + ", tax=" + String.valueOf(this.getTax()) + ", totalAmount=" + String.valueOf(this.getTotalAmount()) + ", refundedAmount=" + String.valueOf(this.getRefundedAmount()) + ", pdfContent=" + Arrays.toString(this.getPdfContent()) + ")";
    }

    public Invoice() {
        this.refundedAmount = Invoice.$default$refundedAmount();
    }

    public Invoice(Long id, String invoiceNumber, Order order, LocalDateTime issuedAt, LocalDateTime dueAt, InvoiceStatus status, BigDecimal subtotal, BigDecimal shippingCharges, BigDecimal discount, BigDecimal tax, BigDecimal totalAmount, BigDecimal refundedAmount, byte[] pdfContent) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.order = order;
        this.issuedAt = issuedAt;
        this.dueAt = dueAt;
        this.status = status;
        this.subtotal = subtotal;
        this.shippingCharges = shippingCharges;
        this.discount = discount;
        this.tax = tax;
        this.totalAmount = totalAmount;
        this.refundedAmount = refundedAmount;
        this.pdfContent = pdfContent;
    }
}

