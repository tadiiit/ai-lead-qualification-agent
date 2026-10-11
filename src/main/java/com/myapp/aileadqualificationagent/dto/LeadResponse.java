package com.myapp.aileadqualificationagent.dto;

import com.myapp.aileadqualificationagent.model.LeadProcessingStatus;

import java.time.Instant;
import java.util.List;

public record LeadResponse(
        Long id,
        String companyName,
        String contactEmail,
        String message,
        Instant submittedAt,
        LeadProcessingStatus processingStatus,
        List<EvaluationResponse> evaluations
) {
}
