package com.pulsedrop.assignment.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pulsedrop.assignment.event.EventEnvelope;
import com.pulsedrop.assignment.event.EventType;
import com.pulsedrop.assignment.event.OrderCreatedEvent;
import com.pulsedrop.assignment.service.DriverAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final ObjectMapper objectMapper;
    private final DriverAssignmentService driverAssignmentService;

    @KafkaListener(
            topics = "pulse.order.events",
            groupId = "driver-assignment-service"
    )
    public void consumeOrderEvent(String message) {

        try {

            EventEnvelope<?> envelope =
                    objectMapper.readValue(
                            message,
                            EventEnvelope.class
                    );

            System.out.println(
                    "Received event: " + envelope.getEventType()
            );

            if (envelope.getEventType() == EventType.ORDER_CREATED) {

                OrderCreatedEvent event =
                        objectMapper.convertValue(
                                envelope.getPayload(),
                                OrderCreatedEvent.class
                        );

                driverAssignmentService.assignDriver(event);
            }

        } catch (Exception exception) {

            System.err.println(
                    "Failed to process Kafka event: "
                            + exception.getMessage()
            );
        }
    }
}