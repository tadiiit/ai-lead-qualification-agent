package com.myapp.aileadqualificationagent.model.integration;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
        name = "hubspot_oauth_state",
        indexes = {
                @Index(
                        name = "idx_hubspot_oauth_state_expiry",
                        columnList = "expires_at"
                )
        }
)
public class HubSpotOAuthState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "state_hash", nullable = false, unique = true)
    private String stateHash;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    protected HubSpotOAuthState() {
    }

    public HubSpotOAuthState(
            String stateHash,
            Long userId,
            Instant expiresAt
    ) {
        this.stateHash = stateHash;
        this.userId = userId;
        this.expiresAt = expiresAt;
    }

    public String getStateHash() {
        return stateHash;
    }

    public Long getUserId() {
        return userId;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }
}
