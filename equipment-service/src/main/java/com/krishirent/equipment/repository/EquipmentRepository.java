package com.krishirent.equipment.repository;

import com.krishirent.equipment.entity.Equipment;
import com.krishirent.equipment.entity.EquipmentStatus;
import com.krishirent.equipment.entity.EquipmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByStatusOrderByCreatedAtDesc(EquipmentStatus status);

    List<Equipment> findByTypeAndStatusOrderByCreatedAtDesc(EquipmentType type, EquipmentStatus status);

    List<Equipment> findByDistrictAndStatusOrderByCreatedAtDesc(String district, EquipmentStatus status);

    long countByStatus(EquipmentStatus status);
}
