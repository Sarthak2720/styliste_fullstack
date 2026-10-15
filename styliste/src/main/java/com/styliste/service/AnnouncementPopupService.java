package com.styliste.service;

import com.styliste.entity.AnnouncementPopup;
import com.styliste.exception.ResourceNotFoundException;
import com.styliste.repository.AnnouncementPopupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementPopupService {

    @Autowired
    private AnnouncementPopupRepository repository;

    public Optional<AnnouncementPopup> getActiveAnnouncement() {
        List<AnnouncementPopup> activeList = repository.findActiveAnnouncements(LocalDateTime.now());
        if (activeList.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(activeList.get(0));
    }

    public List<AnnouncementPopup> getAllAnnouncements() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public AnnouncementPopup getAnnouncementById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement popup not found with id: " + id));
    }

    @Transactional
    public AnnouncementPopup createAnnouncement(AnnouncementPopup popup) {
        return repository.save(popup);
    }

    @Transactional
    public AnnouncementPopup updateAnnouncement(Long id, AnnouncementPopup details) {
        AnnouncementPopup existing = getAnnouncementById(id);
        existing.setTitle(details.getTitle());
        existing.setSubtitle(details.getSubtitle());
        existing.setContent(details.getContent());
        existing.setBackgroundColor(details.getBackgroundColor());
        existing.setImageUrl(details.getImageUrl());
        existing.setButtonText(details.getButtonText());
        existing.setButtonLink(details.getButtonLink());
        existing.setPopupWidth(details.getPopupWidth());
        existing.setPopupMaxHeight(details.getPopupMaxHeight());
        if (details.getEnabled() != null) {
            existing.setEnabled(details.getEnabled());
        }
        existing.setStartDate(details.getStartDate());
        existing.setEndDate(details.getEndDate());
        return repository.save(existing);
    }

    @Transactional
    public AnnouncementPopup toggleEnabled(Long id) {
        AnnouncementPopup existing = getAnnouncementById(id);
        existing.setEnabled(!Boolean.TRUE.equals(existing.getEnabled()));
        return repository.save(existing);
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        AnnouncementPopup existing = getAnnouncementById(id);
        repository.delete(existing);
    }
}
