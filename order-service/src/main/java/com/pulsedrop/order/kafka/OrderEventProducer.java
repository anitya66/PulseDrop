package com.pulsedrop.order.kafka;

import com.pulsedrop.order.event.EventEnvelope;
import com.pulsedrop.order.event.EventType;
import com.pulsedrop.order.event.OrderCreatedEvent;
import com.pulsedrop.order.event.OrderInTransitEvent;
import com.pulsedrop.order.event.OrderPickedUpEvent;
import com.pulsedrop.order.event.OrderDeliveredEvent;
import com.pulsedrop.order.event.OrderCancelledEvent;
import lombok.RequiredArgsConstructor;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OrderEventProducer {

    private static final String ORDER_EVENTS_TOPIC =
            "pulse.order.events";

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

    public void publishOrderPickedUp(OrderPickedUpEvent event) {

        EventEnvelope<OrderPickedUpEvent> envelope =
                new EventEnvelope<>(
                        UUID.randomUUID(),
                        EventType.ORDER_PICKED_UP,
                        LocalDateTime.now(),
                        event
                );

        kafkaTemplate.send(
                ORDER_EVENTS_TOPIC,
                event.getOrderId().toString(),
                envelope
        );
    }
    public void publishOrderInTransit(OrderInTransitEvent event) {

    EventEnvelope<OrderInTransitEvent> envelope =
            new EventEnvelope<>(
                    UUID.randomUUID(),
                    EventType.ORDER_IN_TRANSIT,
                    LocalDateTime.now(),
                    event
            );

    kafkaTemplate.send(
            ORDER_EVENTS_TOPIC,
            event.getOrderId().toString(),
            envelope
    );
}
public void publishOrderDelivered(OrderDeliveredEvent event) {

    EventEnvelope<OrderDeliveredEvent> envelope =
            new EventEnvelope<>(
                    UUID.randomUUID(),
                    EventType.ORDER_DELIVERED,
                    LocalDateTime.now(),
                    event
            );

    kafkaTemplate.send(
            ORDER_EVENTS_TOPIC,
            event.getOrderId().toString(),
            envelope
    );
}
public void publishOrderCancelled(OrderCancelledEvent event) {

    EventEnvelope<OrderCancelledEvent> envelope =
            new EventEnvelope<>(
                    UUID.randomUUID(),
                    EventType.ORDER_CANCELLED,
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