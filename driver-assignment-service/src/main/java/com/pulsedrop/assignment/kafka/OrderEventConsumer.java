package com.pulsedrop.assignment.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pulsedrop.assignment.event.EventEnvelope;
import com.pulsedrop.assignment.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    private final ObjectMapper objectMapper;

    public OrderEventConsumer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        System.out.println(">>> OrderEventConsumer bean created");
    }

    @KafkaListener(
            topics = "pulse.order.events",
            groupId = "driver-assignment-service"
    )
    public void consumeOrderEvent(String message) {

        try {
            EventEnvelope<?> envelope =
                    objectMapper.readValue(message, EventEnvelope.class);

            System.out.println(
                    "Received event: " + envelope.getEventType()
            );

            if ("ORDER_CREATED".equals(envelope.getEventType().name())) {

                OrderCreatedEvent event =
                        objectMapper.convertValue(
                                envelope.getPayload(),
                                OrderCreatedEvent.class
                        );

                System.out.println(
                        "New order received: " + event.getOrderId()
                );

                System.out.println(
                        "Pickup: " + event.getPickupAddress()
                );
            }

        } catch (Exception exception) {
            System.err.println(
                    "Failed to process Kafka event: "
                            + exception.getMessage()
            );
        }
    }
}