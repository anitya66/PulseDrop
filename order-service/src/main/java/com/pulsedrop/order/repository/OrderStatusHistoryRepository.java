package com.pulsedrop.order.repository;

import com.pulsedrop.order.entity.OrderStatus;
import com.pulsedrop.order.entity.OrderStatusHistory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderStatusHistoryRepository
        extends JpaRepository<OrderStatusHistory, Long> {

    List<OrderStatusHistory> findByOrderIdOrderByChangedAtAsc(Long orderId);
}