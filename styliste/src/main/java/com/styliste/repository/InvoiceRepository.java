/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Invoice
 *  com.styliste.repository.InvoiceRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 */
package com.styliste.repository;

import com.styliste.entity.Invoice;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository
extends JpaRepository<Invoice, Long> {
    public Optional<Invoice> findByOrderId(Long var1);

    public boolean existsByOrderId(Long var1);
}

