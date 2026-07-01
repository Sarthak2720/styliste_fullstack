/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AdminAvailabilityDTO
 *  com.styliste.dto.AdminAvailabilityRequest
 *  com.styliste.dto.AffectedAppointmentDTO
 *  com.styliste.entity.AdminAvailability
 *  com.styliste.entity.Appointment
 *  com.styliste.entity.AppointmentStatus
 *  com.styliste.entity.User
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.AdminAvailabilityRepository
 *  com.styliste.repository.AppointmentRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.AdminAvailabilityService
 *  com.styliste.service.EmailService
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 */
package com.styliste.service;

import com.styliste.dto.AdminAvailabilityDTO;
import com.styliste.dto.AdminAvailabilityRequest;
import com.styliste.dto.AffectedAppointmentDTO;
import com.styliste.entity.AdminAvailability;
import com.styliste.entity.Appointment;
import com.styliste.entity.AppointmentStatus;
import com.styliste.entity.User;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.AdminAvailabilityRepository;
import com.styliste.repository.AppointmentRepository;
import com.styliste.repository.UserRepository;
import com.styliste.service.EmailService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAvailabilityService {
    private static final Logger log = LoggerFactory.getLogger(AdminAvailabilityService.class);
    @Autowired
    private AdminAvailabilityRepository availabilityRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;

    @Transactional
    public AdminAvailabilityDTO createUnavailability(AdminAvailabilityRequest request, Long adminId) {
        log.info("Creating unavailability for date: {}", request.getBlockedDate());
        LocalDate maxAllowedDate = LocalDate.now().plusDays(15L);
        if (request.getBlockedDate().isAfter(maxAllowedDate)) {
            throw new BadRequestException("You can block availability only up to the next 15 days");
        }
        if (request.getBlockedDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot block dates in the past");
        }
        if (!request.getIsFullDayBlocked().booleanValue()) {
            if (request.getBlockedTimeStart() == null || request.getBlockedTimeEnd() == null) {
                throw new BadRequestException("Time range required when not blocking full day");
            }
            if (request.getBlockedTimeEnd().isBefore(request.getBlockedTimeStart())) {
                throw new BadRequestException("End time must be after start time");
            }
        }
        User admin = (User)this.userRepository.findById(adminId).orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        AdminAvailability availability = AdminAvailability.builder().blockedDate(request.getBlockedDate()).blockedTimeStart(request.getBlockedTimeStart()).blockedTimeEnd(request.getBlockedTimeEnd()).isFullDayBlocked(request.getIsFullDayBlocked()).reason(request.getReason()).createdBy(admin).build();
        AdminAvailability saved = (AdminAvailability)this.availabilityRepository.save(availability);
        List<com.styliste.entity.Appointment> affectedEntities = this.findAffectedAppointmentEntities(saved);
        List<com.styliste.dto.AffectedAppointmentDTO> affectedAppointments = this.mapToAffectedDTOs(affectedEntities);
        if (!affectedAppointments.isEmpty()) {
            this.notifyAffectedCustomers(affectedAppointments, saved);
            this.cancelAffectedAppointments(affectedEntities);
        }
        return this.mapToDTO(saved);
    }

    private List<Appointment> findAffectedAppointmentEntities(AdminAvailability availability) {
        List<com.styliste.entity.Appointment> appointments = this.appointmentRepository.findByAppointmentDate(availability.getBlockedDate());
        return appointments.stream().filter(apt -> {
            if (availability.getIsFullDayBlocked().booleanValue()) {
                return true;
            }
            LocalTime aptTime = apt.getAppointmentTime();
            return !aptTime.isBefore(availability.getBlockedTimeStart()) && aptTime.isBefore(availability.getBlockedTimeEnd());
        }).collect(Collectors.toList());
    }

    private List<AffectedAppointmentDTO> mapToAffectedDTOs(List<Appointment> appointments) {
        return appointments.stream().map(apt -> AffectedAppointmentDTO.builder().appointmentId(apt.getId()).customerName(apt.getUser() != null ? apt.getUser().getName() : apt.getGuestName()).customerEmail(apt.getUser() != null ? apt.getUser().getEmail() : apt.getGuestEmail()).appointmentDate(apt.getAppointmentDate()).appointmentTime(apt.getAppointmentTime()).serviceType(apt.getServiceType().name()).build()).collect(Collectors.toList());
    }

    private void notifyAffectedCustomers(List<AffectedAppointmentDTO> affected, AdminAvailability availability) {
        List<String> alternativeSlots = this.findAlternativeSlots(availability.getBlockedDate());
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
        for (AffectedAppointmentDTO apt : affected) {
            String dateStr = apt.getAppointmentDate().format(dateFormatter);
            String timeStr = apt.getAppointmentTime().format(timeFormatter);
            this.emailService.sendUnavailabilityApologyEmail(apt.getCustomerEmail(), apt.getCustomerName(), dateStr, timeStr, alternativeSlots);
            log.info("Sent apology email to {} for affected appointment {}", apt.getCustomerEmail(), apt.getAppointmentId());
        }
    }

    private void cancelAffectedAppointments(List<Appointment> affected) {
        if (affected == null || affected.isEmpty()) {
            return;
        }
        List<Long> ids = affected.stream().map(Appointment::getId).toList();
        this.appointmentRepository.updateStatusAndCancelledBy(ids, AppointmentStatus.CANCELLED, "ADMIN_UNAVAILABLE");
        log.warn("Cancelled {} appointments due to admin unavailability", ids.size());
    }

    private List<String> findAlternativeSlots(LocalDate blockedDate) {
        ArrayList<String> alternatives = new ArrayList<String>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
        for (int i = 1; i <= 7; ++i) {
            LocalDate checkDate = blockedDate.plusDays(i);
            List<java.time.LocalTime> slots = this.getAvailableSlotsForDate(checkDate);
            for (LocalTime slot : slots) {
                if (alternatives.size() >= 5) break;
                String slotStr = checkDate.atTime(slot).format(formatter);
                alternatives.add(slotStr);
            }
            if (alternatives.size() >= 5) break;
        }
        return alternatives;
    }

    private List<LocalTime> getAvailableSlotsForDate(LocalDate date) {
        List<LocalTime> allSlots = List.of(LocalTime.of(10, 0), LocalTime.of(11, 0), LocalTime.of(12, 0), LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0), LocalTime.of(17, 0), LocalTime.of(18, 0));
        List<java.time.LocalTime> bookedSlots = this.appointmentRepository.findBookedSlotsByDate(date);
        List<com.styliste.entity.AdminAvailability> blocks = this.availabilityRepository.findByBlockedDate(date);
        return allSlots.stream().filter(slot -> !bookedSlots.contains(slot)).filter(slot -> {
            for (AdminAvailability block : blocks) {
                if (block.getIsFullDayBlocked().booleanValue()) {
                    return false;
                }
                if (slot.isBefore(block.getBlockedTimeStart()) || !slot.isBefore(block.getBlockedTimeEnd())) continue;
                return false;
            }
            return true;
        }).collect(Collectors.toList());
    }

    public List<AdminAvailabilityDTO> getUpcomingUnavailability() {
        LocalDate today = LocalDate.now();
        LocalDate fifteenDaysLater = today.plusDays(15L);
        return this.availabilityRepository.findByBlockedDateBetween(today, fifteenDaysLater).stream().map(arg_0 -> this.mapToDTO(arg_0)).collect(Collectors.toList());
    }

    public List<AdminAvailabilityDTO> getUnavailabilityForDate(LocalDate date) {
        return this.availabilityRepository.findByBlockedDate(date).stream().map(arg_0 -> this.mapToDTO(arg_0)).collect(Collectors.toList());
    }

    @Transactional
    public void deleteUnavailability(Long id) {
        AdminAvailability availability = (AdminAvailability)this.availabilityRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unavailability not found"));
        LocalDate date = availability.getBlockedDate();
        this.availabilityRepository.delete(availability);
        log.info("Deleted unavailability for date: {}", date);
        int restoredCount = this.appointmentRepository.restoreAppointmentsForDate(date, AppointmentStatus.CONFIRMED);
        if (restoredCount > 0) {
            this.notifyRestoredAppointments(date, restoredCount);
        }
    }

    private void notifyRestoredAppointments(LocalDate date, int count) {
        List<Appointment> restoredAppointments = this.appointmentRepository.findByAppointmentDate(date).stream().filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED && a.getCancelledBy() == null).toList();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
        for (Appointment apt : restoredAppointments) {
            String name = apt.getUser() != null ? apt.getUser().getName() : apt.getGuestName();
            String email = apt.getUser() != null ? apt.getUser().getEmail() : apt.getGuestEmail();
            this.emailService.sendAvailabilityRestoredEmail(email, name, apt.getAppointmentDate().format(dateFormatter), apt.getAppointmentTime().format(timeFormatter), apt.getServiceType().name());
        }
        log.info("Notified {} customers about restored availability on {}", count, date);
    }

    private AdminAvailabilityDTO mapToDTO(AdminAvailability entity) {
        return AdminAvailabilityDTO.builder().id(entity.getId()).blockedDate(entity.getBlockedDate()).blockedTimeStart(entity.getBlockedTimeStart()).blockedTimeEnd(entity.getBlockedTimeEnd()).isFullDayBlocked(entity.getIsFullDayBlocked()).reason(entity.getReason()).createdByName(entity.getCreatedBy() != null ? entity.getCreatedBy().getName() : null).build();
    }
}

