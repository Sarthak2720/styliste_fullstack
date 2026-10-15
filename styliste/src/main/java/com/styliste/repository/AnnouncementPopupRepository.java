package com.styliste.repository;

import com.styliste.entity.AnnouncementPopup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementPopupRepository extends JpaRepository<AnnouncementPopup, Long> {

    List<AnnouncementPopup> findAllByOrderByCreatedAtDesc();

    @Query("SELECT p FROM AnnouncementPopup p WHERE p.enabled = true " +
           "AND (p.startDate IS NULL OR p.startDate <= :now) " +
           "AND (p.endDate IS NULL OR p.endDate >= :now) " +
           "ORDER BY p.updatedAt DESC")
    List<AnnouncementPopup> findActiveAnnouncements(@Param("now") LocalDateTime now);
}
