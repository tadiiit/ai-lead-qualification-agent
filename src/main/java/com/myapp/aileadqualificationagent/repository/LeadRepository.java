package com.myapp.aileadqualificationagent.repository;

import com.myapp.aileadqualificationagent.model.Category;
import com.myapp.aileadqualificationagent.model.EvaluationStatus;
import com.myapp.aileadqualificationagent.model.LeadInquiry;
import com.myapp.aileadqualificationagent.model.LeadProcessingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeadRepository extends JpaRepository<LeadInquiry , Long> {
    Page<LeadInquiry> findByUser_Id(Long userId, Pageable pageable);

    Page<LeadInquiry> findByUser_IdAndEvaluation_Category(
            Long userId,
            Category category,
            Pageable pageable
    );

   //Searching by processing status
   Page<LeadInquiry> findByUser_IdAndProcessingStatus(
           Long userId,
           LeadProcessingStatus processingStatus,
           Pageable pageable
   );

    // 2. Find a user's leads by evaluation status
    Page<LeadInquiry> findByUser_IdAndEvaluation_Status(
            Long userId,
            EvaluationStatus status,
            Pageable pageable
    );

    Page<LeadInquiry> findByProcessingStatus(LeadProcessingStatus ProcessingStatus, Pageable pageable);

    Optional<LeadInquiry> findByContactEmailAndMessage(String contactEmail, String message);
}
