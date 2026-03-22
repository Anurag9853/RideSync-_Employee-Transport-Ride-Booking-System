package com.ridesync.backend.dto.admin;

import com.ridesync.backend.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminBookingResponseDto {
    private Long id;
    private LocalDateTime bookingTime;
    private BookingStatus status;
    private String userName;
    private String userEmail;
    private Long rideId;
    private String rideSource;
    private String rideDestination;
    private LocalDateTime rideDateTime;
}
