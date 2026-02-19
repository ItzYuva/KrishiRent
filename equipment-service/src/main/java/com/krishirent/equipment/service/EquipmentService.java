package com.krishirent.equipment.service;

import com.krishirent.equipment.dto.EquipmentRequest;
import com.krishirent.equipment.dto.EquipmentResponse;
import com.krishirent.equipment.dto.EquipmentUpdateRequest;

import java.util.List;

public interface EquipmentService {

    EquipmentResponse createEquipment(EquipmentRequest request);

    List<EquipmentResponse> getAllAvailableEquipment();

    EquipmentResponse getEquipmentById(Long id);

    List<EquipmentResponse> getEquipmentByType(String type);

    EquipmentResponse updateEquipment(Long id, EquipmentUpdateRequest request);

    void deleteEquipment(Long id);

    void updateEquipmentStatus(Long id, String status);

    long getEquipmentCount();
}
