package com.ridesync.backend.dto.ride;

import com.ridesync.backend.entity.RideStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RideResponseDto {

    private Long id;
    private String sourceLocation;
    private String destinationLocation;
    private LocalDateTime rideDateTime;
    private Integer totalSeats;
    private Integer availableSeats;
    private RideStatus status;
}

