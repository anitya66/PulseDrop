package com.pulsedrop.order.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
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