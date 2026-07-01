/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.razorpay.RazorpayException
 *  com.styliste.controller.OrderController
 *  com.styliste.dto.CancelOrderRequest
 *  com.styliste.dto.CheckoutShippingRequest
 *  com.styliste.dto.CreateOrderRequest
 *  com.styliste.dto.OrderDTO
 *  com.styliste.dto.OrderStatisticsDTO
 *  com.styliste.dto.OrderTimelineDTO
 *  com.styliste.dto.PaymentVerificationRequest
 *  com.styliste.dto.ReturnCreateRequest
 *  com.styliste.dto.ReturnResponseDTO
 *  com.styliste.dto.ReturnTimelineDTO
 *  com.styliste.dto.ShippingChargeResponse
 *  com.styliste.dto.UpdateOrderStatusRequest
 *  com.styliste.entity.Order
 *  com.styliste.entity.OrderStatus
 *  com.styliste.entity.PaymentMethod
 *  com.styliste.entity.PaymentStatus
 *  com.styliste.entity.ReturnStatus
 *  com.styliste.entity.User
 *  com.styliste.entity.UserRole
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.OrderRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.OrderService
 *  com.styliste.service.RazorpayService
 *  jakarta.validation.Valid
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.http.HttpStatus
 *  org.springframework.http.HttpStatusCode
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.security.core.Authentication
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.ModelAttribute
 *  org.springframework.web.bind.annotation.PatchMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestHeader
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.razorpay.RazorpayException;
import com.styliste.dto.CancelOrderRequest;
import com.styliste.dto.CheckoutShippingRequest;
import com.styliste.dto.CreateOrderRequest;
import com.styliste.dto.OrderDTO;
import com.styliste.dto.OrderStatisticsDTO;
import com.styliste.dto.OrderTimelineDTO;
import com.styliste.dto.PaymentVerificationRequest;
import com.styliste.dto.ReturnCreateRequest;
import com.styliste.dto.ReturnResponseDTO;
import com.styliste.dto.ReturnTimelineDTO;
import com.styliste.dto.ShippingChargeResponse;
import com.styliste.dto.UpdateOrderStatusRequest;
import com.styliste.entity.Order;
import com.styliste.entity.OrderStatus;
import com.styliste.entity.PaymentMethod;
import com.styliste.entity.PaymentStatus;
import com.styliste.entity.ReturnStatus;
import com.styliste.entity.User;
import com.styliste.entity.UserRole;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.OrderRepository;
import com.styliste.repository.UserRepository;
import com.styliste.service.OrderService;
import com.styliste.service.RazorpayService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/orders"})
@CrossOrigin(origins={"*"})
public class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    @Autowired
    private OrderService orderService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private RazorpayService razorpayService;

    @PostMapping
    @PreAuthorize(value="hasRole('CUSTOMER')")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody CreateOrderRequest request, Authentication authentication) {
        Long userId = this.extractUserIdFromAuth(authentication);
        return ResponseEntity.status((HttpStatusCode)HttpStatus.CREATED).body(this.orderService.createOrder(userId, request));
    }

    @PostMapping(value={"/calculate-shipping"})
    public ResponseEntity<ShippingChargeResponse> calculateShipping(@RequestBody CheckoutShippingRequest request) {
        BigDecimal shipping = this.orderService.calculateShippingByAddress(request.getAddress(), request.getSubtotal());
        return ResponseEntity.ok(new ShippingChargeResponse(shipping));
    }

    @GetMapping(value={"/{id}"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id, Authentication authentication) {
        Long userId = this.extractUserIdFromAuth(authentication);
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == UserRole.ADMIN) {
            return ResponseEntity.ok(this.orderService.getOrderById(id));
        }
        return ResponseEntity.ok(this.orderService.getOrderForUser(id, userId));
    }

    @PatchMapping(value={"/{id}/status"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(this.orderService.updateOrderStatus(id, request));
    }

    @GetMapping(value={"/{orderId}/timeline"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderTimelineDTO>> getTimeline(@PathVariable Long orderId) {
        return ResponseEntity.ok(this.orderService.getOrderTimeline(orderId));
    }

    @PostMapping(value={"/{orderId}/pay"})
    @PreAuthorize(value="hasRole('CUSTOMER')")
    public ResponseEntity<?> initiatePayment(@PathVariable Long orderId, Authentication authentication) throws RazorpayException {
        Long userId = this.extractUserIdFromAuth(authentication);
        Order order = (Order)this.orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Not authorized to pay for this order");
        }
        if (order.getPaymentMethod() == PaymentMethod.COD) {
            throw new BadRequestException("Payment not required for Cash on Delivery orders.");
        }
        if (order.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("Payment already processed");
        }
        String razorpayOrderId = this.razorpayService.createRazorpayOrder(order);
        return ResponseEntity.ok(Map.of("razorpayOrderId", razorpayOrderId, "amount", order.getTotalAmount(), "currency", "INR"));
    }

    @PostMapping(value={"/{orderId}/verify-payment"})
    @PreAuthorize(value="hasRole('CUSTOMER')")
    public ResponseEntity<?> verifyPayment(@PathVariable Long orderId, @Valid @RequestBody PaymentVerificationRequest request) {
        this.razorpayService.verifyPayment(orderId, request);
        return ResponseEntity.ok(Map.of("message", "Payment verified successfully"));
    }

    @PostMapping(value={"/webhook/razorpay"})
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader(value="X-Razorpay-Signature") String signature) {
        this.razorpayService.handleWebhook(payload, signature);
        return ResponseEntity.ok("OK");
    }

    @GetMapping(value={"/my-orders"})
    @PreAuthorize(value="hasRole('CUSTOMER')")
    public ResponseEntity<Page<OrderDTO>> getMyOrders(@RequestParam(required=false) Integer page, @RequestParam(required=false) Integer pageSize, Authentication authentication) {
        Long userId = this.extractUserIdFromAuth(authentication);
        return ResponseEntity.ok(this.orderService.getUserOrders(userId, page, pageSize));
    }

    @GetMapping(value={"/user/{userId}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<Page<OrderDTO>> getUserOrders(@PathVariable Long userId, @RequestParam(required=false) Integer page, @RequestParam(required=false) Integer pageSize) {
        return ResponseEntity.ok(this.orderService.getUserOrders(userId, page, pageSize));
    }

    @GetMapping
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<Page<OrderDTO>> getAllOrders(@RequestParam(required=false) Integer page, @RequestParam(required=false) Integer pageSize) {
        return ResponseEntity.ok(this.orderService.getAllOrders(page, pageSize));
    }

    @GetMapping(value={"/returns/{id}/timeline"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<List<ReturnTimelineDTO>> getReturnTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(this.orderService.getReturnTimeline(id));
    }

    @GetMapping(value={"/status/{status}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable String status) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf((String)status.toUpperCase());
            return ResponseEntity.ok(this.orderService.getOrdersByStatus(orderStatus));
        }
        catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(value={"/track/{trackingNumber}"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> trackOrder(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(this.orderService.getOrderByTrackingNumber(trackingNumber));
    }

    @GetMapping(value={"/statistics"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<OrderStatisticsDTO> getOrderStatistics() {
        return ResponseEntity.ok(this.orderService.getOrderStatistics());
    }

    @PostMapping(value={"/{orderId}/cancel"})
    @PreAuthorize(value="hasRole('CUSTOMER')")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, @RequestBody(required=false) CancelOrderRequest request, Authentication auth) {
        Long userId = this.extractUserIdFromAuth(auth);
        this.orderService.cancelOrder(userId, orderId, request);
        return ResponseEntity.ok(Map.of("message", "Cancellation processed"));
    }

    @PostMapping(value={"/{orderId}/admin-cancel"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<?> adminCancelOrder(@PathVariable Long orderId, @RequestBody(required=false) CancelOrderRequest request) {
        this.orderService.cancelOrder(null, orderId, request);
        return ResponseEntity.ok(Map.of("message", "Order cancelled by admin"));
    }

    @PostMapping(value={"/returns"}, consumes={"multipart/form-data"})
    @PreAuthorize(value="hasRole('CUSTOMER')")
    public ResponseEntity<ReturnResponseDTO> createReturn(@ModelAttribute ReturnCreateRequest req, Authentication auth) {
        Long userId = this.extractUserIdFromAuth(auth);
        ReturnResponseDTO dto = this.orderService.createReturnRequest(userId, req);
        return ResponseEntity.status((HttpStatusCode)HttpStatus.CREATED).body(dto);
    }

    @GetMapping(value={"/my-returns"})
    @PreAuthorize(value="hasRole('CUSTOMER')")
    public ResponseEntity<List<ReturnResponseDTO>> getMyReturns(Authentication auth) {
        Long userId = this.extractUserIdFromAuth(auth);
        return ResponseEntity.ok(this.orderService.listUserReturns(userId));
    }

    @GetMapping(value={"/returns"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<List<ReturnResponseDTO>> listReturns(@RequestParam(required=false) String status) {
        List list = this.orderService.listReturns(status == null ? null : ReturnStatus.valueOf((String)status));
        return ResponseEntity.ok(list);
    }

    @PatchMapping(value={"/returns/{id}/approve"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<?> approveReturn(@PathVariable Long id, @RequestBody Map<String, String> body) {
        this.orderService.approveReturn(id, body.get("adminComment"));
        return ResponseEntity.ok(Map.of("message", "Return approved"));
    }

    @PatchMapping(value={"/returns/{id}/reject"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<?> rejectReturn(@PathVariable Long id, @RequestBody Map<String, String> body) {
        this.orderService.rejectReturn(id, body.get("adminComment"));
        return ResponseEntity.ok(Map.of("message", "Return rejected"));
    }

    @PatchMapping(value={"/returns/{id}/picked-up"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<?> markPickedUp(@PathVariable Long id) {
        this.orderService.markReturnPickedUp(id);
        return ResponseEntity.ok(Map.of("message", "Return marked picked-up and refund processed"));
    }

    private Long extractUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        User user = (User)this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        return user.getId();
    }
}

