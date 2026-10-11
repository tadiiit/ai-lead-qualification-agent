package com.myapp.aileadqualificationagent.conroller;


import com.myapp.aileadqualificationagent.dto.EvaluationResponse;
import com.myapp.aileadqualificationagent.dto.LeadPageResponse;
import com.myapp.aileadqualificationagent.dto.LeadRequest;
import com.myapp.aileadqualificationagent.model.*;
import com.myapp.aileadqualificationagent.model.user.User;
import com.myapp.aileadqualificationagent.repository.EvaluationResultRepository;
import com.myapp.aileadqualificationagent.repository.LeadRepository;
import com.myapp.aileadqualificationagent.service.AIFailureService;
import com.myapp.aileadqualificationagent.service.LeadEvaluationService;
import com.myapp.aileadqualificationagent.service.LeadService;
import com.myapp.aileadqualificationagent.service.WebhookDispacherService;
import jakarta.validation.Valid;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LeadController {
    private final LeadEvaluationService evaluationService;
    private final LeadService leadService;
    private final AIFailureService failureService;
    private final WebhookDispacherService webhookDispacherService;

    public LeadController(LeadEvaluationService evaluationService, LeadService leadService, AIFailureService failureService, WebhookDispacherService webhookDispacherService) {
        this.evaluationService = evaluationService;
        this.leadService = leadService;
        this.failureService = failureService;
        this.webhookDispacherService = webhookDispacherService;
    }

    @PostMapping("/lead")
    private LeadEvaluation evalatedlead(@Valid @RequestBody LeadRequest request ,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("--------------------------------------");
        System.out.println("Lead message : " + request.getMessage());

        //sending to leadservice
        LeadInquiry leadInquiry = leadService.saveLead(request , userDetails.getUsername());
        System.out.println("Sucesshully stored the lead into db : ");

        //sending lead through failure service
        System.out.println("Getting the lead --- ");
        LeadEvaluation leadEvaluation = failureService.evaluateWithRetry(leadInquiry);
       System.out.println("Lead rresponse with failure : " + leadEvaluation);
       // LeadEvaluation evaluation = evaluationService.evaluatedLead(request.getMessage());
        System.out.println("Getting saving the and sending to crm ");
       webhookDispacherService.sendWebhookifHot(leadInquiry , leadEvaluation);

         //Sending the lead

        //returnng the lead value
        return leadEvaluation;
    }

    //...............................Get about kead -------------------
    @GetMapping("/totallead")
    public  LeadPageResponse getAllLead(
            @RequestParam(defaultValue = "0") int page ,
            @AuthenticationPrincipal UserDetails userDetails
            )
    {
        System.out.println("Retriving the lead info . ");
        return leadService.getAllLead(page , userDetails.getUsername());
    }

    @GetMapping("/hotlead")
    public LeadPageResponse getHotlead(
            @RequestParam(defaultValue = "0") int page ,
            @AuthenticationPrincipal UserDetails userDetails)
    {
          System.out.println("Retriving hot lead : ");
         return leadService.getHotLead(page , userDetails.getUsername());
    }

    @GetMapping("/warmlead")
    public LeadPageResponse getWarmlead(
            @RequestParam(defaultValue = "0") int page ,
            @AuthenticationPrincipal UserDetails userDetails)
    {
        System.out.println("Retriving hot lead : ");
        return leadService.getWarmLead(page , userDetails.getUsername());
    }

    @GetMapping("/coldlead")
    public LeadPageResponse getColdlead(
            @RequestParam(defaultValue = "0") int page ,
            @AuthenticationPrincipal UserDetails userDetails)
    {
        System.out.println("Retriving hot lead : ");
         return leadService.getColdLead(page , userDetails.getUsername());
    }

    @GetMapping("/sendCRM")
    public LeadPageResponse getResultWithSendCRM(
            @RequestParam(defaultValue = "0") int page)
    {
        System.out.println("Retriving lead that send to crm: ");
        return leadService.getResultWithSendCRM(page);
    }

    //..................AI Failure response .....................
    @GetMapping("/aiEvaluationfailed")
    public LeadPageResponse getaifailedEvaluation(
            @RequestParam(defaultValue = "0") int page ,
            @AuthenticationPrincipal UserDetails userDetails)
    {
        System.out.println("Retriving lead that are not evaluated: ");
        return leadService.aifailedEvaluation(page , userDetails.getUsername());
    }

    @PostMapping("/leadevaluation")
    public EvaluationResult setLeadEvaluation(
            @RequestParam long id , LeadEvaluation evaluation)
    {
        System.out.println("Sending the evaluated lead to system:  ");
        return leadService.setLeadEvaluation(id , evaluation);
    }

    @GetMapping("/failedcrmsend")
    public LeadPageResponse getFailedToSendCRM(
            @RequestParam(defaultValue = "0") int page)
    {
        System.out.println("Retriving lead that are not evaluated: ");
        return leadService.getFailedToSendCRM(page);
    }

    @GetMapping("/webhookReview")
    public List<WebhookDelivery> getCRMData(){
        System.out.println("The response of webhook are: ");
        return leadService.getCRMData();
    }


    @PostMapping("/test")
    public String test(@RequestBody String query){
        System.out.println("we are going for test");
        System.out.print("Query is " + query);
       return evaluationService.test(query);
    }
}
