package com.ridesync.backend.dto.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDto {
    private Long totalRides;
    private Long activeRides;
    private Long cancelledRides;
    private Long totalBookings;
    private Long activeBookings;
    private Long cancelledBookings;
    private Long totalUsers;
    private Long totalEmployees;
    private Long totalAdmins;
    private Long ridesToday;
    private Long bookingsToday;
}
