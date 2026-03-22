package com.ridesync.backend.service.impl;

import com.ridesync.backend.dto.admin.AdminBookingResponseDto;
import com.ridesync.backend.dto.admin.AdminUserResponseDto;
import com.ridesync.backend.dto.admin.DashboardStatsDto;
import com.ridesync.backend.entity.Booking;
import com.ridesync.backend.entity.BookingStatus;
import com.ridesync.backend.entity.Ride;
import com.ridesync.backend.entity.RideStatus;
import com.ridesync.backend.entity.Role;
import com.ridesync.backend.entity.User;
import com.ridesync.backend.exception.ResourceNotFoundException;
import com.ridesync.backend.repository.BookingRepository;
import com.ridesync.backend.repository.RideRepository;
import com.ridesync.backend.repository.UserRepository;
import com.ridesync.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;

    @Override
    public DashboardStatsDto getDashboardStats() {
        long totalRides = rideRepository.count();
        long activeRides = rideRepository.findAll().stream()
                .filter(r -> r.getStatus() == RideStatus.SCHEDULED || r.getStatus() == RideStatus.FULL)
                .count();
        long cancelledRides = rideRepository.findAll().stream()
                .filter(r -> r.getStatus() == RideStatus.CANCELLED)
                .count();

        long totalBookings = bookingRepository.count();
        long activeBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.BOOKED)
                .count();
        long cancelledBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.CANCELLED)
                .count();

        long totalUsers = userRepository.count();
        long totalEmployees = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.EMPLOYEE)
                .count();
        long totalAdmins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .count();

        LocalDate today = LocalDate.now();
        long ridesToday = rideRepository.findAll().stream()
                .filter(r -> r.getRideDateTime().toLocalDate().equals(today))
                .count();
        long bookingsToday = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingTime().toLocalDate().equals(today))
                .count();

        return DashboardStatsDto.builder()
                .totalRides(totalRides)
                .activeRides(activeRides)
                .cancelledRides(cancelledRides)
                .totalBookings(totalBookings)
                .activeBookings(activeBookings)
                .cancelledBookings(cancelledBookings)
                .totalUsers(totalUsers)
                .totalEmployees(totalEmployees)
                .totalAdmins(totalAdmins)
                .ridesToday(ridesToday)
                .bookingsToday(bookingsToday)
                .build();
    }

    @Override
    public Page<AdminUserResponseDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(user -> {
            long totalBookings = bookingRepository.findByUser(user).size();
            return AdminUserResponseDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .totalBookings(totalBookings)
                    .build();
        });
    }

    @Override
    public Page<AdminBookingResponseDto> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable).map(booking -> {
            User user = booking.getUser();
            Ride ride = booking.getRide();
            return AdminBookingResponseDto.builder()
                    .id(booking.getId())
                    .bookingTime(booking.getBookingTime())
                    .status(booking.getStatus())
                    .userName(user.getName())
                    .userEmail(user.getEmail())
                    .rideId(ride.getId())
                    .rideSource(ride.getSourceLocation())
                    .rideDestination(ride.getDestinationLocation())
                    .rideDateTime(ride.getRideDateTime())
                    .build();
        });
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        if (user.getRole() == Role.ADMIN) {
            long adminCount = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == Role.ADMIN)
                    .count();
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot delete the last admin user");
            }
        }
        
        userRepository.delete(user);
    }
}
