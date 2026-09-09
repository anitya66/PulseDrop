package com.pulsedrop.order.service.impl;

import com.pulsedrop.order.dto.request.CreateOrderRequest;
import com.pulsedrop.order.dto.response.OrderResponse;
import com.pulsedrop.order.dto.response.OrderStatusHistoryResponse;
import com.pulsedrop.order.entity.Order;
import com.pulsedrop.order.entity.OrderStatus;
import com.pulsedrop.order.entity.OrderStatusHistory;
import com.pulsedrop.order.event.OrderCreatedEvent;
import com.pulsedrop.order.exception.ResourceNotFoundException;
import com.pulsedrop.order.kafka.OrderEventProducer;
import com.pulsedrop.order.mapper.OrderMapper;
import com.pulsedrop.order.mapper.OrderStatusHistoryMapper;
import com.pulsedrop.order.repository.OrderRepository;
import com.pulsedrop.order.repository.OrderStatusHistoryRepository;
import com.pulsedrop.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pulsedrop.order.entity.Order;
import com.pulsedrop.order.entity.OrderStatus;
import com.pulsedrop.order.exception.ResourceNotFoundException;

import java.time.LocalDateTime;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final OrderMapper orderMapper;
    private final OrderStatusHistoryMapper orderStatusHistoryMapper;
    private final OrderEventProducer orderEventProducer;

    @Override
    @Transactional
    public OrderResponse createOrder(
            Long customerId,
            CreateOrderRequest request) {

        // Convert request DTO into Order entity
        Order order = orderMapper.toEntity(request);

        // Set customer ID
        order.setCustomerId(customerId);

        // Save order in MySQL
        Order savedOrder = orderRepository.save(order);

        // Create initial status history
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrderId(savedOrder.getId());
        history.setStatus(savedOrder.getStatus());

        // Save status history
        orderStatusHistoryRepository.save(history);

        // Create Kafka event
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                savedOrder.getCustomerId(),
                savedOrder.getPickupAddress(),
                savedOrder.getPickupLatitude(),
                savedOrder.getPickupLongitude(),
                savedOrder.getDropAddress(),
                savedOrder.getDropLatitude(),
                savedOrder.getDropLongitude()
        );

        // Publish OrderCreated event to Kafka
        orderEventProducer.publishOrderCreated(event);

        // Return response DTO
        return orderMapper.toResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: " + orderId
                        )
                );

        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(Long customerId) {

        List<Order> orders =
                orderRepository.findByCustomerId(customerId);

        return orders.stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatus newStatus) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: " + orderId
                        )
                );

        OrderStatus currentStatus = order.getStatus();

        // Validate status transition
        if (!isValidTransition(currentStatus, newStatus)) {

            throw new IllegalArgumentException(
                    "Invalid status transition: "
                            + currentStatus
                            + " → "
                            + newStatus
            );
        }

        // Update order status
        order.setStatus(newStatus);

        // Save updated order
        Order updatedOrder = orderRepository.save(order);

        // Create status history record
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrderId(updatedOrder.getId());
        history.setStatus(updatedOrder.getStatus());

        // Save status history
        orderStatusHistoryRepository.save(history);

        // Return response
        return orderMapper.toResponse(updatedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderStatusHistoryResponse> getOrderStatusHistory(
            Long orderId) {

        // Check whether order exists
        if (!orderRepository.existsById(orderId)) {

            throw new ResourceNotFoundException(
                    "Order not found with id: " + orderId
            );
        }

        // Fetch history in chronological order
        return orderStatusHistoryRepository
                .findByOrderIdOrderByChangedAtAsc(orderId)
                .stream()
                .map(orderStatusHistoryMapper::toResponse)
                .toList();
    }

    /**
     * Validates the allowed order status transitions.
     */
    private boolean isValidTransition(
            OrderStatus currentStatus,
            OrderStatus newStatus) {

        return switch (currentStatus) {

            case PENDING ->
                    newStatus == OrderStatus.DRIVER_ASSIGNED
                            || newStatus == OrderStatus.CANCELLED;

            case DRIVER_ASSIGNED ->
                    newStatus == OrderStatus.PICKED_UP
                            || newStatus == OrderStatus.CANCELLED;

            case PICKED_UP ->
                    newStatus == OrderStatus.IN_TRANSIT;

            case IN_TRANSIT ->
                    newStatus == OrderStatus.DELIVERED;

            case DELIVERED, CANCELLED ->
                    false;
        };
    }
    @Override
public void assignDriver(Long orderId, Long driverId) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Order not found with id: " + orderId
                    )
            );

    order.setDriverId(driverId);
    order.setStatus(OrderStatus.DRIVER_ASSIGNED);
    order.setUpdatedAt(LocalDateTime.now());

    orderRepository.save(order);

    System.out.println(
            "Driver " + driverId +
            " assigned to order " + orderId
    );
}
}