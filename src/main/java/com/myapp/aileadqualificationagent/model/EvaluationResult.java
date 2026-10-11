package com.myapp.aileadqualificationagent.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lead_evaluation")
public class EvaluationResult {

    public EvaluationResult() {
    }

    public EvaluationResult(
            LeadInquiry lead,
            int attemptNumber,
            int score,
            Category category,
            Float confidence,
            String reasoning,
            String recommendedAction,
            EvaluationStatus status,
            AIFailureType failureType,
            String failureMessage
    ) {
        this.lead = lead;
        this.attemptNumber = attemptNumber;
        this.score = score;
        this.category = category;
        this.confidence = confidence;
        this.reasoning = reasoning;
        this.recommendedAction = recommendedAction;
        this.status = status;
        this.failureType = failureType;
        this.failureMessage = failureMessage;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Many EvaluationResult records can belong to one LeadInquiry.
     *
     * Example:
     * Lead 101
     *   -> Evaluation attempt 1
     *   -> Evaluation attempt 2
     *   -> Evaluation attempt 3
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private LeadInquiry lead;

    /*
     * AI attempt number for this lead.
     * Example: 1, 2, 3
     */
    private int attemptNumber;

    /*
     * AI lead score.
     * Example: 0 - 100
     */
    private int score;

    /*
     * HOT / WARM / COLD
     */
    @Enumerated(EnumType.STRING)
    private Category category;

    /*
     * AI confidence/uncertainty signal.
     */
    private Float confidence;

    /*
     * Reason why AI classified the lead.
     */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String reasoning;

    /*
     * Recommended next action.
     */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String recommendedAction;

    /*
     * SUCCESS / FAILED
     */
    @Enumerated(EnumType.STRING)
    private EvaluationStatus status;

    /*
     * Reason for AI failure.
     */
    @Enumerated(EnumType.STRING)
    private AIFailureType failureType;

    /*
     * Detailed technical failure message.
     */
    @Column(columnDefinition = "TEXT")
    private String failureMessage;


    // =========================
    // Getters
    // =========================

    public Long getId() {
        return id;
    }

    public LeadInquiry getLead() {
        return lead;
    }

    public int getAttemptNumber() {
        return attemptNumber;
    }

    public int getScore() {
        return score;
    }

    public Category getCategory() {
        return category;
    }

    public Float getConfidence() {
        return confidence;
    }

    public String getReasoning() {
        return reasoning;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public EvaluationStatus getStatus() {
        return status;
    }

    public AIFailureType getFailureType() {
        return failureType;
    }

    public String getFailureMessage() {
        return failureMessage;
    }


    // =========================
    // Setters
    // =========================

    public void setId(Long id) {
        this.id = id;
    }

    public void setLead(LeadInquiry lead) {
        this.lead = lead;
    }

    public void setAttemptNumber(int attemptNumber) {
        this.attemptNumber = attemptNumber;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setConfidence(Float confidence) {
        this.confidence = confidence;
    }

    public void setReasoning(String reasoning) {
        this.reasoning = reasoning;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public void setStatus(EvaluationStatus status) {
        this.status = status;
    }

    public void setFailureType(AIFailureType failureType) {
        this.failureType = failureType;
    }

    public void setFailureMessage(String failureMessage) {
        this.failureMessage = failureMessage;
    }
}