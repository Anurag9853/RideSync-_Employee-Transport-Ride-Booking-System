package com.ridesync.backend.service;

import com.ridesync.backend.dto.auth.AuthResponse;
import com.ridesync.backend.dto.auth.LoginRequest;
import com.ridesync.backend.dto.auth.RegisterRequest;
import com.ridesync.backend.dto.common.ApiResponse;

public interface AuthService {

    ApiResponse registerEmployee(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}

