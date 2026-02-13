package com.ridesync.backend.service;

import com.ridesync.backend.dto.ride.RideRequestDto;
import com.ridesync.backend.dto.ride.RideResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RideService {

    // Admin operations
    RideResponseDto createRide(RideRequestDto request);

    RideResponseDto updateRide(Long id, RideRequestDto request);

    void cancelRide(Long id);

    Page<RideResponseDto> getAdminRides(Pageable pageable);
    
    RideResponseDto getRideById(Long id);

    // Employee operations
    Page<RideResponseDto> searchAvailableRides(String source, String destination, Pageable pageable);
}

