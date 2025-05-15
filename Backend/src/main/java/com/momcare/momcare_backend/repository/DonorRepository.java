package com.momcare.momcare_backend.repository;

import com.momcare.momcare_backend.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DonorRepository extends JpaRepository<Donor, Long> {
    
    @Query(value = """
        SELECT d.* FROM donors d
        WHERE d.is_available = true
        AND d.blood_type = :bloodType
        AND (
            6371 * acos(
                cos(radians(:latitude)) * cos(radians(d.latitude))
                * cos(radians(d.longitude) - radians(:longitude))
                + sin(radians(:latitude)) * sin(radians(d.latitude))
            )
        ) <= :radiusKm
        ORDER BY (
            6371 * acos(
                cos(radians(:latitude)) * cos(radians(d.latitude))
                * cos(radians(d.longitude) - radians(:longitude))
                + sin(radians(:latitude)) * sin(radians(d.latitude))
            )
        ) ASC
        LIMIT :limit
        """, nativeQuery = true)
    List<Donor> findNearbyDonors(
        @Param("latitude") double latitude,
        @Param("longitude") double longitude,
        @Param("bloodType") String bloodType,
        @Param("radiusKm") double radiusKm,
        @Param("limit") int limit
    );

    @Query(value = """
        SELECT d.* FROM donors d
        WHERE d.is_available = true
        AND (
            6371 * acos(
                cos(radians(:latitude)) * cos(radians(d.latitude))
                * cos(radians(d.longitude) - radians(:longitude))
                + sin(radians(:latitude)) * sin(radians(d.latitude))
            )
        ) <= :radiusKm
        ORDER BY (
            6371 * acos(
                cos(radians(:latitude)) * cos(radians(d.latitude))
                * cos(radians(d.longitude) - radians(:longitude))
                + sin(radians(:latitude)) * sin(radians(d.latitude))
            )
        ) ASC
        LIMIT :limit
        """, nativeQuery = true)
    List<Donor> findNearbyDonorsAnyBloodType(
        @Param("latitude") double latitude,
        @Param("longitude") double longitude,
        @Param("radiusKm") double radiusKm,
        @Param("limit") int limit
    );

    List<Donor> findByUserId(Long userId);
} 