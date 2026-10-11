package com.myapp.aileadqualificationagent.repository;

import com.myapp.aileadqualificationagent.model.Category;
import com.myapp.aileadqualificationagent.model.EvaluationResult;
import com.myapp.aileadqualificationagent.model.EvaluationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationResultRepository extends JpaRepository<com.myapp.aileadqualificationagent.model.EvaluationResult , Long> {
    Page<EvaluationResult> findByCategory(
            Category category,
            Pageable pageable
    );

    EvaluationResult findByLead(Long leadid);

    Page<EvaluationResult> findByStatus(EvaluationStatus evaluationStatus, Pageable pageable);
}
