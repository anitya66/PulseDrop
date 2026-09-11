package com.pulsedrop.order.service.impl;

import com.pulsedrop.order.dto.request.CreateOrderRequest;
import com.pulsedrop.order.dto.response.OrderResponse;
import com.pulsedrop.order.dto.response.OrderStatusHistoryResponse;
import com.pulsedrop.order.entity.Order;
import com.pulsedrop.order.entity.OrderStatus;
import com.pulsedrop.order.entity.OrderStatusHistory;
import com.pulsedrop.order.event.OrderCreatedEvent;
import com.pulsedrop.order.event.OrderInTransitEvent;
import com.pulsedrop.order.event.OrderPickedUpEvent;
import com.pulsedrop.order.exception.ResourceNotFoundException;
import com.pulsedrop.order.exception.UnauthorizedAccessException;
import com.pulsedrop.order.kafka.OrderEventProducer;
import com.pulsedrop.order.mapper.OrderMapper;
import com.pulsedrop.order.mapper.OrderStatusHistoryMapper;
import com.pulsedrop.order.repository.OrderRepository;
import com.pulsedrop.order.repository.OrderStatusHistoryRepository;
import com.pulsedrop.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pulsedrop.order.event.OrderCancelledEvent;
import com.pulsedrop.order.event.OrderDeliveredEvent;

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
public OrderResponse getOrderById(Long orderId, Long userId) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Order not found with id: " + orderId
                    )
            );

    if (!order.getCustomerId().equals(userId)) {
    throw new UnauthorizedAccessException(
            "You are not authorized to access this order"
    );
}

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
@Transactional(readOnly = true)
public List<OrderResponse> getDriverOrders(Long driverId) {

    List<Order> orders =
            orderRepository.findByDriverId(driverId);

    return orders.stream()
            .map(orderMapper::toResponse)
            .toList();
}

   @Override
@Transactional
public OrderResponse updateOrderStatus(
        Long orderId,
        OrderStatus newStatus,
        Long userId,
        String role) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Order not found with id: " + orderId
                    )
            );

    // Authorization check
    if ("CUSTOMER".equals(role)) {

        // Customer can update only their own order
        if (!order.getCustomerId().equals(userId)) {
            throw new UnauthorizedAccessException(
                    "You are not authorized to update this order"
            );
        }

        // Customer can only cancel an order
        if (newStatus != OrderStatus.CANCELLED) {
            throw new UnauthorizedAccessException(
                    "Customer can only cancel an order"
            );
        }

    } else if ("DRIVER".equals(role)) {

        // Driver can update only orders assigned to them
        if (order.getDriverId() == null
                || !order.getDriverId().equals(userId)) {

            throw new UnauthorizedAccessException(
                    "You are not authorized to update this order"
            );
        }

    } else {

        throw new UnauthorizedAccessException(
                "Invalid role for order status update"
        );
    }

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

    orderStatusHistoryRepository.save(history);

    // Publish event when order enters transit
    if (newStatus == OrderStatus.IN_TRANSIT) {

        OrderInTransitEvent event =
                new OrderInTransitEvent(
                        updatedOrder.getId(),
                        updatedOrder.getDriverId()
                );

        orderEventProducer.publishOrderInTransit(event);
    }

    // Publish event when order is delivered
    if (newStatus == OrderStatus.DELIVERED) {

        OrderDeliveredEvent event =
                new OrderDeliveredEvent(
                        updatedOrder.getId(),
                        updatedOrder.getDriverId()
                );

        orderEventProducer.publishOrderDelivered(event);
    }

    // Publish event when order is cancelled
    if (newStatus == OrderStatus.CANCELLED) {

        OrderCancelledEvent event =
                new OrderCancelledEvent(
                        updatedOrder.getId(),
                        updatedOrder.getCustomerId(),
                        updatedOrder.getDriverId()
                );

        orderEventProducer.publishOrderCancelled(event);
    }

    // Return response
    return orderMapper.toResponse(updatedOrder);
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
@Transactional(readOnly = true)
public List<OrderStatusHistoryResponse> getOrderStatusHistory(
        Long orderId,
        Long userId) {

    // Check whether order exists
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Order not found with id: " + orderId
                    )
            );

    // Check whether the order belongs to the authenticated user
    if (!order.getCustomerId().equals(userId)) {
        throw new UnauthorizedAccessException(
                "You are not authorized to access this order"
        );
    }

    // Fetch history in chronological order
    return orderStatusHistoryRepository
            .findByOrderIdOrderByChangedAtAsc(orderId)
            .stream()
            .map(orderStatusHistoryMapper::toResponse)
            .toList();
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

@Override
@Transactional
public void pickupOrder(
        Long orderId,
        Long userId,
        String role) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Order not found with id: " + orderId
                    )
            );

    // Only DRIVER can pick up an order
    if (!"DRIVER".equals(role)) {
        throw new UnauthorizedAccessException(
                "Only the assigned driver can pick up this order"
        );
    }

    // Verify that this driver is assigned to this order
    if (order.getDriverId() == null
            || !order.getDriverId().equals(userId)) {

        throw new UnauthorizedAccessException(
                "You are not authorized to pick up this order"
        );
    }

    // Verify current status
    if (order.getStatus() != OrderStatus.DRIVER_ASSIGNED) {
        throw new IllegalStateException(
                "Order cannot be picked up. Current status: "
                        + order.getStatus()
        );
    }

    // Update order status
    order.setStatus(OrderStatus.PICKED_UP);
    order.setUpdatedAt(LocalDateTime.now());

    // Save updated order
    orderRepository.save(order);

    // Create status history
    OrderStatusHistory history = new OrderStatusHistory();
    history.setOrderId(order.getId());
    history.setStatus(OrderStatus.PICKED_UP);

    orderStatusHistoryRepository.save(history);

    // Create Kafka event
    OrderPickedUpEvent event =
            new OrderPickedUpEvent(
                    order.getId(),
                    order.getDriverId()
            );

    // Publish ORDER_PICKED_UP event
    orderEventProducer.publishOrderPickedUp(event);

    System.out.println(
            "Order " + orderId + " has been picked up"
    );
}
}