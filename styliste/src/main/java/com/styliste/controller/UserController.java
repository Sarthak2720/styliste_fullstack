/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.UserController
 *  com.styliste.dto.AddressDTO
 *  com.styliste.dto.UserDTO
 *  com.styliste.entity.User
 *  com.styliste.entity.UserRole
 *  com.styliste.exception.BadRequestException
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.UserRepository
 *  com.styliste.service.UserService
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.beans.factory.annotation.Autowired
 *  org.springframework.data.domain.Page
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.security.core.Authentication
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.DeleteMapping
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PatchMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.PutMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.styliste.dto.AddressDTO;
import com.styliste.dto.UserDTO;
import com.styliste.entity.User;
import com.styliste.entity.UserRole;
import com.styliste.exception.BadRequestException;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.UserRepository;
import com.styliste.service.UserService;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/users"})
@CrossOrigin(origins={"*"})
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<Page<UserDTO>> getAllUsers(@RequestParam(required=false) String role, @RequestParam(required=false) Integer page, @RequestParam(required=false) Integer pageSize) {
        return ResponseEntity.ok(this.userService.getAllUsers(role, page, pageSize));
    }

    @GetMapping(value={"/{id}"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id, Authentication authentication) {
        this.enforceOwnershipOrAdmin(id, authentication);
        return ResponseEntity.ok(this.userService.getUserById(id));
    }

    @PutMapping(value={"/{id}"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateProfile(@PathVariable Long id, @RequestBody UserDTO dto, Authentication authentication) {
        this.enforceOwnershipOrAdmin(id, authentication);
        return ResponseEntity.ok(this.userService.updateProfile(id, dto));
    }

    @PostMapping(value={"/{id}/change-password"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody Map<String, String> payload, Authentication authentication) {
        this.enforceOwnershipOrAdmin(id, authentication);
        this.userService.updatePassword(id, payload.get("oldPassword"), payload.get("newPassword"));
        return ResponseEntity.ok("Password updated successfully");
    }

    @GetMapping(value={"/{id}/addresses"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<List<AddressDTO>> getAddresses(@PathVariable Long id, Authentication authentication) {
        this.enforceOwnershipOrAdmin(id, authentication);
        return ResponseEntity.ok(this.userService.getUserAddresses(id));
    }

    @PostMapping(value={"/{id}/addresses"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<AddressDTO> addAddress(@PathVariable Long id, @RequestBody AddressDTO dto, Authentication authentication) {
        this.enforceOwnershipOrAdmin(id, authentication);
        return ResponseEntity.ok(this.userService.addAddress(id, dto));
    }

    @PatchMapping(value={"/{id}/addresses/{addressId}/default"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Void> setDefault(@PathVariable Long id, @PathVariable Long addressId, Authentication authentication) {
        this.enforceOwnershipOrAdmin(id, authentication);
        this.userService.setDefaultAddress(id, addressId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value={"/{id}/addresses/{addrId}"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long id, @PathVariable Long addrId, @RequestBody AddressDTO dto, Authentication authentication) {
        this.enforceOwnershipOrAdmin(id, authentication);
        return ResponseEntity.ok(this.userService.updateAddress(id, addrId, dto));
    }

    @DeleteMapping(value={"/{id}/addresses/{addrId}"})
    @PreAuthorize(value="hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id, @PathVariable Long addrId, Authentication authentication) {
        this.enforceOwnershipOrAdmin(id, authentication);
        this.userService.deleteAddress(id, addrId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(value={"/{id}/activate"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<UserDTO> activateUser(@PathVariable Long id) {
        return ResponseEntity.ok(this.userService.updateUserStatus(id, true));
    }

    @PatchMapping(value={"/{id}/deactivate"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<UserDTO> deactivateUser(@PathVariable Long id) {
        return ResponseEntity.ok(this.userService.updateUserStatus(id, false));
    }

    @DeleteMapping(value={"/{id}"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        this.userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

    private void enforceOwnershipOrAdmin(Long targetUserId, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = (User)this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (currentUser.getRole() != UserRole.ADMIN && !currentUser.getId().equals(targetUserId)) {
            throw new BadRequestException("You are not authorized to access this resource");
        }
    }
}

