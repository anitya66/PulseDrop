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

    OrderResponse getOrderById(Long orderId);

    List<OrderResponse> getMyOrders(Long customerId);

    OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatus newStatus
    );

    List<OrderStatusHistoryResponse> getOrderStatusHistory(Long orderId);
}