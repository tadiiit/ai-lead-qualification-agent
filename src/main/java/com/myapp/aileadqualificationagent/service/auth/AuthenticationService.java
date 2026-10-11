package com.myapp.aileadqualificationagent.service.auth;

import com.myapp.aileadqualificationagent.dto.auth.AuthResponse;
import com.myapp.aileadqualificationagent.dto.auth.LoginRequest;
import com.myapp.aileadqualificationagent.dto.auth.RegisterRequest;
import com.myapp.aileadqualificationagent.dto.auth.UserResponse;
import com.myapp.aileadqualificationagent.model.user.User;
import com.myapp.aileadqualificationagent.repository.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomDetailsService customDetailsService;

    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder, JwtService jwtService, CustomDetailsService customDetailsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.customDetailsService = customDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Never store the plain password.
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(
                customDetailsService.loadUserByUsername(savedUser.getEmail())
        );

        UserResponse userResponse = new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );

        // JWT will be generated here later.
        return new AuthResponse(
                "Registration successful",
                userResponse,
                token
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                customDetailsService.loadUserByUsername(user.getEmail())
        );

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );

        // JWT will be generated here later.
        return new AuthResponse(
                "Login successful",
                userResponse,
                token
        );
    }

    public UserResponse getCurrentUser(Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    public void logout() {
        // With JWT, logout will be handled differently.
        // We will implement this when JWT/security is added.
    }


    public UserResponse getCurrentUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}
