package com.krishirent.booking.dto;

public class AvailabilityResponse {

    private boolean available;
    private String reason;

    public AvailabilityResponse() {
    }

    public AvailabilityResponse(boolean available, String reason) {
        this.available = available;
        this.reason = reason;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    @Override
    public String toString() {
        return "AvailabilityResponse{" +
                "available=" + available +
                ", reason='" + reason + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AvailabilityResponse that = (AvailabilityResponse) o;
        return available == that.available &&
                java.util.Objects.equals(reason, that.reason);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(available, reason);
    }

    public static AvailabilityResponseBuilder builder() {
        return new AvailabilityResponseBuilder();
    }

    public static class AvailabilityResponseBuilder {
        private boolean available;
        private String reason;

        public AvailabilityResponseBuilder available(boolean available) {
            this.available = available;
            return this;
        }

        public AvailabilityResponseBuilder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public AvailabilityResponse build() {
            return new AvailabilityResponse(available, reason);
        }
    }
}
