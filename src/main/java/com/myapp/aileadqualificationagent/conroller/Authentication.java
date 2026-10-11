
package com.myapp.aileadqualificationagent.conroller;

import com.myapp.aileadqualificationagent.dto.auth.AuthResponse;
import com.myapp.aileadqualificationagent.dto.auth.LoginRequest;
import com.myapp.aileadqualificationagent.dto.auth.RegisterRequest;
import com.myapp.aileadqualificationagent.dto.auth.UserResponse;
import com.myapp.aileadqualificationagent.service.auth.AuthenticationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class Authentication {

    private final AuthenticationService authenticationService;

    public Authentication(
            AuthenticationService authenticationService
    ) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(
                authenticationService.register(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authenticationService.login(request)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
                authenticationService.getCurrentUserByEmail(
                        userDetails.getUsername()
                )
        );
    }
}