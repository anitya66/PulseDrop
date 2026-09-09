package com.pulsedrop.location.service;

import lombok.RequiredArgsConstructor;

import java.util.List;
import com.pulsedrop.location.dto.DriverLocationUpdateEvent;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.domain.geo.GeoReference;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.pulsedrop.location.dto.DriverLocationResponse;

import org.springframework.data.geo.Distance;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.domain.geo.GeoReference;

@Service
@RequiredArgsConstructor
public class DriverLocationService {

    private static final String DRIVER_LOCATION_KEY =
            "drivers:locations";

    private final RedisTemplate<String, String> redisTemplate;

    private final SimpMessagingTemplate messagingTemplate;

    public void updateDriverLocation(
        Long driverId,
        double longitude,
        double latitude) {

    redisTemplate.opsForGeo().add(
            DRIVER_LOCATION_KEY,
            new Point(longitude, latitude),
            driverId.toString()
    );

    DriverLocationUpdateEvent event =
            new DriverLocationUpdateEvent(
                    driverId,
                    latitude,
                    longitude
            );

    messagingTemplate.convertAndSend(
            "/topic/driver/" + driverId,
            event
    );
}

    public DriverLocationResponse getDriverLocation(Long driverId) {

    List<Point> positions =
            redisTemplate.opsForGeo().position(
                    DRIVER_LOCATION_KEY,
                    driverId.toString()
            );

    if (positions == null || positions.isEmpty()) {
        return null;
    }

    Point point = positions.get(0);

    return new DriverLocationResponse(
            driverId,
            point.getY(),
            point.getX()
    );
}

public List<String> findNearbyDrivers(
        double longitude,
        double latitude,
        double radiusInKm) {

    GeoReference<String> reference =
            GeoReference.fromCoordinate(
                    longitude,
                    latitude
            );

    Distance radius =
            new Distance(
                    radiusInKm,
                    RedisGeoCommands.DistanceUnit.KILOMETERS
            );

    var results =
            redisTemplate.opsForGeo().search(
                    DRIVER_LOCATION_KEY,
                    reference,
                    radius,
                    RedisGeoCommands.GeoSearchCommandArgs
                            .newGeoSearchArgs()
                            .sortAscending()
            );

    if (results == null || results.getContent().isEmpty()) {
        return List.of();
    }

    return results.getContent()
            .stream()
            .map(result -> result.getContent().getName())
            .toList();
}
}