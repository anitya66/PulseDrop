package com.pulsedrop.order.mapper;

import com.pulsedrop.order.dto.response.OrderStatusHistoryResponse;
import com.pulsedrop.order.entity.OrderStatusHistory;

import org.springframework.stereotype.Component;

@Component
public class OrderStatusHistoryMapper {

    public OrderStatusHistoryResponse toResponse(
            OrderStatusHistory history) {

        return new OrderStatusHistoryResponse(
                history.getId(),
                history.getOrderId(),
                history.getStatus(),
                history.getChangedAt()
        );
    }
}