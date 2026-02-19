package com.krishirent.payment.repository;

import com.krishirent.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);

    List<Payment> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<Payment> findAllByOrderByCreatedAtDesc();

    Optional<Payment> findByBookingId(Long bookingId);

    boolean existsByBookingId(Long bookingId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'COMPLETED'")
    Double getTotalRevenue();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.ownerId = :ownerId AND p.status = 'COMPLETED'")
    Double getTotalRevenueByOwner(Long ownerId);
}
