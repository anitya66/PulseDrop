package com.pulsedrop.assignment.service;

import com.pulsedrop.assignment.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DriverAssignmentService {

    private final DriverLocationService driverLocationService;

    public void assignDriver(OrderCreatedEvent event) {

        System.out.println(
                "Starting driver assignment for order: "
                        + event.getOrderId()
        );

        System.out.println(
                "Pickup location: "
                        + event.getPickupLatitude()
                        + ", "
                        + event.getPickupLongitude()
        );

        String driverId = driverLocationService.findNearestDriver(
                event.getPickupLongitude(),
                event.getPickupLatitude(),
                10
        );

        if (driverId == null) {
            System.out.println(
                    "No available driver found for order: "
                            + event.getOrderId()
            );
            return;
        }

        System.out.println(
                "Driver "
                        + driverId
                        + " selected for order "
                        + event.getOrderId()
        );
    }
}