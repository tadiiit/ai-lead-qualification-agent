package com.myapp.aileadqualificationagent.service;

import com.myapp.aileadqualificationagent.model.*;
import com.myapp.aileadqualificationagent.repository.EvaluationResultRepository;
import com.myapp.aileadqualificationagent.repository.LeadRepository;
import com.myapp.aileadqualificationagent.repository.WebhookDeliveryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebhookDispacherService {

    private final RestClient restClient;
    private final LeadRepository leadRepository;
    private final EvaluationResultRepository evaluationResultRepository;
    private final WebhookDeliveryRepository deliveryRepository;

    public WebhookDispacherService(LeadRepository leadRepository,
                                   EvaluationResultRepository evaluationResultRepository,
                                   @Value("${hubspot.base-url}") String baseUrl,
                                   @Value("${hubspot.service-key}") String serviceKey,
                                   WebhookDeliveryRepository deliveryRepository) {
        this.leadRepository = leadRepository;
        this.evaluationResultRepository = evaluationResultRepository;
        this.deliveryRepository = deliveryRepository;

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + serviceKey)
                .build();
    }

    public ResponseEntity<Void> sendWebhookifHot(LeadInquiry lead, LeadEvaluation result) {
        // Proceed only if the lead category is HOT
        if (result.category() != Category.HOT) {
            return null;
        }

        // Prepare HubSpot Contact payload
        Map<String, Object> properties = new HashMap<>();
        properties.put("email", lead.getContactEmail());
        properties.put("company", lead.getCompanyName());

        Map<String, Object> crmData = new HashMap<>();
        crmData.put("properties", properties);

        System.out.println("Sending HOT lead to HubSpot...");
        System.out.println("Email: " + lead.getContactEmail());
        System.out.println("Company: " + lead.getCompanyName());

        // Initialize WebhookDelivery tracking record
        WebhookDelivery delivery = new WebhookDelivery();
        // Note: Adjust setLeadId(...) or setLead(...) depending on your WebhookDelivery entity relationship
        delivery.setLead(lead);
        delivery.setCreatedAt(Instant.now());
        delivery.setStatus(WebhookStatus.PROCESSING);

        try {
            // Attempt to send lead to HubSpot CRM
            ResponseEntity<Void> response = restClient.post()
                    .uri("crm/v3/objects/contacts")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(crmData)
                    .retrieve()
                    .toBodilessEntity();

            // Mark delivery as SUCCESS upon successful API response
            delivery.setStatus(WebhookStatus.SENT);
            deliveryRepository.save(delivery);
            lead.setProcessingStatus(LeadProcessingStatus.CRM_SENT);
            System.out.println("Lead successfully sent to HubSpot.");
            return response;

        } catch (RestClientException e) {
            // Handle failure: Mark status as CRM_FAILED and save to DB
            System.err.println("Failed to send lead to HubSpot: " + e.getMessage());

            delivery.setStatus(WebhookStatus.PENDING);
            deliveryRepository.save(delivery);
            lead.setProcessingStatus(LeadProcessingStatus.CRM_FAILED);

            // Return a 500 Internal Server Error indicating CRM sync failure
            return ResponseEntity.internalServerError().build();
        }
    }


    public ResponseEntity<Void> Sync(WebhookDelivery delivery ) {
        // Reconstruct the HubSpot payload (crmData) from the lead inquiry details
        LeadInquiry leadInquiry = delivery.getLead();
        System.out.println("Sending lead to crm again ");

        Map<String, Object> properties = new HashMap<>();
        properties.put("email", leadInquiry.getContactEmail());
        properties.put("company", leadInquiry.getCompanyName());

        Map<String, Object> crmData = new HashMap<>();
        crmData.put("properties", properties);

        try {
            // Attempt to send lead to HubSpot CRM
            ResponseEntity<Void> response = restClient.post()
                    .uri("crm/v3/objects/contacts")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(crmData)
                    .retrieve()
                    .toBodilessEntity();

            // Mark delivery as SENT upon successful API response
            delivery.setStatus(WebhookStatus.SENT);
            deliveryRepository.save(delivery);

            // Update and save lead processing status
            leadInquiry.setProcessingStatus(LeadProcessingStatus.CRM_SENT);
            leadRepository.save(leadInquiry);

            System.out.println("Lead successfully sent to HubSpot.");
            return response;

        } catch (RestClientException e) {
            // Handle failure: Mark status as PENDING (or CRM_FAILED) and save to DB
            System.err.println("Failed to send lead to HubSpot: " + e.getMessage());

            delivery.setStatus(WebhookStatus.PENDING);
            deliveryRepository.save(delivery);

            leadInquiry.setProcessingStatus(LeadProcessingStatus.CRM_FAILED);
            leadRepository.save(leadInquiry);

            // Return a 500 Internal Server Error indicating CRM sync failure
            return ResponseEntity.internalServerError().build();
        }
    }
}