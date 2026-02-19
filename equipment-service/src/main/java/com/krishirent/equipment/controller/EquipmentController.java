package com.krishirent.equipment.controller;

import com.krishirent.equipment.dto.EquipmentRequest;
import com.krishirent.equipment.dto.EquipmentResponse;
import com.krishirent.equipment.dto.EquipmentUpdateRequest;
import com.krishirent.equipment.service.EquipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @PostMapping
    public ResponseEntity<EquipmentResponse> createEquipment(@RequestBody EquipmentRequest request) {
        EquipmentResponse response = equipmentService.createEquipment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EquipmentResponse>> getAllAvailableEquipment() {
        return ResponseEntity.ok(equipmentService.getAllAvailableEquipment());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponse> getEquipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(equipmentService.getEquipmentById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<EquipmentResponse>> getEquipmentByType(@PathVariable String type) {
        return ResponseEntity.ok(equipmentService.getEquipmentByType(type));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentResponse> updateEquipment(@PathVariable Long id,
                                                              @RequestBody EquipmentUpdateRequest request) {
        return ResponseEntity.ok(equipmentService.updateEquipment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateEquipmentStatus(@PathVariable Long id,
                                                       @RequestParam String status) {
        equipmentService.updateEquipmentStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getEquipmentCount() {
        return ResponseEntity.ok(equipmentService.getEquipmentCount());
    }
}
