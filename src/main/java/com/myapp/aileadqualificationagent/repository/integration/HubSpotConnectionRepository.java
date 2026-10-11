package com.myapp.aileadqualificationagent.repository.integration;

import com.myapp.aileadqualificationagent.model.integration.HubSpotConnection;
import org.hibernate.internal.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HubSpotConnectionRepository extends JpaRepository<HubSpotConnection , Long> {

    Optional<HubSpotConnection> findByUserId(Long userId);

    Optional<HubSpotConnection> findByUserIdAndHubspotAccountId(
            Long userId,
            String hubspotAccountId
    );
}
