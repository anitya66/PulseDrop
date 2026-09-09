package com.pulsedrop.location.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DriverLocationRequest {

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;
}