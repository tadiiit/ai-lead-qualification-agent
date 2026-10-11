V2 Architecture — Multi-Source Lead & Sales Workflow Automation
1. Overview

Version 2 expands the platform from a single lead-processing workflow into a broader lead lifecycle automation system.

V1 answers:

"Is this lead valuable?"

V2 focuses on:

"What should happen to this lead next?"

The target workflow becomes:

Lead Acquisition
↓
Normalization
↓
Deduplication
↓
AI Qualification
↓
Sales Pipeline
↓
Assignment
↓
Follow-up
↓
CRM
↓
Analytics

2. Business Problem

Modern businesses do not receive leads from one source.

Typical sources include:

Website
WordPress
Meta / Facebook
Instagram
LinkedIn
Advertising Platforms
External Webhooks
Landing Pages
Partner Systems


Each source can have a different payload format.

Without a unified system:

Website → Manual processing

Facebook → Manual processing

LinkedIn → Manual processing

WordPress → Manual processing


This creates:

duplicate leads

inconsistent data

fragmented lead history

manual assignment

missed follow-ups

poor campaign visibility

disconnected communication

CRM synchronization problems

V2 solves this by introducing a unified lead lifecycle.

3. V2 Architecture
   Website
   Lead Ingestion Layer
   WordPress
   Meta / Facebook
   Instagram
   LinkedIn
   External Webhooks
   Source Adapter
   Lead Normalization
   Deduplication
   Lead Qualification
   AI Evaluation
   Decision Engine
   Sales Pipeline
   Lead Assignment
   Task / Follow-up Engine
   Communication
   CRM
   Activity Tracking
   Analytics
4. Multi-Source Ingestion

The ingestion layer becomes source-independent.

Instead of building business logic around every external API:

Facebook Payload
WordPress Payload
Website Payload
LinkedIn Payload


each source is converted into a common internal model.

External Source
↓
Source Adapter
↓
Normalized Lead
↓
Internal Workflow


This creates a clean separation:

External Integration
≠
Business Workflow

5. Source Adapter Pattern

Each integration has an adapter.

Example:

FacebookAdapter
WordPressAdapter
WebsiteAdapter
LinkedInAdapter
WebhookAdapter


All adapters produce:

NormalizedLead


Example:

NormalizedLead
----------------
name
email
phone
company
message
source
campaign
utmSource
utmMedium
utmCampaign
externalLeadId
createdAt


Adding another source becomes:

New Source
↓
New Adapter
↓
NormalizedLead
↓
Existing Workflow


The qualification and sales workflow does not need to know where the lead originated.

6. Lead Normalization

Different platforms may represent the same information differently.

For example:

Facebook:
lead_email

Website:
email

Partner API:
contactEmail


The normalization layer converts these into:

email


The same principle applies to:

names

phone numbers

company names

messages

source

campaign

timestamps

external identifiers

This creates a consistent internal data model.

7. Duplicate Detection

Multiple lead sources may generate the same lead.

V2 introduces duplicate detection.

Possible matching signals:

Email
Phone
External Source ID
Company + Contact
Existing Lead Identity


Example:

Website Lead
↓
john@example.com

Facebook Lead
↓
john@example.com

        ↓

Same Business Lead


Instead of creating two unrelated records, the platform can associate incoming activity with the existing lead.

8. Sales Pipeline

V1 ends the workflow after CRM delivery.

V2 introduces sales lifecycle management.

Example:

NEW
↓
QUALIFIED
↓
ASSIGNED
↓
CONTACTED
↓
ENGAGED
↓
PROPOSAL
↓
NEGOTIATION
↓
WON / LOST


The exact stages can become configurable later.

9. Lead Assignment

Qualified leads can be automatically assigned.

Potential strategies:

Round Robin
Territory
Salesperson Availability
Product Expertise
Lead Score
Company Size
Geography
Campaign


Example:

HOT Lead
↓
Assignment Rules
↓
Salesperson
↓
Create Task


This removes another manual step from the sales process.

10. Follow-up Automation

A major V2 feature is automated follow-up.

Example:

HOT Lead
↓
Assign Salesperson
↓
Create Task
↓
Wait 24 Hours
↓
Was Lead Contacted?
│
├── YES → Continue Sales Workflow
│
└── NO → Reminder
↓
Follow-up


Future workflows can support:

Immediate notification
Scheduled email
Follow-up task
Reminder
Nurturing
Re-engagement
Escalation

11. Communication Layer

V2 introduces communication integrations.

Potential channels:

Email
WhatsApp
SMS
CRM Messaging
Notifications


The architecture should avoid embedding communication logic directly into the lead service.

Instead:

Workflow
↓
Communication Service
↓
Channel Adapter
├── Email
├── WhatsApp
└── SMS


This allows additional channels to be added without rewriting the workflow engine.

12. AI Evolution

V1:

Lead
↓
"What is the lead score?"


V2:

Lead Context
↓
Qualification
↓
Priority
↓
Recommended Action
↓
Follow-up Recommendation
↓
Sales Workflow


AI may eventually consider:

Lead Information
+
Source
+
Campaign
+
Previous Activity
+
Company Context
+
Communication History


However, AI-generated decisions remain subject to application-level validation.

13. Campaign & Attribution Tracking

V2 introduces acquisition context.

Source
Campaign
UTM Source
UTM Medium
UTM Campaign
Landing Page
Referrer


Example:

Lead
↓
Source = Google Ads
Campaign = Enterprise AI
UTM Campaign = enterprise_ai_q4
↓
HOT
↓
CRM


This makes it possible to connect:

Marketing Campaign
↓
Lead
↓
Qualification
↓
Sales Outcome

14. V2 Data Model Evolution

V1:

Lead
├── Evaluations
└── CRM Deliveries


V2 expands this into:

Lead
├── Evaluations
├── Activities
├── Assignments
├── Tasks
├── Communications
├── CRM Deliveries
├── Campaign Attribution
└── Pipeline History


Potential entities:

Lead
LeadSource
Campaign
Evaluation
Assignment
Task
Communication
PipelineStage
Activity
CRMDelivery

15. Features Added in V2
    Acquisition

multiple lead sources

source tracking

campaign tracking

UTM tracking

source adapters

unified ingestion

Lead Intelligence

normalization

duplicate detection

richer lead context

improved qualification

lead segmentation

Sales Automation

pipeline stages

lead ownership

automatic assignment

task creation

follow-up reminders

escalation

Communication

email automation

WhatsApp integration

notification workflows

re-engagement

Analytics

source performance

campaign performance

conversion tracking

sales activity tracking

lead lifecycle analytics

16. Business Value Added in V2

V1 automates:

Qualification + CRM Routing


V2 expands this to:

Acquisition
↓
Qualification
↓
Assignment
↓
Follow-up
↓
Communication
↓
Conversion


The business benefit is moving from AI-assisted lead qualification toward automated sales operations.

17. V2 Engineering Goals

V2 focuses on:

Extensibility
Integration Design
Workflow Management
Data Consistency
Deduplication
Automation
Observability


The architecture should make it possible to add new lead sources and workflow actions without rewriting the core system.

18. V2 Status
    🟢 V1 foundation

🟡 Multi-source ingestion
🟡 Normalization
🟡 Deduplication
🟡 Sales pipeline
🟡 Assignment
🟡 Follow-up automation
🟡 Communication integrations
🟡 Analytics

🔵 Event-driven architecture
🔵 Enterprise scalability


V2 is the transition from a lead qualification application into a broader sales automation platform.