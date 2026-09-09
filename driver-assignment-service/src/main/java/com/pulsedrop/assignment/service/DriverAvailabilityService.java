package com.pulsedrop.assignment.service;

import com.pulsedrop.assignment.model.DriverAvailability;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DriverAvailabilityService {

    private static final String DRIVER_AVAILABILITY_KEY =
            "drivers:availability";

    private final RedisTemplate<String, String> redisTemplate;

    public void updateAvailability(
            Long driverId,
            DriverAvailability availability) {

        redisTemplate.opsForHash().put(
                DRIVER_AVAILABILITY_KEY,
                driverId.toString(),
                availability.name()
        );
    }

    public void markBusy(Long driverId) {
    updateAvailability(
            driverId,
            DriverAvailability.BUSY
    );
}

    public DriverAvailability getAvailability(Long driverId) {

        Object value = redisTemplate.opsForHash().get(
                DRIVER_AVAILABILITY_KEY,
                driverId.toString()
        );

        if (value == null) {
            return DriverAvailability.OFFLINE;
        }

        return DriverAvailability.valueOf(value.toString());
    }
}