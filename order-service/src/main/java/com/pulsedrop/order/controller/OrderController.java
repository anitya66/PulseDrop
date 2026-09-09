package com.pulsedrop.order.controller;

import com.pulsedrop.order.common.ApiResponse;
import com.pulsedrop.order.dto.request.CreateOrderRequest;
import com.pulsedrop.order.dto.request.UpdateOrderStatusRequest;
import com.pulsedrop.order.dto.response.OrderResponse;
import com.pulsedrop.order.dto.response.OrderStatusHistoryResponse;
import com.pulsedrop.order.service.OrderService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Create Order
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @RequestBody @Valid CreateOrderRequest request) {

        // TEMPORARY customer ID
        // Authentication will be connected later
        Long customerId = 1L;

        OrderResponse response =
                orderService.createOrder(customerId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Order created successfully",
                                response
                        )
                );
    }

    // Get Order By ID
    @GetMapping("/{orderId:\\d+}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long orderId) {

        OrderResponse response =
                orderService.getOrderById(orderId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                        ApiResponse.success(
                                "Order fetched successfully",
                                response
                        )
                );
    }

    // Get My Orders
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders() {

        // TEMPORARY customer ID
        // Authentication will be connected later
        Long customerId = 1L;

        List<OrderResponse> response =
                orderService.getMyOrders(customerId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                        ApiResponse.success(
                                "Orders fetched successfully",
                                response
                        )
                );
    }

    // Update Order Status
    @PatchMapping("/{orderId:\\d+}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody @Valid UpdateOrderStatusRequest request) {

        OrderResponse response =
                orderService.updateOrderStatus(
                        orderId,
                        request.getStatus()
                );

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                        ApiResponse.success(
                                "Order status updated successfully",
                                response
                        )
                );
    }

    // Get Order Status History
    @GetMapping("/{orderId:\\d+}/history")
    public ResponseEntity<ApiResponse<List<OrderStatusHistoryResponse>>> getOrderStatusHistory(
            @PathVariable Long orderId) {

        List<OrderStatusHistoryResponse> history =
                orderService.getOrderStatusHistory(orderId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                        ApiResponse.success(
                                "Order history fetched successfully",
                                history
                        )
                );
    }
}