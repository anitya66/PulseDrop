package com.pulsedrop.order.dto.response;

import com.pulsedrop.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class OrderResponse {

    private Long id;

    private Long customerId;

    private Long driverId;

    private String pickupAddress;

    private Double pickupLatitude;

    private Double pickupLongitude;

    private String dropAddress;

    private Double dropLatitude;

    private Double dropLongitude;

    private OrderStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}