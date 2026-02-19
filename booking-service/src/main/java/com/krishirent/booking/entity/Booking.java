package com.krishirent.booking.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long equipmentId;

    @Column(nullable = false)
    private Long farmerId;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    @Column(nullable = false)
    private LocalDateTime endDateTime;

    @Column(nullable = false)
    private Double totalHours;

    @Column(nullable = false)
    private Double baseCost;

    @Column(nullable = false)
    private Double platformFee;

    @Column(nullable = false)
    private Double totalCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    private Double refundAmount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Booking() {
    }

    public Booking(Long id, Long equipmentId, Long farmerId, LocalDateTime startDateTime, LocalDateTime endDateTime,
                   Double totalHours, Double baseCost, Double platformFee, Double totalCost, BookingStatus status,
                   Double refundAmount, LocalDateTime createdAt) {
        this.id = id;
        this.equipmentId = equipmentId;
        this.farmerId = farmerId;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.totalHours = totalHours;
        this.baseCost = baseCost;
        this.platformFee = platformFee;
        this.totalCost = totalCost;
        this.status = status;
        this.refundAmount = refundAmount;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public Double getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Double totalHours) {
        this.totalHours = totalHours;
    }

    public Double getBaseCost() {
        return baseCost;
    }

    public void setBaseCost(Double baseCost) {
        this.baseCost = baseCost;
    }

    public Double getPlatformFee() {
        return platformFee;
    }

    public void setPlatformFee(Double platformFee) {
        this.platformFee = platformFee;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public Double getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(Double refundAmount) {
        this.refundAmount = refundAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", equipmentId=" + equipmentId +
                ", farmerId=" + farmerId +
                ", startDateTime=" + startDateTime +
                ", endDateTime=" + endDateTime +
                ", totalHours=" + totalHours +
                ", baseCost=" + baseCost +
                ", platformFee=" + platformFee +
                ", totalCost=" + totalCost +
                ", status=" + status +
                ", refundAmount=" + refundAmount +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Booking booking = (Booking) o;
        return java.util.Objects.equals(id, booking.id) &&
                java.util.Objects.equals(equipmentId, booking.equipmentId) &&
                java.util.Objects.equals(farmerId, booking.farmerId) &&
                java.util.Objects.equals(startDateTime, booking.startDateTime) &&
                java.util.Objects.equals(endDateTime, booking.endDateTime) &&
                java.util.Objects.equals(totalHours, booking.totalHours) &&
                java.util.Objects.equals(baseCost, booking.baseCost) &&
                java.util.Objects.equals(platformFee, booking.platformFee) &&
                java.util.Objects.equals(totalCost, booking.totalCost) &&
                status == booking.status &&
                java.util.Objects.equals(refundAmount, booking.refundAmount) &&
                java.util.Objects.equals(createdAt, booking.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, equipmentId, farmerId, startDateTime, endDateTime,
                totalHours, baseCost, platformFee, totalCost, status, refundAmount, createdAt);
    }

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public static class BookingBuilder {
        private Long id;
        private Long equipmentId;
        private Long farmerId;
        private LocalDateTime startDateTime;
        private LocalDateTime endDateTime;
        private Double totalHours;
        private Double baseCost;
        private Double platformFee;
        private Double totalCost;
        private BookingStatus status;
        private Double refundAmount;
        private LocalDateTime createdAt;

        public BookingBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BookingBuilder equipmentId(Long equipmentId) {
            this.equipmentId = equipmentId;
            return this;
        }

        public BookingBuilder farmerId(Long farmerId) {
            this.farmerId = farmerId;
            return this;
        }

        public BookingBuilder startDateTime(LocalDateTime startDateTime) {
            this.startDateTime = startDateTime;
            return this;
        }

        public BookingBuilder endDateTime(LocalDateTime endDateTime) {
            this.endDateTime = endDateTime;
            return this;
        }

        public BookingBuilder totalHours(Double totalHours) {
            this.totalHours = totalHours;
            return this;
        }

        public BookingBuilder baseCost(Double baseCost) {
            this.baseCost = baseCost;
            return this;
        }

        public BookingBuilder platformFee(Double platformFee) {
            this.platformFee = platformFee;
            return this;
        }

        public BookingBuilder totalCost(Double totalCost) {
            this.totalCost = totalCost;
            return this;
        }

        public BookingBuilder status(BookingStatus status) {
            this.status = status;
            return this;
        }

        public BookingBuilder refundAmount(Double refundAmount) {
            this.refundAmount = refundAmount;
            return this;
        }

        public BookingBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Booking build() {
            return new Booking(id, equipmentId, farmerId, startDateTime, endDateTime,
                    totalHours, baseCost, platformFee, totalCost, status, refundAmount, createdAt);
        }
    }
}
