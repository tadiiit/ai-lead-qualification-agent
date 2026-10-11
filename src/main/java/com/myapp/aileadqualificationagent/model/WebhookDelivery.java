package com.myapp.aileadqualificationagent.model;


import com.myapp.aileadqualificationagent.model.WebhookStatus;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "webhook_delivery")
public class WebhookDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private LeadInquiry lead;

    private String eventId;

    private int attemptNumber;

    @Enumerated(EnumType.STRING)
    private WebhookStatus status;

    private Integer responseCode;

    @Column(columnDefinition = "TEXT")
    private String responseBody;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private Instant createdAt;

    private Instant lastAttemptAt;


    // ---------- Getters ----------

    public Long getId() {
        return id;
    }

    public LeadInquiry getLead() {
        return lead;
    }

    public String getEventId() {
        return eventId;
    }

    public int getAttemptNumber() {
        return attemptNumber;
    }

    public WebhookStatus getStatus() {
        return status;
    }

    public Integer getResponseCode() {
        return responseCode;
    }

    public String getResponseBody() {
        return responseBody;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getLastAttemptAt() {
        return lastAttemptAt;
    }


    // ---------- Setters ----------

    public void setId(Long id) {
        this.id = id;
    }

    public void setLead(LeadInquiry lead) {
        this.lead = lead;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public void setAttemptNumber(int attemptNumber) {
        this.attemptNumber = attemptNumber;
    }

    public void setStatus(WebhookStatus status) {
        this.status = status;
    }

    public void setResponseCode(Integer responseCode) {
        this.responseCode = responseCode;
    }

    public void setResponseBody(String responseBody) {
        this.responseBody = responseBody;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setLastAttemptAt(Instant lastAttemptAt) {
        this.lastAttemptAt = lastAttemptAt;
    }
}

