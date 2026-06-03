# ART-AI Backend API Specification

## Overview

ART-AI (Academic Research Transparency & AI Audit System) is a platform designed to evaluate how students use Generative AI during academic work.

The system does **not** detect AI-generated content from uploaded files.

Instead, it focuses on:

* AI Usage Declaration
* Prompt & Response Tracking
* Reflection & Critical Thinking Assessment
* AI Dependency Evaluation
* Lecturer Review & Monitoring

---

# Base URL

```http
/api/
```

---

# 1. Authentication

## 1.1 Auth

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/auth/login`         | User login           |
| POST   | `/auth/refresh-token` | Refresh access token |
| POST   | `/auth/logout`        | Logout               |

---

# 2. User Management

## 2.1 Users

| Method | Endpoint            | Role  |
| ------ | ------------------- | ----- |
| GET    | `/users/me`         | All   |
| GET    | `/users`            | Admin |
| POST   | `/users`            | Admin |
| PUT    | `/users/:id`        | Admin |
| PATCH  | `/users/:id/status` | Admin |

---

# 3. Academic Management

## 3.1 Classes

| Method | Endpoint       | Role                   |
| ------ | -------------- | ---------------------- |
| GET    | `/classes`     | Lecturer, Subject Head |
| POST   | `/classes`     | Lecturer               |
| GET    | `/classes/:id` | Lecturer, Subject Head |
| PUT    | `/classes/:id` | Lecturer               |
| DELETE | `/classes/:id` | Lecturer               |

### 3.1.1 Students In Class

| Method | Endpoint                           | Role                   |
| ------ | ---------------------------------- | ---------------------- |
| GET    | `/classes/:id/students`            | Lecturer, Subject Head |
| POST   | `/classes/:id/students`            | Lecturer               |
| POST   | `/classes/:id/students/import`     | Lecturer               |
| DELETE | `/classes/:id/students/:studentId` | Lecturer               |

---

## 3.2 Grade Items

Grade Items represent milestones of an academic project.

Examples:

* Proposal
* Literature Review
* Methodology
* Final Report

| Method | Endpoint                        | Role              |
| ------ | ------------------------------- | ----------------- |
| GET    | `/classes/:classId/grade-items` | Student, Lecturer |
| POST   | `/classes/:classId/grade-items` | Lecturer          |
| GET    | `/grade-items/:id`              | Student, Lecturer |
| PUT    | `/grade-items/:id`              | Lecturer          |
| DELETE | `/grade-items/:id`              | Lecturer          |

---

# 4. Submission Management

Submission files are only used as final deliverables.

Supported file types:

* PDF
* DOCX
* XLSX
* PPTX
* ZIP

Constraints:

```text
Maximum file size: 10 MB
```

## 4.1 Submission APIs

| Method | Endpoint                                   | Role                            |
| ------ | ------------------------------------------ | ------------------------------- |
| POST   | `/grade-items/:gradeItemId/submissions`    | Student                         |
| GET    | `/grade-items/:gradeItemId/submissions/my` | Student                         |
| GET    | `/grade-items/:gradeItemId/submissions`    | Lecturer                        |
| GET    | `/submissions/:id`                         | Student, Lecturer, Subject Head |
| GET    | `/submissions/:id/download`                | Student, Lecturer, Subject Head |

---

# 5. Lecturer Review

## 5.1 Lecturer Review APIs

| Method | Endpoint                                         | Role     |
| ------ | ------------------------------------------------ | -------- |
| GET    | `/lecturer/classes/:classId/submission-overview` | Lecturer |
| GET    | `/lecturer/submissions/:id/review`               | Lecturer |
| POST   | `/lecturer/submissions/:id/comments`             | Lecturer |
| PATCH  | `/lecturer/submissions/:id/review-status`        | Lecturer |

### Review Status

```text
PENDING
REVIEWED
NEEDS_REVISION
FLAGGED
```

---

# 6. Reporting

## 6.1 Reports

| Method | Endpoint                                | Role                   |
| ------ | --------------------------------------- | ---------------------- |
| GET    | `/reports/classes/:classId/ai-usage`    | Lecturer, Subject Head |
| GET    | `/reports/semesters/:semester/ai-usage` | Subject Head           |
| GET    | `/reports/suspicious-cases`             | Subject Head           |
| GET    | `/reports/export`                       | Subject Head           |

---

# 7. AI Usage Declaration

## 7.1 Business Rules

Each submission must contain:

```text
Minimum interactions: 5
Maximum interactions: 10
```

Each interaction consists of:

* AI Tool
* Usage Purpose
* Prompt
* AI Response
* Student Decision
* Reflection

---

## 7.2 AI Interaction APIs

| Method | Endpoint                                     | Role                            |
| ------ | -------------------------------------------- | ------------------------------- |
| GET    | `/submissions/:submissionId/ai-interactions` | Student, Lecturer, Subject Head |
| POST   | `/submissions/:submissionId/ai-interactions` | Student                         |
| PUT    | `/ai-interactions/:id`                       | Student                         |
| DELETE | `/ai-interactions/:id`                       | Student                         |
| GET    | `/ai-interactions/:id`                       | Student, Lecturer, Subject Head |

### AI Tool Types

```text
CHATGPT
GEMINI
CLAUDE
COPILOT
OTHER
```

### Usage Purpose Types

```text
BRAINSTORMING
TOPIC_RESEARCH
SUMMARIZATION
WRITING_IMPROVEMENT
CRITICAL_FEEDBACK
METHODOLOGY_REVIEW
DATA_ANALYSIS
OTHER
```

### Decision Types

```text
ACCEPTED
PARTIALLY_ACCEPTED
REJECTED
REFERENCE_ONLY
```

### Create AI Interaction Request

```json
{
  "aiTool": "CHATGPT",
  "purpose": "CRITICAL_FEEDBACK",
  "prompt": "Act as a reviewer and criticize my methodology section.",
  "response": "Your sample size may be too small...",
  "decision": "PARTIALLY_ACCEPTED",
  "reflection": "I agreed with the concern about sample size and expanded the survey."
}
```

---

# 8. AI Usage Evaluation

The system evaluates how students interact with AI rather than whether AI generated the final work.

## 8.1 Evaluation APIs

| Method | Endpoint                             | Role                            |
| ------ | ------------------------------------ | ------------------------------- |
| POST   | `/submissions/:id/evaluate-ai-usage` | System                          |
| GET    | `/submissions/:id/ai-evaluation`     | Student, Lecturer, Subject Head |
| GET    | `/classes/:classId/ai-evaluations`   | Lecturer, Subject Head          |

### AI Usage Pattern

```text
CRITICAL_ENGAGEMENT
COLLABORATIVE_USAGE
PASSIVE_USAGE
HIGH_DEPENDENCY
```

### Evaluation Result Example

```json
{
  "pattern": "CRITICAL_ENGAGEMENT",
  "riskLevel": "LOW",
  "scores": {
    "promptQuality": 82,
    "reflectionQuality": 88,
    "criticalThinking": 76,
    "aiDependency": 24
  },
  "summary": "Student mainly used AI for feedback and improvement."
}
```

---

# 9. Flag Management

Flags identify potentially problematic AI usage patterns.

## 9.1 Flag APIs

| Method | Endpoint                 | Role                   |
| ------ | ------------------------ | ---------------------- |
| GET    | `/flags`                 | Lecturer, Subject Head |
| GET    | `/submissions/:id/flags` | Lecturer, Subject Head |
| POST   | `/submissions/:id/flags` | Lecturer, Subject Head |
| PATCH  | `/flags/:id/resolve`     | Lecturer, Subject Head |
| PATCH  | `/flags/:id/level`       | Lecturer, Subject Head |

### Flag Types

```text
LOW_QUALITY_PROMPT
HIGH_AI_DEPENDENCY
WEAK_REFLECTION
ALL_RESPONSES_ACCEPTED
MISSING_AI_INTERACTIONS
SUSPICIOUS_DECLARATION
MANUAL
```

### Suspect Levels

```text
LOW
MEDIUM
HIGH
```

---

# 10. Core MVP APIs

Priority implementation order:

1. POST `/grade-items/:gradeItemId/submissions`
2. GET `/submissions/:id`
3. GET `/submissions/:id/ai-interactions`
4. POST `/submissions/:id/evaluate-ai-usage`
5. GET `/submissions/:id/ai-evaluation`
6. GET `/lecturer/submissions/:id/review`
7. GET `/reports/classes/:classId/ai-usage`

---

# Core Philosophy

ART-AI does not attempt to detect AI-generated content.

ART-AI evaluates:

* How students use AI
* Whether students critically engage with AI responses
* Whether students reflect on AI suggestions
* Whether students rely excessively on AI

The system promotes transparency, accountability, and responsible AI-assisted learning.
