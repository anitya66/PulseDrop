package com.pulsedrop.assignment.event;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class OrderCreatedEvent {

    private Long orderId;
    private Long customerId;

    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;

    private String dropAddress;
    private Double dropLatitude;
    private Double dropLongitude;
}