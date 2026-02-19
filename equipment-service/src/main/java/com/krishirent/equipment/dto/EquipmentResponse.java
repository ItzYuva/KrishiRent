package com.krishirent.equipment.dto;

import java.time.LocalDateTime;

public class EquipmentResponse {

    private Long id;
    private String name;
    private String type;
    private String description;
    private Double hourlyRate;
    private String location;
    private String district;
    private String imageUrl;
    private Long ownerId;
    private String ownerName;
    private String status;
    private LocalDateTime createdAt;

    // No-args constructor
    public EquipmentResponse() {
    }

    // All-args constructor
    public EquipmentResponse(Long id, String name, String type, String description, Double hourlyRate,
                             String location, String district, String imageUrl, Long ownerId,
                             String ownerName, String status, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.hourlyRate = hourlyRate;
        this.location = location;
        this.district = district;
        this.imageUrl = imageUrl;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // toString
    @Override
    public String toString() {
        return "EquipmentResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", description='" + description + '\'' +
                ", hourlyRate=" + hourlyRate +
                ", location='" + location + '\'' +
                ", district='" + district + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", ownerId=" + ownerId +
                ", ownerName='" + ownerName + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    // Builder pattern
    public static EquipmentResponseBuilder builder() {
        return new EquipmentResponseBuilder();
    }

    public static class EquipmentResponseBuilder {
        private Long id;
        private String name;
        private String type;
        private String description;
        private Double hourlyRate;
        private String location;
        private String district;
        private String imageUrl;
        private Long ownerId;
        private String ownerName;
        private String status;
        private LocalDateTime createdAt;

        EquipmentResponseBuilder() {
        }

        public EquipmentResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public EquipmentResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public EquipmentResponseBuilder type(String type) {
            this.type = type;
            return this;
        }

        public EquipmentResponseBuilder description(String description) {
            this.description = description;
            return this;
        }

        public EquipmentResponseBuilder hourlyRate(Double hourlyRate) {
            this.hourlyRate = hourlyRate;
            return this;
        }

        public EquipmentResponseBuilder location(String location) {
            this.location = location;
            return this;
        }

        public EquipmentResponseBuilder district(String district) {
            this.district = district;
            return this;
        }

        public EquipmentResponseBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public EquipmentResponseBuilder ownerId(Long ownerId) {
            this.ownerId = ownerId;
            return this;
        }

        public EquipmentResponseBuilder ownerName(String ownerName) {
            this.ownerName = ownerName;
            return this;
        }

        public EquipmentResponseBuilder status(String status) {
            this.status = status;
            return this;
        }

        public EquipmentResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public EquipmentResponse build() {
            return new EquipmentResponse(id, name, type, description, hourlyRate, location, district,
                    imageUrl, ownerId, ownerName, status, createdAt);
        }
    }
}
