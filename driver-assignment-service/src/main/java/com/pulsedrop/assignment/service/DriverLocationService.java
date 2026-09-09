package com.pulsedrop.assignment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Distance;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.domain.geo.GeoReference;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DriverLocationService {

    private static final String DRIVER_LOCATION_KEY = "drivers:locations";

    private final RedisTemplate<String, String> redisTemplate;

    private static final String DRIVER_AVAILABILITY_KEY =
        "drivers:availability";

    public void updateDriverLocation(
            Long driverId,
            double longitude,
            double latitude) {

        redisTemplate.opsForGeo().add(
                DRIVER_LOCATION_KEY,
                new org.springframework.data.geo.Point(longitude, latitude),
                driverId.toString()
        );
    }

    public String findNearestDriver(
        double longitude,
        double latitude,
        double radiusInKm) {

    GeoReference<String> reference =
            GeoReference.fromCoordinate(longitude, latitude);

    Distance radius = new Distance(
            radiusInKm,
            RedisGeoCommands.DistanceUnit.KILOMETERS
    );

    var results = redisTemplate.opsForGeo().search(
            DRIVER_LOCATION_KEY,
            reference,
            radius,
            RedisGeoCommands.GeoSearchCommandArgs
                    .newGeoSearchArgs()
                    .sortAscending()
                    .includeDistance()
    );

    if (results == null || results.getContent().isEmpty()) {
        return null;
    }

    for (var result : results.getContent()) {

        String driverId =
                result.getContent().getName();

        Object availability =
                redisTemplate.opsForHash().get(
                        DRIVER_AVAILABILITY_KEY,
                        driverId
                );

        if (availability != null &&
                "AVAILABLE".equals(availability.toString())) {

            return driverId;
        }
    }

    return null;
}
}