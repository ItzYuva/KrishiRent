package com.krishirent.payment.service;

import com.krishirent.payment.dto.*;

import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(PaymentRequest request);

    List<PaymentResponse> getPaymentsByFarmer(Long farmerId);

    OwnerRevenueResponse getPaymentsByOwner(Long ownerId);

    AdminPaymentResponse getAllPayments();
}
