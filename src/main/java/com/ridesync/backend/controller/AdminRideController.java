package com.ridesync.backend.controller;

import com.ridesync.backend.dto.ride.RideRequestDto;
import com.ridesync.backend.dto.ride.RideResponseDto;
import com.ridesync.backend.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/rides")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRideController {

    private final RideService rideService;

    @PostMapping
    public ResponseEntity<RideResponseDto> createRide(@Valid @RequestBody RideRequestDto request) {
        RideResponseDto response = rideService.createRide(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RideResponseDto> updateRide(@PathVariable Long id,
                                                      @Valid @RequestBody RideRequestDto request) {
        RideResponseDto response = rideService.updateRide(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelRide(@PathVariable Long id) {
        rideService.cancelRide(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<RideResponseDto>> getRides(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size,
                                                          @RequestParam(defaultValue = "rideDateTime") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        Page<RideResponseDto> rides = rideService.getAdminRides(pageable);
        return ResponseEntity.ok(rides);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RideResponseDto> getRide(@PathVariable Long id) {
        RideResponseDto ride = rideService.getRideById(id);
        return ResponseEntity.ok(ride);
    }
}

