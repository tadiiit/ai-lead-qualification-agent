package com.myapp.aileadqualificationagent.model;

public record LeadEvaluation(
        int icpScore ,// e.g., 0 to 100
        float confidence , //  How confident the AI is in its assessmnet
        Category category,       // "HOT", "WARM", "COLD"
        String reasoning,      // Why this score was given
        String recommendedAction
) {

}
