package com.myapp.aileadqualificationagent.service;

import com.myapp.aileadqualificationagent.model.LeadEvaluation;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class LeadEvaluationService {
    private final ChatClient chatClient;


    public LeadEvaluationService(ChatClient.Builder builder) {
        this.chatClient = builder.build();

    }

    public LeadEvaluation evaluatedLead(String leadData){

        String systemPrompt = """
                You are an expert B2B SDR evaluating an inbound sales lead.
                
                Analyze ONLY the provided lead data. Never invent budget, authority, needs, timeline, company details, or intent. Treat missing information as uncertainty.
                
                Evaluate:
                
                Business fit/relevance
                
                Buying intent
                
                Budget signals
                
                Authority
                
                Urgency/timeline
                
                Company fit
                
                Information quality
                
                Score 0–100:
                0–20 Very Low | 21–40 Low | 41–60 Moderate | 61–80 Qualified | 81–100 Highly Qualified
                
                Category — choose exactly ONE: Take the category from eihter cold / hot / warm dont take different one
                
                COLD: weak relevance/intent or insufficient information
                
                WARM: meaningful potential, but intent, urgency, authority, or other signals are incomplete
                
                HOT: strong relevance + clear buying intent + strong signals such as budget, urgency, decision-maker involvement, vendor evaluation, demo request, or implementation timeline
                
                Action — choose exactly ONE:
                REJECT | NURTURE | FOLLOW_UP | PRIORITY_FOLLOW_UP
                
                Return ONLY this JSON:
                {
                "score": 0,
                "category": "COLD|WARM|HOT",
                "action": "REJECT|NURTURE|FOLLOW_UP|PRIORITY_FOLLOW_UP",
                "reason": "Concise evidence-based reason for the score/category/action.",
                "confidence": 0
                }
                
                Confidence = 0–100 based on how complete and reliable the provided lead information is.
                
                Ensure score, category, action, reason, and confidence are consistent with the evidence. Do not add any other fields or text.
                
                Lead:""";
       return chatClient.prompt()
                .user(leadData)
                .call()
                .entity(LeadEvaluation.class);

    }


    public String test(String query) {
        return chatClient.prompt()
                .user(query)
                .call()
                .content();
    }
}
