/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Attribute
 *  com.styliste.repository.AttributeRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.data.jpa.repository.Query
 *  org.springframework.data.repository.query.Param
 */
package com.styliste.repository;

import com.styliste.entity.Attribute;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttributeRepository
extends JpaRepository<Attribute, Long> {
    public Optional<Attribute> findByTypeAndValue(String var1, String var2);

    @Query(value="SELECT COUNT(p) FROM Product p JOIN p.attributes a WHERE a.id = :attributeId")
    public long countProductsUsingAttribute(@Param(value="attributeId") Long var1);

    @Query(value="SELECT DISTINCT a.value FROM Attribute a WHERE a.type = :type")
    public List<String> findUniqueValuesByType(@Param(value="type") String var1);
}

