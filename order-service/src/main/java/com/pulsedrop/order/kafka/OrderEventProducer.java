package com.pulsedrop.order.kafka;

import com.pulsedrop.order.event.EventEnvelope;
import com.pulsedrop.order.event.EventType;
import com.pulsedrop.order.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OrderEventProducer {

    private static final String ORDER_EVENTS_TOPIC = "pulse.order.events";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOrderCreated(OrderCreatedEvent event) {

        EventEnvelope<OrderCreatedEvent> envelope =
                new EventEnvelope<>(
                        UUID.randomUUID(),
                        EventType.ORDER_CREATED,
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