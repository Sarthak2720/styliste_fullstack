/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  com.styliste.controller.ContactController
 *  com.styliste.dto.ContactMessageDTO
 *  com.styliste.entity.ContactMessage
 *  com.styliste.entity.MessageStatus
 *  com.styliste.exception.ResourceNotFoundException
 *  com.styliste.repository.ContactMessageRepository
 *  jakarta.validation.Valid
 *  org.springframework.http.ResponseEntity
 *  org.springframework.security.access.prepost.PreAuthorize
 *  org.springframework.web.bind.annotation.CrossOrigin
 *  org.springframework.web.bind.annotation.GetMapping
 *  org.springframework.web.bind.annotation.PatchMapping
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestParam
 *  org.springframework.web.bind.annotation.RestController
 */
package com.styliste.controller;

import com.styliste.dto.ContactMessageDTO;
import com.styliste.entity.ContactMessage;
import com.styliste.entity.MessageStatus;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/contact"})
@CrossOrigin(origins={"*"})
public class ContactController {
    private final ContactMessageRepository contactRepository;

    @PostMapping
    public ResponseEntity<String> sendMessage(@Valid @RequestBody ContactMessageDTO dto) {
        ContactMessage message = ContactMessage.builder().name(dto.getName()).email(dto.getEmail()).subject(dto.getSubject()).message(dto.getMessage()).status(MessageStatus.PENDING).build();
        this.contactRepository.save(message);
        return ResponseEntity.ok("Message sent successfully!");
    }

    @GetMapping(value={"/admin/all"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(this.contactRepository.findAll());
    }

    @PatchMapping(value={"/admin/{id}/status"})
    @PreAuthorize(value="hasRole('ADMIN')")
    public ResponseEntity<ContactMessage> updateStatus(@PathVariable Long id, @RequestParam String status) {
        ContactMessage msg = (ContactMessage)this.contactRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        msg.setStatus(MessageStatus.valueOf((String)status.toUpperCase()));
        return ResponseEntity.ok(((ContactMessage)this.contactRepository.save(msg)));
    }

    public ContactController(ContactMessageRepository contactRepository) {
        this.contactRepository = contactRepository;
    }
}

