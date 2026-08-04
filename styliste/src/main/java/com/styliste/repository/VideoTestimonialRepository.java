package com.styliste.repository;

import com.styliste.entity.VideoTestimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoTestimonialRepository extends JpaRepository<VideoTestimonial, Long> {
}
