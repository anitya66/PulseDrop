package com.pulsedrop.location.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DriverLocationResponse {

    private Long driverId;
    private double latitude;
    private double longitude;
}