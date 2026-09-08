package com.pulsedrop.user.controller;

import com.pulsedrop.user.common.ApiResponse;
import com.pulsedrop.user.dto.response.UserResponse;
import com.pulsedrop.user.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    // Get currently authenticated user
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            Authentication authentication
    ) {

        String email = authentication.getName();

        UserResponse response =
                userService.getCurrentUser(email);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Current user retrieved successfully",
                        response
                )
        );
    }

    // Customer-only endpoint
    @GetMapping("/customer-test")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<String>> customerTest() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Customer authorization successful",
                        "You have CUSTOMER access"
                )
        );
    }

    // Driver-only endpoint
    @GetMapping("/driver-test")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<String>> driverTest() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Driver authorization successful",
                        "You have DRIVER access"
                )
        );
    }
}