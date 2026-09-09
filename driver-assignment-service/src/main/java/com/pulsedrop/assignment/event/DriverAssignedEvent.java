package com.pulsedrop.assignment.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DriverAssignedEvent {

    private Long orderId;
    private Long driverId;
}