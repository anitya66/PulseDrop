package com.pulsedrop.assignment.service;

import com.pulsedrop.assignment.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.pulsedrop.assignment.event.DriverAssignedEvent;
import com.pulsedrop.assignment.kafka.DriverAssignmentEventProducer;

@Service
@RequiredArgsConstructor
public class DriverAssignmentService {

    private final DriverLocationService driverLocationService;
    private final DriverAvailabilityService driverAvailabilityService;
    private final DriverAssignmentEventProducer driverAssignmentEventProducer;

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

    Long selectedDriverId = Long.valueOf(driverId);

    driverAvailabilityService.markBusy(selectedDriverId);

    System.out.println(
            "Driver "
                    + selectedDriverId
                    + " selected for order "
                    + event.getOrderId()
    );

    System.out.println(
            "Driver "
                    + selectedDriverId
                    + " is now BUSY"
    );

    DriverAssignedEvent driverAssignedEvent =
            new DriverAssignedEvent(
                    event.getOrderId(),
                    selectedDriverId
            );

    System.out.println(
            "Publishing DRIVER_ASSIGNED event for order: "
                    + event.getOrderId()
    );

    driverAssignmentEventProducer.publishDriverAssigned(
            driverAssignedEvent
    );
}
}