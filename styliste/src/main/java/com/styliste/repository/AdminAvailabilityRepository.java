/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.AdminAvailability
 *  com.styliste.repository.AdminAvailabilityRepository
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.data.jpa.repository.Query
 *  org.springframework.data.repository.query.Param
 *  org.springframework.stereotype.Repository
 */
package com.styliste.repository;

import com.styliste.entity.AdminAvailability;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminAvailabilityRepository
extends JpaRepository<AdminAvailability, Long> {
    public List<AdminAvailability> findByBlockedDate(LocalDate var1);

    public List<AdminAvailability> findByBlockedDateBetween(LocalDate var1, LocalDate var2);

    @Query(value="    SELECT COUNT(a) > 0 FROM AdminAvailability a\n     WHERE a.blockedDate = :date\n     AND (\n        a.isFullDayBlocked = true\n         OR (\n            a.blockedTimeStart <= :time\n             AND a.blockedTimeEnd > :time\n        )\n    )\n")
    public boolean isTimeSlotBlocked(@Param(value="date") LocalDate var1, @Param(value="time") LocalTime var2);

    public void deleteByBlockedDateBefore(LocalDate var1);
}

