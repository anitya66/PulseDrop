package com.pulsedrop.assignment.controller;

import com.pulsedrop.assignment.dto.request.UpdateDriverLocationRequest;
import com.pulsedrop.assignment.model.DriverAvailability;
import com.pulsedrop.assignment.service.DriverAvailabilityService;
import com.pulsedrop.assignment.service.DriverLocationService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverLocationService driverLocationService;
    private final DriverAvailabilityService driverAvailabilityService;

    @PostMapping("/{driverId}/location")
    public ResponseEntity<String> updateDriverLocation(
            @PathVariable Long driverId,
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody UpdateDriverLocationRequest request) {

        // Only drivers can update driver locations
        if (!"DRIVER".equals(role)) {
            return ResponseEntity.status(403).build();
        }

        // Driver can update only their own location
        if (!driverId.equals(authenticatedUserId)) {
            return ResponseEntity.status(403).build();
        }

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
            @RequestHeader("X-User-Id") Long authenticatedUserId,
            @RequestHeader("X-User-Role") String role,
            @RequestParam DriverAvailability availability) {

        // Only drivers can update availability
        if (!"DRIVER".equals(role)) {
            return ResponseEntity.status(403).build();
        }

        // Driver can update only their own availability
        if (!driverId.equals(authenticatedUserId)) {
            return ResponseEntity.status(403).build();
        }

        driverAvailabilityService.updateAvailability(
                driverId,
                availability
        );

        return ResponseEntity.ok(
                "Driver availability updated successfully"
        );
    }

    @GetMapping("/{driverId}/availability")
    public ResponseEntity<DriverAvailability> getDriverAvailability(
            @PathVariable Long driverId) {

        DriverAvailability availability =
                driverAvailabilityService.getAvailability(driverId);

        return ResponseEntity.ok(availability);
    }
}