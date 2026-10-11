V1 Architecture — AI Lead Qualification & CRM Automation
1. Overview

Version 1 establishes the core foundation of the platform.

The primary objective is:

Lead
↓
AI Qualification
↓
Validation
↓
Business Decision
↓
CRM Automation


V1 focuses on building a reliable AI-powered workflow rather than simply integrating an LLM.

The system is responsible for:

receiving leads

evaluating leads using an LLM

validating the AI response

retrying failed AI evaluations

persisting every evaluation attempt

classifying leads as HOT / WARM / COLD

triggering CRM operations for qualified leads

retrying failed CRM deliveries

maintaining delivery history

exposing processing status to the frontend

2. Business Problem

Sales teams frequently receive leads from websites, forms, advertising platforms, and other channels.

Without automation:

New Lead
↓
Salesperson reads lead
↓
Manual qualification
↓
Manual CRM entry
↓
Manual follow-up


This creates several problems:

slow response to high-value leads

inconsistent qualification

repetitive CRM data entry

missed opportunities

poor visibility into failures

no structured history of qualification decisions

V1 addresses the first part of this problem:

Automatically qualify a lead and route high-value leads to the CRM.

3. V1 Business Workflow
   Lead Submitted
   ↓
   Lead Persisted
   ↓
   AI Evaluation
   ↓
   Response Validation
   ↓
   HOT / WARM / COLD
   ↓
   ┌───────────────┐
   │               │
   HOT           WARM/COLD
   │               │
   ↓               ↓
   CRM           Complete
   │
   ↓
   Delivery Tracking
   │
   ├── Success → CRM_SENT
   │
   └── Failure → Retry
   ↓
   CRM_FAILED

4. System Architecture
   flowchart TD

   A[React Frontend] --> B[Spring Boot REST API]

   B --> C[Lead Service]

   C --> D[(Database)]

   C --> E[AI Evaluation Service]

   E --> F[Gemini / LLM]

   F --> G{Valid Response?}

   G -- No --> H[Retry Policy]
   H --> F

   G -- Yes --> I[Evaluation Result]

   I --> D

   I --> J{Lead Category}

   J -- HOT --> K[CRM Dispatcher]

   J -- WARM --> L[Complete]

   J -- COLD --> L

   K --> M[CRM / Webhook]

   M --> N[Webhook Delivery]

   N --> O{Success?}

   O -- Yes --> P[CRM_SENT]
   O -- No --> Q[CRM Retry]

   Q --> M

5. Main Components
   Lead API

Responsible for:

accepting incoming leads

validating request data

creating the permanent lead identity

starting the processing workflow

Example:

POST /api/leads

Lead Service

The orchestration layer responsible for coordinating:

Lead
↓
AI Evaluation
↓
Business Decision
↓
CRM Action


It should not depend on raw LLM text.

AI Evaluation Service

Responsible for:

constructing the AI request

calling the LLM

parsing structured output

validating the result

classifying failures

applying retry rules

Evaluation History

Each AI attempt is persisted separately.

Example:

Lead 101

Attempt 1 → TIMEOUT
Attempt 2 → INVALID_RESPONSE
Attempt 3 → SUCCESS


Database:

Evaluation #1 → FAILED
Evaluation #2 → FAILED
Evaluation #3 → SUCCESS


The lead itself remains:

Lead ID = 101


This prevents retries from creating duplicate business entities.

6. AI Decision Model

The AI produces a structured result:

{
"score": 87,
"category": "HOT",
"confidence": 0.91,
"reasoning": "Strong purchase intent and relevant company profile.",
"recommendedAction": "SEND_TO_CRM"
}


The application validates:

Score
Category
Confidence
Reasoning
Recommended Action
Business Rules


The architecture intentionally follows:

AI Recommendation
↓
Backend Validation
↓
Business Decision
↓
External Action


The LLM is therefore not trusted to directly execute business operations.

7. AI Failure Handling

V1 recognizes different failure categories.

TIMEOUT
NETWORK_ERROR
API_ERROR
RATE_LIMITED
SERVICE_UNAVAILABLE
EMPTY_RESPONSE
INVALID_RESPONSE
PARSING_ERROR
MISSING_REQUIRED_FIELD
VALIDATION_ERROR
AUTHENTICATION_ERROR
QUOTA_EXCEEDED
BUSINESS_RULE_VIOLATION


Retryable failures may be retried up to three times.

Non-retryable failures can terminate processing immediately.

Example:

Attempt 1
↓
TIMEOUT
↓
Retry

Attempt 2
↓
INVALID_RESPONSE
↓
Retry

Attempt 3
↓
SUCCESS


If all attempts fail:

AI_FAILURE

8. CRM Architecture

Only successfully qualified HOT leads are sent to the CRM.

Validated Evaluation
↓
Category = HOT
↓
CRM Dispatcher
↓
CRM API / Webhook
↓
Delivery Tracking


CRM delivery has its own retry lifecycle.

Example:

CRM Attempt 1 → 500
CRM Attempt 2 → 503
CRM Attempt 3 → 200

Final State → CRM_SENT


A CRM failure does not cause the AI evaluation to run again.

This separates two independent failure domains:

AI Processing
≠
CRM Delivery

9. Data Model
   LeadInquiry
   id
   companyName
   contactEmail
   message
   submittedAt
   processingStatus

EvaluationResult
id
leadId
attemptNumber
score
category
confidence
reasoning
recommendedAction
status
failureType
failureMessage

WebhookDelivery
id
leadId
eventId
attemptNumber
status
responseCode
responseBody
errorMessage
createdAt
lastAttemptAt


Relationship:

LeadInquiry
│
├── EvaluationResult
│      ├── Attempt 1
│      ├── Attempt 2
│      └── Attempt 3
│
└── WebhookDelivery
├── Attempt 1
├── Attempt 2
└── Attempt 3

10. Features Added in V1
    Lead Management

REST lead ingestion

Lead persistence

Permanent lead ID

Input validation

Processing states

AI

LLM integration

Lead scoring

HOT / WARM / COLD classification

Confidence score

AI reasoning

Recommended action

Structured response parsing

AI response validation

Reliability

AI retry mechanism

Maximum 3 evaluation attempts

Failure classification

Persistent evaluation history

Business-rule validation

CRM

CRM integration layer

Webhook/API delivery

Maximum 3 CRM delivery attempts

Delivery history

CRM failure handling

CRM status tracking

Frontend

React lead submission

Lead dashboard

Processing status

AI result display

CRM status display

11. Business Value Delivered by V1

V1 reduces repetitive sales operations by automating:

Manual Lead Review
↓
AI Qualification
↓
Automatic Prioritization
↓
CRM Routing


Expected operational improvements include:

faster lead qualification

faster routing of HOT leads

reduced manual CRM entry

consistent qualification criteria

better failure visibility

auditable AI decisions

12. V1 Design Principles
    One lead = one identity

Retries never create duplicate leads.

AI and CRM retries are independent

An external CRM failure does not trigger unnecessary AI processing.

AI output is untrusted input

The application validates the AI response before using it.

Failures are persistent

Important failures are stored rather than silently discarded.

Business logic remains in the application

The LLM recommends; backend rules decide.

13. V1 Technology Stack
    Java
    Spring Boot
    Spring AI
    Google Gemini / Google GenAI
    Spring Data JPA
    Hibernate
    REST APIs
    React
    JavaScript
    H2
    Maven
    Git
    GitHub

14. V1 Status
    🟢 Lead ingestion
    🟢 AI qualification
    🟢 AI validation
    🟢 AI retry handling
    🟢 Evaluation history
    🟢 HOT/WARM/COLD classification
    🟢 CRM delivery layer
    🟢 CRM retry handling
    🟢 Delivery history
    🟢 React dashboard

🟡 Production-style testing
🟡 Final CRM connector verification


V1 establishes the reliable processing foundation required for the next stage of the platform.