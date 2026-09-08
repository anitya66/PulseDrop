package com.pulsedrop.user.controller;

import com.pulsedrop.user.common.ApiResponse;
import com.pulsedrop.user.dto.response.UserResponse;
import com.pulsedrop.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
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
}