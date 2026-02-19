package com.krishirent.payment.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "booking-service")
public interface BookingServiceClient {

    @GetMapping("/bookings/{id}")
    Map<String, Object> getBookingById(@PathVariable("id") Long id);
}
