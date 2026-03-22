package com.ridesync.backend.repository;

import com.ridesync.backend.entity.Ride;
import com.ridesync.backend.entity.RideStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Collection;
import java.util.Optional;

public interface RideRepository extends JpaRepository<Ride, Long> {

    /**
     * Pessimistic write lock to safely update seats during booking.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Ride> findWithLockingById(Long id);

    Page<Ride> findBySourceLocationContainingIgnoreCaseAndDestinationLocationContainingIgnoreCase(
            String sourceLocation,
            String destinationLocation,
            Pageable pageable
    );

    Page<Ride> findByStatusInAndSourceLocationContainingIgnoreCaseAndDestinationLocationContainingIgnoreCase(
            Collection<RideStatus> statuses,
            String sourceLocation,
            String destinationLocation,
            Pageable pageable
    );
}

