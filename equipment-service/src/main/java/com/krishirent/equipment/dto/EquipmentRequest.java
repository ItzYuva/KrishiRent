package com.krishirent.equipment.dto;

public class EquipmentRequest {

    private String name;
    private String type;
    private String description;
    private Double hourlyRate;
    private String location;
    private String district;
    private String imageUrl;
    private Long ownerId;

    // No-args constructor
    public EquipmentRequest() {
    }

    // All-args constructor
    public EquipmentRequest(String name, String type, String description, Double hourlyRate,
                            String location, String district, String imageUrl, Long ownerId) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.hourlyRate = hourlyRate;
        this.location = location;
        this.district = district;
        this.imageUrl = imageUrl;
        this.ownerId = ownerId;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    // toString
    @Override
    public String toString() {
        return "EquipmentRequest{" +
                "name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", description='" + description + '\'' +
                ", hourlyRate=" + hourlyRate +
                ", location='" + location + '\'' +
                ", district='" + district + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", ownerId=" + ownerId +
                '}';
    }

    // Builder pattern
    public static EquipmentRequestBuilder builder() {
        return new EquipmentRequestBuilder();
    }

    public static class EquipmentRequestBuilder {
        private String name;
        private String type;
        private String description;
        private Double hourlyRate;
        private String location;
        private String district;
        private String imageUrl;
        private Long ownerId;

        EquipmentRequestBuilder() {
        }

        public EquipmentRequestBuilder name(String name) {
            this.name = name;
            return this;
        }

        public EquipmentRequestBuilder type(String type) {
            this.type = type;
            return this;
        }

        public EquipmentRequestBuilder description(String description) {
            this.description = description;
            return this;
        }

        public EquipmentRequestBuilder hourlyRate(Double hourlyRate) {
            this.hourlyRate = hourlyRate;
            return this;
        }

        public EquipmentRequestBuilder location(String location) {
            this.location = location;
            return this;
        }

        public EquipmentRequestBuilder district(String district) {
            this.district = district;
            return this;
        }

        public EquipmentRequestBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public EquipmentRequestBuilder ownerId(Long ownerId) {
            this.ownerId = ownerId;
            return this;
        }

        public EquipmentRequest build() {
            return new EquipmentRequest(name, type, description, hourlyRate, location, district,
                    imageUrl, ownerId);
        }
    }
}
