package com.pulsedrop.user.service;

import com.pulsedrop.user.dto.request.RegisterRequest;
import com.pulsedrop.user.dto.response.UserResponse;

public interface UserService {

    UserResponse createUser(RegisterRequest request);

    UserResponse getUserById(Long id);

    UserResponse getUserByEmail(String email);

    boolean existsByEmail(String email);

    UserResponse getCurrentUser(String email);
}