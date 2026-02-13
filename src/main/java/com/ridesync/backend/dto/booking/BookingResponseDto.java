package com.ridesync.backend.dto.booking;

import com.ridesync.backend.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponseDto {

    private Long id;
    private LocalDateTime bookingTime;
    private BookingStatus status;
    private RideSummaryDto ride;
}

