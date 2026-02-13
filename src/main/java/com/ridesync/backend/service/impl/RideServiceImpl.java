package com.ridesync.backend.service.impl;

import com.ridesync.backend.dto.ride.RideRequestDto;
import com.ridesync.backend.dto.ride.RideResponseDto;
import com.ridesync.backend.entity.Booking;
import com.ridesync.backend.entity.BookingStatus;
import com.ridesync.backend.entity.Ride;
import com.ridesync.backend.entity.RideStatus;
import com.ridesync.backend.exception.BadRequestException;
import com.ridesync.backend.exception.ResourceNotFoundException;
import com.ridesync.backend.repository.BookingRepository;
import com.ridesync.backend.repository.RideRepository;
import com.ridesync.backend.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RideServiceImpl implements RideService {

    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;

    @Override
    public RideResponseDto createRide(RideRequestDto request) {
        Ride ride = Ride.builder()
                .sourceLocation(request.getSourceLocation())
                .destinationLocation(request.getDestinationLocation())
                .rideDateTime(request.getRideDateTime())
                .totalSeats(request.getTotalSeats())
                // when a new ride is created, all seats are available
                .availableSeats(request.getTotalSeats())
                .status(RideStatus.SCHEDULED)
                .build();

        Ride saved = rideRepository.save(ride);
        return toDto(saved);
    }

    @Override
    public RideResponseDto updateRide(Long id, RideRequestDto request) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + id));

        if (ride.getStatus() == RideStatus.CANCELLED) {
            throw new BadRequestException("Cancelled rides cannot be modified");
        }

        int alreadyBookedSeats = ride.getTotalSeats() - ride.getAvailableSeats();
        if (request.getTotalSeats() < alreadyBookedSeats) {
            throw new BadRequestException(
                    "Total seats cannot be less than already booked seats (" + alreadyBookedSeats + ")"
            );
        }

        ride.setSourceLocation(request.getSourceLocation());
        ride.setDestinationLocation(request.getDestinationLocation());
        ride.setRideDateTime(request.getRideDateTime());
        ride.setTotalSeats(request.getTotalSeats());

        // keep existing bookings, recompute available seats from new capacity
        int newAvailableSeats = request.getTotalSeats() - alreadyBookedSeats;
        ride.setAvailableSeats(newAvailableSeats);

        if (ride.getStatus() != RideStatus.CANCELLED) {
            if (newAvailableSeats == 0) {
                ride.setStatus(RideStatus.FULL);
            } else {
                ride.setStatus(RideStatus.SCHEDULED);
            }
        }

        Ride updated = rideRepository.save(ride);
        return toDto(updated);
    }

    /**
     * Cancel ride and automatically cancel all active bookings for that ride.
     */
    @Override
    @Transactional
    public void cancelRide(Long id) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + id));

        ride.setStatus(RideStatus.CANCELLED);
        rideRepository.save(ride);

        // auto-cancel all active bookings for this ride
        List<Booking> activeBookings = bookingRepository.findByRideAndStatus(ride, BookingStatus.BOOKED);
        for (Booking booking : activeBookings) {
            booking.setStatus(BookingStatus.CANCELLED);
        }
        bookingRepository.saveAll(activeBookings);
    }

    @Override
    public Page<RideResponseDto> getAdminRides(Pageable pageable) {
        return rideRepository.findAll(pageable).map(this::toDto);
    }
    
    @Override
    public RideResponseDto getRideById(Long id) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + id));
        return toDto(ride);
    }

    @Override
    public Page<RideResponseDto> searchAvailableRides(String source, String destination, Pageable pageable) {
        String sourceFilter = source == null ? "" : source;
        String destinationFilter = destination == null ? "" : destination;

        List<RideStatus> statuses = Arrays.asList(RideStatus.SCHEDULED, RideStatus.FULL);

        return rideRepository
                .findByStatusInAndSourceLocationContainingIgnoreCaseAndDestinationLocationContainingIgnoreCase(
                        statuses,
                        sourceFilter,
                        destinationFilter,
                        pageable
                )
                .map(this::toDto);
    }

    private RideResponseDto toDto(Ride ride) {
        return RideResponseDto.builder()
                .id(ride.getId())
                .sourceLocation(ride.getSourceLocation())
                .destinationLocation(ride.getDestinationLocation())
                .rideDateTime(ride.getRideDateTime())
                .totalSeats(ride.getTotalSeats())
                .availableSeats(ride.getAvailableSeats())
                .status(ride.getStatus())
                .build();
    }
}

