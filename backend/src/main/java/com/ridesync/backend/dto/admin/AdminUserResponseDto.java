package com.ridesync.backend.dto.admin;

import com.ridesync.backend.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminUserResponseDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Long totalBookings;
}
