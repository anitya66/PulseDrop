package com.pulsedrop.notification.service;

import com.pulsedrop.notification.dto.NotificationMessage;
import com.pulsedrop.notification.event.EventType;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationMessage createNotification(
            EventType eventType,
            Long orderId,
            Long customerId,
            Long driverId
    ) {

        NotificationMessage notification = switch (eventType) {

            case ORDER_CREATED ->
                    new NotificationMessage(
                            "ORDER_CREATED",
                            orderId,
                            customerId,
                            driverId,
                            "Your order has been created successfully."
                    );

            case DRIVER_ASSIGNED ->
                    new NotificationMessage(
                            "DRIVER_ASSIGNED",
                            orderId,
                            customerId,
                            driverId,
                            "A driver has been assigned to your order."
                    );

            case ORDER_PICKED_UP ->
                    new NotificationMessage(
                            "ORDER_PICKED_UP",
                            orderId,
                            customerId,
                            driverId,
                            "Your order has been picked up."
                    );

            case ORDER_IN_TRANSIT ->
                    new NotificationMessage(
                            "ORDER_IN_TRANSIT",
                            orderId,
                            customerId,
                            driverId,
                            "Your order is now in transit."
                    );

            case ORDER_DELIVERED ->
                    new NotificationMessage(
                            "ORDER_DELIVERED",
                            orderId,
                            customerId,
                            driverId,
                            "Your order has been delivered successfully."
                    );

            case ORDER_CANCELLED ->
                    new NotificationMessage(
                            "ORDER_CANCELLED",
                            orderId,
                            customerId,
                            driverId,
                            "Your order has been cancelled."
                    );
        };

        messagingTemplate.convertAndSend(
                "/topic/notifications",
                notification
        );

        return notification;
    }
}