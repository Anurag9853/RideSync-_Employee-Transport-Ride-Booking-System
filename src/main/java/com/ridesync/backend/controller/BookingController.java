package com.ridesync.backend.controller;

import com.ridesync.backend.dto.booking.BookingResponseDto;
import com.ridesync.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
public class BookingController {

    private final BookingService bookingService;

    /**
     * Create a booking for the given ride. Request body: { "rideId": <long> }.
     * Alternative: use POST /rides/{rideId}/book (no body).
     */
    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@RequestBody Map<String, Long> body, Authentication authentication) {
        Long rideId = body != null ? body.get("rideId") : null;
        if (rideId == null) {
            throw new IllegalArgumentException("rideId is required");
        }
        String email = authentication.getName();
        BookingResponseDto response = bookingService.bookRide(rideId, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId, Authentication authentication) {
        String email = authentication.getName();
        bookingService.cancelBooking(bookingId, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        List<BookingResponseDto> bookings = bookingService.getMyBookings(email);
        return ResponseEntity.ok(bookings);
    }
}

