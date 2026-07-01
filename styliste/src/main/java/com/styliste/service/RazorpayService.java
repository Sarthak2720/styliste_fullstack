/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.razorpay.Order
 *  com.razorpay.RazorpayClient
 *  com.razorpay.RazorpayException
 *  com.styliste.dto.PaymentVerificationRequest
 *  com.styliste.entity.Order
 *  com.styliste.entity.OrderStatus
 *  com.styliste.entity.PaymentStatus
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.OrderRepository
 *  com.styliste.service.InvoiceService
 *  com.styliste.service.RazorpayService
 *  org.apache.commons.codec.digest.HmacUtils
 *  org.json.JSONObject
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.beans.factory.annotation.Value
 *  org.springframework.stereotype.Service
 */
package com.styliste.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.styliste.dto.PaymentVerificationRequest;
import com.styliste.entity.OrderStatus;
import com.styliste.entity.PaymentStatus;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.OrderRepository;
import com.styliste.service.InvoiceService;
import java.math.BigDecimal;
import org.apache.commons.codec.digest.HmacUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {
    private static final Logger log = LoggerFactory.getLogger(RazorpayService.class);
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private RazorpayClient razorpayClient;
    @Autowired
    private InvoiceService invoiceService;
    @Value(value="${razorpay.key.secret}")
    private String razorpaySecret;

    public String createRazorpayOrder(com.styliste.entity.Order order) throws RazorpayException {
        JSONObject options = new JSONObject();
        options.put("amount", order.getTotalAmount().multiply(new BigDecimal(100)));
        options.put("currency", "INR");
        options.put("receipt", ("order_rcpt_" + order.getId()));
        Order razorpayOrder = this.razorpayClient.orders.create(options);
        String razorpayOrderId = (String)razorpayOrder.get("id");
        order.setRazorpayOrderId(razorpayOrderId);
        this.orderRepository.save(order);
        return razorpayOrderId;
    }

    public void verifyPayment(Long orderId, PaymentVerificationRequest request) {
        com.styliste.entity.Order order = (com.styliste.entity.Order)this.orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getRazorpayOrderId().equals(request.getRazorpayOrderId())) {
            throw new BadRequestException("Razorpay order ID mismatch");
        }
        String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        String expectedSignature = HmacUtils.hmacSha256Hex((String)this.razorpaySecret, (String)payload);
        if (!expectedSignature.equals(request.getRazorpaySignature())) {
            order.setPaymentStatus(PaymentStatus.FAILED);
            this.orderRepository.save(order);
            throw new BadRequestException("Payment verification failed");
        }
        order.setPaymentStatus(PaymentStatus.COMPLETED);
        order.setStatus(OrderStatus.PROCESSING);
        order.setRazorpayPaymentId(request.getRazorpayPaymentId());
        order.setRazorpaySignature(request.getRazorpaySignature());
        order.addTimelineStep(OrderStatus.PROCESSING, "Payment successful. Order is now being processed.");
        this.invoiceService.markInvoicePaid(order);
        this.orderRepository.save(order);
    }

    public void handleWebhook(String payload, String signature) {
        String expectedSignature = HmacUtils.hmacSha256Hex((String)this.razorpaySecret, (String)payload);
        if (!expectedSignature.equals(signature)) {
            throw new BadRequestException("Invalid webhook signature");
        }
        JSONObject event = new JSONObject(payload);
        String eventType = event.getString("event");
        if ("payment.captured".equals(eventType)) {
            JSONObject payment = event.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
            String razorpayOrderId = payment.getString("order_id");
            String paymentId = payment.getString("id");
            com.styliste.entity.Order order = (com.styliste.entity.Order)this.orderRepository.findByRazorpayOrderId(razorpayOrderId).orElseThrow();
            if (order.getPaymentStatus() != PaymentStatus.COMPLETED) {
                order.setPaymentStatus(PaymentStatus.COMPLETED);
                order.setRazorpayPaymentId(paymentId);
                order.setStatus(OrderStatus.PROCESSING);
                order.addTimelineStep(OrderStatus.PROCESSING, "Payment captured via Razorpay (webhook)");
                this.invoiceService.markInvoicePaid(order);
                this.orderRepository.save(order);
            }
        }
    }
}

