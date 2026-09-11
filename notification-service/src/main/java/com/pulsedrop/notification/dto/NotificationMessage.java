package com.pulsedrop.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NotificationMessage {

    private String type;
    private Long orderId;
    private Long customerId;
    private Long driverId;
    private String message;
}