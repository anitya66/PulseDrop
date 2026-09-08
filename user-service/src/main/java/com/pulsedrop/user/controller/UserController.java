package com.pulsedrop.user.controller;

import com.pulsedrop.user.common.ApiResponse;
import com.pulsedrop.user.dto.request.ChangePasswordRequest;
import com.pulsedrop.user.dto.request.UpdateUserRequest;
import com.pulsedrop.user.dto.response.UserResponse;
import com.pulsedrop.user.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

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

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request
    ) {

        String currentEmail = authentication.getName();

        UserResponse response =
                userService.updateCurrentUser(
                        currentEmail,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User profile updated successfully",
                        response
                )
        );
    }

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
    @PutMapping("/me/password")
public ResponseEntity<ApiResponse<Void>> changePassword(
        Authentication authentication,
        @Valid @RequestBody ChangePasswordRequest request
) {

    String currentEmail = authentication.getName();

    userService.changePassword(
            currentEmail,
            request
    );

    return ResponseEntity.ok(
            ApiResponse.success(
                    "Password changed successfully",
                    null
            )
    );
}
}