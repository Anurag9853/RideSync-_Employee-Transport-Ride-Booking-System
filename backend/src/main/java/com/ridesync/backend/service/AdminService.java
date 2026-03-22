package com.ridesync.backend.service;

import com.ridesync.backend.dto.admin.AdminBookingResponseDto;
import com.ridesync.backend.dto.admin.AdminUserResponseDto;
import com.ridesync.backend.dto.admin.DashboardStatsDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    DashboardStatsDto getDashboardStats();
    
    Page<AdminUserResponseDto> getAllUsers(Pageable pageable);
    
    Page<AdminBookingResponseDto> getAllBookings(Pageable pageable);
    
    void deleteUser(Long userId);
}
