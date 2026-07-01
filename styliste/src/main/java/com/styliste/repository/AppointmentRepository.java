/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.entity.Appointment
 *  com.styliste.entity.AppointmentStatus
 *  com.styliste.repository.AppointmentRepository
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.data.jpa.repository.Modifying
 *  org.springframework.data.jpa.repository.Query
 *  org.springframework.data.repository.query.Param
 *  org.springframework.stereotype.Repository
 */
package com.styliste.repository;

import com.styliste.entity.Appointment;
import com.styliste.entity.AppointmentStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository
extends JpaRepository<Appointment, Long> {
    public Page<Appointment> findByUserId(Long var1, Pageable var2);

    public List<Appointment> findByAppointmentDate(LocalDate var1);

    public List<Appointment> findByStatus(AppointmentStatus var1);

    public List<Appointment> findByGuestEmail(String var1);

    public long countByStatus(AppointmentStatus var1);

    @Query(value="    select a.appointmentTime\n    from Appointment a\n    where a.appointmentDate = :date\n      and a.status in ('PENDING', 'CONFIRMED')\n")
    public List<LocalTime> findBookedSlotsByDate(@Param(value="date") LocalDate var1);

    @Modifying
    @Query(value="    UPDATE Appointment a\n    SET a.status = :status,\n        a.cancelledBy = :cancelledBy\n    WHERE a.id IN :ids\n")
    public void updateStatusAndCancelledBy(@Param(value="ids") List<Long> var1, @Param(value="status") AppointmentStatus var2, @Param(value="cancelledBy") String var3);

    @Modifying
    @Query(value="    UPDATE Appointment a\n    SET a.status = :status,\n        a.cancelledBy = null\n    WHERE a.appointmentDate = :date\n      AND a.status = 'CANCELLED'\n      AND a.cancelledBy = 'ADMIN_UNAVAILABLE'\n")
    public int restoreAppointmentsForDate(@Param(value="date") LocalDate var1, @Param(value="status") AppointmentStatus var2);
}

