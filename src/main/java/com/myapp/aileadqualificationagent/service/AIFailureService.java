package com.myapp.aileadqualificationagent.service;

import com.myapp.aileadqualificationagent.model.*;
import com.myapp.aileadqualificationagent.repository.EvaluationResultRepository;
import com.myapp.aileadqualificationagent.repository.LeadRepository;
import org.springframework.stereotype.Service;

import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.util.Locale;

@Service
public class AIFailureService {

    private static final int MAX_ATTEMPTS = 3;

    private final LeadEvaluationService leadEvaluationService;
    private final EvaluationResultRepository evaluationResultRepository;
    private final LeadRepository leadInquiryRepository;

    public AIFailureService(
            LeadEvaluationService leadEvaluationService,
            EvaluationResultRepository evaluationResultRepository,
            LeadRepository leadInquiryRepository
    ) {
        this.leadEvaluationService = leadEvaluationService;
        this.evaluationResultRepository = evaluationResultRepository;
        this.leadInquiryRepository = leadInquiryRepository;
    }


    /**
     * Main AI evaluation method.
     *
     * One LeadInquiry keeps ONE lead ID.
     *
     * Maximum 3 AI attempts.
     *
     * Every attempt is stored in DB.
     *
     * If one attempt succeeds:
     *      store SUCCESS
     *      return successful result
     *
     * If all 3 fail:
     *      mark lead as AI_FAILURE
     *      return null
     */
    public LeadEvaluation evaluateWithRetry(LeadInquiry leadInquiry) {

        AIFailureType lastFailureType = AIFailureType.UNKNOWN;
        String lastFailureMessage = "Unknown AI failure";

        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {

            System.out.println(
                    "AI evaluation attempt "
                            + attempt
                            + " for Lead ID: "
                            + leadInquiry.getId()
            );

            try {

                // =========================================
                // 1. Call AI
                // =========================================

                LeadEvaluation evaluation =
                        leadEvaluationService.evaluatedLead(
                                leadInquiry.getMessage()
                        );


                // =========================================
                // 2. Check AI response
                // =========================================

                AIFailure failure = aiResponse(evaluation);


                // =========================================
                // 3. SUCCESS
                // =========================================

                if (failure == null) {

                    saveSuccessfulEvaluation(
                            leadInquiry,
                            evaluation,
                            attempt
                    );

                    System.out.println(
                            "AI evaluation successful on attempt "
                                    + attempt
                    );

                    // Stop immediately after success
                    return evaluation;
                }


                // =========================================
                // 4. RESPONSE / VALIDATION FAILURE
                // =========================================

                lastFailureType = failure.type();
                lastFailureMessage = failure.message();

                saveFailedEvaluation(
                        leadInquiry,
                        attempt,
                        lastFailureType,
                        lastFailureMessage
                );


                System.out.println(
                        "AI response failed: "
                                + lastFailureType
                                + " - "
                                + lastFailureMessage
                );


                // =========================================
                // 5. Check retry
                // =========================================

                if (!isRetryable(lastFailureType)) {
                    break;
                }

            } catch (Exception exception) {

                // =========================================
                // 6. MODEL / API / NETWORK FAILURE
                // =========================================

                lastFailureType = modelFailures(exception);

                lastFailureMessage =
                        exception.getMessage() != null
                                ? exception.getMessage()
                                : exception.toString();


                // Save failed attempt
                saveFailedEvaluation(
                        leadInquiry,
                        attempt,
                        lastFailureType,
                        lastFailureMessage
                );


                System.out.println(
                        "AI model failure: "
                                + lastFailureType
                                + " - "
                                + lastFailureMessage
                );


                // Do not retry non-retryable failures
                if (!isRetryable(lastFailureType)) {
                    break;
                }
            }
        }


        // =========================================
        // ALL ATTEMPTS FAILED
        // =========================================

        markFinalAIFailure(
                leadInquiry,
                lastFailureType,
                lastFailureMessage
        );

        return null;
    }


    // =====================================================
    // CHECK COMPLETE AI RESPONSE
    // =====================================================

    private AIFailure aiResponse(LeadEvaluation leadEvaluation) {

        // Response-format failure
        AIFailure responseFailure =
                responseFailure(leadEvaluation);

        if (responseFailure != null) {
            return responseFailure;
        }


        // Validation failure
        AIFailure validationFailure =
                validateFailure(
                        leadEvaluation.icpScore(),
                        leadEvaluation.category()
                );

        if (validationFailure != null) {
            return validationFailure;
        }


        // Business-rule failure
        AIFailure safetyFailure =
                safetyFailures(leadEvaluation);

        if (safetyFailure != null) {
            return safetyFailure;
        }


        return null;
    }


    // =====================================================
    // MODEL / API FAILURE
    // =====================================================

    private AIFailureType modelFailures(Exception exception) {

        Throwable cause = exception;

        while (cause.getCause() != null) {
            cause = cause.getCause();
        }


        if (cause instanceof SocketTimeoutException
                || cause instanceof java.util.concurrent.TimeoutException) {

            return AIFailureType.TIMEOUT;
        }


        if (cause instanceof ConnectException) {
            return AIFailureType.NETWORK_ERROR;
        }


        String message = cause.getMessage();


        if (message != null) {

            String error =
                    message.toLowerCase(Locale.ROOT);


            if (error.contains("429")
                    || error.contains("rate limit")
                    || error.contains("too many requests")) {

                return AIFailureType.RATE_LIMITED;
            }


            if (error.contains("401")
                    || error.contains("403")
                    || error.contains("api key")
                    || error.contains("authentication")) {

                return AIFailureType.AUTHENTICATION_ERROR;
            }


            if (error.contains("quota")) {
                return AIFailureType.QUOTA_EXCEEDED;
            }


            if (error.contains("503")
                    || error.contains("service unavailable")) {

                return AIFailureType.SERVICE_UNAVAILABLE;
            }
        }


        return AIFailureType.API_ERROR;
    }


    // =====================================================
    // RESPONSE FORMAT VALIDATION
    // =====================================================

    private AIFailure responseFailure(
            LeadEvaluation leadEvaluation
    ) {

        if (leadEvaluation == null) {

            return new AIFailure(
                    AIFailureType.EMPTY_RESPONSE,
                    "AI returned null response"
            );
        }


        if (leadEvaluation.category() == null) {

            return new AIFailure(
                    AIFailureType.MISSING_REQUIRED_FIELD,
                    "AI response is missing category"
            );
        }


        if (leadEvaluation.reasoning() == null
                || leadEvaluation.reasoning().isBlank()) {

            return new AIFailure(
                    AIFailureType.MISSING_REQUIRED_FIELD,
                    "AI response is missing reasoning"
            );
        }


        if (leadEvaluation.recommendedAction() == null
                || leadEvaluation.recommendedAction().isBlank()) {

            return new AIFailure(
                    AIFailureType.MISSING_REQUIRED_FIELD,
                    "AI response is missing recommended action"
            );
        }


        return null;
    }


    // =====================================================
    // DATA VALIDATION
    // =====================================================

    private AIFailure validateFailure(
            float score,
            Category category
    ) {

        if (score < 0 || score > 100) {

            return new AIFailure(
                    AIFailureType.VALIDATION_ERROR,
                    "AI returned invalid score: " + score
            );
        }


        if (category == null) {

            return new AIFailure(
                    AIFailureType.VALIDATION_ERROR,
                    "AI returned null category"
            );
        }


        return null;
    }


    // =====================================================
    // BUSINESS RULE VALIDATION
    // =====================================================

    private AIFailure safetyFailures(
            LeadEvaluation leadEvaluation
    ) {

        if (leadEvaluation.icpScore() >= 80
                && leadEvaluation.category() == Category.COLD) {

            return new AIFailure(
                    AIFailureType.BUSINESS_RULE_VIOLATION,
                    "Score and category are inconsistent"
            );
        }


        if (leadEvaluation.icpScore() < 40
                && leadEvaluation.category() == Category.HOT) {

            return new AIFailure(
                    AIFailureType.BUSINESS_RULE_VIOLATION,
                    "Score and category are inconsistent"
            );
        }


        return null;
    }


    // =====================================================
    // RETRY RULE
    // =====================================================

    private boolean isRetryable(
            AIFailureType failureType
    ) {

        return switch (failureType) {

            case TIMEOUT,
                 RATE_LIMITED,
                 SERVICE_UNAVAILABLE,
                 NETWORK_ERROR,
                 API_ERROR,
                 EMPTY_RESPONSE,
                 INVALID_RESPONSE,
                 PARSING_ERROR,
                 MISSING_REQUIRED_FIELD,
                 VALIDATION_ERROR -> true;


            case AUTHENTICATION_ERROR,
                 QUOTA_EXCEEDED,
                 BUSINESS_RULE_VIOLATION -> false;


            case UNKNOWN -> true;
        };
    }


    // =====================================================
    // SAVE SUCCESSFUL ATTEMPT
    // =====================================================

    private void saveSuccessfulEvaluation(
            LeadInquiry leadInquiry,
            LeadEvaluation evaluation,
            int attempt
    ) {
        System.out.println("Currently in  saving the sucess evalution ");
        com.myapp.aileadqualificationagent.model.EvaluationResult result =
                new com.myapp.aileadqualificationagent.model.EvaluationResult();
        leadInquiry.setProcessingStatus(LeadProcessingStatus.AI_SUCCESS);
        result.setLead(leadInquiry);
        result.setAttemptNumber(attempt);

        result.setScore(
                evaluation.icpScore()
        );

        result.setCategory(
                evaluation.category()
        );

        result.setReasoning(
                evaluation.reasoning()
        );

        result.setRecommendedAction(
                evaluation.recommendedAction()
        );

        /*
         * Add this only if LeadEvaluation
         * contains confidence.
         */
        if (evaluation.confidence() != 0) {
            result.setConfidence(
                    evaluation.confidence()
            );
        }

        result.setStatus(
                EvaluationStatus.SUCCESS
        );

        result.setFailureType(null);

        result.setFailureMessage(null);

        evaluationResultRepository.save(result);

        //Sending the lead inquiry to if hot to hubspot crm
        System.out.println("Sending the lead to crm .. ");



    }


    // =====================================================
    // SAVE FAILED ATTEMPT
    // =====================================================

    private void saveFailedEvaluation(
            LeadInquiry leadInquiry,
            int attempt,
            AIFailureType failureType,
            String failureMessage
    ) {

        com.myapp.aileadqualificationagent.model.EvaluationResult result =
                new com.myapp.aileadqualificationagent.model.EvaluationResult();

        leadInquiry.setProcessingStatus(LeadProcessingStatus.AI_FAILURE);
        result.setLead(leadInquiry);

        result.setAttemptNumber(attempt);

        result.setStatus(
                EvaluationStatus.FAILED
        );

        /*
         * Failed response has no valid
         * score/category.
         */
        result.setScore(0);

        result.setCategory(null);

        result.setConfidence(null);

        result.setReasoning(null);

        result.setRecommendedAction(null);

        result.setFailureType(
                failureType
        );

        result.setFailureMessage(
                failureMessage
        );


        evaluationResultRepository.save(result);
    }


    // =====================================================
    // FINAL AI FAILURE
    // =====================================================

    private void markFinalAIFailure(
            LeadInquiry leadInquiry,
            AIFailureType failureType,
            String failureMessage
    ) {

        System.out.println("--------------------------------");
        System.out.println("AI FAILURE");
        System.out.println(
                "Lead ID: " + leadInquiry.getId()
        );
        System.out.println(
                "Status: AI_FAILURE"
        );
        System.out.println(
                "Failure Type: " + failureType
        );
        System.out.println(
                "Message: " + failureMessage
        );
        System.out.println(
                "Maximum Attempts: " + MAX_ATTEMPTS
        );
        System.out.println("--------------------------------");


        /*
         * IMPORTANT:
         *
         * Add an AI processing status to LeadInquiry:
         *
         * leadInquiry.setProcessingStatus(
         *     LeadProcessingStatus.AI_FAILURE
         * );
         *
         * Then:
         *
         * leadInquiryRepository.save(leadInquiry);
         *
         * This assumes your LeadInquiry entity has
         * processingStatus + setter.
         */

        leadInquiry.setProcessingStatus(
                LeadProcessingStatus.AI_FAILURE
        );

        leadInquiryRepository.save(
                leadInquiry
        );
    }


    // =====================================================
    // FAILURE OBJECT
    // =====================================================

    private record AIFailure(
            AIFailureType type,
            String message
    ) {
    }
}