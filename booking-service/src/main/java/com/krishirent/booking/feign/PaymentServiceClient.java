package com.krishirent.booking.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient(name = "payment-service")
public interface PaymentServiceClient {

    @GetMapping("/payments/admin/all")
    Map<String, Object> getAllPayments();
}
