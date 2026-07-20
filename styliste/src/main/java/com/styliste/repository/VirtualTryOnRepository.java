package com.styliste.repository;

import com.styliste.entity.VirtualTryOn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VirtualTryOnRepository extends JpaRepository<VirtualTryOn, Long> {
    List<VirtualTryOn> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<VirtualTryOn> findAllByOrderByCreatedAtDesc();
}
