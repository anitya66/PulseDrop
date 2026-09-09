package com.pulsedrop.order.mapper;

import com.pulsedrop.order.dto.request.CreateOrderRequest;
import com.pulsedrop.order.dto.response.OrderResponse;
import com.pulsedrop.order.entity.Order;

import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public Order toEntity(CreateOrderRequest request) {

        Order order = new Order();

        order.setPickupAddress(request.getPickupAddress());
        order.setPickupLatitude(request.getPickupLatitude());
        order.setPickupLongitude(request.getPickupLongitude());

        order.setDropAddress(request.getDropAddress());
        order.setDropLatitude(request.getDropLatitude());
        order.setDropLongitude(request.getDropLongitude());

        return order;
    }

    public OrderResponse toResponse(Order order) {

        return new OrderResponse(
                order.getId(),
                order.getCustomerId(),
                order.getDriverId(),
                order.getPickupAddress(),
                order.getPickupLatitude(),
                order.getPickupLongitude(),
                order.getDropAddress(),
                order.getDropLatitude(),
                order.getDropLongitude(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}