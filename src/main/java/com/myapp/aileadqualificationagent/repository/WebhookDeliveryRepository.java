package com.myapp.aileadqualificationagent.repository;

import com.myapp.aileadqualificationagent.model.WebhookDelivery;
import com.myapp.aileadqualificationagent.model.WebhookStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookDeliveryRepository extends JpaRepository<WebhookDelivery , Long> {
    List<WebhookDelivery> findTop10ByStatusOrderByCreatedAtAsc(WebhookStatus webhookStatus);
}
