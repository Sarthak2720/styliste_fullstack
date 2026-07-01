/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.InvoiceController
 *  com.styliste.entity.Invoice
 *  com.styliste.entity.User
 *  com.styliste.entity.UserRole
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.InvoiceRepository
 *  com.styliste.repository.UserRepository
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.http.MediaType
 *  org.springframework.http.ResponseEntity
 *  org.springframework.http.ResponseEntity$BodyBuilder
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.security.core.Authentication
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.styliste.entity.Invoice;
import com.styliste.entity.User;
import com.styliste.entity.UserRole;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.InvoiceRepository;
import com.styliste.repository.UserRepository;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/invoices"})
public class InvoiceController {
    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping(value={"/order/{orderId}"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long orderId, Authentication authentication) {
        Invoice invoice = (Invoice)this.invoiceRepository.findByOrderId(orderId).orElseThrow(() -> new ResourceNotFoundException("Invoice not found for order: " + orderId));
        String email = authentication.getName();
        User user = (User)this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() != UserRole.ADMIN && !invoice.getOrder().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to download this invoice");
        }
        if (invoice.getPdfContent() == null || invoice.getPdfContent().length == 0) {
            throw new ResourceNotFoundException("Invoice PDF is not available yet for order: " + orderId);
        }
        String filename = invoice.getInvoiceNumber() + ".pdf";
        return ((ResponseEntity.BodyBuilder)ResponseEntity.ok().header("Content-Disposition", new String[]{"attachment; filename=\"" + filename + "\""})).contentType(MediaType.APPLICATION_PDF).body(invoice.getPdfContent());
    }

    @GetMapping(value={"/order/{orderId}/status"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> getInvoiceStatus(@PathVariable Long orderId, Authentication authentication) {
        Invoice invoice = (Invoice)this.invoiceRepository.findByOrderId(orderId).orElseThrow(() -> new ResourceNotFoundException("Invoice not found for order: " + orderId));
        String email = authentication.getName();
        User user = (User)this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() != UserRole.ADMIN && !invoice.getOrder().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to view this invoice");
        }
        return ResponseEntity.ok(Map.of("invoiceNumber", invoice.getInvoiceNumber(), "status", invoice.getStatus().name(), "issuedAt", invoice.getIssuedAt().toString(), "totalAmount", invoice.getTotalAmount(), "refundedAmount", invoice.getRefundedAmount() != null ? invoice.getRefundedAmount() : Integer.valueOf(0)));
    }
}

