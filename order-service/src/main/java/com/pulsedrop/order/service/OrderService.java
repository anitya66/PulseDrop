package com.pulsedrop.order.service;

import com.pulsedrop.order.dto.request.CreateOrderRequest;
import com.pulsedrop.order.dto.response.OrderResponse;
import com.pulsedrop.order.dto.response.OrderStatusHistoryResponse;
import com.pulsedrop.order.entity.OrderStatus;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(
            Long customerId,
            CreateOrderRequest request
    );

    OrderResponse getOrderById(Long orderId, Long userId);

    List<OrderResponse> getMyOrders(Long customerId);

    List<OrderResponse> getDriverOrders(Long driverId);

    OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatus newStatus,
            Long userId,
            String role
    );

    List<OrderStatusHistoryResponse> getOrderStatusHistory(
            Long orderId,
            Long userId
    );

    void assignDriver(Long orderId, Long driverId);

    void pickupOrder(
            Long orderId,
            Long userId,
            String role
    );
}