package com.krishirent.booking.dto;

import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long equipmentId;
    private String equipmentName;
    private Long farmerId;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Double totalHours;
    private Double baseCost;
    private Double platformFee;
    private Double totalCost;
    private String status;
    private Double refundAmount;
    private LocalDateTime createdAt;

    public BookingResponse() {
    }

    public BookingResponse(Long id, Long equipmentId, String equipmentName, Long farmerId,
                           LocalDateTime startDateTime, LocalDateTime endDateTime, Double totalHours,
                           Double baseCost, Double platformFee, Double totalCost, String status,
                           Double refundAmount, LocalDateTime createdAt) {
        this.id = id;
        this.equipmentId = equipmentId;
        this.equipmentName = equipmentName;
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

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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
        return "BookingResponse{" +
                "id=" + id +
                ", equipmentId=" + equipmentId +
                ", equipmentName='" + equipmentName + '\'' +
                ", farmerId=" + farmerId +
                ", startDateTime=" + startDateTime +
                ", endDateTime=" + endDateTime +
                ", totalHours=" + totalHours +
                ", baseCost=" + baseCost +
                ", platformFee=" + platformFee +
                ", totalCost=" + totalCost +
                ", status='" + status + '\'' +
                ", refundAmount=" + refundAmount +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookingResponse that = (BookingResponse) o;
        return java.util.Objects.equals(id, that.id) &&
                java.util.Objects.equals(equipmentId, that.equipmentId) &&
                java.util.Objects.equals(equipmentName, that.equipmentName) &&
                java.util.Objects.equals(farmerId, that.farmerId) &&
                java.util.Objects.equals(startDateTime, that.startDateTime) &&
                java.util.Objects.equals(endDateTime, that.endDateTime) &&
                java.util.Objects.equals(totalHours, that.totalHours) &&
                java.util.Objects.equals(baseCost, that.baseCost) &&
                java.util.Objects.equals(platformFee, that.platformFee) &&
                java.util.Objects.equals(totalCost, that.totalCost) &&
                java.util.Objects.equals(status, that.status) &&
                java.util.Objects.equals(refundAmount, that.refundAmount) &&
                java.util.Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, equipmentId, equipmentName, farmerId, startDateTime,
                endDateTime, totalHours, baseCost, platformFee, totalCost, status, refundAmount, createdAt);
    }

    public static BookingResponseBuilder builder() {
        return new BookingResponseBuilder();
    }

    public static class BookingResponseBuilder {
        private Long id;
        private Long equipmentId;
        private String equipmentName;
        private Long farmerId;
        private LocalDateTime startDateTime;
        private LocalDateTime endDateTime;
        private Double totalHours;
        private Double baseCost;
        private Double platformFee;
        private Double totalCost;
        private String status;
        private Double refundAmount;
        private LocalDateTime createdAt;

        public BookingResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BookingResponseBuilder equipmentId(Long equipmentId) {
            this.equipmentId = equipmentId;
            return this;
        }

        public BookingResponseBuilder equipmentName(String equipmentName) {
            this.equipmentName = equipmentName;
            return this;
        }

        public BookingResponseBuilder farmerId(Long farmerId) {
            this.farmerId = farmerId;
            return this;
        }

        public BookingResponseBuilder startDateTime(LocalDateTime startDateTime) {
            this.startDateTime = startDateTime;
            return this;
        }

        public BookingResponseBuilder endDateTime(LocalDateTime endDateTime) {
            this.endDateTime = endDateTime;
            return this;
        }

        public BookingResponseBuilder totalHours(Double totalHours) {
            this.totalHours = totalHours;
            return this;
        }

        public BookingResponseBuilder baseCost(Double baseCost) {
            this.baseCost = baseCost;
            return this;
        }

        public BookingResponseBuilder platformFee(Double platformFee) {
            this.platformFee = platformFee;
            return this;
        }

        public BookingResponseBuilder totalCost(Double totalCost) {
            this.totalCost = totalCost;
            return this;
        }

        public BookingResponseBuilder status(String status) {
            this.status = status;
            return this;
        }

        public BookingResponseBuilder refundAmount(Double refundAmount) {
            this.refundAmount = refundAmount;
            return this;
        }

        public BookingResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public BookingResponse build() {
            return new BookingResponse(id, equipmentId, equipmentName, farmerId, startDateTime,
                    endDateTime, totalHours, baseCost, platformFee, totalCost, status, refundAmount, createdAt);
        }
    }
}
