package com.pulsedrop.order.dto.response;

import com.pulsedrop.order.entity.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class OrderStatusHistoryResponse {

    private Long id;

    private Long orderId;

    private OrderStatus status;

    private LocalDateTime changedAt;
}