package com.krishirent.payment.dto;

import java.util.List;

public class OwnerRevenueResponse {

    private Long ownerId;
    private Double totalRevenue;
    private List<PaymentResponse> payments;

    public OwnerRevenueResponse() {
    }

    public OwnerRevenueResponse(Long ownerId, Double totalRevenue, List<PaymentResponse> payments) {
        this.ownerId = ownerId;
        this.totalRevenue = totalRevenue;
        this.payments = payments;
    }

    // Builder pattern
    public static OwnerRevenueResponseBuilder builder() {
        return new OwnerRevenueResponseBuilder();
    }

    public static class OwnerRevenueResponseBuilder {
        private Long ownerId;
        private Double totalRevenue;
        private List<PaymentResponse> payments;

        public OwnerRevenueResponseBuilder ownerId(Long ownerId) { this.ownerId = ownerId; return this; }
        public OwnerRevenueResponseBuilder totalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public OwnerRevenueResponseBuilder payments(List<PaymentResponse> payments) { this.payments = payments; return this; }

        public OwnerRevenueResponse build() {
            return new OwnerRevenueResponse(ownerId, totalRevenue, payments);
        }
    }

    // Getters and Setters
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<PaymentResponse> getPayments() { return payments; }
    public void setPayments(List<PaymentResponse> payments) { this.payments = payments; }

    @Override
    public String toString() {
        return "OwnerRevenueResponse{" +
                "ownerId=" + ownerId +
                ", totalRevenue=" + totalRevenue +
                ", payments=" + payments +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OwnerRevenueResponse that = (OwnerRevenueResponse) o;
        return java.util.Objects.equals(ownerId, that.ownerId) &&
                java.util.Objects.equals(totalRevenue, that.totalRevenue) &&
                java.util.Objects.equals(payments, that.payments);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(ownerId, totalRevenue, payments);
    }
}
