package com.krishirent.booking.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "equipment-service")
public interface EquipmentServiceClient {

    @GetMapping("/equipment/{id}")
    Map<String, Object> getEquipmentById(@PathVariable("id") Long id);

    @PutMapping("/equipment/{id}/status")
    void updateEquipmentStatus(@PathVariable("id") Long id, @RequestParam("status") String status);

    @GetMapping("/equipment/count")
    Long getEquipmentCount();
}
