package com.pulsedrop.order.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class EventEnvelope<T> {

    private UUID eventId;

    private EventType eventType;

    private LocalDateTime timestamp;

    private T payload;
}