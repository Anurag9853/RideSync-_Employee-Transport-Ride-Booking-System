package com.ridesync.backend.dto.booking;

import com.ridesync.backend.entity.RideStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RideSummaryDto {

    private Long rideId;
    private String sourceLocation;
    private String destinationLocation;
    private LocalDateTime rideDateTime;
    private RideStatus status;
}

