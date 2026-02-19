package com.krishirent.payment.controller;

import com.krishirent.payment.dto.*;
import com.krishirent.payment.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByFarmer(@PathVariable Long farmerId) {
        return ResponseEntity.ok(paymentService.getPaymentsByFarmer(farmerId));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<OwnerRevenueResponse> getPaymentsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(paymentService.getPaymentsByOwner(ownerId));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<AdminPaymentResponse> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
