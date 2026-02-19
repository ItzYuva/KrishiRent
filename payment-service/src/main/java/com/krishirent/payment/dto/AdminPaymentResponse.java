package com.krishirent.payment.dto;

import java.util.List;

public class AdminPaymentResponse {

    private Double totalPlatformRevenue;
    private List<PaymentResponse> payments;

    public AdminPaymentResponse() {
    }

    public AdminPaymentResponse(Double totalPlatformRevenue, List<PaymentResponse> payments) {
        this.totalPlatformRevenue = totalPlatformRevenue;
        this.payments = payments;
    }

    // Builder pattern
    public static AdminPaymentResponseBuilder builder() {
        return new AdminPaymentResponseBuilder();
    }

    public static class AdminPaymentResponseBuilder {
        private Double totalPlatformRevenue;
        private List<PaymentResponse> payments;

        public AdminPaymentResponseBuilder totalPlatformRevenue(Double totalPlatformRevenue) { this.totalPlatformRevenue = totalPlatformRevenue; return this; }
        public AdminPaymentResponseBuilder payments(List<PaymentResponse> payments) { this.payments = payments; return this; }

        public AdminPaymentResponse build() {
            return new AdminPaymentResponse(totalPlatformRevenue, payments);
        }
    }

    // Getters and Setters
    public Double getTotalPlatformRevenue() { return totalPlatformRevenue; }
    public void setTotalPlatformRevenue(Double totalPlatformRevenue) { this.totalPlatformRevenue = totalPlatformRevenue; }

    public List<PaymentResponse> getPayments() { return payments; }
    public void setPayments(List<PaymentResponse> payments) { this.payments = payments; }

    @Override
    public String toString() {
        return "AdminPaymentResponse{" +
                "totalPlatformRevenue=" + totalPlatformRevenue +
                ", payments=" + payments +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AdminPaymentResponse that = (AdminPaymentResponse) o;
        return java.util.Objects.equals(totalPlatformRevenue, that.totalPlatformRevenue) &&
                java.util.Objects.equals(payments, that.payments);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(totalPlatformRevenue, payments);
    }
}
