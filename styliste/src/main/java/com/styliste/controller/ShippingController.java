package com.styliste.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.styliste.dto.ApiResponse;
import com.styliste.dto.OrderDTO;
import com.styliste.entity.Order;
import com.styliste.entity.OrderStatus;
import com.styliste.repository.OrderRepository;
import com.styliste.service.OrderService;
import com.styliste.service.ShiprocketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    private static final Logger log = LoggerFactory.getLogger(ShippingController.class);

    @Autowired
    private ShiprocketService shiprocketService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Admin Endpoint: Order ko Shiprocket par push karke shipment create karta hai
     */
    @PostMapping("/admin/orders/{orderId}/create-shipment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderDTO>> createShipment(@PathVariable Long orderId) {
        log.info("Admin initiated shipment creation for order: {}", orderId);
        Order updatedOrder = shiprocketService.createShiprocketOrder(orderId);
        OrderDTO dto = orderService.getOrderById(updatedOrder.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Shipment successfully created on Shiprocket", dto));
    }

    /**
     * Admin Endpoint: Shipping label PDF download URL generate karta hai
     */
    @GetMapping("/admin/orders/{orderId}/label")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> getShippingLabel(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getShipmentId() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Shipment has not been created for this order yet. Please click 'Ship via Shiprocket' (🚚) first.", null));
        }

        // If tracking number (AWB) is not yet assigned, automatically assign AWB first
        if (order.getTrackingNumber() == null || order.getTrackingNumber().isBlank()) {
            shiprocketService.assignAwbAndCourier(order, shiprocketService.getAuthToken());
            order = orderRepository.save(order);
        }

        String labelUrl = shiprocketService.generateShippingLabel(order.getShipmentId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Shipping label generated", Map.of("labelUrl", labelUrl)));
    }

    /**
     * Public/Customer Endpoint: Live tracking status laata hai
     */
    @GetMapping("/track/{awbCode}")
    public ResponseEntity<ApiResponse<JsonNode>> trackShipment(@PathVariable String awbCode) {
        JsonNode trackingData = shiprocketService.trackShipment(awbCode);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tracking information fetched", trackingData));
    }

    @Value("${shiprocket.webhook.secret:styliste_shiprocket_secure_2026}")
    private String webhookSecret;

    @Value("${shiprocket.webhook.basic-user:styliste_admin}")
    private String basicUser;

    @Value("${shiprocket.webhook.basic-password:StylisteShiprocket2026!}")
    private String basicPassword;

    /**
     * Webhook Endpoint: Shiprocket se automatic status update leta hai
     * With Security Token Verification to prevent spoofing
     */
    @PostMapping("/webhook")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Map<String, Object>> handleShiprocketWebhook(
            @RequestHeader(value = "x-api-key", required = false) String apiKeyHeader,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody JsonNode payload) {

        log.info("Received Shiprocket Webhook notification: {}", payload);

        // Security check: Strict authentication verification
        boolean valid = false;

        // 1. Verify Authorization Header (Bearer, Basic, or Plain Token)
        if (authHeader != null && !authHeader.isBlank()) {
            String trimmedAuth = authHeader.trim();

            // Case A: Token matches configured secret directly or as "Bearer <token>"
            if (trimmedAuth.equals(webhookSecret)
                    || trimmedAuth.equals("Bearer " + webhookSecret)
                    || trimmedAuth.equalsIgnoreCase("Bearer " + webhookSecret)) {
                valid = true;
            }
            // Case B: Basic Auth "Basic <base64>"
            else if (trimmedAuth.startsWith("Basic ") || trimmedAuth.startsWith("basic ")) {
                try {
                    String base64Credentials = trimmedAuth.substring(6).trim();
                    byte[] decoded = java.util.Base64.getDecoder().decode(base64Credentials);
                    String credentials = new String(decoded, java.nio.charset.StandardCharsets.UTF_8);

                    // Format: "username:password"
                    String[] parts = credentials.split(":", 2);
                    if (parts.length == 2) {
                        String user = parts[0];
                        String pass = parts[1];
                        if (basicUser != null && basicUser.equals(user) && basicPassword != null && basicPassword.equals(pass)) {
                            valid = true;
                        }
                    }
                    // Also accept if the secret itself was passed as the basic credentials
                    if (!valid && credentials.equals(webhookSecret)) {
                        valid = true;
                    }
                } catch (Exception ex) {
                    log.warn("Malformed Basic Auth header in webhook: {}", ex.getMessage());
                }
            }
            // Case C: Plain custom Authorization header value matching webhookSecret
            else if (trimmedAuth.equalsIgnoreCase(webhookSecret)) {
                valid = true;
            }
        }

        // 2. Verify x-api-key Header (Backward Compatibility)
        if (!valid && apiKeyHeader != null && !apiKeyHeader.isBlank()) {
            if (apiKeyHeader.trim().equals(webhookSecret)) {
                valid = true;
            }
        }

        // STRICT ENFORCEMENT: If authentication fails or is missing, REJECT immediately!
        if (!valid) {
            log.warn("Rejected unauthorized Shiprocket webhook attempt! Missing or invalid authentication.");
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Unauthorized: Valid Authorization (Bearer/Basic) or x-api-key is required."
            ));
        }

        try {
            String awb = null;
            if (payload.has("awb")) {
                awb = payload.get("awb").asText().trim();
            } else if (payload.has("awb_code")) {
                awb = payload.get("awb_code").asText().trim();
            }

            Long orderId = null;
            if (payload.has("order_id")) {
                orderId = payload.get("order_id").asLong();
            } else if (payload.has("orderId")) {
                orderId = payload.get("orderId").asLong();
            }

            String status = null;
            if (payload.has("current_status")) {
                status = payload.get("current_status").asText().trim().toUpperCase();
            } else if (payload.has("status")) {
                status = payload.get("status").asText().trim().toUpperCase();
            }

            // Find order by AWB or by order ID
            Optional<Order> orderOpt = Optional.empty();
            if (awb != null && !awb.isBlank()) {
                orderOpt = orderRepository.findByTrackingNumber(awb);
            }
            if (orderOpt.isEmpty() && orderId != null) {
                orderOpt = orderRepository.findById(orderId);
            }

            if (orderOpt.isPresent() && status != null) {
                Order order = orderOpt.get();
                final String finalStatus = status;

                if (finalStatus.contains("DELIVERED") && order.getStatus() != OrderStatus.DELIVERED) {
                    order.addTimelineStep(OrderStatus.DELIVERED, "Shipment delivered successfully by courier.");
                    log.info("Order ID {} updated to DELIVERED via webhook", order.getId());
                } else if (finalStatus.contains("OUT FOR DELIVERY") && order.getStatus() != OrderStatus.OUT_FOR_DELIVERY) {
                    order.addTimelineStep(OrderStatus.OUT_FOR_DELIVERY, "Package is out for delivery.");
                    log.info("Order ID {} updated to OUT_FOR_DELIVERY via webhook", order.getId());
                } else if (finalStatus.contains("IN TRANSIT") && order.getStatus() != OrderStatus.SHIPPED) {
                    order.addTimelineStep(OrderStatus.SHIPPED, "Package in transit.");
                    log.info("Order ID {} updated to SHIPPED via webhook", order.getId());
                } else {
                    log.info("Webhook received status '{}' for order ID {}, updating timeline note", finalStatus, order.getId());
                }
                orderRepository.save(order);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Order #" + order.getId() + " status updated to " + order.getStatus(),
                        "orderId", order.getId(),
                        "status", order.getStatus().name()
                ));
            } else {
                log.warn("Webhook: No matching order found for AWB '{}' or OrderId '{}'", awb, orderId);
                return ResponseEntity.ok(Map.of(
                        "success", false,
                        "message", "Webhook received but no matching order found for provided AWB/OrderId"
                ));
            }
        } catch (Exception e) {
            log.error("Error processing Shiprocket webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
