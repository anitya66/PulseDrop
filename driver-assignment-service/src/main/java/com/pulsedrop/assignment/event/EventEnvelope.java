package com.pulsedrop.assignment.event;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
public class EventEnvelope<T> {

    private UUID eventId;

    private EventType eventType;

    private LocalDateTime timestamp;

    private T payload;
}