/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.dto.AddressDTO
 *  com.styliste.dto.UserDTO
 *  com.styliste.entity.Address
 *  com.styliste.entity.User
 *  com.styliste.entity.UserRole
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.AddressRepository
 *  com.styliste.repository.AppointmentRepository
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.UserService
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.PageRequest
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.domain.Sort
 *  org.springframework.security.crypto.password.PasswordEncoder
 *  org.springframework.stereotype.Service
 *  org.springframework.transaction.annotation.Transactional
 */
package com.styliste.service;

import com.styliste.dto.AddressDTO;
import com.styliste.dto.UserDTO;
import com.styliste.entity.Address;
import com.styliste.entity.User;
import com.styliste.entity.UserRole;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.AddressRepository;
import com.styliste.repository.AppointmentRepository;
import com.styliste.repository.UserRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO getUserById(Long id) {
        User user = (User)this.userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return this.mapToDTO(user);
    }

    public UserDTO updateProfile(Long id, UserDTO dto) {
        User user = (User)this.userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        return this.mapToDTO((User)this.userRepository.save(user));
    }

    public void updatePassword(Long id, String oldPassword, String newPassword) {
        User user = (User)this.userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!this.passwordEncoder.matches((CharSequence)oldPassword, user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }
        user.setPassword(this.passwordEncoder.encode((CharSequence)newPassword));
        this.userRepository.save(user);
    }

    public List<AddressDTO> getUserAddresses(Long userId) {
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getAddresses().stream().map(arg_0 -> this.mapAddressToDTO(arg_0)).toList();
    }

    public AddressDTO updateAddress(Long userId, Long addrId, AddressDTO dto) {
        Address address = (Address)this.addressRepository.findByIdAndUserId(addrId, userId).orElseThrow(() -> new RuntimeException("Address not found"));
        address.setAddressLine1(dto.getAddressLine1());
        address.setAddressLine2(dto.getAddressLine2());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry());
        address.setContactPhone(dto.getContactPhone());
        Address saved = (Address)this.addressRepository.save(address);
        return this.mapAddressToDTO(saved);
    }

    public void deleteAddress(Long userId, Long addrId) {
        Address address = (Address)this.addressRepository.findByIdAndUserId(addrId, userId).orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        try {
            this.addressRepository.delete(address);
            this.addressRepository.flush();
        }
        catch (Exception e) {
            log.error("Delete address failed", (Throwable)e);
            throw e;
        }
    }

    public AddressDTO addAddress(Long userId, AddressDTO dto) {
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (dto.getIsDefault().booleanValue() || user.getAddresses().isEmpty()) {
            this.resetDefaultAddresses(user);
        }
        Address address = Address.builder().user(user).addressLine1(dto.getAddressLine1()).addressLine2(dto.getAddressLine2()).city(dto.getCity()).state(dto.getState()).postalCode(dto.getPostalCode()).country(dto.getCountry()).contactPhone(dto.getContactPhone()).isDefault(Boolean.valueOf(user.getAddresses().isEmpty() ? true : dto.getIsDefault())).build();
        return this.mapAddressToDTO((Address)this.addressRepository.save(address));
    }

    public void setDefaultAddress(Long userId, Long addressId) {
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        this.resetDefaultAddresses(user);
        Address address = (Address)this.addressRepository.findById(addressId).orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        address.setIsDefault(Boolean.valueOf(true));
        this.addressRepository.save(address);
    }

    private void resetDefaultAddresses(User user) {
        user.getAddresses().forEach(a -> a.setIsDefault(Boolean.valueOf(false)));
        this.addressRepository.saveAll((Iterable)user.getAddresses());
    }

    public Page<UserDTO> getAllUsers(String role, Integer page, Integer pageSize) {
        Page<com.styliste.entity.User> userPage;
        log.debug("Fetching users. Role filter: {}", role);
        int pageNum = page != null ? page : 0;
        int size = pageSize != null ? pageSize : 10;
        PageRequest pageable = PageRequest.of((int)pageNum, (int)size, (Sort)Sort.by((String[])new String[]{"id"}).descending());
        if (role != null && !role.isEmpty()) {
            try {
                UserRole userRole = UserRole.valueOf((String)role.toUpperCase());
                userPage = this.userRepository.findByRole(userRole, (Pageable)pageable);
            }
            catch (IllegalArgumentException e) {
                log.warn("Invalid role requested: {}", role);
                return Page.empty();
            }
        } else {
            userPage = this.userRepository.findAll((Pageable)pageable);
        }
        return userPage.map(arg_0 -> this.mapToDTO(arg_0));
    }

    public UserDTO updateUserStatus(Long userId, boolean isActive) {
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setIsActive(Boolean.valueOf(isActive));
        User savedUser = (User)this.userRepository.save(user);
        return this.mapToDTO(savedUser);
    }

    public void deleteUser(Long userId) {
        User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getOrders() != null && !user.getOrders().isEmpty()) {
            throw new RuntimeException("Cannot delete user. They have existing orders. Please deactivate instead.");
        }
        if (user.getAppointments() != null && !user.getAppointments().isEmpty()) {
            throw new RuntimeException("Cannot delete user. They have existing Appointments. Please deactivate instead.");
        }
        this.userRepository.delete(user);
    }

    private AddressDTO mapAddressToDTO(Address a) {
        return AddressDTO.builder().id(a.getId()).addressLine1(a.getAddressLine1()).addressLine2(a.getAddressLine2()).city(a.getCity()).state(a.getState()).contactPhone(a.getContactPhone()).postalCode(a.getPostalCode()).country(a.getCountry()).isDefault(a.getIsDefault()).build();
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder().id(user.getId()).name(user.getName()).email(user.getEmail()).phone(user.getPhone()).role(user.getRole().name()).isActive(user.getIsActive()).createdAt(user.getCreatedAt()).orderCount(user.getOrders() != null ? user.getOrders().size() : 0).appointmentCount(user.getAppointments() != null ? user.getAppointments().size() : 0).build();
    }
}

