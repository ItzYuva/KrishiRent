package com.krishirent.equipment.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentType type;

    private String description;

    @Column(nullable = false)
    private Double hourlyRate;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String district;

    private String imageUrl;

    @Column(nullable = false)
    private Long ownerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // No-args constructor
    public Equipment() {
    }

    // All-args constructor
    public Equipment(Long id, String name, EquipmentType type, String description, Double hourlyRate,
                     String location, String district, String imageUrl, Long ownerId,
                     EquipmentStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = description;
        this.hourlyRate = hourlyRate;
        this.location = location;
        this.district = district;
        this.imageUrl = imageUrl;
        this.ownerId = ownerId;
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

    public EquipmentType getType() {
        return type;
    }

    public void setType(EquipmentType type) {
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

    public EquipmentStatus getStatus() {
        return status;
    }

    public void setStatus(EquipmentStatus status) {
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
        return "Equipment{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type=" + type +
                ", description='" + description + '\'' +
                ", hourlyRate=" + hourlyRate +
                ", location='" + location + '\'' +
                ", district='" + district + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", ownerId=" + ownerId +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }

    // Builder pattern
    public static EquipmentBuilder builder() {
        return new EquipmentBuilder();
    }

    public static class EquipmentBuilder {
        private Long id;
        private String name;
        private EquipmentType type;
        private String description;
        private Double hourlyRate;
        private String location;
        private String district;
        private String imageUrl;
        private Long ownerId;
        private EquipmentStatus status;
        private LocalDateTime createdAt;

        EquipmentBuilder() {
        }

        public EquipmentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public EquipmentBuilder name(String name) {
            this.name = name;
            return this;
        }

        public EquipmentBuilder type(EquipmentType type) {
            this.type = type;
            return this;
        }

        public EquipmentBuilder description(String description) {
            this.description = description;
            return this;
        }

        public EquipmentBuilder hourlyRate(Double hourlyRate) {
            this.hourlyRate = hourlyRate;
            return this;
        }

        public EquipmentBuilder location(String location) {
            this.location = location;
            return this;
        }

        public EquipmentBuilder district(String district) {
            this.district = district;
            return this;
        }

        public EquipmentBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public EquipmentBuilder ownerId(Long ownerId) {
            this.ownerId = ownerId;
            return this;
        }

        public EquipmentBuilder status(EquipmentStatus status) {
            this.status = status;
            return this;
        }

        public EquipmentBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Equipment build() {
            return new Equipment(id, name, type, description, hourlyRate, location, district,
                    imageUrl, ownerId, status, createdAt);
        }
    }
}
