/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.razorpay.RazorpayClient
 *  com.razorpay.RazorpayException
 *  com.styliste.config.RazorpayConfig
 *  org.springframework.beans.factory.annotation.Value
 *  org.springframework.context.annotation.Bean
 *  org.springframework.context.annotation.Configuration
 */
package com.styliste.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {
    @Value(value="${razorpay.key.id}")
    private String keyId;
    @Value(value="${razorpay.key.secret}")
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {
        return new RazorpayClient(this.keyId, this.keySecret);
    }
}

