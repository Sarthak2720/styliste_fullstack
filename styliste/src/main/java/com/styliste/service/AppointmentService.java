/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AppointmentDTO
 *  com.styliste.dto.AppointmentStatisticsDTO
 *  com.styliste.dto.CreateAppointmentRequest
 *  com.styliste.dto.CreateGuestAppointmentRequest
 *  com.styliste.dto.UpdateAppointmentRequest
 *  com.styliste.entity.AdminAvailability
 *  com.styliste.entity.Appointment
 *  com.styliste.entity.AppointmentStatus
 *  com.styliste.entity.ServiceType
 *  com.styliste.entity.User
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.AdminAvailabilityRepository
 *  com.styliste.repository.AppointmentRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.AppointmentService
 *  com.styliste.service.EmailService
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.PageRequest
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.domain.Sort
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 */
package com.styliste.service;

import com.styliste.dto.AppointmentDTO;
import com.styliste.dto.AppointmentStatisticsDTO;
import com.styliste.dto.CreateAppointmentRequest;
import com.styliste.dto.CreateGuestAppointmentRequest;
import com.styliste.dto.UpdateAppointmentRequest;
import com.styliste.entity.AdminAvailability;
import com.styliste.entity.Appointment;
import com.styliste.entity.AppointmentStatus;
import com.styliste.entity.ServiceType;
import com.styliste.entity.User;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.AdminAvailabilityRepository;
import com.styliste.repository.AppointmentRepository;
import com.styliste.repository.UserRepository;
import com.styliste.service.EmailService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AppointmentService {
    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private AdminAvailabilityRepository availabilityRepository;
    @Autowired
    private UserRepository userRepository;

    public AppointmentDTO createAppointment(Long userId, CreateAppointmentRequest request) {
        log.info("Creating appointment for user: {}", userId);
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        if (request.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Appointment date cannot be in the past");
        }
        try {
            ServiceType serviceType = ServiceType.valueOf((String)request.getServiceType().toUpperCase());
            Appointment appointment = Appointment.builder().user(user).guestName(user.getName()).guestEmail(user.getEmail()).guestPhone(user.getPhone()).appointmentDate(request.getAppointmentDate()).appointmentTime(request.getAppointmentTime()).serviceType(serviceType).notes(request.getNotes()).status(AppointmentStatus.PENDING).build();
            Appointment savedAppointment = (Appointment)this.appointmentRepository.save(appointment);
            log.info("Appointment created with ID: {}", savedAppointment.getId());
            return this.mapToDTO(savedAppointment);
        }
        catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid service type: " + request.getServiceType());
        }
    }

    public AppointmentDTO approveAppointment(Long id) {
        Appointment appointment = (Appointment)this.appointmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new BadRequestException("Only pending appointments can be approved");
        }
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        Appointment saved = (Appointment)this.appointmentRepository.save(appointment);
        String recipientEmail = this.resolveRecipientEmail(appointment);
        String recipientName = this.resolveRecipientName(appointment);
        this.emailService.sendAppointmentApprovedEmail(recipientEmail, recipientName, appointment.getAppointmentDate().toString(), appointment.getAppointmentTime().toString(), appointment.getServiceType().name());
        return this.mapToDTO(saved);
    }

    private String resolveRecipientEmail(Appointment appointment) {
        if (appointment.getUser() != null) {
            return appointment.getUser().getEmail();
        }
        return appointment.getGuestEmail();
    }

    private String resolveRecipientName(Appointment appointment) {
        if (appointment.getUser() != null) {
            return appointment.getUser().getName();
        }
        return appointment.getGuestName();
    }

    public List<LocalTime> getAvailableSlots(LocalDate date) {
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

    @Transactional
    public AppointmentDTO createGuestAppointment(CreateGuestAppointmentRequest request) {
        ServiceType serviceType;
        if (request.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Appointment date cannot be in the past");
        }
        try {
            serviceType = ServiceType.valueOf((String)request.getServiceType().toUpperCase());
        }
        catch (Exception e) {
            throw new BadRequestException("Invalid service type");
        }
        Appointment appointment = Appointment.builder().guestName(request.getGuestName()).guestEmail(request.getGuestEmail()).guestPhone(request.getGuestPhone()).appointmentDate(request.getAppointmentDate()).appointmentTime(request.getAppointmentTime()).serviceType(serviceType).notes(request.getNotes()).status(AppointmentStatus.PENDING).build();
        Appointment saved = (Appointment)this.appointmentRepository.save(appointment);
        return this.mapToDTO(saved);
    }

    public AppointmentDTO rejectAppointment(Long id) {
        Appointment appointment = (Appointment)this.appointmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new BadRequestException("Only pending appointments can be rejected");
        }
        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = (Appointment)this.appointmentRepository.save(appointment);
        String recipientEmail = this.resolveRecipientEmail(appointment);
        String recipientName = this.resolveRecipientName(appointment);
        this.emailService.sendAppointmentRejectedEmail(recipientEmail, recipientName);
        return this.mapToDTO(saved);
    }

    @Transactional
    public void linkAppointmentsToUser(User user) {
        List<com.styliste.entity.Appointment> appointments = this.appointmentRepository.findByGuestEmail(user.getEmail());
        for (Appointment appointment : appointments) {
            appointment.setUser(user);
        }
        this.appointmentRepository.saveAll((Iterable)appointments);
    }

    public AppointmentDTO getAppointmentById(Long id) {
        log.debug("Fetching appointment with ID: {}", id);
        Appointment appointment = (Appointment)this.appointmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        return this.mapToDTO(appointment);
    }

    public AppointmentDTO updateAppointment(Long id, UpdateAppointmentRequest request) {
        log.info("Updating appointment with ID: {}", id);
        Appointment appointment = (Appointment)this.appointmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        if (request.getStatus() != null) {
            try {
                AppointmentStatus status = AppointmentStatus.valueOf((String)request.getStatus().toUpperCase());
                appointment.setStatus(status);
            }
            catch (IllegalArgumentException ex) {
                throw new BadRequestException("Invalid appointment status: " + request.getStatus());
            }
        }
        if (request.getNotes() != null) {
            appointment.setNotes(request.getNotes());
        }
        Appointment updatedAppointment = (Appointment)this.appointmentRepository.save(appointment);
        log.info("Appointment updated successfully");
        return this.mapToDTO(updatedAppointment);
    }

    public void cancelAppointment(Long id) {
        log.info("Cancelling appointment with ID: {}", id);
        Appointment appointment = (Appointment)this.appointmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        this.appointmentRepository.save(appointment);
    }

    public Page<AppointmentDTO> getUserAppointments(Long userId, Integer page, Integer pageSize) {
        log.debug("Fetching appointments for user: {}", userId);
        int pageNum = page != null ? page : 0;
        int size = pageSize != null ? pageSize : 10;
        PageRequest pageable = PageRequest.of((int)pageNum, (int)size, (Sort)Sort.by((String[])new String[]{"appointmentDate"}).ascending());
        return this.appointmentRepository.findByUserId(userId, (Pageable)pageable).map(arg_0 -> this.mapToDTO(arg_0));
    }

    public List<AppointmentDTO> getAppointmentsByDate(LocalDate date) {
        log.debug("Fetching appointments for date: {}", date);
        return this.appointmentRepository.findByAppointmentDate(date).stream().map(arg_0 -> this.mapToDTO(arg_0)).collect(Collectors.toList());
    }

    public Page<AppointmentDTO> getAllAppointments(Integer page, Integer pageSize) {
        log.debug("Fetching all appointments");
        int pageNum = page != null ? page : 0;
        int size = pageSize != null ? pageSize : 10;
        PageRequest pageable = PageRequest.of((int)pageNum, (int)size, (Sort)Sort.by((String[])new String[]{"appointmentDate"}).ascending());
        return this.appointmentRepository.findAll((Pageable)pageable).map(arg_0 -> this.mapToDTO(arg_0));
    }

    public AppointmentStatisticsDTO getAppointmentStatistics() {
        log.debug("Calculating appointment statistics");
        long totalAppointments = this.appointmentRepository.count();
        long pendingAppointments = this.appointmentRepository.countByStatus(AppointmentStatus.PENDING);
        long confirmedAppointments = this.appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED);
        long completedAppointments = this.appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);
        return AppointmentStatisticsDTO.builder().totalAppointments(Long.valueOf(totalAppointments)).pendingAppointments(Long.valueOf(pendingAppointments)).confirmedAppointments(Long.valueOf(confirmedAppointments)).completedAppointments(Long.valueOf(completedAppointments)).build();
    }

    private AppointmentDTO mapToDTO(Appointment appointment) {
        boolean isGuest = appointment.getUser() == null;
        return AppointmentDTO.builder().id(appointment.getId()).name(isGuest ? appointment.getGuestName() : appointment.getUser().getName()).userId(isGuest ? null : appointment.getUser().getId()).appointmentDate(appointment.getAppointmentDate()).appointmentTime(appointment.getAppointmentTime()).serviceType(appointment.getServiceType().name()).notes(appointment.getNotes()).status(appointment.getStatus().name()).createdAt(appointment.getCreatedAt()).build();
    }
}

