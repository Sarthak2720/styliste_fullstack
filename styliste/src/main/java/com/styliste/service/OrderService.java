/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AddressDTO
 *  com.styliste.dto.CancelOrderRequest
 *  com.styliste.dto.CartItemDTO
 *  com.styliste.dto.CreateOrderRequest
 *  com.styliste.dto.OrderDTO
 *  com.styliste.dto.OrderItemDTO
 *  com.styliste.dto.OrderStatisticsDTO
 *  com.styliste.dto.OrderTimelineDTO
 *  com.styliste.dto.RefundResult
 *  com.styliste.dto.ReturnCreateRequest
 *  com.styliste.dto.ReturnResponseDTO
 *  com.styliste.dto.ReturnTimelineDTO
 *  com.styliste.dto.UpdateOrderStatusRequest
 *  com.styliste.entity.Order
 *  com.styliste.entity.OrderItem
 *  com.styliste.entity.OrderItemStatus
 *  com.styliste.entity.OrderStatus
 *  com.styliste.entity.OrderTimeline
 *  com.styliste.entity.PaymentMethod
 *  com.styliste.entity.PaymentStatus
 *  com.styliste.entity.Product
 *  com.styliste.entity.ReturnRequest
 *  com.styliste.entity.ReturnStatus
 *  com.styliste.entity.ReturnTimeline
 *  com.styliste.entity.User
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.OrderItemRepository
 *  com.styliste.repository.OrderRepository
 *  com.styliste.repository.OrderTimelineRepository
 *  com.styliste.repository.ProductRepository
 *  com.styliste.repository.ReturnRequestRepository
 *  com.styliste.repository.ReturnTimelineRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.CartService
 *  com.styliste.service.FileStorageService
 *  com.styliste.service.InvoiceService
 *  com.styliste.service.OrderService
 *  com.styliste.service.OrderService$1
 *  com.styliste.service.RefundService
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.PageRequest
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.domain.Sort
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 *  org.springframework.web.multipart.MultipartFile
 */
package com.styliste.service;

import com.styliste.dto.AddressDTO;
import com.styliste.dto.CancelOrderRequest;
import com.styliste.dto.CartItemDTO;
import com.styliste.dto.CreateOrderRequest;
import com.styliste.dto.OrderDTO;
import com.styliste.dto.OrderItemDTO;
import com.styliste.dto.OrderStatisticsDTO;
import com.styliste.dto.OrderTimelineDTO;
import com.styliste.dto.RefundResult;
import com.styliste.dto.ReturnCreateRequest;
import com.styliste.dto.ReturnResponseDTO;
import com.styliste.dto.ReturnTimelineDTO;
import com.styliste.dto.UpdateOrderStatusRequest;
import com.styliste.entity.Order;
import com.styliste.entity.OrderItem;
import com.styliste.entity.OrderItemStatus;
import com.styliste.entity.OrderStatus;
import com.styliste.entity.OrderTimeline;
import com.styliste.entity.PaymentMethod;
import com.styliste.entity.PaymentStatus;
import com.styliste.entity.Product;
import com.styliste.entity.ReturnRequest;
import com.styliste.entity.ReturnStatus;
import com.styliste.entity.ReturnTimeline;
import com.styliste.entity.User;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.OrderItemRepository;
import com.styliste.repository.OrderRepository;
import com.styliste.repository.OrderTimelineRepository;
import com.styliste.repository.ProductRepository;
import com.styliste.repository.ReturnRequestRepository;
import com.styliste.repository.ReturnTimelineRepository;
import com.styliste.repository.UserRepository;
import com.styliste.service.CartService;
import com.styliste.service.FileStorageService;
import com.styliste.service.InvoiceService;
import com.styliste.service.OrderService;
import com.styliste.service.RefundService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReturnTimelineRepository returnTimelineRepository;
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private RefundService refundService;
    @Autowired
    private ReturnRequestRepository returnRequestRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private CartService cartService;
    @Autowired
    private OrderTimelineRepository timelineRepository;
    private static final Map<OrderStatus, Set<OrderStatus>> ORDER_STATE_MACHINE;
    private static final int RETURN_WINDOW_DAYS = 15;

    public OrderDTO createOrder(Long userId, CreateOrderRequest request) {
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        AddressDTO addr = request.getShippingAddress();
        String addressSnapshot = this.formatAddress(addr);
        OrderStatus initialStatus = request.getPaymentMethod() == PaymentMethod.COD ? OrderStatus.PROCESSING : OrderStatus.PENDING;
        Order order = Order.builder().user(user).status(initialStatus).paymentStatus(PaymentStatus.PENDING).paymentMethod(request.getPaymentMethod()).shippingAddress(addressSnapshot).userPhone(addr.getContactPhone()).totalAmount(BigDecimal.ZERO).build();
        BigDecimal itemsSubtotal = BigDecimal.ZERO;
        ArrayList<OrderItem> orderItems = new ArrayList<OrderItem>();
        for (CartItemDTO cartItem : request.getItems()) {
            Product product = (Product)this.productRepository.findById(cartItem.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found: " + cartItem.getProductId()));
            this.validateStock(product, cartItem.getQuantity().intValue());
            BigDecimal price = product.getSalePrice() != null ? product.getSalePrice() : product.getPrice();
            BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(cartItem.getQuantity().intValue()));
            orderItems.add(OrderItem.builder().order(order).product(product).quantity(cartItem.getQuantity()).unitPrice(price).totalPrice(itemTotal).selectedSize(cartItem.getSelectedSize()).selectedColor(cartItem.getSelectedColor()).itemStatus(OrderItemStatus.ACTIVE).returnedQuantity(0).build());
            itemsSubtotal = itemsSubtotal.add(itemTotal);
            product.setStock(Integer.valueOf(product.getStock() - cartItem.getQuantity()));
            this.productRepository.save(product);
        }
        BigDecimal expectedShipping = this.calculateShippingByAddress(addr, itemsSubtotal);
        if (request.getShippingCharges() == null || request.getShippingCharges().compareTo(expectedShipping) != 0) {
            throw new BadRequestException("Shipping charge mismatch. Please refresh checkout.");
        }
        order.setItems(orderItems);
        order.setShippingCharges(expectedShipping);
        order.setTotalAmount(itemsSubtotal.add(expectedShipping));
        String timelineMsg = request.getPaymentMethod() == PaymentMethod.COD ? "Order placed via Cash on Delivery. We are processing your items." : "Order placed. Awaiting payment confirmation.";
        order.addTimelineStep(initialStatus, timelineMsg);
        Order savedOrder = (Order)this.orderRepository.save(order);
        this.invoiceService.createInvoiceForOrder(savedOrder);
        try {
            this.cartService.clearCart(userId);
        }
        catch (Exception e) {
            log.warn("Could not clear cart for user {}: {}", userId, e.getMessage());
        }
        return this.mapToDTO(savedOrder);
    }

    private String formatAddress(AddressDTO addr) {
        return String.format("%s, %s, %s, %s - %s, %s", addr.getAddressLine1(), addr.getAddressLine2() != null ? addr.getAddressLine2() : "", addr.getCity(), addr.getState(), addr.getPostalCode(), addr.getCountry());
    }

    private void validateStock(Product product, int requestedQuantity) {
        if (product.getStock() <= 0) {
            throw new BadRequestException("Item '" + product.getName() + "' is sold out.");
        }
        if (product.getStock() < requestedQuantity) {
            throw new BadRequestException("Only " + product.getStock() + " units left for " + product.getName());
        }
    }

    public OrderDTO getOrderById(Long id) {
        log.debug("Fetching order with ID: {}", id);
        Order order = (Order)this.orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        return this.mapToDTO(order);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = (Order)this.orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        try {
            String formattedStatus = request.getStatus().trim().toUpperCase();
            OrderStatus newStatus = OrderStatus.valueOf((String)formattedStatus);
            OrderStatus currentStatus = order.getStatus();
            Set allowed = ORDER_STATE_MACHINE.getOrDefault(currentStatus, EnumSet.noneOf(OrderStatus.class));
            if (!allowed.contains(newStatus)) {
                throw new BadRequestException("Cannot transition from " + String.valueOf(currentStatus) + " to " + String.valueOf(newStatus) + ". Allowed transitions: " + String.valueOf(allowed));
            }
            if (request.getTrackingNumber() != null) {
                order.setTrackingNumber(request.getTrackingNumber());
            }
            String message = request.getTimelineMessage() != null ? request.getTimelineMessage() : this.getDefaultMessage(newStatus);
            order.addTimelineStep(newStatus, message);
            if (newStatus == OrderStatus.DELIVERED && order.getPaymentMethod() == PaymentMethod.COD && order.getPaymentStatus() != PaymentStatus.COMPLETED) {
                order.setPaymentStatus(PaymentStatus.COMPLETED);
                this.invoiceService.markInvoicePaid(order);
            }
        }
        catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid status: " + request.getStatus());
        }
        return this.mapToDTO((Order)this.orderRepository.save(order));
    }

    public List<OrderTimelineDTO> getOrderTimeline(Long orderId) {
        if (!this.orderRepository.existsById(orderId)) {
            throw new ResourceNotFoundException("Order not found with ID: " + orderId);
        }
        List<com.styliste.entity.OrderTimeline> timeline = this.timelineRepository.findByOrderIdOrderByTimestampAsc(orderId);
        return timeline.stream().map(arg_0 -> this.mapToTimelineDTO(arg_0)).collect(Collectors.toList());
    }

    private OrderTimelineDTO mapToTimelineDTO(OrderTimeline entity) {
        return OrderTimelineDTO.builder().status(entity.getStatus().name()).message(entity.getMessage()).timestamp(entity.getTimestamp()).build();
    }

    private String getDefaultMessage(OrderStatus status) {
        return switch (status) {
            case PENDING -> "Order placed successfully.";
            case PROCESSING -> "Your order is under proceeding from seller side by the seller.";
            case SHIPPED -> "Item has been dispatched.";
            case OUT_FOR_DELIVERY -> "Our delivery partner is on the way to your location!";
            case DELIVERED -> "Package delivered successfully.";
            case CANCELLED -> "Order was cancelled.";
            case RETURNED -> "Order got returned to the seller";
            default -> "Order status updated to " + String.valueOf(status);
        };
    }

    public void updatePaymentStatus(Long id, String paymentStatus) {
        log.info("Updating payment status for order ID: {}", id);
        Order order = (Order)this.orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        try {
            PaymentStatus status = PaymentStatus.valueOf((String)paymentStatus.toUpperCase());
            order.setPaymentStatus(status);
            this.orderRepository.save(order);
        }
        catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid payment status: " + paymentStatus);
        }
    }

    public Page<OrderDTO> getUserOrders(Long userId, Integer page, Integer pageSize) {
        log.debug("Fetching orders for user: {}", userId);
        int pageNum = page != null ? page : 0;
        int size = pageSize != null ? pageSize : 10;
        PageRequest pageable = PageRequest.of((int)pageNum, (int)size, (Sort)Sort.by((String[])new String[]{"createdAt"}).descending());
        return this.orderRepository.findByUserId(userId, (Pageable)pageable).map(arg_0 -> this.mapToDTO(arg_0));
    }

    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        log.debug("Fetching orders by status: {}", status);
        return this.orderRepository.findByStatus(status).stream().map(arg_0 -> this.mapToDTO(arg_0)).collect(Collectors.toList());
    }

    public Page<OrderDTO> getAllOrders(Integer page, Integer pageSize) {
        log.debug("Fetching all orders");
        int pageNum = page != null ? page : 0;
        int size = pageSize != null ? pageSize : 10;
        PageRequest pageable = PageRequest.of((int)pageNum, (int)size, (Sort)Sort.by((String[])new String[]{"createdAt"}).descending());
        return this.orderRepository.findAll((Pageable)pageable).map(arg_0 -> this.mapToDTO(arg_0));
    }

    public BigDecimal calculateShippingByAddress(AddressDTO address, BigDecimal subtotal) {
        if ("Maharashtra".equalsIgnoreCase(address.getState())) {
            return new BigDecimal("60.00");
        }
        return new BigDecimal("80.00");
    }

    public OrderDTO getOrderByTrackingNumber(String trackingNumber) {
        log.debug("Fetching order by tracking number: {}", trackingNumber);
        Order order = (Order)this.orderRepository.findByTrackingNumber(trackingNumber).orElseThrow(() -> new ResourceNotFoundException("Order not found with tracking number: " + trackingNumber));
        return this.mapToDTO(order);
    }

    public OrderStatisticsDTO getOrderStatistics() {
        log.debug("Calculating order statistics");
        return OrderStatisticsDTO.builder().totalOrders(Long.valueOf(this.orderRepository.count())).pendingOrders(Long.valueOf(this.orderRepository.countByStatus(OrderStatus.PENDING))).processingOrders(Long.valueOf(this.orderRepository.countByStatus(OrderStatus.PROCESSING))).shippedOrders(Long.valueOf(this.orderRepository.countByStatus(OrderStatus.SHIPPED))).outForDeliveryOrders(Long.valueOf(this.orderRepository.countByStatus(OrderStatus.OUT_FOR_DELIVERY))).deliveredOrders(Long.valueOf(this.orderRepository.countByStatus(OrderStatus.DELIVERED))).cancelledOrders(Long.valueOf(this.orderRepository.countByStatus(OrderStatus.CANCELLED))).returnedOrders(Long.valueOf(this.orderRepository.countByStatus(OrderStatus.RETURNED))).build();
    }

    private OrderDTO mapToDTO(Order order) {
        List items = order.getItems().stream().map(item -> {
            Product product = item.getProduct();
            List productImages = product.getImages();
            String firstImageUrl = productImages != null && !productImages.isEmpty() ? (String)productImages.get(0) : null;
            return OrderItemDTO.builder().id(item.getId()).productId(product.getId()).productName(product.getName()).productImage(firstImageUrl).quantity(item.getQuantity()).unitPrice(item.getUnitPrice()).totalPrice(item.getTotalPrice()).selectedSize(item.getSelectedSize()).selectedColor(item.getSelectedColor()).itemStatus(item.getItemStatus() != null ? item.getItemStatus().name() : "ACTIVE").returnedQuantity(Integer.valueOf(item.getReturnedQuantity() != null ? item.getReturnedQuantity() : 0)).build();
        }).collect(Collectors.toList());
        List timelineDTOs = null;
        if (order.getTimeline() != null) {
            timelineDTOs = order.getTimeline().stream().map(arg_0 -> this.mapToTimelineDTO(arg_0)).collect(Collectors.toList());
        }
        return OrderDTO.builder().id(order.getId()).userId(order.getUser().getId()).userName(order.getUser().getName()).userEmail(order.getUser().getEmail()).userPhone(order.getUserPhone()).status(order.getStatus().name()).paymentStatus(order.getPaymentStatus().name()).paymentMethod(order.getPaymentMethod().name()).shippingCharges(order.getShippingCharges()).totalAmount(order.getTotalAmount()).transactionId(order.getRazorpayPaymentId()).discount(order.getDiscount()).tax(order.getTax()).trackingNumber(order.getTrackingNumber()).shippingAddress(order.getShippingAddress()).createdAt(order.getCreatedAt()).updatedAt(order.getUpdatedAt()).items(items).timeline(timelineDTOs).build();
    }

    @Transactional
    public void cancelOrder(Long userId, Long orderId, CancelOrderRequest request) {
        String reason;
        Order order = (Order)this.orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (userId != null && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("User not authorized to cancel this order");
        }
        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.RETURNED) {
            throw new BadRequestException("Order is already " + order.getStatus().name().toLowerCase());
        }
        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.OUT_FOR_DELIVERY || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Order cannot be cancelled after it is shipped/delivered");
        }
        List itemIds = request != null ? request.getOrderItemIds() : null;
        String string = reason = request != null ? request.getReason() : "";
        if (itemIds == null || itemIds.isEmpty()) {
            this.performFullCancel(order, reason);
        } else {
            this.performPartialCancel(order, orderId, itemIds, reason);
        }
    }

    /*
     * Enabled aggressive block sorting
     */
    private void performFullCancel(Order order, String reason) {
        BigDecimal refundAmount = BigDecimal.ZERO;
        for (OrderItem item : order.getItems()) {
            if (item.getItemStatus() != null && item.getItemStatus() != OrderItemStatus.ACTIVE) continue;
            item.setItemStatus(OrderItemStatus.CANCELLED);
            Product p = item.getProduct();
            p.setStock(Integer.valueOf(p.getStock() + item.getQuantity()));
            this.productRepository.save(p);
            refundAmount = refundAmount.add(item.getTotalPrice());
        }
        BigDecimal shippingRefund = order.getShippingCharges() != null ? order.getShippingCharges() : BigDecimal.ZERO;
        refundAmount = refundAmount.add(shippingRefund);
        order.setTotalAmount(BigDecimal.ZERO);
        order.setShippingCharges(BigDecimal.ZERO);
        order.setStatus(OrderStatus.CANCELLED);
        OrderTimeline cancelTimeline = OrderTimeline.builder().order(order).status(OrderStatus.CANCELLED).message("Order cancelled by customer. Reason: " + reason).build();
        order.getTimeline().add(cancelTimeline);
        this.invoiceService.voidInvoiceForOrder(order);
        if (order.getPaymentMethod() != PaymentMethod.COD && order.getPaymentStatus() == PaymentStatus.COMPLETED) {
            RefundResult result = this.refundService.initiateRefund(order, refundAmount);
            if (!result.isSuccess()) {
                log.error("Refund failed for order {}: {}", order.getId(), result.getMessage());
                throw new BadRequestException("Cancellation refund failed: " + result.getMessage());
            }
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        } else if (order.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.FAILED);
        }
        this.orderRepository.save(order);
    }

    private void performPartialCancel(Order order, Long orderId, List<Long> itemIds, String reason) {
        BigDecimal refundAmount = BigDecimal.ZERO;
        for (Long itemId : itemIds) {
            OrderItem item = (OrderItem)this.orderItemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("OrderItem not found: " + itemId));
            if (!item.getOrder().getId().equals(orderId)) {
                throw new BadRequestException("Item does not belong to order");
            }
            if (item.getItemStatus() != OrderItemStatus.ACTIVE) {
                throw new BadRequestException("Item already cancelled/returned: " + itemId);
            }
            item.setItemStatus(OrderItemStatus.CANCELLED);
            Product p = item.getProduct();
            p.setStock(Integer.valueOf(p.getStock() + item.getQuantity()));
            this.productRepository.save(p);
            refundAmount = refundAmount.add(item.getTotalPrice());
            OrderTimeline itemTimeline = OrderTimeline.builder().order(order).status(order.getStatus()).message("Item cancelled: " + item.getProduct().getName() + ". Reason: " + reason).build();
            order.getTimeline().add(itemTimeline);
            this.orderItemRepository.save(item);
        }
        order.setTotalAmount(order.getTotalAmount().subtract(refundAmount));
        boolean allCancelledOrReturned = order.getItems().stream().allMatch(i -> i.getItemStatus() == OrderItemStatus.CANCELLED || i.getItemStatus() == OrderItemStatus.RETURNED);
        if (allCancelledOrReturned) {
            order.setStatus(OrderStatus.CANCELLED);
            BigDecimal shippingRefund = order.getShippingCharges() != null ? order.getShippingCharges() : BigDecimal.ZERO;
            refundAmount = refundAmount.add(shippingRefund);
            order.setShippingCharges(BigDecimal.ZERO);
            order.setTotalAmount(BigDecimal.ZERO);
            this.invoiceService.voidInvoiceForOrder(order);
            OrderTimeline allCancelTimeline = OrderTimeline.builder().order(order).status(OrderStatus.CANCELLED).message("All items cancelled. Order marked as cancelled.").build();
            order.getTimeline().add(allCancelTimeline);
        } else {
            this.invoiceService.regenerateInvoiceAfterPartialChange(order);
        }
        this.orderRepository.save(order);
        if (order.getPaymentMethod() != PaymentMethod.COD && order.getPaymentStatus() == PaymentStatus.COMPLETED) {
            RefundResult result = this.refundService.initiateRefund(order, refundAmount);
            if (!result.isSuccess()) {
                log.error("Partial cancel refund failed for order {}: {}", order.getId(), result.getMessage());
                throw new BadRequestException("Refund failed: " + result.getMessage());
            }
            if (allCancelledOrReturned) {
                order.setPaymentStatus(PaymentStatus.REFUNDED);
                this.orderRepository.save(order);
            }
        }
    }

    @Transactional
    public ReturnResponseDTO createReturnRequest(Long userId, ReturnCreateRequest req) {
        long daysSinceDelivery;
        if (req.getOrderItemId() == null) {
            throw new BadRequestException("Order item id required");
        }
        if (req.getQuantity() == null || req.getQuantity() <= 0) {
            throw new BadRequestException("Invalid return quantity");
        }
        OrderItem item = (OrderItem)this.orderItemRepository.findById(req.getOrderItemId()).orElseThrow(() -> new ResourceNotFoundException("Order item not found"));
        Order order = item.getOrder();
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Not your order item");
        }
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new BadRequestException("Returns allowed only after delivery");
        }
        if (order.getDeliveredAt() != null && (daysSinceDelivery = ChronoUnit.DAYS.between(order.getDeliveredAt(), LocalDateTime.now())) > 15L) {
            throw new BadRequestException("Return window of 15 days has expired");
        }
        if (item.getItemStatus() == OrderItemStatus.RETURN_REQUESTED) {
            throw new BadRequestException("A return request is already pending for this item");
        }
        if (item.getItemStatus() == OrderItemStatus.CANCELLED) {
            throw new BadRequestException("Cannot return a cancelled item");
        }
        int remainingQty = item.getQuantity() - item.getReturnedQuantity();
        if (req.getQuantity() > remainingQty) {
            throw new BadRequestException("Return quantity exceeds available quantity (" + remainingQty + ")");
        }
        ArrayList<String> savedImages = new ArrayList<String>();
        if (req.getProofImages() != null) {
            for (MultipartFile file : req.getProofImages()) {
                if (file.isEmpty()) continue;
                savedImages.add(this.fileStorageService.saveFile(file, "image"));
            }
        }
        ReturnRequest rr = ReturnRequest.builder().orderItem(item).user(order.getUser()).status(ReturnStatus.REQUESTED).reason(req.getReason()).requestedQuantity(req.getQuantity().intValue()).refundAmount(this.calculateRefundForReturn(item, req.getQuantity().intValue())).proofImageUrls(savedImages).build();
        this.returnRequestRepository.save(rr);
        item.setItemStatus(OrderItemStatus.RETURN_REQUESTED);
        this.orderItemRepository.save(item);
        this.addReturnTimeline(rr, ReturnStatus.REQUESTED, "Return request submitted by customer.");
        return this.mapReturnToDTO(rr);
    }

    private ReturnResponseDTO mapReturnToDTO(ReturnRequest rr) {
        OrderItem item = rr.getOrderItem();
        Product product = item.getProduct();
        List images = product.getImages();
        return ReturnResponseDTO.builder().id(rr.getId()).orderId(item.getOrder().getId()).orderItemId(item.getId()).productName(product.getName()).productImage(images != null && !images.isEmpty() ? (String)images.get(0) : null).requestedQuantity(Integer.valueOf(rr.getRequestedQuantity())).status(rr.getStatus().name()).refundAmount(rr.getRefundAmount()).reason(rr.getReason()).adminComment(rr.getAdminComment()).proofImageUrls(rr.getProofImageUrls()).createdAt(rr.getCreatedAt()).build();
    }

    @Transactional
    public void approveReturn(Long returnId, String comment) {
        ReturnRequest rr = (ReturnRequest)this.returnRequestRepository.findById(returnId).orElseThrow(() -> new ResourceNotFoundException("Return not found"));
        if (rr.getStatus() != ReturnStatus.REQUESTED) {
            throw new BadRequestException("Return not in requested state");
        }
        rr.setStatus(ReturnStatus.APPROVED);
        rr.setAdminComment(comment);
        this.returnRequestRepository.save(rr);
        this.addReturnTimeline(rr, ReturnStatus.APPROVED, "Return approved by admin.");
    }

    @Transactional
    public void rejectReturn(Long returnId, String comment) {
        ReturnRequest rr = (ReturnRequest)this.returnRequestRepository.findById(returnId).orElseThrow(() -> new ResourceNotFoundException("Return not found"));
        rr.setStatus(ReturnStatus.REJECTED);
        rr.setAdminComment(comment);
        this.returnRequestRepository.save(rr);
        OrderItem item = rr.getOrderItem();
        item.setItemStatus(OrderItemStatus.ACTIVE);
        this.orderItemRepository.save(item);
        this.addReturnTimeline(rr, ReturnStatus.REJECTED, "Return rejected by admin.");
    }

    @Transactional
    public void markReturnPickedUp(Long returnId) {
        ReturnRequest rr = (ReturnRequest)this.returnRequestRepository.findById(returnId).orElseThrow(() -> new ResourceNotFoundException("Return not found"));
        if (rr.getStatus() != ReturnStatus.APPROVED) {
            throw new BadRequestException("Return not approved");
        }
        rr.setStatus(ReturnStatus.PICKED_UP);
        rr.setPickedUpAt(LocalDateTime.now());
        this.returnRequestRepository.save(rr);
        this.addReturnTimeline(rr, ReturnStatus.PICKED_UP, "Item picked up from customer.");
        OrderItem item = rr.getOrderItem();
        Order order = item.getOrder();
        Product p = item.getProduct();
        p.setStock(Integer.valueOf(p.getStock() + rr.getRequestedQuantity()));
        this.productRepository.save(p);
        item.setReturnedQuantity(Integer.valueOf(item.getReturnedQuantity() + rr.getRequestedQuantity()));
        if (item.getReturnedQuantity() >= item.getQuantity()) {
            item.setItemStatus(OrderItemStatus.RETURNED);
        } else {
            item.setItemStatus(OrderItemStatus.ACTIVE);
        }
        this.orderItemRepository.save(item);
        rr.setStatus(ReturnStatus.REFUND_INITIATED);
        this.returnRequestRepository.save(rr);
        this.addReturnTimeline(rr, ReturnStatus.REFUND_INITIATED, "Refund initiated for returned item.");
        if (order.getPaymentMethod() != PaymentMethod.COD && order.getPaymentStatus() == PaymentStatus.COMPLETED) {
            RefundResult result = this.refundService.initiateRefund(order, rr.getRefundAmount());
            if (!result.isSuccess()) {
                throw new BadRequestException("Refund failed: " + result.getMessage());
            }
            rr.setStatus(ReturnStatus.REFUNDED);
            rr.setRefundedAt(LocalDateTime.now());
            this.addReturnTimeline(rr, ReturnStatus.REFUNDED, "Refund of Rs." + String.valueOf(rr.getRefundAmount()) + " processed via Razorpay.");
        } else if (order.getPaymentMethod() == PaymentMethod.COD) {
            rr.setStatus(ReturnStatus.REFUNDED);
            rr.setRefundedAt(LocalDateTime.now());
            this.addReturnTimeline(rr, ReturnStatus.REFUNDED, "COD order \u2014 refund of Rs." + String.valueOf(rr.getRefundAmount()) + " to be processed via bank transfer.");
            this.refundService.recordCodRefund(order, item, rr.getRefundAmount());
        }
        this.returnRequestRepository.save(rr);
        order.setTotalAmount(order.getTotalAmount().subtract(rr.getRefundAmount()));
        boolean allReturnedOrCancelled = order.getItems().stream().allMatch(i -> i.getItemStatus() == OrderItemStatus.RETURNED || i.getItemStatus() == OrderItemStatus.CANCELLED);
        if (allReturnedOrCancelled) {
            order.setStatus(OrderStatus.RETURNED);
            order.setTotalAmount(BigDecimal.ZERO);
            order.setShippingCharges(BigDecimal.ZERO);
            OrderTimeline returnedTimeline = OrderTimeline.builder().order(order).status(OrderStatus.RETURNED).message("All items returned. Order marked as returned.").build();
            order.getTimeline().add(returnedTimeline);
            this.invoiceService.voidInvoiceForOrder(order);
        } else {
            OrderTimeline refundTimeline = OrderTimeline.builder().order(order).status(order.getStatus()).message("Refund completed for item: " + item.getProduct().getName()).build();
            order.getTimeline().add(refundTimeline);
            this.invoiceService.regenerateInvoiceAfterPartialChange(order);
        }
        this.orderRepository.save(order);
    }

    public List<ReturnTimelineDTO> getReturnTimeline(Long returnId) {
        return this.returnTimelineRepository.findByReturnRequestIdOrderByTimestampAsc(returnId).stream().map(rt -> ReturnTimelineDTO.builder().status(rt.getStatus().name()).message(rt.getMessage()).timestamp(rt.getTimestamp()).build()).toList();
    }

    private void addReturnTimeline(ReturnRequest rr, ReturnStatus status, String message) {
        ReturnTimeline timeline = new ReturnTimeline();
        timeline.setReturnRequest(rr);
        timeline.setStatus(status);
        timeline.setMessage(message);
        this.returnTimelineRepository.save(timeline);
    }

    private BigDecimal calculateRefundForReturn(OrderItem item, int quantityToReturn) {
        int remainingQty = item.getQuantity() - (item.getReturnedQuantity() != null ? item.getReturnedQuantity() : 0);
        if (quantityToReturn <= 0 || quantityToReturn > remainingQty) {
            throw new BadRequestException("Invalid return quantity. Returnable: " + remainingQty);
        }
        return item.getUnitPrice().multiply(BigDecimal.valueOf(quantityToReturn));
    }

    public List<ReturnResponseDTO> listReturns(ReturnStatus status) {
        List<com.styliste.entity.ReturnRequest> requests = status == null ? this.returnRequestRepository.findAll() : this.returnRequestRepository.findByStatus(status);
        return requests.stream().map(arg_0 -> this.mapReturnToDTO(arg_0)).collect(Collectors.toList());
    }

    public List<ReturnResponseDTO> listUserReturns(Long userId) {
        return this.returnRequestRepository.findByUserId(userId).stream().map(arg_0 -> this.mapReturnToDTO(arg_0)).collect(Collectors.toList());
    }

    public OrderDTO getOrderForUser(Long orderId, Long userId) {
        Order order = (Order)this.orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to view this order");
        }
        return this.mapToDTO(order);
    }

    static {
        EnumMap<OrderStatus, EnumSet<OrderStatus>> map = new EnumMap<OrderStatus, EnumSet<OrderStatus>>(OrderStatus.class);
        map.put(OrderStatus.PENDING, EnumSet.of(OrderStatus.PROCESSING, OrderStatus.CANCELLED));
        map.put(OrderStatus.PROCESSING, EnumSet.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED));
        map.put(OrderStatus.SHIPPED, EnumSet.of(OrderStatus.OUT_FOR_DELIVERY));
        map.put(OrderStatus.OUT_FOR_DELIVERY, EnumSet.of(OrderStatus.DELIVERED));
        map.put(OrderStatus.DELIVERED, EnumSet.of(OrderStatus.RETURNED));
        map.put(OrderStatus.CANCELLED, EnumSet.noneOf(OrderStatus.class));
        map.put(OrderStatus.RETURNED, EnumSet.noneOf(OrderStatus.class));
        ORDER_STATE_MACHINE = Collections.unmodifiableMap(map);
    }
}

