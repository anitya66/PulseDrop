package com.pulsedrop.order.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pulsedrop.order.event.DriverAssignedEvent;
import com.pulsedrop.order.event.EventEnvelope;
import com.pulsedrop.order.event.EventType;
import com.pulsedrop.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderAssignmentEventConsumer {

    private final ObjectMapper objectMapper;
    private final OrderService orderService;

    @KafkaListener(
            topics = "pulse.order.events",
            groupId = "order-service"
    )
    public void consumeOrderEvent(String message) {

        try {

            EventEnvelope<?> envelope =
                    objectMapper.readValue(
                            message,
                            EventEnvelope.class
                    );

            System.out.println(
                    "Order Service received event: "
                            + envelope.getEventType()
            );

            if (envelope.getEventType() ==
                    EventType.DRIVER_ASSIGNED) {

                DriverAssignedEvent event =
                        objectMapper.convertValue(
                                envelope.getPayload(),
                                DriverAssignedEvent.class
                        );

                orderService.assignDriver(
                        event.getOrderId(),
                        event.getDriverId()
                );
            }

        } catch (Exception exception) {

            System.err.println(
                    "Failed to process order event: "
                            + exception.getMessage()
            );
        }
    }
}