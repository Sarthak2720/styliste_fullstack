package com.styliste.repository;

import com.styliste.entity.AboutSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AboutSectionRepository extends JpaRepository<AboutSection, Long> {
    List<AboutSection> findAllByOrderBySortOrderAsc();
}
