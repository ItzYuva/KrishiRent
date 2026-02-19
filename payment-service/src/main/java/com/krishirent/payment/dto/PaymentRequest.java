package com.krishirent.payment.dto;

public class PaymentRequest {

    private Long bookingId;
    private Long farmerId;
    private Double amount;
    private String paymentMethod;

    public PaymentRequest() {
    }

    public PaymentRequest(Long bookingId, Long farmerId, Double amount, String paymentMethod) {
        this.bookingId = bookingId;
        this.farmerId = farmerId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
    }

    // Builder pattern
    public static PaymentRequestBuilder builder() {
        return new PaymentRequestBuilder();
    }

    public static class PaymentRequestBuilder {
        private Long bookingId;
        private Long farmerId;
        private Double amount;
        private String paymentMethod;

        public PaymentRequestBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public PaymentRequestBuilder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public PaymentRequestBuilder amount(Double amount) { this.amount = amount; return this; }
        public PaymentRequestBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }

        public PaymentRequest build() {
            return new PaymentRequest(bookingId, farmerId, amount, paymentMethod);
        }
    }

    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    @Override
    public String toString() {
        return "PaymentRequest{" +
                "bookingId=" + bookingId +
                ", farmerId=" + farmerId +
                ", amount=" + amount +
                ", paymentMethod='" + paymentMethod + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PaymentRequest that = (PaymentRequest) o;
        return java.util.Objects.equals(bookingId, that.bookingId) &&
                java.util.Objects.equals(farmerId, that.farmerId) &&
                java.util.Objects.equals(amount, that.amount) &&
                java.util.Objects.equals(paymentMethod, that.paymentMethod);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(bookingId, farmerId, amount, paymentMethod);
    }
}
