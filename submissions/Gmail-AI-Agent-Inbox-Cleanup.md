# Hackathon Submission: Gmail AI Agent Inbox Cleanup

## GitHub handle
@QTechDevelopment

<!--
@QTechDevelopment
-->

## Project Title
Gmail AI Agent: Intelligent Inbox Cleanup Assistant

<!--
Gmail AI Agent: Intelligent Inbox Cleanup Assistant
-->

## Project Description    
Gmail AI Agent is an intelligent email management system that autonomously cleans up your inbox based on user-defined rules and AI-powered classification. The agent features a modular architecture with five core components:

**Perception Layer** - Collects email data via Gmail API with OAuth 2.0 authentication and receives user cleanup rules (delete, archive, label criteria)

**Memory Module** - Maintains short-term context for the current session (recent actions, undo requests) and stores long-term preferences (cleanup rules, decision history)

**Reasoning & Planning Engine** - Uses Language Models (LLM) and rule-based systems to classify emails, prioritize cleanup operations, and batch process actions safely

**Action & Execution Layer** - Interacts with Gmail API to execute operations (delete, archive, label, move emails) and integrates with notification systems

**Feedback & Safety Loop** - Reports all actions to users for review, enables undo functionality, and implements human-in-the-loop for uncertain decisions before bulk operations

The agent intelligently categorizes emails as spam, promotions, important, or custom labels, provides safe deletion pipelines with review capabilities, and maintains complete activity logs for transparency and troubleshooting.

<!--
The project I created is an autonomous Gmail cleanup agent that uses AI to understand user intent through natural language rules. It safely processes inbox emails by classifying them with machine learning, executing batch operations with review capabilities, and providing undo functionality. The modular architecture ensures scalability for future features like scheduling, multi-account support, and advanced analytics.
-->

## Inspiration behind the Project  
Email overload is a universal challenge affecting millions of users daily. Traditional email filters require manual configuration and lack the intelligence to understand context and user intent. This project addresses the critical need for an intelligent, safe, and autonomous email management system.

The inspiration came from recognizing that users want to describe what they need in natural language ("delete all promotional emails older than 30 days") rather than configuring complex filter rules. The agent architecture ensures safety through human-in-the-loop confirmation for bulk operations, undo capabilities, and transparent activity logging.

By combining AI-powered classification with a robust safety framework, this project aims to deliver truly autonomous email management that users can trust with their valuable communications.

<!--
The reason I chose this idea/project was to solve the daily productivity drain caused by inbox overload. I wanted to create an AI agent that understands natural language instructions, operates safely with confirmation workflows, and learns from user preferences over time. The modular architecture allows the system to scale from simple cleanup tasks to sophisticated multi-account management with scheduling and analytics.
-->

## Tech Stack    
The Gmail AI Agent is built using a modern, scalable technology stack optimized for AI agent architectures:

### Core Technologies
- **Frontend**: Streamlit web application for MVP with CLI support for advanced users
- **Backend**: Python 3.9+ for agent core logic and API integrations
- **Authentication**: OAuth 2.0 flow for secure Gmail API access with token management
- **Gmail Integration**: Gmail API for inbox operations (list, read, delete, archive, label, move)
- **AI/ML**: OpenAI API or local LLM models for email classification and natural language understanding
- **Database**: Appwrite Databases for storing user preferences, cleanup rules, and action history

### Appwrite Services Integration
- **Appwrite Auth**: Secure user authentication and session management
- **Appwrite Databases**: Persistent storage for user preferences, cleanup rules, email processing history, and undo logs
- **Appwrite Functions**: Serverless execution for email classification, batch processing, and scheduled cleanup jobs
- **Appwrite Sites**: Hosting the Streamlit web interface and dashboard

### Architecture Components
**Perception (Input Layer)**
- Gmail API SDK for email data collection
- OAuth 2.0 authentication with secure token storage
- User input parser for natural language cleanup rules

**Memory Module**
- Short-term: In-memory session cache for recent actions and undo queue
- Long-term: Appwrite Databases for storing preferences, rules, and decision history

**Reasoning & Planning Engine**
- LLM integration (OpenAI GPT-4 or local models) for email classification
- Rule-based engine for applying user-defined criteria
- Batch processing logic with priority queuing
- Safety checks before destructive operations

**Action & Execution Layer**
- Gmail API client for inbox operations
- Batch operation executor with rate limiting
- Integration hooks for notifications (email, Slack, webhooks)

**Feedback & Safety Loop**
- Action reporting with detailed logs
- Undo/restore functionality with time-limited recovery
- Human-in-the-loop confirmation prompts for bulk operations
- Activity dashboard for transparency and audit trails

### MVP Feature Implementation

| Feature | Implementation Status | Technical Details |
|---------|---------------------|------------------|
| Gmail API Integration | ✓ Essential | OAuth 2.0 flow, read/write permissions, token refresh |
| User Input for Rules | ✓ Core | Natural language parser, rule validation, criteria storage |
| AI-Based Classification | ✓ Key | LLM for categorization (spam, promo, important, custom) |
| Safe Deletion Pipeline | ✓ Required | Batch review, confirmation prompts, staged deletion |
| Undo/Restore Actions | ✓ Critical | Action history, time-limited restore, bulk undo |
| Human-in-the-Loop | ✓ Safety | Uncertainty threshold, manual confirmation for bulk ops |
| Activity Reporting | ✓ Transparency | Structured logs, action summaries, audit dashboard |
| Dashboard Interface | ✓ MVP UI | Streamlit web app with inbox stats and control panel |
| Security & Privacy | ✓ Critical | OAuth 2.0, encrypted tokens, user consent, minimal scope |

### Development Workflow
1. Streamlit web application with minimal UI for quick prototyping
2. Secure OAuth 2.0 implementation with Gmail API integration
3. Natural language rule parser with validation
4. AI classification pipeline using OpenAI API
5. Batch operations with review and confirmation workflows
6. Activity logging and reporting with Appwrite Databases
7. Undo functionality with time-limited recovery windows
8. Future roadmap: Scheduled cleanup, multi-account support, advanced analytics, Slack notifications

<!--
The technologies I used include Python for the agent core, Streamlit for the web interface, Gmail API with OAuth 2.0 for inbox access, OpenAI API for AI-powered classification, and Appwrite services (Auth, Databases, Functions, Sites) for authentication, data persistence, serverless execution, and hosting. The modular architecture ensures the agent remains scalable for additional features like scheduling, multi-agent workflows, and advanced analytics dashboards.
-->

### Appwrite products
_Select all the Appwrite products you have used in your project_

<!--
Update the checkbox to [x] for the products used.

e.g.:

- [x] Auth 
-->

- [x] Auth
- [x] Databases
- [ ] Storage
- [x] Functions
- [ ] Messaging
- [ ] Realtime
- [x] Sites

## Project Repo  
_Share a public repo link of your project_

<!--
https://github.com/QTechDevelopment/gmail-ai-agent
-->

## Deployed Site URL
_Share a `.appwrite.network` URL for your project_

<!--
https://gmail-ai-agent.appwrite.network
-->

## Demo Video/Photos  
_Share a 2-3 minute demo video of your project_

<!--
https://www.youtube.com/watch?v=gmail-ai-agent-demo
-->
