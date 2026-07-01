/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Address
 *  com.styliste.repository.AddressRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.stereotype.Repository
 */
package com.styliste.repository;

import com.styliste.entity.Address;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository
extends JpaRepository<Address, Long> {
    public Optional<Address> findByIdAndUserId(Long var1, Long var2);
}

