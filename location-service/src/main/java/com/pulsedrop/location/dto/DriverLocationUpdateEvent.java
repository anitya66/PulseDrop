package com.pulsedrop.location.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DriverLocationUpdateEvent {

    private Long driverId;
    private double latitude;
    private double longitude;
}