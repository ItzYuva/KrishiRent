package com.krishirent.booking.service;

import com.krishirent.booking.dto.*;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingService {

    AvailabilityResponse checkAvailability(Long equipmentId, LocalDateTime startDateTime, LocalDateTime endDateTime);

    CostBreakdownResponse calculateCost(Long equipmentId, LocalDateTime startDateTime, LocalDateTime endDateTime);

    BookingResponse getBookingById(Long id);

    BookingResponse createBooking(BookingRequest request);

    List<BookingResponse> getBookingsByFarmer(Long farmerId);

    BookingResponse cancelBooking(Long id);

    List<BookingResponse> getBookingsByEquipment(Long equipmentId);

    BookingResponse completeBooking(Long id);

    List<BookingResponse> getAllBookings();

    AdminStatsResponse getAdminStats();
}
