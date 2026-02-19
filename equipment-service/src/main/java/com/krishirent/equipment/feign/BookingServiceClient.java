package com.krishirent.equipment.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name = "booking-service")
public interface BookingServiceClient {

    @GetMapping("/bookings/equipment/{equipmentId}")
    List<Map<String, Object>> getBookingsByEquipment(@PathVariable("equipmentId") Long equipmentId);
}
