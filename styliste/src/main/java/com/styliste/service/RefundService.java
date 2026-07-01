/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.razorpay.RazorpayClient
 *  com.razorpay.Refund
 *  com.styliste.dto.RefundResult
 *  com.styliste.entity.Order
 *  com.styliste.entity.OrderItem
 *  com.styliste.entity.Refund
 *  com.styliste.repository.RefundRepository
 *  com.styliste.service.RefundService
 *  org.json.JSONObject
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.stereotype.Service
 */
package com.styliste.service;

import com.razorpay.RazorpayClient;
import com.styliste.dto.RefundResult;
import com.styliste.entity.Order;
import com.styliste.entity.OrderItem;
import com.styliste.entity.Refund;
import com.styliste.repository.RefundRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RefundService {
    private static final Logger log = LoggerFactory.getLogger(RefundService.class);
    @Autowired
    private RazorpayClient razorpayClient;
    @Autowired
    private RefundRepository refundRepository;

    public RefundResult initiateRefund(Order order, BigDecimal amount) {
        try {
            String paymentId = order.getRazorpayPaymentId();
            if (paymentId == null) {
                return new RefundResult(false, null, "Payment id not available on order");
            }
            int amountPaise = amount.multiply(BigDecimal.valueOf(100L)).intValueExact();
            JSONObject options = new JSONObject();
            options.put("amount", amountPaise);
            com.razorpay.Refund refund = this.razorpayClient.payments.refund(paymentId, options);
            Refund record = Refund.builder().orderId(order.getId()).orderItemId(null).amount(amount).paymentProvider("RAZORPAY").providerRefundId((String)refund.get("id")).providerPaymentId(paymentId).createdAt(LocalDateTime.now()).build();
            this.refundRepository.save(record);
            log.info("Refund successful for order {}", order.getId());
            return new RefundResult(true, (String)refund.get("id"), "Refund created");
        }
        catch (Exception e) {
            log.error("Refund failed for order {}", order.getId(), e);
            return new RefundResult(false, null, e.getMessage());
        }
    }

    public void recordCodRefund(Order order, OrderItem item, BigDecimal amount) {
        Refund record = Refund.builder().orderId(order.getId()).orderItemId(item != null ? item.getId() : null).amount(amount).paymentProvider("COD_BANK_TRANSFER").providerRefundId(null).providerPaymentId(null).createdAt(LocalDateTime.now()).build();
        this.refundRepository.save(record);
        log.info("COD refund of Rs.{} recorded for order {}", amount, order.getId());
    }
}

