package com.pulsedrop.assignment.controller;

import com.pulsedrop.assignment.model.DriverAvailability;
import com.pulsedrop.assignment.service.DriverAvailabilityService;
import com.pulsedrop.assignment.service.DriverLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverLocationService driverLocationService;
    private final DriverAvailabilityService driverAvailabilityService;

    @PostMapping("/{driverId}/location")
    public ResponseEntity<String> updateDriverLocation(
            @PathVariable Long driverId,
            @RequestBody @jakarta.validation.Valid
            com.pulsedrop.assignment.dto.request.UpdateDriverLocationRequest request) {

        driverLocationService.updateDriverLocation(
                driverId,
                request.getLongitude(),
                request.getLatitude()
        );

        return ResponseEntity.ok(
                "Driver location updated successfully"
        );
    }

    @GetMapping("/nearest")
    public ResponseEntity<String> findNearestDriver(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "10") double radiusInKm) {

        String driverId = driverLocationService.findNearestDriver(
                longitude,
                latitude,
                radiusInKm
        );

        if (driverId == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(driverId);
    }

    @PutMapping("/{driverId}/availability")
    public ResponseEntity<String> updateDriverAvailability(
            @PathVariable Long driverId,
            @RequestParam DriverAvailability availability) {

        driverAvailabilityService.updateAvailability(
                driverId,
                availability
        );

        return ResponseEntity.ok(
                "Driver availability updated successfully"
        );
    }
}