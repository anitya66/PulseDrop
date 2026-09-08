package com.pulsedrop.user.service.impl;

import com.pulsedrop.user.dto.request.LoginRequest;
import com.pulsedrop.user.dto.request.RegisterRequest;
import com.pulsedrop.user.dto.response.AuthResponse;
import com.pulsedrop.user.dto.response.UserResponse;
import com.pulsedrop.user.entity.User;
import com.pulsedrop.user.exception.ResourceNotFoundException;
import com.pulsedrop.user.exception.UserAlreadyExistsException;
import com.pulsedrop.user.mapper.UserMapper;
import com.pulsedrop.user.repository.UserRepository;
import com.pulsedrop.user.security.JwtService;
import com.pulsedrop.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    @Override
    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "Email is already registered"
            );
        }

        User user = userMapper.toEntity(request);

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }
    @Override
public AuthResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Invalid email or password"
                    )
            );

    if (!passwordEncoder.matches(
            request.getPassword(),
            user.getPassword()
    )) {
        throw new ResourceNotFoundException(
                "Invalid email or password"
        );
    }

    String token = jwtService.generateToken(
            user.getId(),
            user.getEmail(),
            user.getRole().name()
    );

    UserResponse userResponse =
            userMapper.toResponse(user);

    return new AuthResponse(
            token,
            userResponse
    );
}
}