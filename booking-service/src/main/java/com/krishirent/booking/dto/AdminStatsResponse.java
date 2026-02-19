package com.krishirent.booking.dto;

public class AdminStatsResponse {

    private Long totalUsers;
    private Long totalEquipment;
    private Long totalBookings;
    private Double totalRevenue;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(Long totalUsers, Long totalEquipment, Long totalBookings, Double totalRevenue) {
        this.totalUsers = totalUsers;
        this.totalEquipment = totalEquipment;
        this.totalBookings = totalBookings;
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalEquipment() {
        return totalEquipment;
    }

    public void setTotalEquipment(Long totalEquipment) {
        this.totalEquipment = totalEquipment;
    }

    public Long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    @Override
    public String toString() {
        return "AdminStatsResponse{" +
                "totalUsers=" + totalUsers +
                ", totalEquipment=" + totalEquipment +
                ", totalBookings=" + totalBookings +
                ", totalRevenue=" + totalRevenue +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AdminStatsResponse that = (AdminStatsResponse) o;
        return java.util.Objects.equals(totalUsers, that.totalUsers) &&
                java.util.Objects.equals(totalEquipment, that.totalEquipment) &&
                java.util.Objects.equals(totalBookings, that.totalBookings) &&
                java.util.Objects.equals(totalRevenue, that.totalRevenue);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(totalUsers, totalEquipment, totalBookings, totalRevenue);
    }

    public static AdminStatsResponseBuilder builder() {
        return new AdminStatsResponseBuilder();
    }

    public static class AdminStatsResponseBuilder {
        private Long totalUsers;
        private Long totalEquipment;
        private Long totalBookings;
        private Double totalRevenue;

        public AdminStatsResponseBuilder totalUsers(Long totalUsers) {
            this.totalUsers = totalUsers;
            return this;
        }

        public AdminStatsResponseBuilder totalEquipment(Long totalEquipment) {
            this.totalEquipment = totalEquipment;
            return this;
        }

        public AdminStatsResponseBuilder totalBookings(Long totalBookings) {
            this.totalBookings = totalBookings;
            return this;
        }

        public AdminStatsResponseBuilder totalRevenue(Double totalRevenue) {
            this.totalRevenue = totalRevenue;
            return this;
        }

        public AdminStatsResponse build() {
            return new AdminStatsResponse(totalUsers, totalEquipment, totalBookings, totalRevenue);
        }
    }
}
