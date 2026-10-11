package com.myapp.aileadqualificationagent.service;

import com.myapp.aileadqualificationagent.dto.EvaluationResponse;
import com.myapp.aileadqualificationagent.dto.LeadPageResponse;
import com.myapp.aileadqualificationagent.dto.LeadRequest;
import com.myapp.aileadqualificationagent.dto.LeadResponse;
import com.myapp.aileadqualificationagent.model.*;
import com.myapp.aileadqualificationagent.model.user.User;
import com.myapp.aileadqualificationagent.repository.EvaluationResultRepository;
import com.myapp.aileadqualificationagent.repository.LeadRepository;
import com.myapp.aileadqualificationagent.repository.WebhookDeliveryRepository;
import com.myapp.aileadqualificationagent.repository.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class LeadService {
    private final LeadRepository leadRepository;
    private final com.myapp.aileadqualificationagent.repository.EvaluationResultRepository evaluationResultRepository;
    private final WebhookDeliveryRepository webhookDeliveryRepository;
    private final UserRepository userRepository;
    public LeadService(LeadRepository leadRepository, EvaluationResultRepository evaluationResultRepository, WebhookDeliveryRepository webhookDeliveryRepository, UserRepository userRepository) {
        this.leadRepository = leadRepository;
        this.evaluationResultRepository = evaluationResultRepository;
        this.webhookDeliveryRepository = webhookDeliveryRepository;
        this.userRepository = userRepository;
    }

    public com.myapp.aileadqualificationagent.model.LeadInquiry saveLead(LeadRequest request, String username){

        //1. Find the authenticated user by email
        User user = userRepository.findByEmail(username)
                .orElseThrow(() ->
                        new RuntimeException("User not Found"));
        //2. creating the lead
        LeadInquiry leaddata = new LeadInquiry();

        leaddata.setCompanyName(request.getCompanyName());
        leaddata.setContactEmail(request.getContactEmail());
        leaddata.setMessage(request.getMessage());
        leaddata.setSubmmitedAt(Instant.now());
        leaddata.setProcessingStatus(LeadProcessingStatus.PROCESSING);
        leaddata.setUser(user);

        leadRepository.save(leaddata);

        return leaddata;
    }

        @Transactional
        public LeadPageResponse getAllLead(int page, String username) {

           User user = userRepository.findByEmail(username)
                   .orElseThrow(() ->
                           new RuntimeException("User not found"));

            Pageable pageable = PageRequest.of(
                    page,
                    20,
                    Sort.by("id").descending()
            );

            Page<LeadInquiry> leadPage =
                    leadRepository.findByUser_Id(user.getId(),  pageable);

            List<LeadResponse> leads = leadPage
                    .getContent()
                    .stream()
                    .map(this::convertToResponse)
                    .toList();

            return new LeadPageResponse(
                    leads,
                    leadPage.getNumber(),
                    leadPage.getSize(),
                    leadPage.getTotalElements(),
                    leadPage.getTotalPages(),
                    leadPage.isFirst(),
                    leadPage.isLast()
            );
        }

    //............CRM send lead>.........................
    public LeadPageResponse getResultWithSendCRM(int page) {
        Pageable pageable = PageRequest.of(
                page,
                20,
                Sort.by("id").descending()
        );

        Page<LeadInquiry> leadPage =
                leadRepository.findByProcessingStatus(LeadProcessingStatus.CRM_SENT ,
                        pageable);

        List<LeadResponse> leads = leadPage
                .getContent()
                .stream()
                .map(this::convertToResponse)
                .toList();

        return new LeadPageResponse(
                leads,
                leadPage.getNumber(),
                leadPage.getSize(),
                leadPage.getTotalElements(),
                leadPage.getTotalPages(),
                leadPage.isFirst(),
                leadPage.isLast()
        );
    }

        private LeadResponse convertToResponse(LeadInquiry lead) {

            List<EvaluationResponse> evaluations =
                    lead.getEvaluation()
                            .stream()
                            .map(evaluation -> new EvaluationResponse(
                                    evaluation.getId(),
                                    evaluation.getAttemptNumber(),
                                    evaluation.getScore(),
                                    evaluation.getCategory(),
                                    evaluation.getConfidence(),
                                    evaluation.getReasoning(),
                                    evaluation.getRecommendedAction(),
                                    evaluation.getStatus(),
                                    evaluation.getFailureType(),
                                    evaluation.getFailureMessage()
                            ))
                            .toList();

            return new LeadResponse(
                    lead.getId(),
                    lead.getCompanyName(),
                    lead.getContactEmail(),
                    lead.getMessage(),
                    lead.getSubmmitedAt(),
                    lead.getProcessingStatus(),
                    evaluations
            );
        }


    public LeadPageResponse getHotLead(int page, String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow( () ->
                        new RuntimeException("User does not found"));

        Pageable pageable =  PageRequest.of(
                page, 20,
                Sort.by("id").descending()
        );

        //Calling the hot lead
        Page<LeadInquiry> leadPage = leadRepository.findByUser_IdAndEvaluation_Category(
                user.getId(),
                Category.HOT,
                pageable
        );
        //getting the evaluation result
        List<LeadResponse> hotLead = leadPage.getContent()
                .stream()
                .map(this::convertToResponse)//
                .toList();

        return new LeadPageResponse(
                hotLead,
                leadPage.getNumber(),
                leadPage.getSize(),
                leadPage.getTotalElements(),
                leadPage.getTotalPages(),
                leadPage.isFirst(),
                leadPage.isLast()
        );

    }


    //..............Warm lead ....................................
    public LeadPageResponse getWarmLead(int page , String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow( () ->
                        new RuntimeException("User does not found"));

        Pageable pageable =  PageRequest.of(
                page, 20,
                Sort.by("id").descending()
        );

        //Calling the warm lead
        Page<LeadInquiry> leadPage = leadRepository.findByUser_IdAndEvaluation_Category(
                user.getId(),
                Category.WARM,
                pageable
        );
        //getting the evaluation result
        List<LeadResponse> warmLead = leadPage.getContent()
                .stream()
                .map(this::convertToResponse)//
                .toList();

        return new LeadPageResponse(
                warmLead,
                leadPage.getNumber(),
                leadPage.getSize(),
                leadPage.getTotalElements(),
                leadPage.getTotalPages(),
                leadPage.isFirst(),
                leadPage.isLast()
        );
    }

    public LeadPageResponse getColdLead(int page , String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow( () ->
                        new RuntimeException("User does not found"));

        Pageable pageable =  PageRequest.of(
                page, 20,
                Sort.by("id").descending()
        );

        //Calling the hot lead
        Page<LeadInquiry> leadPage = leadRepository.findByUser_IdAndEvaluation_Category(
                user.getId(),
                Category.COLD,
                pageable
        );

        //getting the evaluation result
        List<LeadResponse> coldLead = leadPage.getContent()
                .stream()
                .map(this::convertToResponse)//
                .toList();

        return new LeadPageResponse(
                coldLead,
                leadPage.getNumber(),
                leadPage.getSize(),
                leadPage.getTotalElements(),
                leadPage.getTotalPages(),
                leadPage.isFirst(),
                leadPage.isLast()
        );
    }

    public LeadResponse mapLeadWithEvalution(EvaluationResult evaluationResult){

        LeadInquiry lead = evaluationResult.getLead();

       //Storing in evaluation response
        EvaluationResponse evaluation =
                new EvaluationResponse(
                        evaluationResult.getId(),
                        evaluationResult.getAttemptNumber(),
                        evaluationResult.getScore(),
                        evaluationResult.getCategory(),
                        evaluationResult.getConfidence(),
                        evaluationResult.getReasoning(),
                        evaluationResult.getRecommendedAction(),
                        evaluationResult.getStatus(),
                        evaluationResult.getFailureType(),
                        evaluationResult.getFailureMessage()
                );

        return new LeadResponse(
                lead.getId(),
                lead.getCompanyName(),
                lead.getContactEmail(),
                lead.getMessage(),
                lead.getSubmmitedAt(),
                lead.getProcessingStatus(),
                List.of(evaluation));

    }


    public LeadPageResponse aifailedEvaluation(int page , String username) {
        Pageable pageable =  PageRequest.of(
                page, 20,
                Sort.by("id").descending()
        );

        User user = userRepository.findByEmail(username)
                .orElseThrow( () ->
                        new RuntimeException("User not found")
                );

        Page<LeadInquiry> leadPage = leadRepository.findByUser_IdAndEvaluation_Status(
                user.getId(),
                EvaluationStatus.FAILED,
                pageable
        );

        //getting the evaluation result
        List<LeadResponse> failed = leadPage.getContent()
                .stream()
                .map(this::convertToResponse)//
                .toList();

        return new LeadPageResponse(
                failed,
                leadPage.getNumber(),
                leadPage.getSize(),
                leadPage.getTotalElements(),
                leadPage.getTotalPages(),
                leadPage.isFirst(),
                leadPage.isLast()
        );
    }

    public EvaluationResult setLeadEvaluation(long leadid, LeadEvaluation evaluation) {

        LeadInquiry lead = leadRepository.getById(leadid);


        //saving the leadevaluation to
        EvaluationResult evaluationResult = new EvaluationResult();
        evaluationResult.setScore(evaluation.icpScore());
        evaluationResult.setCategory(evaluation.category());
        evaluationResult.setConfidence(evaluation.confidence());
        evaluationResult.setReasoning(evaluation.reasoning());
        evaluationResult.setRecommendedAction(evaluation.recommendedAction());
        evaluationResult.setLead(lead);
        evaluationResult.setStatus(EvaluationStatus.SUCCESS);
        evaluationResultRepository.save(evaluationResult);

        if (evaluation.category() == Category.HOT){
            //update webhook
            WebhookDelivery webhookDelivery = new WebhookDelivery();
            webhookDelivery.setStatus(WebhookStatus.PROCESSING);
            webhookDelivery.setLead(lead);



        }

        else {
           lead.setProcessingStatus(LeadProcessingStatus.CRM_FAILED);
           leadRepository.save(lead);
        }

     return evaluationResult;

    }

    // ........................For failed crm ........................

    public LeadPageResponse getFailedToSendCRM(int page) {
        Pageable pageable = PageRequest.of(
                page,
                20,
                Sort.by("id").descending()
        );

        Page<LeadInquiry> leadPage =
                leadRepository.findByProcessingStatus(LeadProcessingStatus.CRM_FAILED ,
                        pageable);

        List<LeadResponse> leads = leadPage
                .getContent()
                .stream()
                .map(this::convertToResponse)
                .toList();

        return new LeadPageResponse(
                leads,
                leadPage.getNumber(),
                leadPage.getSize(),
                leadPage.getTotalElements(),
                leadPage.getTotalPages(),
                leadPage.isFirst(),
                leadPage.isLast()
        );
    }

    public List<WebhookDelivery> getCRMData() {
       return webhookDeliveryRepository.findAll();
    }
}
