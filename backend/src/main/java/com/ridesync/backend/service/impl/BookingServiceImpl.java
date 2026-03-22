package com.ridesync.backend.service.impl;

import com.ridesync.backend.dto.booking.BookingResponseDto;
import com.ridesync.backend.dto.booking.RideSummaryDto;
import com.ridesync.backend.entity.Booking;
import com.ridesync.backend.entity.BookingStatus;
import com.ridesync.backend.entity.Ride;
import com.ridesync.backend.entity.RideStatus;
import com.ridesync.backend.entity.User;
import com.ridesync.backend.exception.BadRequestException;
import com.ridesync.backend.exception.ForbiddenOperationException;
import com.ridesync.backend.exception.ResourceNotFoundException;
import com.ridesync.backend.repository.BookingRepository;
import com.ridesync.backend.repository.RideRepository;
import com.ridesync.backend.repository.UserRepository;
import com.ridesync.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    /**
     * Transactional booking to prevent overbooking using pessimistic locking on the ride.
     */
    @Override
    @Transactional
    public BookingResponseDto bookRide(Long rideId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        // lock ride row for update to avoid concurrent overbooking
        Ride ride = rideRepository.findWithLockingById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (ride.getStatus() == RideStatus.CANCELLED) {
            throw new BadRequestException("Cannot book a cancelled ride");
        }

        if (ride.getAvailableSeats() <= 0 || ride.getStatus() == RideStatus.FULL) {
            throw new BadRequestException("Ride is already full");
        }

        if (bookingRepository.existsByUserAndRide(user, ride)) {
            throw new BadRequestException("You have already booked this ride");
        }

        // allocate one seat
        ride.setAvailableSeats(ride.getAvailableSeats() - 1);
        if (ride.getAvailableSeats() == 0) {
            ride.setStatus(RideStatus.FULL);
        }

        Booking booking = Booking.builder()
                .bookingTime(LocalDateTime.now())
                .status(BookingStatus.BOOKED)
                .user(user)
                .ride(ride)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        rideRepository.save(ride);

        return toDto(savedBooking);
    }

    /**
     * User can only cancel their own bookings.
     * When cancelling, free up a seat if the ride is still active.
     */
    @Override
    @Transactional
    public void cancelBooking(Long bookingId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Booking booking = bookingRepository.findByIdAndUser(bookingId, user)
                .orElseThrow(() -> new ForbiddenOperationException("You cannot cancel another user's booking or booking does not exist"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        Ride ride = booking.getRide();

        // if ride is not cancelled by admin, free a seat
        if (ride.getStatus() != RideStatus.CANCELLED) {
            ride.setAvailableSeats(ride.getAvailableSeats() + 1);
            if (ride.getAvailableSeats() > 0 && ride.getStatus() == RideStatus.FULL) {
                ride.setStatus(RideStatus.SCHEDULED);
            }
            rideRepository.save(ride);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void cancelBookingByAdmin(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        Ride ride = booking.getRide();

        // if ride is not cancelled by admin, free a seat
        if (ride.getStatus() != RideStatus.CANCELLED) {
            ride.setAvailableSeats(ride.getAvailableSeats() + 1);
            if (ride.getAvailableSeats() > 0 && ride.getStatus() == RideStatus.FULL) {
                ride.setStatus(RideStatus.SCHEDULED);
            }
            rideRepository.save(ride);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Override
    public List<BookingResponseDto> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return bookingRepository.findByUser(user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private BookingResponseDto toDto(Booking booking) {
        Ride ride = booking.getRide();
        RideSummaryDto rideSummary = RideSummaryDto.builder()
                .rideId(ride.getId())
                .sourceLocation(ride.getSourceLocation())
                .destinationLocation(ride.getDestinationLocation())
                .rideDateTime(ride.getRideDateTime())
                .status(ride.getStatus())
                .build();

        return BookingResponseDto.builder()
                .id(booking.getId())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .ride(rideSummary)
                .build();
    }
}

