package com.myapp.aileadqualificationagent.model;

import com.myapp.aileadqualificationagent.model.user.User;
import jakarta.persistence.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.validation.annotation.Validated;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "lead")
public class LeadInquiry {

    public LeadInquiry(List<EvaluationResult> evaluation){

        this.evaluation = evaluation;
    }

    public LeadInquiry(String companyName ,
                       String contactEmail, String message,
                       Instant submmitedAt, List<EvaluationResult> evaluation){
        this.companyName = companyName;
        this.contactEmail = contactEmail;
        this.message = message;
        this.submmitedAt = submmitedAt;

        this.evaluation = evaluation;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    private String companyName;

    @NotNull
    private String contactEmail;

    @NotNull
    @Column(columnDefinition = "TEXT")
    private String message;

    private Instant submmitedAt;

    private LeadProcessingStatus processingStatus;

    @OneToMany(
            mappedBy = "lead",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<EvaluationResult> evaluation;

    public LeadInquiry() {

    }


    public String getCompanyName() {
        return companyName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getMessage() {
        return message;
    }

    public Instant getSubmmitedAt() {
        return submmitedAt;
    }

    public LeadProcessingStatus getProcessingStatus() {
        return processingStatus;
    }

    public List<EvaluationResult> getEvaluation(){
        return evaluation;
    }

    public void setEvaluation(List<EvaluationResult> evaluation) {

    }
    //setter...................................

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setSubmmitedAt(Instant submmitedAt) {
        this.submmitedAt = submmitedAt;
    }

    public void setProcessingStatus(LeadProcessingStatus processingStatus) {
        this.processingStatus = processingStatus;
    }

    public Long getId() {
        return  id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
