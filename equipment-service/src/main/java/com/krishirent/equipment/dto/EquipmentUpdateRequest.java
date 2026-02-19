package com.krishirent.equipment.dto;

public class EquipmentUpdateRequest {

    private String name;
    private String description;
    private Double hourlyRate;
    private String status;

    // No-args constructor
    public EquipmentUpdateRequest() {
    }

    // All-args constructor
    public EquipmentUpdateRequest(String name, String description, Double hourlyRate, String status) {
        this.name = name;
        this.description = description;
        this.hourlyRate = hourlyRate;
        this.status = status;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(Double hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // toString
    @Override
    public String toString() {
        return "EquipmentUpdateRequest{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", hourlyRate=" + hourlyRate +
                ", status='" + status + '\'' +
                '}';
    }

    // Builder pattern
    public static EquipmentUpdateRequestBuilder builder() {
        return new EquipmentUpdateRequestBuilder();
    }

    public static class EquipmentUpdateRequestBuilder {
        private String name;
        private String description;
        private Double hourlyRate;
        private String status;

        EquipmentUpdateRequestBuilder() {
        }

        public EquipmentUpdateRequestBuilder name(String name) {
            this.name = name;
            return this;
        }

        public EquipmentUpdateRequestBuilder description(String description) {
            this.description = description;
            return this;
        }

        public EquipmentUpdateRequestBuilder hourlyRate(Double hourlyRate) {
            this.hourlyRate = hourlyRate;
            return this;
        }

        public EquipmentUpdateRequestBuilder status(String status) {
            this.status = status;
            return this;
        }

        public EquipmentUpdateRequest build() {
            return new EquipmentUpdateRequest(name, description, hourlyRate, status);
        }
    }
}
