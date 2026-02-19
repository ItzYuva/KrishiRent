package com.krishirent.equipment.dataloader;

import com.krishirent.equipment.entity.Equipment;
import com.krishirent.equipment.entity.EquipmentStatus;
import com.krishirent.equipment.entity.EquipmentType;
import com.krishirent.equipment.repository.EquipmentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataLoader.class);

    private final EquipmentRepository equipmentRepository;

    public DataLoader(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    @Override
    public void run(String... args) {
        if (equipmentRepository.count() == 0) {
            equipmentRepository.save(Equipment.builder()
                    .name("John Deere 5050D Tractor")
                    .type(EquipmentType.TRACTOR)
                    .description("50 HP tractor suitable for all farming operations")
                    .hourlyRate(500.0)
                    .location("Thane Farm Area")
                    .district("Thane")
                    .imageUrl("tractor_john_deere.jpg")
                    .ownerId(3L)
                    .status(EquipmentStatus.AVAILABLE)
                    .build());

            equipmentRepository.save(Equipment.builder()
                    .name("Mahindra 575 Tractor")
                    .type(EquipmentType.TRACTOR)
                    .description("45 HP tractor ideal for medium farms")
                    .hourlyRate(450.0)
                    .location("Pune Farm Area")
                    .district("Pune")
                    .imageUrl("tractor_mahindra.jpg")
                    .ownerId(4L)
                    .status(EquipmentStatus.AVAILABLE)
                    .build());

            equipmentRepository.save(Equipment.builder()
                    .name("Kirloskar Water Pump")
                    .type(EquipmentType.PUMP)
                    .description("5 HP water pump for irrigation")
                    .hourlyRate(150.0)
                    .location("Thane Irrigation Zone")
                    .district("Thane")
                    .imageUrl("pump_kirloskar.jpg")
                    .ownerId(3L)
                    .status(EquipmentStatus.AVAILABLE)
                    .build());

            equipmentRepository.save(Equipment.builder()
                    .name("Kubota Harvester")
                    .type(EquipmentType.HARVESTER)
                    .description("Combine harvester for rice and wheat")
                    .hourlyRate(800.0)
                    .location("Pune Harvest Zone")
                    .district("Pune")
                    .imageUrl("harvester_kubota.jpg")
                    .ownerId(4L)
                    .status(EquipmentStatus.AVAILABLE)
                    .build());

            equipmentRepository.save(Equipment.builder()
                    .name("Fieldking Plough")
                    .type(EquipmentType.PLOUGH)
                    .description("Heavy-duty plough for soil preparation")
                    .hourlyRate(200.0)
                    .location("Thane Ploughing Area")
                    .district("Thane")
                    .imageUrl("plough_fieldking.jpg")
                    .ownerId(3L)
                    .status(EquipmentStatus.AVAILABLE)
                    .build());

            log.info("Equipment DataLoader: 5 sample equipment loaded successfully");
        }
    }
}
