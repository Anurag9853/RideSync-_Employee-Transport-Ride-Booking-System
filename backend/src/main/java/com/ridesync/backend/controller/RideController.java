package com.ridesync.backend.controller;

import com.ridesync.backend.dto.booking.BookingResponseDto;
import com.ridesync.backend.dto.ride.RideResponseDto;
import com.ridesync.backend.service.BookingService;
import com.ridesync.backend.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
public class RideController {

    private final RideService rideService;
    private final BookingService bookingService;

    @GetMapping("/rides")
    public ResponseEntity<Page<RideResponseDto>> searchRides(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size,
                                                             @RequestParam(required = false) String source,
                                                             @RequestParam(required = false) String destination) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("rideDateTime").ascending());
        Page<RideResponseDto> rides = rideService.searchAvailableRides(source, destination, pageable);
        return ResponseEntity.ok(rides);
    }

    @PostMapping("/rides/{rideId}/book")
    public ResponseEntity<BookingResponseDto> bookRide(@PathVariable Long rideId, Authentication authentication) {
        String email = authentication.getName();
        BookingResponseDto response = bookingService.bookRide(rideId, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

