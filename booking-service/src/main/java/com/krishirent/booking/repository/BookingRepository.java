package com.krishirent.booking.repository;

import com.krishirent.booking.entity.Booking;
import com.krishirent.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Checks for overlapping bookings including the 1-hour transit buffer.
     * A new booking from [requestedStart, requestedEnd] conflicts if any existing
     * CONFIRMED booking's buffered window [existingStart - 1hr, existingEnd + 1hr]
     * overlaps with the requested window.
     *
     * Overlap condition: existing.startDateTime - 1hr < requestedEnd
     *                AND existing.endDateTime + 1hr > requestedStart
     */
    @Query("SELECT b FROM Booking b WHERE b.equipmentId = :equipmentId " +
           "AND b.status = :status " +
           "AND b.startDateTime < :endWithBuffer " +
           "AND b.endDateTime > :startWithBuffer")
    List<Booking> findOverlappingBookings(
            @Param("equipmentId") Long equipmentId,
            @Param("status") BookingStatus status,
            @Param("startWithBuffer") LocalDateTime startWithBuffer,
            @Param("endWithBuffer") LocalDateTime endWithBuffer);

    List<Booking> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);

    List<Booking> findByEquipmentIdOrderByCreatedAtDesc(Long equipmentId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(b.totalCost), 0) FROM Booking b WHERE b.status = 'COMPLETED'")
    Double getTotalRevenue();

    long countByEquipmentIdAndStatus(Long equipmentId, BookingStatus status);
}
