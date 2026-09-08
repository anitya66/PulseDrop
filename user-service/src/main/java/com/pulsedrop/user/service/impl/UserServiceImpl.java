package com.pulsedrop.user.service.impl;

import com.pulsedrop.user.dto.request.RegisterRequest;
import com.pulsedrop.user.dto.request.UpdateUserRequest;
import com.pulsedrop.user.dto.response.UserResponse;
import com.pulsedrop.user.entity.User;
import com.pulsedrop.user.exception.ResourceNotFoundException;
import com.pulsedrop.user.exception.UserAlreadyExistsException;
import com.pulsedrop.user.mapper.UserMapper;
import com.pulsedrop.user.repository.UserRepository;
import com.pulsedrop.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponse createUser(RegisterRequest request) {

        User user = userMapper.toEntity(request);

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(Long id) {

    User user = userRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with id: " + id
                    )
            );

    return userMapper.toResponse(user);
   }

    @Override
    public UserResponse getUserByEmail(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with email: " + email
                    )
            );

    return userMapper.toResponse(user);
    }

    @Override
    public boolean existsByEmail(String email) {

        return userRepository.existsByEmail(email);
    }

    @Override
public UserResponse getCurrentUser(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found"
                    )
            );

    return userMapper.toResponse(user);
}

@Override
public UserResponse updateCurrentUser(
        String currentEmail,
        UpdateUserRequest request
) {

    User user = userRepository.findByEmail(currentEmail)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found"
                    )
            );

    if (!currentEmail.equalsIgnoreCase(request.getEmail())
            && userRepository.existsByEmail(request.getEmail())) {

        throw new UserAlreadyExistsException(
                "Email is already registered"
        );
    }

    user.setName(request.getName());
    user.setEmail(request.getEmail());

    User updatedUser = userRepository.save(user);

    return userMapper.toResponse(updatedUser);
}
}