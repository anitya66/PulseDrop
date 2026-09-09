package com.pulsedrop.order.kafka;

import com.pulsedrop.order.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderEventProducer {

    private static final String ORDER_EVENTS_TOPIC = "pulse.order.events";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOrderCreated(OrderCreatedEvent event) {

        kafkaTemplate.send(
                ORDER_EVENTS_TOPIC,
                event.getOrderId().toString(),
                event
        );
    }
}