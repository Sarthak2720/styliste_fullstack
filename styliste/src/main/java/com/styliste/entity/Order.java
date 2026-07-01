/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Invoice
 *  com.styliste.entity.Order
 *  com.styliste.entity.Order$OrderBuilder
 *  com.styliste.entity.OrderItem
 *  com.styliste.entity.OrderStatus
 *  com.styliste.entity.OrderTimeline
 *  com.styliste.entity.PaymentMethod
 *  com.styliste.entity.PaymentStatus
 *  com.styliste.entity.User
 *  jakarta.persistence.CascadeType
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
 *  jakarta.persistence.OneToMany
 *  jakarta.persistence.OneToOne
 *  jakarta.persistence.OrderBy
 *  jakarta.persistence.PrePersist
 *  jakarta.persistence.PreUpdate
 *  jakarta.persistence.Table
 */
package com.styliste.entity;

import com.styliste.entity.Invoice;
import com.styliste.entity.Order;
import com.styliste.entity.OrderItem;
import com.styliste.entity.OrderStatus;
import com.styliste.entity.OrderTimeline;
import com.styliste.entity.PaymentMethod;
import com.styliste.entity.PaymentStatus;
import com.styliste.entity.User;
import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/*
 * Exception performing whole class analysis ignored.
 */
@Entity
@Table(name="orders")
@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class Order {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="user_id", nullable=false)
    private User user;
    @Column(length=20)
    private String userPhone;
    @Enumerated(value=EnumType.STRING)
    @Column(nullable=false, length=30)
    private OrderStatus status;
    @Enumerated(value=EnumType.STRING)
    @Column(name="payment_status", nullable=false, length=30)
    private PaymentStatus paymentStatus;
    @Column(precision=10, scale=2, nullable=false)
    private BigDecimal totalAmount;
    @Column(precision=10, scale=2)
    private BigDecimal discount;
    @Column(precision=10, scale=2)
    private BigDecimal tax;
    @Column(length=50)
    private String trackingNumber;
    @Column(columnDefinition="TEXT")
    private String shippingAddress;
    @Column(name="created_at", nullable=false, updatable=false)
    private LocalDateTime createdAt;
    @Column(name="updated_at")
    private LocalDateTime updatedAt;
    @OneToMany(mappedBy="order", cascade={CascadeType.ALL}, orphanRemoval=true, fetch=FetchType.EAGER)
    private List<OrderItem> items;
    @OneToOne(mappedBy="order", cascade={CascadeType.ALL}, fetch=FetchType.LAZY)
    private Invoice invoice;
    @Column(name="razorpay_order_id")
    private String razorpayOrderId;
    @Column(name="razorpay_payment_id")
    private String razorpayPaymentId;
    @Column(name="razorpay_signature")
    private String razorpaySignature;
    @Enumerated(value=EnumType.STRING)
    @Column(nullable=false, length=30)
    private PaymentMethod paymentMethod;
    @Column(precision=10, scale=2)
    private BigDecimal shippingCharges;
    @OneToMany(mappedBy="order", cascade={CascadeType.ALL}, orphanRemoval=true)
    @OrderBy(value="timestamp ASC")
    private List<OrderTimeline> timeline;
    @Column(name="delivered_at")
    private LocalDateTime deliveredAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addTimelineStep(OrderStatus status, String message) {
        if (this.timeline == null) {
            this.timeline = new ArrayList();
        }
        OrderTimeline step = OrderTimeline.builder().order(this).status(status).message(message).build();
        this.timeline.add(step);
        this.setStatus(status);
        if (status == OrderStatus.DELIVERED && this.deliveredAt == null) {
            this.deliveredAt = LocalDateTime.now();
        }
    }

    private static List<OrderTimeline> $default$timeline() {
        return new ArrayList<OrderTimeline>();
    }

    

    public Long getId() {
        return this.id;
    }

    public User getUser() {
        return this.user;
    }

    public String getUserPhone() {
        return this.userPhone;
    }

    public OrderStatus getStatus() {
        return this.status;
    }

    public PaymentStatus getPaymentStatus() {
        return this.paymentStatus;
    }

    public BigDecimal getTotalAmount() {
        return this.totalAmount;
    }

    public BigDecimal getDiscount() {
        return this.discount;
    }

    public BigDecimal getTax() {
        return this.tax;
    }

    public String getTrackingNumber() {
        return this.trackingNumber;
    }

    public String getShippingAddress() {
        return this.shippingAddress;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public List<OrderItem> getItems() {
        return this.items;
    }

    public Invoice getInvoice() {
        return this.invoice;
    }

    public String getRazorpayOrderId() {
        return this.razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return this.razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return this.razorpaySignature;
    }

    public PaymentMethod getPaymentMethod() {
        return this.paymentMethod;
    }

    public BigDecimal getShippingCharges() {
        return this.shippingCharges;
    }

    public List<OrderTimeline> getTimeline() {
        return this.timeline;
    }

    public LocalDateTime getDeliveredAt() {
        return this.deliveredAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setShippingCharges(BigDecimal shippingCharges) {
        this.shippingCharges = shippingCharges;
    }

    public void setTimeline(List<OrderTimeline> timeline) {
        this.timeline = timeline;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        Order other = (Order)o;
        if (!other.canEqual(this)) {
            return false;
        }
        Long this$id = this.getId();
        Long other$id = other.getId();
        if (this$id == null ? other$id != null : !(this$id).equals(other$id)) {
            return false;
        }
        User this$user = this.getUser();
        User other$user = other.getUser();
        if (this$user == null ? other$user != null : !this$user.equals(other$user)) {
            return false;
        }
        String this$userPhone = this.getUserPhone();
        String other$userPhone = other.getUserPhone();
        if (this$userPhone == null ? other$userPhone != null : !this$userPhone.equals(other$userPhone)) {
            return false;
        }
        OrderStatus this$status = this.getStatus();
        OrderStatus other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        PaymentStatus this$paymentStatus = this.getPaymentStatus();
        PaymentStatus other$paymentStatus = other.getPaymentStatus();
        if (this$paymentStatus == null ? other$paymentStatus != null : !this$paymentStatus.equals(other$paymentStatus)) {
            return false;
        }
        BigDecimal this$totalAmount = this.getTotalAmount();
        BigDecimal other$totalAmount = other.getTotalAmount();
        if (this$totalAmount == null ? other$totalAmount != null : !(this$totalAmount).equals(other$totalAmount)) {
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
        String this$trackingNumber = this.getTrackingNumber();
        String other$trackingNumber = other.getTrackingNumber();
        if (this$trackingNumber == null ? other$trackingNumber != null : !this$trackingNumber.equals(other$trackingNumber)) {
            return false;
        }
        String this$shippingAddress = this.getShippingAddress();
        String other$shippingAddress = other.getShippingAddress();
        if (this$shippingAddress == null ? other$shippingAddress != null : !this$shippingAddress.equals(other$shippingAddress)) {
            return false;
        }
        LocalDateTime this$createdAt = this.getCreatedAt();
        LocalDateTime other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !(this$createdAt).equals(other$createdAt)) {
            return false;
        }
        LocalDateTime this$updatedAt = this.getUpdatedAt();
        LocalDateTime other$updatedAt = other.getUpdatedAt();
        if (this$updatedAt == null ? other$updatedAt != null : !(this$updatedAt).equals(other$updatedAt)) {
            return false;
        }
        List this$items = this.getItems();
        List other$items = other.getItems();
        if (this$items == null ? other$items != null : !(this$items).equals(other$items)) {
            return false;
        }
        Invoice this$invoice = this.getInvoice();
        Invoice other$invoice = other.getInvoice();
        if (this$invoice == null ? other$invoice != null : !this$invoice.equals(other$invoice)) {
            return false;
        }
        String this$razorpayOrderId = this.getRazorpayOrderId();
        String other$razorpayOrderId = other.getRazorpayOrderId();
        if (this$razorpayOrderId == null ? other$razorpayOrderId != null : !this$razorpayOrderId.equals(other$razorpayOrderId)) {
            return false;
        }
        String this$razorpayPaymentId = this.getRazorpayPaymentId();
        String other$razorpayPaymentId = other.getRazorpayPaymentId();
        if (this$razorpayPaymentId == null ? other$razorpayPaymentId != null : !this$razorpayPaymentId.equals(other$razorpayPaymentId)) {
            return false;
        }
        String this$razorpaySignature = this.getRazorpaySignature();
        String other$razorpaySignature = other.getRazorpaySignature();
        if (this$razorpaySignature == null ? other$razorpaySignature != null : !this$razorpaySignature.equals(other$razorpaySignature)) {
            return false;
        }
        PaymentMethod this$paymentMethod = this.getPaymentMethod();
        PaymentMethod other$paymentMethod = other.getPaymentMethod();
        if (this$paymentMethod == null ? other$paymentMethod != null : !this$paymentMethod.equals(other$paymentMethod)) {
            return false;
        }
        BigDecimal this$shippingCharges = this.getShippingCharges();
        BigDecimal other$shippingCharges = other.getShippingCharges();
        if (this$shippingCharges == null ? other$shippingCharges != null : !(this$shippingCharges).equals(other$shippingCharges)) {
            return false;
        }
        List this$timeline = this.getTimeline();
        List other$timeline = other.getTimeline();
        if (this$timeline == null ? other$timeline != null : !(this$timeline).equals(other$timeline)) {
            return false;
        }
        LocalDateTime this$deliveredAt = this.getDeliveredAt();
        LocalDateTime other$deliveredAt = other.getDeliveredAt();
        return !(this$deliveredAt == null ? other$deliveredAt != null : !(this$deliveredAt).equals(other$deliveredAt));
    }

    protected boolean canEqual(Object other) {
        return other instanceof Order;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        User $user = this.getUser();
        result = result * 59 + ($user == null ? 43 : $user.hashCode());
        String $userPhone = this.getUserPhone();
        result = result * 59 + ($userPhone == null ? 43 : $userPhone.hashCode());
        OrderStatus $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        PaymentStatus $paymentStatus = this.getPaymentStatus();
        result = result * 59 + ($paymentStatus == null ? 43 : $paymentStatus.hashCode());
        BigDecimal $totalAmount = this.getTotalAmount();
        result = result * 59 + ($totalAmount == null ? 43 : ($totalAmount).hashCode());
        BigDecimal $discount = this.getDiscount();
        result = result * 59 + ($discount == null ? 43 : ($discount).hashCode());
        BigDecimal $tax = this.getTax();
        result = result * 59 + ($tax == null ? 43 : ($tax).hashCode());
        String $trackingNumber = this.getTrackingNumber();
        result = result * 59 + ($trackingNumber == null ? 43 : $trackingNumber.hashCode());
        String $shippingAddress = this.getShippingAddress();
        result = result * 59 + ($shippingAddress == null ? 43 : $shippingAddress.hashCode());
        LocalDateTime $createdAt = this.getCreatedAt();
        result = result * 59 + ($createdAt == null ? 43 : ($createdAt).hashCode());
        LocalDateTime $updatedAt = this.getUpdatedAt();
        result = result * 59 + ($updatedAt == null ? 43 : ($updatedAt).hashCode());
        List $items = this.getItems();
        result = result * 59 + ($items == null ? 43 : ($items).hashCode());
        Invoice $invoice = this.getInvoice();
        result = result * 59 + ($invoice == null ? 43 : $invoice.hashCode());
        String $razorpayOrderId = this.getRazorpayOrderId();
        result = result * 59 + ($razorpayOrderId == null ? 43 : $razorpayOrderId.hashCode());
        String $razorpayPaymentId = this.getRazorpayPaymentId();
        result = result * 59 + ($razorpayPaymentId == null ? 43 : $razorpayPaymentId.hashCode());
        String $razorpaySignature = this.getRazorpaySignature();
        result = result * 59 + ($razorpaySignature == null ? 43 : $razorpaySignature.hashCode());
        PaymentMethod $paymentMethod = this.getPaymentMethod();
        result = result * 59 + ($paymentMethod == null ? 43 : $paymentMethod.hashCode());
        BigDecimal $shippingCharges = this.getShippingCharges();
        result = result * 59 + ($shippingCharges == null ? 43 : ($shippingCharges).hashCode());
        List $timeline = this.getTimeline();
        result = result * 59 + ($timeline == null ? 43 : ($timeline).hashCode());
        LocalDateTime $deliveredAt = this.getDeliveredAt();
        result = result * 59 + ($deliveredAt == null ? 43 : ($deliveredAt).hashCode());
        return result;
    }

    public String toString() {
        return "Order(id=" + this.getId() + ", user=" + String.valueOf(this.getUser()) + ", userPhone=" + this.getUserPhone() + ", status=" + String.valueOf(this.getStatus()) + ", paymentStatus=" + String.valueOf(this.getPaymentStatus()) + ", totalAmount=" + String.valueOf(this.getTotalAmount()) + ", discount=" + String.valueOf(this.getDiscount()) + ", tax=" + String.valueOf(this.getTax()) + ", trackingNumber=" + this.getTrackingNumber() + ", shippingAddress=" + this.getShippingAddress() + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", updatedAt=" + String.valueOf(this.getUpdatedAt()) + ", items=" + String.valueOf(this.getItems()) + ", invoice=" + String.valueOf(this.getInvoice()) + ", razorpayOrderId=" + this.getRazorpayOrderId() + ", razorpayPaymentId=" + this.getRazorpayPaymentId() + ", razorpaySignature=" + this.getRazorpaySignature() + ", paymentMethod=" + String.valueOf(this.getPaymentMethod()) + ", shippingCharges=" + String.valueOf(this.getShippingCharges()) + ", timeline=" + String.valueOf(this.getTimeline()) + ", deliveredAt=" + String.valueOf(this.getDeliveredAt()) + ")";
    }

    public Order() {
        this.timeline = Order.$default$timeline();
    }

    public Order(Long id, User user, String userPhone, OrderStatus status, PaymentStatus paymentStatus, BigDecimal totalAmount, BigDecimal discount, BigDecimal tax, String trackingNumber, String shippingAddress, LocalDateTime createdAt, LocalDateTime updatedAt, List<OrderItem> items, Invoice invoice, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature, PaymentMethod paymentMethod, BigDecimal shippingCharges, List<OrderTimeline> timeline, LocalDateTime deliveredAt) {
        this.id = id;
        this.user = user;
        this.userPhone = userPhone;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.totalAmount = totalAmount;
        this.discount = discount;
        this.tax = tax;
        this.trackingNumber = trackingNumber;
        this.shippingAddress = shippingAddress;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.items = items;
        this.invoice = invoice;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpaySignature = razorpaySignature;
        this.paymentMethod = paymentMethod;
        this.shippingCharges = shippingCharges;
        this.timeline = timeline;
        this.deliveredAt = deliveredAt;
    }
}

