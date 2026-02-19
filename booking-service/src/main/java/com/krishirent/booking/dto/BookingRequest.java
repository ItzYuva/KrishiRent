package com.krishirent.booking.dto;

import java.time.LocalDateTime;

public class BookingRequest {

    private Long equipmentId;
    private Long farmerId;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    public BookingRequest() {
    }

    public BookingRequest(Long equipmentId, Long farmerId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        this.equipmentId = equipmentId;
        this.farmerId = farmerId;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
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

    @Override
    public String toString() {
        return "BookingRequest{" +
                "equipmentId=" + equipmentId +
                ", farmerId=" + farmerId +
                ", startDateTime=" + startDateTime +
                ", endDateTime=" + endDateTime +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookingRequest that = (BookingRequest) o;
        return java.util.Objects.equals(equipmentId, that.equipmentId) &&
                java.util.Objects.equals(farmerId, that.farmerId) &&
                java.util.Objects.equals(startDateTime, that.startDateTime) &&
                java.util.Objects.equals(endDateTime, that.endDateTime);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(equipmentId, farmerId, startDateTime, endDateTime);
    }

    public static BookingRequestBuilder builder() {
        return new BookingRequestBuilder();
    }

    public static class BookingRequestBuilder {
        private Long equipmentId;
        private Long farmerId;
        private LocalDateTime startDateTime;
        private LocalDateTime endDateTime;

        public BookingRequestBuilder equipmentId(Long equipmentId) {
            this.equipmentId = equipmentId;
            return this;
        }

        public BookingRequestBuilder farmerId(Long farmerId) {
            this.farmerId = farmerId;
            return this;
        }

        public BookingRequestBuilder startDateTime(LocalDateTime startDateTime) {
            this.startDateTime = startDateTime;
            return this;
        }

        public BookingRequestBuilder endDateTime(LocalDateTime endDateTime) {
            this.endDateTime = endDateTime;
            return this;
        }

        public BookingRequest build() {
            return new BookingRequest(equipmentId, farmerId, startDateTime, endDateTime);
        }
    }
}
