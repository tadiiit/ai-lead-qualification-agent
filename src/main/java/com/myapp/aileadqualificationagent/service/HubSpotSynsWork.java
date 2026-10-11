package com.myapp.aileadqualificationagent.service;

import com.myapp.aileadqualificationagent.model.WebhookDelivery;
import com.myapp.aileadqualificationagent.model.WebhookStatus;
import com.myapp.aileadqualificationagent.repository.WebhookDeliveryRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;


@Service
public class HubSpotSynsWork {
    private final WebhookDeliveryRepository webhookRepository;
    private final WebhookDispacherService webhookDispacherService;

    public HubSpotSynsWork(WebhookDeliveryRepository webhookRepository, WebhookDispacherService webhookDispacherService) {
        this.webhookRepository = webhookRepository;
        this.webhookDispacherService = webhookDispacherService;
    }

    @Scheduled(fixedDelay = 6000)
    public void processPendingCRM() {
        List<WebhookDelivery> pendingDelivery =
                webhookRepository.findTop10ByStatusOrderByCreatedAtAsc(
                        WebhookStatus.PENDING
                );

        for (WebhookDelivery delivery : pendingDelivery) {
            try {


                delivery.setStatus(
                        WebhookStatus.PROCESSING
                );
                System.out.println("Processing for " + delivery.getLead());

                delivery.setLastAttemptAt(Instant.now());
                webhookRepository.save(delivery);

                //Try to send to crm
                webhookDispacherService.Sync(delivery);

            } catch (Exception e) {
                //Something went wrong

                delivery.setStatus(WebhookStatus.PENDING);
                delivery.setErrorMessage(e.getMessage());
                delivery.setLastAttemptAt(Instant.now());

                webhookRepository.save(delivery);
            }

        }
    }
}
