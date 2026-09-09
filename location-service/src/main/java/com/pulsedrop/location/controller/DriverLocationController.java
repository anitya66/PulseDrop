package com.pulsedrop.location.controller;

import com.pulsedrop.location.dto.DriverLocationRequest;
import com.pulsedrop.location.dto.DriverLocationResponse;
import com.pulsedrop.location.service.DriverLocationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class DriverLocationController {

    private final DriverLocationService driverLocationService;

    @PostMapping("/{driverId}")
public ResponseEntity<Void> updateDriverLocation(
        @PathVariable Long driverId,
        @Valid @RequestBody DriverLocationRequest request) {

    driverLocationService.updateDriverLocation(
            driverId,
            request.getLongitude(),
            request.getLatitude()
    );

    return ResponseEntity.ok().build();
}

@GetMapping("/{driverId}")
public ResponseEntity<DriverLocationResponse> getDriverLocation(
        @PathVariable Long driverId) {

    DriverLocationResponse location =
            driverLocationService.getDriverLocation(driverId);

    if (location == null) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(location);
}

@GetMapping("/nearby")
public ResponseEntity<List<String>> findNearbyDrivers(
        @RequestParam double longitude,
        @RequestParam double latitude,
        @RequestParam(defaultValue = "10") double radiusInKm) {

    List<String> drivers =
            driverLocationService.findNearbyDrivers(
                    longitude,
                    latitude,
                    radiusInKm
            );

    return ResponseEntity.ok(drivers);
}
}