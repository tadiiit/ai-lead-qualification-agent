package com.myapp.aileadqualificationagent.service.integration.hubspot;

import com.myapp.aileadqualificationagent.model.integration.HubSpotOAuthState;
import com.myapp.aileadqualificationagent.repository.integration.HubSpotOAuthStateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
public class HubSpotOAuthStateService {

    private final HubSpotOAuthStateRepository repository;
    private final SecureRandom secureRandom = new SecureRandom();

    public HubSpotOAuthStateService(
            HubSpotOAuthStateRepository repository
    ) {
        this.repository = repository;
    }

    public String createState(Long userId) {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        String rawState = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        HubSpotOAuthState record = new HubSpotOAuthState(
                hashState(rawState),
                userId,
                Instant.now().plusSeconds(600)
        );

        repository.save(record);

        // Return the raw value to be sent to HubSpot.
        return rawState;
    }

    @Transactional
    public Long validateAndConsumeState(String rawState) {
        if (rawState == null || rawState.isBlank()) {
            throw new IllegalArgumentException(
                    "Missing OAuth state"
            );
        }

        String stateHash = hashState(rawState);

        HubSpotOAuthState record = repository
                .findByStateHashForUpdate(stateHash)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid or already used OAuth state"
                ));

        if (!record.getExpiresAt().isAfter(Instant.now())) {
            repository.delete(record);

            throw new IllegalArgumentException(
                    "OAuth state has expired"
            );
        }

        Long userId = record.getUserId();

        // Consume the state so it cannot be reused.
        repository.delete(record);

        return userId;
    }

    private String hashState(String state) {
        try {
            byte[] digest = MessageDigest
                    .getInstance("SHA-256")
                    .digest(state.getBytes(StandardCharsets.UTF_8));

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(digest);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException(
                    "SHA-256 is unavailable", ex
            );
        }
    }
}
