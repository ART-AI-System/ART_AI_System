# ART-AI Backend API Specification

## Overview

ART-AI (Academic Research Transparency & AI Audit System) is a platform designed to evaluate how students use Generative AI during academic work.

The system does not detect AI-generated content from uploaded files.

Instead, it focuses on:

- AI Usage Declaration
- Prompt & Response Tracking
- Reflection & Critical Thinking Assessment
- AI Dependency Evaluation
- Lecturer Review & Monitoring

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

| #  | Method   | Endpoint             | Role  | 
|----|----------|----------------------|-------|
| 1  | GET      | `/users/me`          | All   | 
| 2  | PATCH    | `/users/me`          | All   | 
| 3  | GET      | `/users`             | Admin | 
| 4  | POST     | `/users`             | Admin | 
| 5  | GET      | `/users/:id`         | Admin | 
| 6  | PUT      | `/users/:id`         | Admin | 
| 7  | DELETE   | `/users/:id`         | Admin | 
| 8  | PATCH    | `/users/:id/status`  | Admin | 
| 9  | PATCH    | `/users/:id/role`    | Admin | 
| 10 | POST     | `/users/import`      | Admin |

---

# 3. Academic Structure Management

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

- Proposal
- Literature Review
- Methodology
- Final Report

| Method | Endpoint                        | Role              |
| ------ | ------------------------------- | ----------------- |
| GET    | `/classes/:classId/grade-items` | Student, Lecturer |
| POST   | `/classes/:classId/grade-items` | Lecturer          |
| GET    | `/grade-items/:id`              | Student, Lecturer |
| PUT    | `/grade-items/:id`              | Lecturer          |
| DELETE | `/grade-items/:id`              | Lecturer          |

---

# 4. Assignment Submission Management

## 4.1 Submission APIs

| Method | Endpoint                                   | Role                            |
| ------ | ------------------------------------------ | ------------------------------- |
| POST   | `/grade-items/:gradeItemId/submissions`    | Student                         |
| GET    | `/grade-items/:gradeItemId/submissions/my` | Student                         |
| GET    | `/grade-items/:gradeItemId/submissions`    | Lecturer                        |
| GET    | `/submissions/:id`                         | Student, Lecturer, Subject Head |
| GET    | `/submissions/:id/download`                | Student, Lecturer, Subject Head |
| GET    | `/students/me/submissions`                 | Student                         |
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

# 6. Score & Grading Management

## 6.1 Submission Grading APIs

| Method | Endpoint                           | Role              |
| ------ | ---------------------------------- | ----------------- |
| POST   | `/submissions/:id/grade`           | Lecturer          |
| GET    | `/submissions/:id/grade`           | Student, Lecturer |
| PUT    | `/submissions/:id/grade`           | Lecturer          |
| DELETE | `/submissions/:id/grade`           | Lecturer          |
| GET    | `/grade-items/:gradeItemId/grades` | Lecturer          |
| GET    | `/classes/:classId/grades`         | Lecturer          |

---

# 7. Final Result Management

## 7.1 Final Result APIs

| Method | Endpoint                                             | Role                   |
| ------ | ---------------------------------------------------- | ---------------------- |
| POST   | `/classes/:classId/final-results/calculate`          | Lecturer               |
| GET    | `/classes/:classId/final-results`                    | Lecturer, Subject Head |
| GET    | `/students/:studentId/classes/:classId/final-result` | Student, Lecturer      |
| GET    | `/classes/:classId/final-results/export`             | Lecturer, Subject Head |
| GET    | `/students/me/results`                               | Student                |

### Final Score Formula

```text
Final Score =
Σ (Grade Item Score × Grade Item Weight)
```

Example:

```text
Proposal          20%
Literature Review 20%
Methodology       20%
Final Report      40%
```

```text
Final Score =
(8.0 × 20%)
+ (7.5 × 20%)
+ (8.5 × 20%)
+ (9.0 × 40%)

= 8.4
```
---

# 8. Academic Classification

## 8.1 Classification APIs

| Method | Endpoint                              | Role                   |
| ------ | ------------------------------------- | ---------------------- |
| GET    | `/classes/:classId/classifications`   | Lecturer, Subject Head |
| GET    | `/classes/:classId/rankings`          | Lecturer, Subject Head |
| GET    | `/students/:studentId/classification` | Student, Lecturer      |

### Classification Rules

```text
0.0 - 4.9   = POOR
5.0 - 6.4   = AVERAGE
6.5 - 7.9   = GOOD
8.0 - 8.9   = VERY_GOOD
9.0 - 10.0  = EXCELLENT
```

---

# 9. Reporting & Export

## 9.1 Academic Reports

| Method | Endpoint                                    | Role                   |
| ------ | ------------------------------------------- | ---------------------- |
| GET    | `/reports/classes/:classId/grade-summary`   | Lecturer, Subject Head |
| GET    | `/reports/classes/:classId/final-results`   | Lecturer, Subject Head |
| GET    | `/reports/classes/:classId/rankings`        | Lecturer, Subject Head |
| GET    | `/reports/classes/:classId/classifications` | Lecturer, Subject Head |

## 9.2 AI Usage Reports

| Method | Endpoint                                | Role                   |
| ------ | --------------------------------------- | ---------------------- |
| GET    | `/reports/classes/:classId/ai-usage`    | Lecturer, Subject Head |
| GET    | `/reports/semesters/:semester/ai-usage` | Subject Head           |
| GET    | `/reports/suspicious-cases`             | Subject Head           |

## 9.3 Export Reports

- Excel
- PDF
- CSV

| Method | Endpoint                                 | Role                   |
| ------ | ---------------------------------------- | ---------------------- |
| GET    | `/reports/classes/:classId/export-excel` | Lecturer, Subject Head |
| GET    | `/reports/classes/:classId/export-pdf`   | Lecturer, Subject Head |
| GET    | `/reports/classes/:classId/export-csv`   | Lecturer, Subject Head |

## 9.4 Dashboard Analytics

### Student Dashboard

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | `/dashboard/student` |

Metrics:

* Submitted Assignments
* Pending Assignments
* Average Score
* AI Usage Pattern
* Flags Received

---

### Lecturer Dashboard

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | `/dashboard/lecturer` |

Metrics:

* Total Classes
* Total Students
* Pending Reviews
* Flagged Submissions
* AI Usage Distribution

---

### Subject Head Dashboard

| Method | Endpoint                  |
| ------ | ------------------------- |
| GET    | `/dashboard/subject-head` |

Metrics:

* Total Classes
* Total Students
* AI Usage Trends
* High Dependency Cases
* Academic Performance Summary

---

### Admin Dashboard

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | `/dashboard/admin` |

Metrics:

* Total Users
* Total Classes
* Total Submissions
* Total AI Interactions
* System Activity

---

# 10. AI Usage Declaration

## 10.1 Business Rules

Each submission must contain:

```text
Minimum interactions: 5
Maximum interactions: 10
```

Each interaction consists of:

- AI Tool
- Usage Purpose
- Prompt
- AI Response
- Student Decision
- Reflection

## 10.2 AI Interaction APIs

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

---

# 11. AI Usage Evaluation

## 11.1 Evaluation APIs

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

### Evaluation Dimensions

- Prompt Quality
- Reflection Quality
- Critical Thinking
- AI Dependency

---

# 12. Flag Management

## 12.1 Flag APIs

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

# 13. Core MVP APIs

Priority Order:

1. POST `/grade-items/:gradeItemId/submissions`
2. GET `/submissions/:id`
3. GET `/submissions/:id/ai-interactions`
4. POST `/submissions/:id/evaluate-ai-usage`
5. GET `/submissions/:id/ai-evaluation`
6. GET `/lecturer/submissions/:id/review`
7. GET `/reports/classes/:classId/ai-usage`

---

# 14. Core Philosophy

ART-AI does not evaluate:

- AI Generated Percentage
- AI Generated Text Detection
- Plagiarism Detection

ART-AI evaluates:

- How students use AI
- Whether students critically engage with AI
- Whether students reflect on AI responses
- Whether students depend excessively on AI

The system promotes transparency, accountability, and responsible AI-assisted learning.
