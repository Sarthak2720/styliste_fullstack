/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.OrderDTO
 *  com.styliste.dto.OrderDTO$OrderDTOBuilder
 *  com.styliste.dto.OrderItemDTO
 *  com.styliste.dto.OrderTimelineDTO
 */
package com.styliste.dto;

import com.styliste.dto.OrderDTO;
import com.styliste.dto.OrderItemDTO;
import com.styliste.dto.OrderTimelineDTO;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@lombok.Builder
@lombok.extern.jackson.Jacksonized
public class OrderDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private String status;
    private String paymentStatus;
    private BigDecimal totalAmount;
    private BigDecimal discount;
    private BigDecimal tax;
    private String trackingNumber;
    private String shippingAddress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemDTO> items;
    private String paymentMethod;
    private BigDecimal shippingCharges;
    private String transactionId;
    private List<OrderTimelineDTO> timeline;

    

    public Long getId() {
        return this.id;
    }

    public Long getUserId() {
        return this.userId;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public String getUserPhone() {
        return this.userPhone;
    }

    public String getStatus() {
        return this.status;
    }

    public String getPaymentStatus() {
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

    public List<OrderItemDTO> getItems() {
        return this.items;
    }

    public String getPaymentMethod() {
        return this.paymentMethod;
    }

    public BigDecimal getShippingCharges() {
        return this.shippingCharges;
    }

    public String getTransactionId() {
        return this.transactionId;
    }

    public List<OrderTimelineDTO> getTimeline() {
        return this.timeline;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setPaymentStatus(String paymentStatus) {
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

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setShippingCharges(BigDecimal shippingCharges) {
        this.shippingCharges = shippingCharges;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public void setTimeline(List<OrderTimelineDTO> timeline) {
        this.timeline = timeline;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof OrderDTO)) {
            return false;
        }
        OrderDTO other = (OrderDTO)o;
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
        String this$userName = this.getUserName();
        String other$userName = other.getUserName();
        if (this$userName == null ? other$userName != null : !this$userName.equals(other$userName)) {
            return false;
        }
        String this$userEmail = this.getUserEmail();
        String other$userEmail = other.getUserEmail();
        if (this$userEmail == null ? other$userEmail != null : !this$userEmail.equals(other$userEmail)) {
            return false;
        }
        String this$userPhone = this.getUserPhone();
        String other$userPhone = other.getUserPhone();
        if (this$userPhone == null ? other$userPhone != null : !this$userPhone.equals(other$userPhone)) {
            return false;
        }
        String this$status = this.getStatus();
        String other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) {
            return false;
        }
        String this$paymentStatus = this.getPaymentStatus();
        String other$paymentStatus = other.getPaymentStatus();
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
        String this$paymentMethod = this.getPaymentMethod();
        String other$paymentMethod = other.getPaymentMethod();
        if (this$paymentMethod == null ? other$paymentMethod != null : !this$paymentMethod.equals(other$paymentMethod)) {
            return false;
        }
        BigDecimal this$shippingCharges = this.getShippingCharges();
        BigDecimal other$shippingCharges = other.getShippingCharges();
        if (this$shippingCharges == null ? other$shippingCharges != null : !(this$shippingCharges).equals(other$shippingCharges)) {
            return false;
        }
        String this$transactionId = this.getTransactionId();
        String other$transactionId = other.getTransactionId();
        if (this$transactionId == null ? other$transactionId != null : !this$transactionId.equals(other$transactionId)) {
            return false;
        }
        List this$timeline = this.getTimeline();
        List other$timeline = other.getTimeline();
        return !(this$timeline == null ? other$timeline != null : !(this$timeline).equals(other$timeline));
    }

    protected boolean canEqual(Object other) {
        return other instanceof OrderDTO;
    }

    public int hashCode() {
        int PRIME = 59;
        int result = 1;
        Long $id = this.getId();
        result = result * 59 + ($id == null ? 43 : ($id).hashCode());
        Long $userId = this.getUserId();
        result = result * 59 + ($userId == null ? 43 : ($userId).hashCode());
        String $userName = this.getUserName();
        result = result * 59 + ($userName == null ? 43 : $userName.hashCode());
        String $userEmail = this.getUserEmail();
        result = result * 59 + ($userEmail == null ? 43 : $userEmail.hashCode());
        String $userPhone = this.getUserPhone();
        result = result * 59 + ($userPhone == null ? 43 : $userPhone.hashCode());
        String $status = this.getStatus();
        result = result * 59 + ($status == null ? 43 : $status.hashCode());
        String $paymentStatus = this.getPaymentStatus();
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
        String $paymentMethod = this.getPaymentMethod();
        result = result * 59 + ($paymentMethod == null ? 43 : $paymentMethod.hashCode());
        BigDecimal $shippingCharges = this.getShippingCharges();
        result = result * 59 + ($shippingCharges == null ? 43 : ($shippingCharges).hashCode());
        String $transactionId = this.getTransactionId();
        result = result * 59 + ($transactionId == null ? 43 : $transactionId.hashCode());
        List $timeline = this.getTimeline();
        result = result * 59 + ($timeline == null ? 43 : ($timeline).hashCode());
        return result;
    }

    public String toString() {
        return "OrderDTO(id=" + this.getId() + ", userId=" + this.getUserId() + ", userName=" + this.getUserName() + ", userEmail=" + this.getUserEmail() + ", userPhone=" + this.getUserPhone() + ", status=" + this.getStatus() + ", paymentStatus=" + this.getPaymentStatus() + ", totalAmount=" + String.valueOf(this.getTotalAmount()) + ", discount=" + String.valueOf(this.getDiscount()) + ", tax=" + String.valueOf(this.getTax()) + ", trackingNumber=" + this.getTrackingNumber() + ", shippingAddress=" + this.getShippingAddress() + ", createdAt=" + String.valueOf(this.getCreatedAt()) + ", updatedAt=" + String.valueOf(this.getUpdatedAt()) + ", items=" + String.valueOf(this.getItems()) + ", paymentMethod=" + this.getPaymentMethod() + ", shippingCharges=" + String.valueOf(this.getShippingCharges()) + ", transactionId=" + this.getTransactionId() + ", timeline=" + String.valueOf(this.getTimeline()) + ")";
    }

    public OrderDTO() {
    }

    public OrderDTO(Long id, Long userId, String userName, String userEmail, String userPhone, String status, String paymentStatus, BigDecimal totalAmount, BigDecimal discount, BigDecimal tax, String trackingNumber, String shippingAddress, LocalDateTime createdAt, LocalDateTime updatedAt, List<OrderItemDTO> items, String paymentMethod, BigDecimal shippingCharges, String transactionId, List<OrderTimelineDTO> timeline) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
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
        this.paymentMethod = paymentMethod;
        this.shippingCharges = shippingCharges;
        this.transactionId = transactionId;
        this.timeline = timeline;
    }
}

