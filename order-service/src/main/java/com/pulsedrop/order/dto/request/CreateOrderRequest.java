package com.pulsedrop.order.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequest {

    @NotBlank(message = "Pickup address is required")
    @Size(max = 255, message = "Pickup address must not exceed 255 characters")
    private String pickupAddress;

    @NotNull(message = "Pickup latitude is required")
    @DecimalMin(value = "-90.0", message = "Pickup latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Pickup latitude must be <= 90")
    private Double pickupLatitude;

    @NotNull(message = "Pickup longitude is required")
    @DecimalMin(value = "-180.0", message = "Pickup longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Pickup longitude must be <= 180")
    private Double pickupLongitude;

    @NotBlank(message = "Drop address is required")
    @Size(max = 255, message = "Drop address must not exceed 255 characters")
    private String dropAddress;

    @NotNull(message = "Drop latitude is required")
    @DecimalMin(value = "-90.0", message = "Drop latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Drop latitude must be <= 90")
    private Double dropLatitude;

    @NotNull(message = "Drop longitude is required")
    @DecimalMin(value = "-180.0", message = "Drop longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Drop longitude must be <= 180")
    private Double dropLongitude;
}