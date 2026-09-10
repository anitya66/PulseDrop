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

    public NotificationMessage createNotification(EventType eventType) {

        NotificationMessage notification = switch (eventType) {

            case ORDER_CREATED ->
                    new NotificationMessage(
                            "ORDER_CREATED",
                            "Your order has been created successfully."
                    );

            case DRIVER_ASSIGNED ->
                    new NotificationMessage(
                            "DRIVER_ASSIGNED",
                            "A driver has been assigned to your order."
                    );

            case ORDER_PICKED_UP ->
                    new NotificationMessage(
                            "ORDER_PICKED_UP",
                            "Your order has been picked up."
                    );

            case ORDER_IN_TRANSIT ->
                    new NotificationMessage(
                            "ORDER_IN_TRANSIT",
                            "Your order is now in transit."
                    );

            case ORDER_DELIVERED ->
                    new NotificationMessage(
                            "ORDER_DELIVERED",
                            "Your order has been delivered successfully."
                    );

            case ORDER_CANCELLED ->
                    new NotificationMessage(
                            "ORDER_CANCELLED",
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