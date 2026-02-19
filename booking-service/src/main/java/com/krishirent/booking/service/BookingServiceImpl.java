package com.krishirent.booking.service;

import com.krishirent.booking.dto.*;
import com.krishirent.booking.entity.Booking;
import com.krishirent.booking.entity.BookingStatus;
import com.krishirent.booking.exception.*;
import com.krishirent.booking.feign.EquipmentServiceClient;
import com.krishirent.booking.feign.PaymentServiceClient;
import com.krishirent.booking.feign.UserServiceClient;
import com.krishirent.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final EquipmentServiceClient equipmentServiceClient;
    private final UserServiceClient userServiceClient;
    private final PaymentServiceClient paymentServiceClient;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              EquipmentServiceClient equipmentServiceClient,
                              UserServiceClient userServiceClient,
                              PaymentServiceClient paymentServiceClient) {
        this.bookingRepository = bookingRepository;
        this.equipmentServiceClient = equipmentServiceClient;
        this.userServiceClient = userServiceClient;
        this.paymentServiceClient = paymentServiceClient;
    }

    // ========== Get Booking By ID (for Feign) ==========
    @Override
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));
        return mapToResponseWithEquipmentName(booking);
    }

    // ========== US 3.1: Check Availability ==========
    @Override
    public AvailabilityResponse checkAvailability(Long equipmentId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        // Validate equipment exists
        Map<String, Object> equipment = equipmentServiceClient.getEquipmentById(equipmentId);
        String equipmentType = (String) equipment.get("type");

        // Check operating hours for heavy equipment (TRACTOR, HARVESTER)
        if (isHeavyEquipment(equipmentType)) {
            LocalTime startTime = startDateTime.toLocalTime();
            LocalTime endTime = endDateTime.toLocalTime();
            if (startTime.isBefore(LocalTime.of(6, 0)) || endTime.isAfter(LocalTime.of(20, 0))) {
                return AvailabilityResponse.builder()
                        .available(false)
                        .reason("Heavy equipment (TRACTOR/HARVESTER) can only be booked between 06:00 and 20:00")
                        .build();
            }
        }

        // Check for overlapping bookings with 1-hour transit buffer
        // We expand the search window by 1 hour on each side
        LocalDateTime startWithBuffer = startDateTime.minusHours(1);
        LocalDateTime endWithBuffer = endDateTime.plusHours(1);

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                equipmentId, BookingStatus.CONFIRMED, startWithBuffer, endWithBuffer);

        if (!overlapping.isEmpty()) {
            return AvailabilityResponse.builder()
                    .available(false)
                    .reason("Equipment is already booked during this time slot (including 1-hour transit buffer)")
                    .build();
        }

        return AvailabilityResponse.builder()
                .available(true)
                .reason("Equipment is available for the requested time slot")
                .build();
    }

    // ========== US 3.2: Calculate Cost ==========
    @Override
    public CostBreakdownResponse calculateCost(Long equipmentId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        Map<String, Object> equipment = equipmentServiceClient.getEquipmentById(equipmentId);
        Double hourlyRate = ((Number) equipment.get("hourlyRate")).doubleValue();

        double totalHours = Duration.between(startDateTime, endDateTime).toMinutes() / 60.0;
        double baseCost = calculateBaseCost(totalHours, hourlyRate);
        double platformFee = Math.round(baseCost * 0.05 * 100.0) / 100.0;
        double totalCost = Math.round((baseCost + platformFee) * 100.0) / 100.0;

        return CostBreakdownResponse.builder()
                .hours(totalHours)
                .baseRate(hourlyRate)
                .baseCost(baseCost)
                .platformFee(platformFee)
                .totalCost(totalCost)
                .build();
    }

    // ========== US 3.3: Create Booking (CRITICAL — @Transactional) ==========
    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        LocalDateTime now = LocalDateTime.now();

        // Validate duration: minimum 2 hours
        double totalHours = Duration.between(request.getStartDateTime(), request.getEndDateTime()).toMinutes() / 60.0;
        if (totalHours < 2) {
            throw new InvalidBookingException("Minimum booking duration is 2 hours. Requested: " + totalHours + " hours");
        }

        // Validate duration: maximum 72 hours
        if (totalHours > 72) {
            throw new InvalidBookingException("Maximum booking duration is 72 hours. Requested: " + totalHours + " hours");
        }

        // Validate lead time: must be at least 2 hours in advance
        if (request.getStartDateTime().isBefore(now.plusHours(2))) {
            throw new InvalidBookingException("Booking must be placed at least 2 hours in advance from current time");
        }

        // Validate equipment exists and get details
        Map<String, Object> equipment = equipmentServiceClient.getEquipmentById(request.getEquipmentId());
        String equipmentType = (String) equipment.get("type");
        Double hourlyRate = ((Number) equipment.get("hourlyRate")).doubleValue();

        // Validate farmer exists
        userServiceClient.getUserById(request.getFarmerId());

        // Validate operating hours for heavy equipment (TRACTOR, HARVESTER)
        if (isHeavyEquipment(equipmentType)) {
            LocalTime startTime = request.getStartDateTime().toLocalTime();
            LocalTime endTime = request.getEndDateTime().toLocalTime();
            if (startTime.isBefore(LocalTime.of(6, 0)) || endTime.isAfter(LocalTime.of(20, 0))) {
                throw new InvalidBookingException("Heavy equipment (TRACTOR/HARVESTER) can only be booked between 06:00 and 20:00");
            }
        }

        // Double booking prevention with 1-hour transit buffer
        // We check if any existing CONFIRMED booking overlaps with
        // [requestedStart - 1hr buffer, requestedEnd + 1hr buffer]
        LocalDateTime startWithBuffer = request.getStartDateTime().minusHours(1);
        LocalDateTime endWithBuffer = request.getEndDateTime().plusHours(1);

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                request.getEquipmentId(), BookingStatus.CONFIRMED, startWithBuffer, endWithBuffer);

        if (!overlapping.isEmpty()) {
            throw new DoubleBookingException("Equipment is already booked during this time slot (including 1-hour transit buffer). " +
                    "Overlapping booking ID: " + overlapping.get(0).getId());
        }

        // Calculate cost with daily cap rule
        double baseCost = calculateBaseCost(totalHours, hourlyRate);
        double platformFee = Math.round(baseCost * 0.05 * 100.0) / 100.0;
        double totalCost = Math.round((baseCost + platformFee) * 100.0) / 100.0;

        // Create booking
        Booking booking = Booking.builder()
                .equipmentId(request.getEquipmentId())
                .farmerId(request.getFarmerId())
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .totalHours(totalHours)
                .baseCost(baseCost)
                .platformFee(platformFee)
                .totalCost(totalCost)
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking saved = bookingRepository.save(booking);

        // Update equipment status to BOOKED
        try {
            equipmentServiceClient.updateEquipmentStatus(request.getEquipmentId(), "BOOKED");
        } catch (Exception e) {
            log.warn("Could not update equipment status: {}", e.getMessage());
        }

        return mapToResponse(saved, (String) equipment.get("name"));
    }

    // ========== US 3.4: Get Bookings by Farmer ==========
    @Override
    public List<BookingResponse> getBookingsByFarmer(Long farmerId) {
        return bookingRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId)
                .stream()
                .map(b -> mapToResponseWithEquipmentName(b))
                .collect(Collectors.toList());
    }

    // ========== US 3.5: Cancel Booking with Refund Tiers ==========
    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new CancellationNotAllowedException("Only CONFIRMED bookings can be cancelled. Current status: " + booking.getStatus());
        }

        LocalDateTime now = LocalDateTime.now();

        // Cannot cancel after start time
        if (now.isAfter(booking.getStartDateTime())) {
            throw new CancellationNotAllowedException("Cannot cancel booking after start time. Booking started at: " + booking.getStartDateTime());
        }

        // Calculate refund based on cancellation tier
        Duration timeUntilStart = Duration.between(now, booking.getStartDateTime());
        long hoursUntilStart = timeUntilStart.toHours();
        double refundAmount;

        if (hoursUntilStart >= 24) {
            // More than 24 hours: 100% refund (platform fee non-refundable)
            refundAmount = booking.getBaseCost();
        } else if (hoursUntilStart >= 12) {
            // Between 12-24 hours: 80% refund
            refundAmount = Math.round(booking.getTotalCost() * 0.80 * 100.0) / 100.0;
        } else {
            // Less than 12 hours: 50% refund
            refundAmount = Math.round(booking.getTotalCost() * 0.50 * 100.0) / 100.0;
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setRefundAmount(refundAmount);
        Booking updated = bookingRepository.save(booking);

        // Return equipment to AVAILABLE
        try {
            equipmentServiceClient.updateEquipmentStatus(booking.getEquipmentId(), "AVAILABLE");
        } catch (Exception e) {
            log.warn("Could not update equipment status: {}", e.getMessage());
        }

        return mapToResponseWithEquipmentName(updated);
    }

    // ========== US 3.6: Get Bookings by Equipment ==========
    @Override
    public List<BookingResponse> getBookingsByEquipment(Long equipmentId) {
        return bookingRepository.findByEquipmentIdOrderByCreatedAtDesc(equipmentId)
                .stream()
                .map(b -> mapToResponseWithEquipmentName(b))
                .collect(Collectors.toList());
    }

    // ========== US 3.7: Complete Booking ==========
    @Override
    @Transactional
    public BookingResponse completeBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new InvalidBookingException("Only CONFIRMED bookings can be completed. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.COMPLETED);
        Booking updated = bookingRepository.save(booking);

        // Return equipment to AVAILABLE
        try {
            equipmentServiceClient.updateEquipmentStatus(booking.getEquipmentId(), "AVAILABLE");
        } catch (Exception e) {
            log.warn("Could not update equipment status: {}", e.getMessage());
        }

        return mapToResponseWithEquipmentName(updated);
    }

    // ========== US 5.1: All Bookings (Admin) ==========
    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(b -> mapToResponseWithEquipmentName(b))
                .collect(Collectors.toList());
    }

    // ========== US 5.2: Admin Stats ==========
    @Override
    public AdminStatsResponse getAdminStats() {
        Long totalUsers = 0L;
        Long totalEquipment = 0L;
        Double totalRevenue = bookingRepository.getTotalRevenue();

        try {
            totalUsers = userServiceClient.getUserCount();
        } catch (Exception e) {
            log.warn("Could not fetch user count: {}", e.getMessage());
        }

        try {
            totalEquipment = equipmentServiceClient.getEquipmentCount();
        } catch (Exception e) {
            log.warn("Could not fetch equipment count: {}", e.getMessage());
        }

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalEquipment(totalEquipment)
                .totalBookings(bookingRepository.count())
                .totalRevenue(totalRevenue)
                .build();
    }

    // ========== COST CALCULATION WITH DAILY CAP ==========
    /**
     * Daily cap rule: if booking duration exceeds 8 hours in a single day,
     * apply a flat daily rate (hourlyRate x 8) instead of continuing to multiply.
     *
     * For multi-day bookings:
     * - Each full 24-hour block: capped at hourlyRate x 8
     * - Remaining hours: if > 8, cap at hourlyRate x 8; otherwise hourlyRate x remainingHours
     */
    private double calculateBaseCost(double totalHours, double hourlyRate) {
        if (totalHours <= 8) {
            // Under 8 hours — simple multiplication
            return Math.round(totalHours * hourlyRate * 100.0) / 100.0;
        }

        double dailyCapRate = hourlyRate * 8; // flat daily rate
        long fullDays = (long) (totalHours / 24);
        double remainingHours = totalHours - (fullDays * 24);

        double cost = fullDays * dailyCapRate;

        if (remainingHours > 8) {
            cost += dailyCapRate; // cap the remaining partial day too
        } else {
            cost += remainingHours * hourlyRate;
        }

        return Math.round(cost * 100.0) / 100.0;
    }

    // ========== HELPER: Check if equipment is heavy ==========
    private boolean isHeavyEquipment(String type) {
        return "TRACTOR".equalsIgnoreCase(type) || "HARVESTER".equalsIgnoreCase(type);
    }

    // ========== MAPPER: Booking -> BookingResponse ==========
    private BookingResponse mapToResponse(Booking booking, String equipmentName) {
        return BookingResponse.builder()
                .id(booking.getId())
                .equipmentId(booking.getEquipmentId())
                .equipmentName(equipmentName)
                .farmerId(booking.getFarmerId())
                .startDateTime(booking.getStartDateTime())
                .endDateTime(booking.getEndDateTime())
                .totalHours(booking.getTotalHours())
                .baseCost(booking.getBaseCost())
                .platformFee(booking.getPlatformFee())
                .totalCost(booking.getTotalCost())
                .status(booking.getStatus().name())
                .refundAmount(booking.getRefundAmount())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    private BookingResponse mapToResponseWithEquipmentName(Booking booking) {
        String equipmentName = "Unknown";
        try {
            Map<String, Object> equipment = equipmentServiceClient.getEquipmentById(booking.getEquipmentId());
            equipmentName = (String) equipment.get("name");
        } catch (Exception e) {
            log.warn("Could not fetch equipment name for id {}: {}", booking.getEquipmentId(), e.getMessage());
        }
        return mapToResponse(booking, equipmentName);
    }
}
