System Architecture
AI Lead Intelligence & Sales Automation Platform

Business problem → automated AI decision → validated business action → CRM operation → observable outcome

Status

🚧 Active Development

The platform is currently being developed incrementally.

✅ V1 core architecture implemented

🧪 V1 end-to-end testing and launch preparation

🚧 V2 architecture and capabilities in active development

🔭 Enterprise architecture under evaluation for future versions

1. Business Problem

Businesses receive leads from multiple sources:

Website
Forms
Advertising
Social Media
Landing Pages
External Systems


A traditional process often looks like:

New Lead
↓
Salesperson receives lead
↓
Manually reads lead
↓
Manually determines lead quality
↓
Manually enters/updates CRM
↓
Manually assigns salesperson
↓
Manually creates follow-up


This creates several operational problems:

Slow lead qualification

Inconsistent decision-making

Manual CRM data entry

Delayed response to high-value leads

Repetitive sales operations

Poor visibility into failed integrations

Difficulty tracking how a lead was evaluated

The platform is designed to automate these repetitive operations while keeping business rules and system execution under backend control.

2. Application Objective

The core objective is:

Convert an incoming lead into a validated business decision and automatically execute the appropriate sales operation.

The current V1 flow is:

Lead
↓
Ingestion
↓
AI Evaluation
↓
Validation
↓
Qualification
↓
CRM Action
↓
Delivery Tracking


The future system expands this into:

Lead Acquisition
↓
Lead Intelligence
↓
Qualification
↓
Decision Engine
↓
Sales Workflow
↓
Communication
↓
CRM
↓
Analytics
↓
Outcome Feedback

3. Current V1 Architecture
   flowchart TD

   A[React Client] --> B[Spring Boot REST API]

   B --> C[Lead Inquiry]
   C --> D[Lead Persistence]

   D --> E[AI Evaluation Service]

   E --> F[Gemini / LLM]

   F --> G{Valid Response?}

   G -- No --> H[AI Retry]
   H --> F

   G -- Yes --> I[Evaluation Result]

   I --> J[Business Validation]

   J --> K{Lead Category}

   K -- HOT --> L[CRM Dispatcher]
   K -- WARM --> M[Persist Result]
   K -- COLD --> M

   L --> N[CRM API / Webhook]

   N --> O[Delivery Tracking]

   O --> P{Delivery Result}

   P -- Success --> Q[CRM_SENT]
   P -- Failure --> R[CRM_FAILED]

4. Major Components
   React Application

Provides:

Lead submission

Lead status monitoring

Qualification results

AI reasoning visibility

CRM delivery status

Basic operational dashboard

The frontend focuses on the lead lifecycle rather than exposing raw database information.

Spring Boot API

Acts as the main application boundary.

Responsibilities include:

Receiving leads

Validating requests

Starting lead processing

Returning application results

Coordinating backend services

Lead Processing Service

Coordinates the lead lifecycle:

Lead
↓
AI Evaluation
↓
Validation
↓
Business Decision
↓
CRM Action


This layer keeps the workflow understandable and allows individual components to evolve independently.

AI Evaluation Service

Responsible for communicating with the LLM.

The AI evaluates lead information and produces structured information such as:

{
"score": 87,
"category": "HOT",
"confidence": 0.91,
"reasoning": "Strong purchase intent and relevant company profile.",
"recommendedAction": "SEND_TO_CRM"
}

Validation Layer

The backend validates AI output before allowing the workflow to continue.

Validation includes:

Required fields
Score range
Category
Confidence
Recommended action
Business-rule consistency


The architectural principle is:

AI recommends. The application validates and executes.

Persistence Layer

The database stores:

Lead identity

AI evaluation attempts

Successful evaluation

Failed evaluation attempts

CRM delivery attempts

Processing states

This creates an auditable history instead of losing failed processing information.

CRM Integration Layer

The CRM layer is separated from AI processing.

AI Qualification
↓
HOT
↓
CRM Dispatcher
↓
CRM API
↓
Delivery Tracking


CRM failures can therefore be retried independently.

5. Reliability Boundaries

The application intentionally separates:

AI Reliability
+
CRM Integration Reliability

AI
Attempt 1 → Failure
Attempt 2 → Failure
Attempt 3 → Success

CRM
Attempt 1 → 500
Attempt 2 → 503
Attempt 3 → 200


A CRM failure does not cause the lead to be evaluated by AI again.

An AI failure does not create duplicate CRM operations.

6. Data Flow

A typical successful HOT lead:

1. Client submits lead
   ↓
2. API validates request
   ↓
3. Lead receives permanent ID
   ↓
4. Lead is persisted
   ↓
5. AI evaluates lead
   ↓
6. AI response is validated
   ↓
7. Score/category are persisted
   ↓
8. Category = HOT
   ↓
9. CRM dispatcher is triggered
   ↓
10. CRM request is sent
    ↓
11. Delivery is recorded
    ↓
12. Lead becomes CRM_SENT

7. Failure Flow

Example:

Lead
↓
AI Evaluation
↓
TIMEOUT
↓
Retry
↓
INVALID_RESPONSE
↓
Retry
↓
SUCCESS
↓
HOT
↓
CRM


If all AI attempts fail:

Lead
↓
AI Attempt 1 → FAILED
↓
AI Attempt 2 → FAILED
↓
AI Attempt 3 → FAILED
↓
AI_FAILURE


The system preserves the attempt history.

8. Why This Architecture

The architecture is intentionally designed around:

Separation of concerns

AI, persistence, validation and CRM integration have separate responsibilities.

Reliability

Failures are classified and retried where appropriate.

Auditability

Processing attempts are persisted.

Extensibility

The CRM integration layer can evolve toward multiple CRM providers.

Business control

The LLM does not directly control external systems.

Incremental development

The architecture can evolve from V1 to V2 and eventually toward an event-driven platform.

9. Current vs Future
   V1

Lead
↓
AI
↓
Validation
↓
CRM


V2

Multiple Sources
↓
Lead Intelligence
↓
Sales Pipeline
↓
Assignment
↓
Follow-up
↓
CRM


V3+

Events
↓
Workflow Engine
↓
AI Agents
↓
Multiple Integrations
↓
Analytics

10. Architectural Principle

The platform follows a simple principle:

Use AI to improve business decisions, but use software engineering to make those decisions reliable.