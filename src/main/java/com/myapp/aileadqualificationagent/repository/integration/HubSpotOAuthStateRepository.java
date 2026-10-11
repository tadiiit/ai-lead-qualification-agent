package com.myapp.aileadqualificationagent.repository.integration;

import com.myapp.aileadqualificationagent.model.integration.HubSpotOAuthState;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface HubSpotOAuthStateRepository
        extends JpaRepository<com.myapp.aileadqualificationagent.model.integration.HubSpotOAuthState, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select s from HubSpotOAuthState s
        where s.stateHash = :stateHash
        """)
    Optional<HubSpotOAuthState> findByStateHashForUpdate(
            @Param("stateHash") String stateHash
    );
}
