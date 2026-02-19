package com.krishirent.payment.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long bookingId;

    @Column(nullable = false)
    private Long farmerId;

    @Column(nullable = false)
    private Long equipmentId;

    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(nullable = false, unique = true)
    private String transactionId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Payment() {
    }

    public Payment(Long id, Long bookingId, Long farmerId, Long equipmentId, Long ownerId,
                   Double amount, PaymentMethod paymentMethod, PaymentStatus status,
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
    public static PaymentBuilder builder() {
        return new PaymentBuilder();
    }

    public static class PaymentBuilder {
        private Long id;
        private Long bookingId;
        private Long farmerId;
        private Long equipmentId;
        private Long ownerId;
        private Double amount;
        private PaymentMethod paymentMethod;
        private PaymentStatus status;
        private String transactionId;
        private LocalDateTime createdAt;

        public PaymentBuilder id(Long id) { this.id = id; return this; }
        public PaymentBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public PaymentBuilder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public PaymentBuilder equipmentId(Long equipmentId) { this.equipmentId = equipmentId; return this; }
        public PaymentBuilder ownerId(Long ownerId) { this.ownerId = ownerId; return this; }
        public PaymentBuilder amount(Double amount) { this.amount = amount; return this; }
        public PaymentBuilder paymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public PaymentBuilder status(PaymentStatus status) { this.status = status; return this; }
        public PaymentBuilder transactionId(String transactionId) { this.transactionId = transactionId; return this; }
        public PaymentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Payment build() {
            return new Payment(id, bookingId, farmerId, equipmentId, ownerId,
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

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Payment{" +
                "id=" + id +
                ", bookingId=" + bookingId +
                ", farmerId=" + farmerId +
                ", equipmentId=" + equipmentId +
                ", ownerId=" + ownerId +
                ", amount=" + amount +
                ", paymentMethod=" + paymentMethod +
                ", status=" + status +
                ", transactionId='" + transactionId + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Payment payment = (Payment) o;
        return java.util.Objects.equals(id, payment.id) &&
                java.util.Objects.equals(bookingId, payment.bookingId) &&
                java.util.Objects.equals(farmerId, payment.farmerId) &&
                java.util.Objects.equals(equipmentId, payment.equipmentId) &&
                java.util.Objects.equals(ownerId, payment.ownerId) &&
                java.util.Objects.equals(amount, payment.amount) &&
                paymentMethod == payment.paymentMethod &&
                status == payment.status &&
                java.util.Objects.equals(transactionId, payment.transactionId) &&
                java.util.Objects.equals(createdAt, payment.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, bookingId, farmerId, equipmentId, ownerId,
                amount, paymentMethod, status, transactionId, createdAt);
    }
}
