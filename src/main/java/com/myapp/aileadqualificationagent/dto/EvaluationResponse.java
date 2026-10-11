package com.myapp.aileadqualificationagent.dto;

import com.myapp.aileadqualificationagent.model.AIFailureType;
import com.myapp.aileadqualificationagent.model.Category;
import com.myapp.aileadqualificationagent.model.EvaluationStatus;

public record EvaluationResponse(Long id,
                                 int attemptNumber,
                                 float score,
                                 Category category,
                                 Float confidence,
                                 String reasoning,
                                 String recommendedAction,
                                 EvaluationStatus status,
                                 AIFailureType failureType,
                                 String failureMessage) {
}
