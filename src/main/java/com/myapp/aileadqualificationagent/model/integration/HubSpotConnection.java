package com.myapp.aileadqualificationagent.model.integration;

import com.myapp.aileadqualificationagent.model.user.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "hubspot_connection")
public class HubSpotConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 2000)
    private String accessToken;

    @Column(nullable = false, length = 2000)
    private String refreshToken;

    @Column(nullable = false)
    private Instant accessTokenExpiresAt;

    private String hubspotAccountId;

    public HubSpotConnection() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public Instant getAccessTokenExpiresAt() {
        return accessTokenExpiresAt;
    }

    public void setAccessTokenExpiresAt(Instant accessTokenExpiresAt) {
        this.accessTokenExpiresAt = accessTokenExpiresAt;
    }

    public String getHubspotAccountId() {
        return hubspotAccountId;
    }

    public void setHubspotAccountId(String hubspotAccountId) {
        this.hubspotAccountId = hubspotAccountId;
    }
}
