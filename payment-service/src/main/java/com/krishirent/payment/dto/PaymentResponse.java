package com.krishirent.payment.dto;

import java.time.LocalDateTime;

public class PaymentResponse {

    private Long id;
    private Long bookingId;
    private Long farmerId;
    private Long equipmentId;
    private Long ownerId;
    private Double amount;
    private String paymentMethod;
    private String status;
    private String transactionId;
    private LocalDateTime createdAt;

    public PaymentResponse() {
    }

    public PaymentResponse(Long id, Long bookingId, Long farmerId, Long equipmentId, Long ownerId,
                           Double amount, String paymentMethod, String status,
                           String transactionId, LocalDateTime createdAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.farmerId = farmerId;
        this.equipmentId = equipmentId;
        this.ownerId = ownerId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.transactionId = transactionId;
        this.createdAt = createdAt;
    }

    // Builder pattern
    public static PaymentResponseBuilder builder() {
        return new PaymentResponseBuilder();
    }

    public static class PaymentResponseBuilder {
        private Long id;
        private Long bookingId;
        private Long farmerId;
        private Long equipmentId;
        private Long ownerId;
        private Double amount;
        private String paymentMethod;
        private String status;
        private String transactionId;
        private LocalDateTime createdAt;

        public PaymentResponseBuilder id(Long id) { this.id = id; return this; }
        public PaymentResponseBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public PaymentResponseBuilder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public PaymentResponseBuilder equipmentId(Long equipmentId) { this.equipmentId = equipmentId; return this; }
        public PaymentResponseBuilder ownerId(Long ownerId) { this.ownerId = ownerId; return this; }
        public PaymentResponseBuilder amount(Double amount) { this.amount = amount; return this; }
        public PaymentResponseBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public PaymentResponseBuilder status(String status) { this.status = status; return this; }
        public PaymentResponseBuilder transactionId(String transactionId) { this.transactionId = transactionId; return this; }
        public PaymentResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public PaymentResponse build() {
            return new PaymentResponse(id, bookingId, farmerId, equipmentId, ownerId,
                    amount, paymentMethod, status, transactionId, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public Long getEquipmentId() { return equipmentId; }
    public void setEquipmentId(Long equipmentId) { this.equipmentId = equipmentId; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "PaymentResponse{" +
                "id=" + id +
                ", bookingId=" + bookingId +
                ", farmerId=" + farmerId +
                ", equipmentId=" + equipmentId +
                ", ownerId=" + ownerId +
                ", amount=" + amount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", status='" + status + '\'' +
                ", transactionId='" + transactionId + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PaymentResponse that = (PaymentResponse) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(bookingId, that.bookingId) &&
                java.util.Objects.equals(farmerId, that.farmerId) &&
                java.util.Objects.equals(equipmentId, that.equipmentId) &&
                java.util.Objects.equals(ownerId, that.ownerId) &&
                java.util.Objects.equals(amount, that.amount) &&
                java.util.Objects.equals(paymentMethod, that.paymentMethod) &&
                java.util.Objects.equals(status, that.status) &&
                java.util.Objects.equals(transactionId, that.transactionId) &&
                java.util.Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, bookingId, farmerId, equipmentId, ownerId,
                amount, paymentMethod, status, transactionId, createdAt);
    }
}
