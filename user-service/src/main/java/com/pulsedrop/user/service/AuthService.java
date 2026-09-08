package com.pulsedrop.user.service;

import com.pulsedrop.user.dto.request.LoginRequest;
import com.pulsedrop.user.dto.request.RegisterRequest;
import com.pulsedrop.user.dto.response.AuthResponse;
import com.pulsedrop.user.dto.response.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}