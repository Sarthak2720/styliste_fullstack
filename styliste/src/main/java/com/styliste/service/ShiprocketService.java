package com.styliste.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.styliste.dto.shiprocket.ShiprocketAwbResponse;
import com.styliste.dto.shiprocket.ShiprocketLabelResponse;
import com.styliste.dto.shiprocket.ShiprocketOrderRequest;
import com.styliste.dto.shiprocket.ShiprocketOrderResponse;
import com.styliste.entity.Order;
import com.styliste.entity.OrderItem;
import com.styliste.entity.OrderStatus;
import com.styliste.entity.PaymentMethod;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.net.http.HttpClient;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ShiprocketService {

    private static final Logger log = LoggerFactory.getLogger(ShiprocketService.class);

    static {
        // Ensure robust IPv4 routing for external API calls
        System.setProperty("java.net.preferIPv4Stack", "true");
    }

    private final RestTemplate restTemplate;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public ShiprocketService() {
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(15))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();

        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(httpClient);
        factory.setReadTimeout(Duration.ofSeconds(30));
        this.restTemplate = new RestTemplate(factory);
    }

    @Value("${shiprocket.api.url:https://apiv2.shiprocket.in/v1/external}")
    private String apiUrl;

    @Value("${shiprocket.email}")
    private String email;

    @Value("${shiprocket.password}")
    private String password;

    @Value("${shiprocket.pickup-location:work}")
    private String defaultPickupLocation;

    // Token caching
    private volatile String cachedToken;
    private volatile LocalDateTime tokenExpiry;

    /**
     * Standard HTTP Headers helper with browser-like user agent
     */
    private HttpHeaders createHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
        if (token != null && !token.isBlank()) {
            headers.setBearerAuth(token);
        }
        return headers;
    }

    /**
     * 1. Shiprocket Authentication Token fetch ya cached token return karta hai with retry logic.
     */
    public synchronized String getAuthToken() {
        if (cachedToken != null && tokenExpiry != null && LocalDateTime.now().isBefore(tokenExpiry)) {
            return cachedToken;
        }

        log.info("Fetching fresh Shiprocket authentication token...");
        int maxRetries = 3;
        Exception lastException = null;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                HttpHeaders headers = createHeaders(null);
                Map<String, String> body = Map.of(
                        "email", email,
                        "password", password
                );

                HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
                ResponseEntity<JsonNode> response = restTemplate.postForEntity(apiUrl + "/auth/login", entity, JsonNode.class);

                JsonNode responseBody = response.getBody();
                if (responseBody != null && responseBody.has("token")) {
                    this.cachedToken = responseBody.get("token").asText();
                    this.tokenExpiry = LocalDateTime.now().plusDays(9);
                    log.info("Shiprocket token successfully retrieved and cached.");
                    return this.cachedToken;
                } else {
                    throw new BadRequestException("Failed to get Shiprocket token. Response: " + responseBody);
                }
            } catch (Exception e) {
                lastException = e;
                log.warn("Shiprocket auth attempt {} failed: {}", attempt, e.getMessage());
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(1000L * attempt);
                    } catch (InterruptedException ignored) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }

        log.error("All {} attempts to authenticate with Shiprocket failed: {}", maxRetries, lastException != null ? lastException.getMessage() : "Unknown");
        throw new BadRequestException("Shiprocket authentication failed after " + maxRetries + " attempts: " + (lastException != null ? lastException.getMessage() : "Unknown error"));
    }

    public synchronized void invalidateToken() {
        this.cachedToken = null;
        this.tokenExpiry = null;
    }

    /**
     * 2. Styliste Order se Shiprocket mein Shipment Order create karta hai.
     */
    @Transactional
    public Order createShiprocketOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (order.getShipmentId() != null) {
            if (order.getTrackingNumber() == null || order.getTrackingNumber().isBlank()) {
                log.info("Order ID {} has shipment ID {} but missing AWB. Assigning AWB now...", orderId, order.getShipmentId());
                assignAwbAndCourier(order, getAuthToken());
                return orderRepository.save(order);
            }
            log.info("Order ID {} already has a Shiprocket shipment ID: {} and AWB: {}", orderId, order.getShipmentId(), order.getTrackingNumber());
            return order;
        }

        // Prepare order items for Shiprocket
        List<ShiprocketOrderRequest.ShiprocketOrderItem> items = new ArrayList<>();
        if (order.getItems() != null) {
            for (OrderItem oi : order.getItems()) {
                String sku = oi.getProduct() != null ? "SKU-" + oi.getProduct().getId() : "SKU-ITEM";
                items.add(ShiprocketOrderRequest.ShiprocketOrderItem.builder()
                        .name(oi.getProduct() != null ? oi.getProduct().getName() : "Item")
                        .sku(sku)
                        .units(oi.getQuantity())
                        .sellingPrice(oi.getUnitPrice())
                        .build());
            }
        }

        // Parse customer address details
        String customerName = order.getUser() != null ? order.getUser().getName() : "Customer";
        String customerEmail = order.getUser() != null ? order.getUser().getEmail() : "customer@example.com";
        String customerPhone = order.getUserPhone() != null ? order.getUserPhone() : (order.getUser() != null ? order.getUser().getPhone() : "9999999999");
        String address = order.getShippingAddress() != null ? order.getShippingAddress() : "Address not provided";

        String city = "Thane";
        String state = "Maharashtra";
        String pincode = "400604";

        // Extract 6-digit pincode if present in shippingAddress
        if (address != null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("\\b(\\d{6})\\b").matcher(address);
            if (m.find()) {
                pincode = m.group(1);
            }
        }

        // Build Payload
        ShiprocketOrderRequest request = ShiprocketOrderRequest.builder()
                .orderId("STY-" + order.getId())
                .orderDate(order.getCreatedAt() != null
                        ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                        : LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .pickupLocation(defaultPickupLocation)
                .billingCustomerName(customerName != null && !customerName.isBlank() ? customerName : "Customer")
                .billingLastName("")
                .billingAddress(address.length() > 5 ? address : "Lokmanya Nagar, Thane")
                .billingCity(city)
                .billingPincode(pincode)
                .billingState(state)
                .billingCountry("India")
                .billingEmail(customerEmail)
                .billingPhone(customerPhone != null && customerPhone.length() >= 10 ? customerPhone.replaceAll("[^0-9]", "").substring(Math.max(0, customerPhone.replaceAll("[^0-9]", "").length() - 10)) : "9999999999")
                .shippingIsBilling(true)
                .orderItems(items)
                .paymentMethod(order.getPaymentMethod() == PaymentMethod.COD ? "COD" : "Prepaid")
                .subTotal(order.getTotalAmount())
                .length(15.0)
                .breadth(10.0)
                .height(5.0)
                .weight(0.5) // Default 0.5 kg for apparel
                .build();

        int maxRetries = 2;
        Exception lastException = null;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                String token = getAuthToken();
                log.info("Sending create order request to Shiprocket for order ID {}: {}", order.getId(), objectMapper.writeValueAsString(request));

                HttpHeaders headers = createHeaders(token);
                HttpEntity<ShiprocketOrderRequest> entity = new HttpEntity<>(request, headers);
                ResponseEntity<JsonNode> responseEntity = restTemplate.postForEntity(apiUrl + "/orders/create/adhoc", entity, JsonNode.class);

                JsonNode response = responseEntity.getBody();
                log.info("Shiprocket create order raw response: {}", response);

                if (response != null && response.has("shipment_id") && !response.get("shipment_id").isNull()) {
                    Long shiprocketOrderId = response.has("order_id") && !response.get("order_id").isNull() ? response.get("order_id").asLong() : null;
                    Long shipmentId = response.get("shipment_id").asLong();

                    order.setShiprocketOrderId(shiprocketOrderId);
                    order.setShipmentId(shipmentId);
                    log.info("Shiprocket order created! Shipment ID: {}, Order ID: {}", shipmentId, shiprocketOrderId);

                    // Auto-generate AWB / Assign Courier
                    assignAwbAndCourier(order, token);

                    return orderRepository.save(order);
                } else {
                    throw new BadRequestException("Shiprocket order creation failed: " + response);
                }
            } catch (HttpStatusCodeException httpEx) {
                lastException = httpEx;
                if (httpEx.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                    log.warn("Shiprocket token expired/unauthorized. Invalidating cache and retrying...");
                    invalidateToken();
                } else {
                    log.error("Shiprocket API returned error status {}: {}", httpEx.getStatusCode(), httpEx.getResponseBodyAsString());
                    throw new BadRequestException("Shiprocket order error: " + httpEx.getResponseBodyAsString());
                }
            } catch (Exception e) {
                lastException = e;
                log.warn("Shiprocket create order attempt {} failed: {}", attempt, e.getMessage());
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(1000L);
                    } catch (InterruptedException ignored) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }

        log.error("Failed to create Shiprocket order after retries: {}", lastException != null ? lastException.getMessage() : "Unknown");
        throw new BadRequestException("Shiprocket create order error: " + (lastException != null ? lastException.getMessage() : "Unknown"));
    }

    /**
     * Helper: Courier serviceability check karke recommended courier ID nikalta hai
     */
    public Integer getRecommendedCourierId(Long shipmentId, String pickupPincode, String deliveryPincode, boolean isCod, double weight, String token) {
        try {
            HttpHeaders headers = createHeaders(token);
            HttpEntity<?> entity = new HttpEntity<>(headers);

            String url = apiUrl + "/courier/serviceability/?pickup_postcode=" + (pickupPincode != null && !pickupPincode.isBlank() ? pickupPincode : "400604")
                    + "&delivery_postcode=" + (deliveryPincode != null && !deliveryPincode.isBlank() ? deliveryPincode : "400604")
                    + "&weight=" + (weight > 0 ? weight : 0.5)
                    + "&cod=" + (isCod ? 1 : 0);

            log.info("Checking Shiprocket courier serviceability: {}", url);
            ResponseEntity<JsonNode> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode.class);
            JsonNode body = responseEntity.getBody();

            if (body != null && body.has("data") && !body.get("data").isNull()) {
                JsonNode data = body.get("data");
                if (data.has("recommended_courier_company_id") && !data.get("recommended_courier_company_id").isNull() && data.get("recommended_courier_company_id").asInt() > 0) {
                    int recId = data.get("recommended_courier_company_id").asInt();
                    log.info("Shiprocket recommended courier company ID: {}", recId);
                    return recId;
                }
                if (data.has("available_courier_companies") && data.get("available_courier_companies").isArray() && data.get("available_courier_companies").size() > 0) {
                    int firstId = data.get("available_courier_companies").get(0).get("courier_company_id").asInt();
                    log.info("Shiprocket first available courier company ID: {}", firstId);
                    return firstId;
                }
            }
        } catch (Exception e) {
            log.warn("Could not fetch recommended courier from serviceability API: {}", e.getMessage());
        }
        return null;
    }

    /**
     * 3. Shipment ke liye Courier & AWB code generate karta hai.
     */
    public void assignAwbAndCourier(Order order, String token) {
        if (order.getShipmentId() == null) {
            throw new BadRequestException("Shipment ID not found on order.");
        }

        // Extract delivery pincode from order
        String pincode = "400604";
        String address = order.getShippingAddress();
        if (address != null) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("\\b(\\d{6})\\b").matcher(address);
            if (m.find()) {
                pincode = m.group(1);
            }
        }

        Integer courierId = getRecommendedCourierId(order.getShipmentId(), "400604", pincode, order.getPaymentMethod() == PaymentMethod.COD, 0.5, token);

        try {
            HttpHeaders headers = createHeaders(token);
            Map<String, Object> body = new HashMap<>();
            body.put("shipment_id", order.getShipmentId());
            if (courierId != null) {
                body.put("courier_id", courierId);
            }

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            log.info("Assigning AWB for shipment ID: {} with courier_id: {}", order.getShipmentId(), courierId);

            ResponseEntity<JsonNode> responseEntity = restTemplate.postForEntity(apiUrl + "/courier/assign/awb", entity, JsonNode.class);
            JsonNode response = responseEntity.getBody();
            log.info("Shiprocket AWB assign raw response: {}", response);

            if (response != null && response.has("response") && !response.get("response").isNull()) {
                JsonNode respObj = response.get("response");
                if (respObj.has("data") && !respObj.get("data").isNull()) {
                    JsonNode dataObj = respObj.get("data");
                    String awbCode = dataObj.has("awb_code") && !dataObj.get("awb_code").isNull() ? dataObj.get("awb_code").asText() : null;
                    String courier = dataObj.has("courier_name") && !dataObj.get("courier_name").isNull() ? dataObj.get("courier_name").asText() : "Courier";

                    if (awbCode != null && !awbCode.isBlank()) {
                        order.setTrackingNumber(awbCode);
                        order.setCourierName(courier);
                        order.addTimelineStep(OrderStatus.SHIPPED, "Shipped via " + courier + ". Tracking AWB: " + awbCode);
                        log.info("AWB Assigned: {} with courier {}", awbCode, courier);
                        return;
                    }

                    if (dataObj.has("awb_assign_error") && !dataObj.get("awb_assign_error").isNull() && !dataObj.get("awb_assign_error").asText().isBlank()) {
                        String awbErr = dataObj.get("awb_assign_error").asText();
                        log.error("Shiprocket AWB assign error: {}", awbErr);
                        throw new BadRequestException(awbErr);
                    }
                }
            }

            if (response != null && response.has("awb_code") && !response.get("awb_code").isNull() && !response.get("awb_code").asText().isBlank()) {
                String awbCode = response.get("awb_code").asText();
                String courier = response.has("courier_name") && !response.get("courier_name").isNull() ? response.get("courier_name").asText() : "Courier";
                order.setTrackingNumber(awbCode);
                order.setCourierName(courier);
                order.addTimelineStep(OrderStatus.SHIPPED, "Shipped via " + courier + ". Tracking AWB: " + awbCode);
                log.info("AWB Assigned: {} with courier {}", awbCode, courier);
                return;
            }

            if (response != null && response.has("message") && !response.get("message").isNull() && !response.get("message").asText().isBlank()) {
                String msg = response.get("message").asText();
                log.error("Shiprocket AWB assign returned message: {}", msg);
                throw new BadRequestException(msg);
            }
        } catch (BadRequestException bre) {
            throw bre;
        } catch (Exception e) {
            log.warn("Could not assign AWB: {}", e.getMessage());
            throw new BadRequestException("Could not assign AWB from Shiprocket: " + e.getMessage());
        }
    }

    /**
     * 4. Shipping Label PDF URL generate karta hai.
     */
    public String generateShippingLabel(Long shipmentId) {
        String token = getAuthToken();
        HttpHeaders headers = createHeaders(token);

        Map<String, Object> body = Map.of(
                "shipment_id", List.of(shipmentId)
        );

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<JsonNode> responseEntity = restTemplate.postForEntity(apiUrl + "/courier/generate/label", entity, JsonNode.class);
            JsonNode response = responseEntity.getBody();
            log.info("Shiprocket generate label raw response: {}", response);

            if (response != null && response.has("label_url") && !response.get("label_url").isNull() && !response.get("label_url").asText().isBlank()) {
                return response.get("label_url").asText();
            }

            String errorMsg = "Failed to generate shipping label from Shiprocket.";
            if (response != null && response.has("response") && !response.get("response").isNull()) {
                errorMsg = response.get("response").asText();
            } else if (response != null && response.has("message") && !response.get("message").isNull()) {
                errorMsg = response.get("message").asText();
            }
            throw new BadRequestException(errorMsg);
        } catch (HttpStatusCodeException httpEx) {
            log.error("Shiprocket API returned error status {}: {}", httpEx.getStatusCode(), httpEx.getResponseBodyAsString());
            throw new BadRequestException("Shiprocket label error: " + httpEx.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Error generating label: {}", e.getMessage(), e);
            throw new BadRequestException("Shiprocket label error: " + e.getMessage());
        }
    }

    /**
     * 5. Live Tracking Information lata hai AWB code se.
     */
    public JsonNode trackShipment(String awbCode) {
        String token = getAuthToken();
        HttpHeaders headers = createHeaders(token);

        try {
            HttpEntity<?> entity = new HttpEntity<>(headers);
            ResponseEntity<JsonNode> responseEntity = restTemplate.exchange(
                    apiUrl + "/courier/track/awb/" + awbCode,
                    HttpMethod.GET,
                    entity,
                    JsonNode.class
            );
            return responseEntity.getBody();
        } catch (Exception e) {
            log.error("Error tracking shipment for AWB {}: {}", awbCode, e.getMessage(), e);
            throw new BadRequestException("Could not fetch tracking data: " + e.getMessage());
        }
    }
}
