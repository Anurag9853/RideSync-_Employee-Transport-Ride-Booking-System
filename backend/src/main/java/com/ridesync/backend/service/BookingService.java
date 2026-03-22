package com.ridesync.backend.service;

import com.ridesync.backend.dto.booking.BookingResponseDto;

import java.util.List;

public interface BookingService {

    BookingResponseDto bookRide(Long rideId, String userEmail);

    void cancelBooking(Long bookingId, String userEmail);
    
    void cancelBookingByAdmin(Long bookingId);

    List<BookingResponseDto> getMyBookings(String userEmail);
}

