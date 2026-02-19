package com.krishirent.payment.service;

import com.krishirent.payment.dto.*;
import com.krishirent.payment.entity.Payment;
import com.krishirent.payment.entity.PaymentMethod;
import com.krishirent.payment.entity.PaymentStatus;
import com.krishirent.payment.exception.DuplicatePaymentException;
import com.krishirent.payment.exception.InvalidPaymentException;
import com.krishirent.payment.feign.BookingServiceClient;
import com.krishirent.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentRepository paymentRepository;
    private final BookingServiceClient bookingServiceClient;

    public PaymentServiceImpl(PaymentRepository paymentRepository, BookingServiceClient bookingServiceClient) {
        this.paymentRepository = paymentRepository;
        this.bookingServiceClient = bookingServiceClient;
    }

    // ========== US 4.1: Create Payment ==========
    @Override
    public PaymentResponse createPayment(PaymentRequest request) {
        // Check if payment already exists for this booking
        if (paymentRepository.existsByBookingId(request.getBookingId())) {
            throw new DuplicatePaymentException("Payment already exists for booking ID: " + request.getBookingId());
        }

        // Get booking details via Feign
        Map<String, Object> booking = bookingServiceClient.getBookingById(request.getBookingId());

        // Validate booking status is CONFIRMED
        String bookingStatus = (String) booking.get("status");
        if ("CANCELLED".equals(bookingStatus)) {
            throw new InvalidPaymentException("Cannot pay for a CANCELLED booking");
        }
        if (!"CONFIRMED".equals(bookingStatus)) {
            throw new InvalidPaymentException("Payment can only be made for CONFIRMED bookings. Current status: " + bookingStatus);
        }

        // Validate amount matches booking totalCost
        Double bookingTotalCost = ((Number) booking.get("totalCost")).doubleValue();
        if (Math.abs(request.getAmount() - bookingTotalCost) > 0.01) {
            throw new InvalidPaymentException("Payment amount (" + request.getAmount() +
                    ") does not match booking total cost (" + bookingTotalCost + ")");
        }

        // Extract equipmentId and ownerId from booking response
        Long equipmentId = ((Number) booking.get("equipmentId")).longValue();

        // We need ownerId — fetch it from equipment info embedded in booking or default
        // The booking response has equipmentId, we need to get ownerId
        // For simplicity, we store the farmerId from request and equipmentId from booking
        Long ownerId = 0L;
        if (booking.containsKey("ownerId") && booking.get("ownerId") != null) {
            ownerId = ((Number) booking.get("ownerId")).longValue();
        }

        // Generate transaction ID
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .bookingId(request.getBookingId())
                .farmerId(request.getFarmerId())
                .equipmentId(equipmentId)
                .ownerId(ownerId)
                .amount(request.getAmount())
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()))
                .status(PaymentStatus.COMPLETED)
                .transactionId(transactionId)
                .build();

        Payment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    // ========== US 4.2: Get Payments by Farmer ==========
    @Override
    public List<PaymentResponse> getPaymentsByFarmer(Long farmerId) {
        return paymentRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ========== US 4.3: Get Payments by Owner ==========
    @Override
    public OwnerRevenueResponse getPaymentsByOwner(Long ownerId) {
        List<Payment> payments = paymentRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
        Double totalRevenue = paymentRepository.getTotalRevenueByOwner(ownerId);

        List<PaymentResponse> paymentResponses = payments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return OwnerRevenueResponse.builder()
                .ownerId(ownerId)
                .totalRevenue(totalRevenue)
                .payments(paymentResponses)
                .build();
    }

    // ========== US 4.4: Admin — All Payments ==========
    @Override
    public AdminPaymentResponse getAllPayments() {
        List<Payment> payments = paymentRepository.findAllByOrderByCreatedAtDesc();
        Double totalRevenue = paymentRepository.getTotalRevenue();

        List<PaymentResponse> paymentResponses = payments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return AdminPaymentResponse.builder()
                .totalPlatformRevenue(totalRevenue)
                .payments(paymentResponses)
                .build();
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBookingId())
                .farmerId(payment.getFarmerId())
                .equipmentId(payment.getEquipmentId())
                .ownerId(payment.getOwnerId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod().name())
                .status(payment.getStatus().name())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
