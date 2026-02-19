package com.krishirent.booking.dto;

public class CostBreakdownResponse {

    private Double hours;
    private Double baseRate;
    private Double baseCost;
    private Double platformFee;
    private Double totalCost;

    public CostBreakdownResponse() {
    }

    public CostBreakdownResponse(Double hours, Double baseRate, Double baseCost, Double platformFee, Double totalCost) {
        this.hours = hours;
        this.baseRate = baseRate;
        this.baseCost = baseCost;
        this.platformFee = platformFee;
        this.totalCost = totalCost;
    }

    public Double getHours() {
        return hours;
    }

    public void setHours(Double hours) {
        this.hours = hours;
    }

    public Double getBaseRate() {
        return baseRate;
    }

    public void setBaseRate(Double baseRate) {
        this.baseRate = baseRate;
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

    @Override
    public String toString() {
        return "CostBreakdownResponse{" +
                "hours=" + hours +
                ", baseRate=" + baseRate +
                ", baseCost=" + baseCost +
                ", platformFee=" + platformFee +
                ", totalCost=" + totalCost +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CostBreakdownResponse that = (CostBreakdownResponse) o;
        return java.util.Objects.equals(hours, that.hours) &&
                java.util.Objects.equals(baseRate, that.baseRate) &&
                java.util.Objects.equals(baseCost, that.baseCost) &&
                java.util.Objects.equals(platformFee, that.platformFee) &&
                java.util.Objects.equals(totalCost, that.totalCost);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(hours, baseRate, baseCost, platformFee, totalCost);
    }

    public static CostBreakdownResponseBuilder builder() {
        return new CostBreakdownResponseBuilder();
    }

    public static class CostBreakdownResponseBuilder {
        private Double hours;
        private Double baseRate;
        private Double baseCost;
        private Double platformFee;
        private Double totalCost;

        public CostBreakdownResponseBuilder hours(Double hours) {
            this.hours = hours;
            return this;
        }

        public CostBreakdownResponseBuilder baseRate(Double baseRate) {
            this.baseRate = baseRate;
            return this;
        }

        public CostBreakdownResponseBuilder baseCost(Double baseCost) {
            this.baseCost = baseCost;
            return this;
        }

        public CostBreakdownResponseBuilder platformFee(Double platformFee) {
            this.platformFee = platformFee;
            return this;
        }

        public CostBreakdownResponseBuilder totalCost(Double totalCost) {
            this.totalCost = totalCost;
            return this;
        }

        public CostBreakdownResponse build() {
            return new CostBreakdownResponse(hours, baseRate, baseCost, platformFee, totalCost);
        }
    }
}
