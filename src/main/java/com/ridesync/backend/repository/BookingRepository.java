package com.ridesync.backend.repository;

import com.ridesync.backend.entity.Booking;
import com.ridesync.backend.entity.BookingStatus;
import com.ridesync.backend.entity.Ride;
import com.ridesync.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByUserAndRide(User user, Ride ride);

    List<Booking> findByUser(User user);

    List<Booking> findByRide(Ride ride);

    List<Booking> findByRideAndStatus(Ride ride, BookingStatus status);

    Optional<Booking> findByIdAndUser(Long id, User user);
}

