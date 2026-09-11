package com.pulsedrop.notification.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pulsedrop.notification.dto.NotificationMessage;
import com.pulsedrop.notification.event.EventEnvelope;
import com.pulsedrop.notification.event.EventType;
import com.pulsedrop.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventConsumer {

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    @KafkaListener(
            topics = "pulse.order.events",
            groupId = "notification-service"
    )
    public void consumeOrderEvent(String message) {

        try {

            EventEnvelope<?> envelope =
                    objectMapper.readValue(message, EventEnvelope.class);

            EventType eventType = envelope.getEventType();

            JsonNode payload = objectMapper.valueToTree(
                    envelope.getPayload()
            );

            Long orderId = getLongValue(payload, "orderId");
            Long customerId = getLongValue(payload, "customerId");
            Long driverId = getLongValue(payload, "driverId");

            NotificationMessage notification =
                    notificationService.createNotification(
                            eventType,
                            orderId,
                            customerId,
                            driverId
                    );

            System.out.println(
                    "Notification: " + notification.getMessage()
            );

        } catch (Exception exception) {

            System.err.println(
                    "Failed to process notification event: "
                            + exception.getMessage()
            );
        }
    }

    private Long getLongValue(JsonNode payload, String fieldName) {

        JsonNode field = payload.get(fieldName);

        if (field == null || field.isNull()) {
            return null;
        }

        return field.asLong();
    }
}