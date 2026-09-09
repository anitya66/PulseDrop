package com.pulsedrop.assignment.kafka;

import com.pulsedrop.assignment.event.DriverAssignedEvent;
import com.pulsedrop.assignment.event.EventEnvelope;
import com.pulsedrop.assignment.event.EventType;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DriverAssignmentEventProducer {

    private static final String ORDER_EVENTS_TOPIC =
            "pulse.order.events";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishDriverAssigned(
            DriverAssignedEvent event) {

        EventEnvelope<DriverAssignedEvent> envelope =
                new EventEnvelope<>(
                        UUID.randomUUID(),
                        EventType.DRIVER_ASSIGNED,
                        LocalDateTime.now(),
                        event
                );

        kafkaTemplate.send(
                ORDER_EVENTS_TOPIC,
                event.getOrderId().toString(),
                envelope
        );
    }
}