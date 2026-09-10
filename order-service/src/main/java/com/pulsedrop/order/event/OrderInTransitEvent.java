package com.pulsedrop.order.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderInTransitEvent {

    private Long orderId;
    private Long driverId;
}