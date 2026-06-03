# ART-AI SYSTEM ARCHITECTURE & DEVELOPMENT SPECIFICATION

## Version

1.0

---

# 1. SYSTEM OVERVIEW

## System Name

ART-AI

Academic Research Transparency & AI Audit System

---

## Core Philosophy

ART-AI is NOT:

* An AI Detector
* A Turnitin replacement
* A plagiarism checker
* A PDF/Word AI percentage analyzer

ART-AI IS:

* An AI Usage Transparency System
* An AI Audit Platform
* A Critical Thinking Evaluation Platform

The system evaluates how students interact with Generative AI during academic work.

---

## Primary Goal

The system answers:

"How did the student use AI?"

NOT

"Did AI generate this assignment?"

---

# 2. BUSINESS MODEL

## Student Workflow

Student creates assignment.

Student may use:

* ChatGPT
* Gemini
* Claude
* Copilot
* Other AI Tools

When submitting:

Student uploads final artifact.

Student must declare important AI interactions.

The system evaluates:

* Prompt quality
* Reflection quality
* Critical thinking
* AI dependency

---

## Lecturer Workflow

Lecturer reviews:

* Submitted artifact
* AI interactions
* Student reflections
* AI usage pattern
* Generated flags

Lecturer decides whether student demonstrated independent thinking.

---

## Subject Head Workflow

Subject Head reviews:

* Class reports
* AI usage analytics
* Suspicious cases
* Lecturer evaluations

---

# 3. SYSTEM ACTORS

## STUDENT

Permissions:

* View Grade Items
* Submit Assignment
* Upload Files
* Create AI Interactions
* Update AI Interactions
* View Own Evaluations

---

## LECTURER

Permissions:

* Manage Classes
* Manage Students
* Manage Grade Items
* Review Submissions
* Review AI Usage
* Create Flags
* Resolve Flags

---

## SUBJECT_HEAD

Permissions:

* View All Reports
* View Suspicious Cases
* Export Reports

---

## ADMIN

Permissions:

* Manage Users
* Manage Roles
* Manage System Configuration

---

# 4. SYSTEM ARCHITECTURE

Technology Stack

Frontend:

* ReactJS
* TypeScript
* Redux Toolkit

Backend:

* NodeJS
* ExpressJS
* TypeScript

Database:

* MongoDB

Storage:

* MinIO / S3 Compatible Storage

Authentication:

* JWT
* Refresh Token

---

# 5. PROJECT STRUCTURE

```txt
src/
├── constants/
├── models/
│   ├── requests/
│   └── schemas/
├── middlewares/
├── controllers/
├── services/
├── routes/
├── utils/
└── index.ts
```

Rules:

Controllers:

* No business logic
* No database queries
* No try-catch

Services:

* All business logic
* All database access
* All evaluations

Routes:

* Route definitions only

Middlewares:

* Authentication
* Authorization
* Validation

---

# 6. DATABASE DESIGN

## users

```ts
{
  _id:ObjectId,
  email:string,
  password:string,
  fullName:string,
  role:'STUDENT'|'LECTURER'|'SUBJECT_HEAD'|'ADMIN',
  isActive:boolean,
  createdAt:Date
}
```

---

## classes

```ts
{
  _id:ObjectId,
  classCode:string,
  subjectName:string,
  lecturerId:ObjectId,
  semester:string,
  createdAt:Date
}
```

---

## class_members

```ts
{
  _id:ObjectId,
  classId:ObjectId,
  studentId:ObjectId
}
```

---

## grade_items

```ts
{
  _id:ObjectId,
  classId:ObjectId,
  title:string,
  description:string,
  deadline:Date,
  aiInteractionRequired:boolean
}
```

---

## submissions

```ts
{
  _id:ObjectId,
  studentId:ObjectId,
  gradeItemId:ObjectId,

  version:number,

  status:'DRAFT'|'SUBMITTED'|'REVIEWED',

  artifactFile:{
    fileName:string,
    fileUrl:string,
    fileSize:number,
    mimeType:string
  },

  aiInteractions:[AiInteraction],

  aiEvaluation:AiEvaluation,

  createdAt:Date,
  updatedAt:Date
}
```

---

## flags

```ts
{
  _id:ObjectId,
  submissionId:ObjectId,
  classId:ObjectId,

  flagType:string,

  suspectLevel:'LOW'|'MEDIUM'|'HIGH',

  status:'DETECTED'|'RESOLVED',

  description:string,

  createdBy:ObjectId,

  createdAt:Date
}
```

---

# 7. AI INTERACTION MODEL

## Core Feature

Each Submission contains:

Minimum:

```text
5 AI Interactions
```

Maximum:

```text
10 AI Interactions
```

---

## AI Interaction

```ts
{
  aiTool:string,

  purpose:string,

  prompt:string,

  aiResponse:string,

  decision:string,

  reflection:string
}
```

---

## AI Tool Types

```text
CHATGPT
GEMINI
CLAUDE
COPILOT
OTHER
```

---

## Purpose Types

```text
BRAINSTORMING
TOPIC_RESEARCH
CRITICAL_FEEDBACK
WRITING_IMPROVEMENT
DATA_ANALYSIS
OTHER
```

---

## Decision Types

```text
ACCEPTED
PARTIALLY_ACCEPTED
REJECTED
REFERENCE_ONLY
```

---

# 8. FILE SUBMISSION RULES

Supported:

* PDF
* DOCX
* XLSX
* PPTX
* ZIP

Maximum Size:

```text
10 MB
```

Files are artifacts only.

Files are NOT analyzed for AI detection.

Files are NOT used to calculate AI percentage.

---

# 9. AI EVALUATION ENGINE

The system evaluates:

## Prompt Quality

Good Prompt Example:

```text
Act as a reviewer and identify weaknesses in my methodology.
```

Bad Prompt Example:

```text
Write my report.
```

---

## Reflection Quality

Reflection must explain:

* Why accepted
* Why rejected
* What modifications were made

---

## Critical Thinking

Indicators:

* Rejected responses
* Partially accepted responses
* Critical prompts
* Analytical reflections

---

## AI Dependency

Indicators:

* Accepted ratio
* Generated-content prompts
* Weak reflections

---

# 10. FLAG GENERATION RULES

## ALL_RESPONSES_ACCEPTED

Condition:

100% interactions accepted.

---

## HIGH_AI_DEPENDENCY

Condition:

Dependency score above threshold.

---

## WEAK_REFLECTION

Condition:

Reflection quality below threshold.

---

## LOW_QUALITY_PROMPT

Condition:

Most prompts request direct content generation.

---

## MISSING_AI_INTERACTIONS

Condition:

Required interactions not submitted.

---

# 11. REQUEST FLOW

```text
Client
 ↓
Routes
 ↓
Middlewares
 ↓
Controllers
 ↓
Services
 ↓
Database Service
 ↓
MongoDB
```

---

# 12. API MODULES

1. Authentication
2. User Management
3. Class Management
4. Grade Item Management
5. Submission Management
6. AI Interaction Management
7. AI Evaluation
8. Lecturer Review
9. Flag Management
10. Reporting
11. Dashboard

---

# 13. CODING RULES

Controllers:

* No business logic
* No database queries

Services:

* All business logic
* All evaluations
* All database access

Validation:

* express-validator

Authentication:

* JWT

Database Access:

* database.service.ts only

---

# 14. MVP PRIORITY

Priority 1:

* Authentication
* Class
* Grade Item
* Submission

Priority 2:

* AI Interaction

Priority 3:

* AI Evaluation

Priority 4:

* Flags

Priority 5:

* Reports

---

# 15. SYSTEM PHILOSOPHY SUMMARY

ART-AI evaluates:

* How students use AI
* Whether students critically engage with AI
* Whether students reflect on AI responses
* Whether students depend excessively on AI

ART-AI does not evaluate:

* AI generated percentage
* AI generated text detection
* Plagiarism detection
