package com.krishirent.equipment.service;

import com.krishirent.equipment.dto.EquipmentRequest;
import com.krishirent.equipment.dto.EquipmentResponse;
import com.krishirent.equipment.dto.EquipmentUpdateRequest;
import com.krishirent.equipment.entity.Equipment;
import com.krishirent.equipment.entity.EquipmentStatus;
import com.krishirent.equipment.entity.EquipmentType;
import com.krishirent.equipment.exception.ActiveBookingExistsException;
import com.krishirent.equipment.exception.EquipmentNotFoundException;
import com.krishirent.equipment.feign.BookingServiceClient;
import com.krishirent.equipment.feign.UserServiceClient;
import com.krishirent.equipment.repository.EquipmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final UserServiceClient userServiceClient;
    private final BookingServiceClient bookingServiceClient;

    public EquipmentServiceImpl(EquipmentRepository equipmentRepository,
                                UserServiceClient userServiceClient,
                                BookingServiceClient bookingServiceClient) {
        this.equipmentRepository = equipmentRepository;
        this.userServiceClient = userServiceClient;
        this.bookingServiceClient = bookingServiceClient;
    }

    @Override
    public EquipmentResponse createEquipment(EquipmentRequest request) {
        Equipment equipment = Equipment.builder()
                .name(request.getName())
                .type(EquipmentType.valueOf(request.getType().toUpperCase()))
                .description(request.getDescription())
                .hourlyRate(request.getHourlyRate())
                .location(request.getLocation())
                .district(request.getDistrict())
                .imageUrl(request.getImageUrl())
                .ownerId(request.getOwnerId())
                .status(EquipmentStatus.AVAILABLE)
                .build();

        Equipment saved = equipmentRepository.save(equipment);
        return mapToResponse(saved);
    }

    @Override
    public List<EquipmentResponse> getAllAvailableEquipment() {
        return equipmentRepository.findByStatusOrderByCreatedAtDesc(EquipmentStatus.AVAILABLE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EquipmentResponse getEquipmentById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new EquipmentNotFoundException("Equipment not found with id: " + id));

        EquipmentResponse response = mapToResponse(equipment);

        // Fetch owner name via Feign
        try {
            Map<String, Object> owner = userServiceClient.getUserById(equipment.getOwnerId());
            response.setOwnerName((String) owner.get("fullName"));
        } catch (Exception e) {
            response.setOwnerName("Unknown");
        }

        return response;
    }

    @Override
    public List<EquipmentResponse> getEquipmentByType(String type) {
        EquipmentType equipmentType = EquipmentType.valueOf(type.toUpperCase());
        return equipmentRepository.findByTypeAndStatusOrderByCreatedAtDesc(equipmentType, EquipmentStatus.AVAILABLE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EquipmentResponse updateEquipment(Long id, EquipmentUpdateRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new EquipmentNotFoundException("Equipment not found with id: " + id));

        if (request.getName() != null) {
            equipment.setName(request.getName());
        }
        if (request.getDescription() != null) {
            equipment.setDescription(request.getDescription());
        }
        if (request.getHourlyRate() != null) {
            equipment.setHourlyRate(request.getHourlyRate());
        }
        if (request.getStatus() != null) {
            equipment.setStatus(EquipmentStatus.valueOf(request.getStatus().toUpperCase()));
        }

        Equipment updated = equipmentRepository.save(equipment);
        return mapToResponse(updated);
    }

    @Override
    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new EquipmentNotFoundException("Equipment not found with id: " + id));

        // Check for active bookings via Feign
        try {
            List<Map<String, Object>> bookings = bookingServiceClient.getBookingsByEquipment(id);
            boolean hasActiveBookings = bookings.stream()
                    .anyMatch(b -> "CONFIRMED".equals(b.get("status")));
            if (hasActiveBookings) {
                throw new ActiveBookingExistsException("Cannot delete equipment with active bookings");
            }
        } catch (ActiveBookingExistsException e) {
            throw e;
        } catch (Exception e) {
            // If booking-service is unavailable, allow deletion
        }

        equipmentRepository.delete(equipment);
    }

    @Override
    public void updateEquipmentStatus(Long id, String status) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new EquipmentNotFoundException("Equipment not found with id: " + id));
        equipment.setStatus(EquipmentStatus.valueOf(status.toUpperCase()));
        equipmentRepository.save(equipment);
    }

    @Override
    public long getEquipmentCount() {
        return equipmentRepository.count();
    }

    private EquipmentResponse mapToResponse(Equipment equipment) {
        return EquipmentResponse.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .type(equipment.getType().name())
                .description(equipment.getDescription())
                .hourlyRate(equipment.getHourlyRate())
                .location(equipment.getLocation())
                .district(equipment.getDistrict())
                .imageUrl(equipment.getImageUrl())
                .ownerId(equipment.getOwnerId())
                .status(equipment.getStatus().name())
                .createdAt(equipment.getCreatedAt())
                .build();
    }
}
