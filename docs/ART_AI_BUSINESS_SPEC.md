# ART-AI Backend API Specification

## Overview

ART-AI (Academic Research Transparency & AI Audit System) is a platform designed to evaluate how students use Generative AI during academic work.

The system does not detect AI-generated content from uploaded files.

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

* Login
* Refresh Token
* Logout

---

# 2. User Management

## 2.1 Users

* Profile
* Create User
* Update User
* Activate / Deactivate User

---

# 3. Academic Structure Management

## 3.1 Classes

* Create Class
* Update Class
* Delete Class
* Get Class Detail

### 3.1.1 Students In Class

* Add Student
* Remove Student
* Import Students
* View Students

---

## 3.2 Grade Items

Examples:

* Proposal
* Literature Review
* Methodology
* Final Report

Features:

* Create Grade Item
* Update Grade Item
* Delete Grade Item
* View Grade Item

---

# 4. Assignment Submission Management

Submission files are final academic deliverables.

Supported:

* PDF
* DOCX
* XLSX
* PPTX
* ZIP

Constraints:

```text
Maximum file size: 10 MB
```

Files are stored for review purposes only.

Files are not used for AI detection.

## 4.1 Submission APIs

* Submit Assignment
* View Submission
* Download Submission
* View My Submissions
* Get all submissions of the current student

---

# 5. Lecturer Review

## 5.1 Lecturer Review APIs

* Review Submission
* Add Comment
* Update Review Status

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

* Grade Submission
* Update Grade
* View Grade
* View Grade Item Grades
* Get gradebook of a class

### Grade Structure

```json
{
  "score": 8.5,
  "maxScore": 10,
  "feedback": "Strong critical engagement with AI."
}
```

### Grade Response Example

```json
{
  "submissionId": "submission_id",
  "score": 8.5,
  "maxScore": 10,
  "feedback": "Student demonstrated strong critical engagement with AI responses.",
  "gradedBy": "lecturer_id",
  "gradedAt": "2026-06-05T10:00:00Z"
}
```

---

# 7. Final Result Management

## 7.1 Final Result APIs

* Calculate Final Result
* View Final Result
* Export Final Result
* Get final academic results of the current student

### Final Score Formula

```text
Final Score =
Σ (Grade Item Score × Grade Item Weight)
```

---

# 8. Academic Classification

## 8.1 Classification APIs

* View Rankings
* View Classifications
* View Student Classification

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

* Grade Summary
* Final Results
* Rankings
* Classifications

## 9.2 AI Usage Reports

* AI Usage Summary
* Semester Analytics
* Suspicious Cases

## 9.3 Export Reports

* Excel
* PDF
* CSV

## 9.4 Dashboard Analytics

### Student Dashboard

* Submitted Assignments
* Pending Assignments
* Average Score
* AI Usage Pattern
* Flags Received

### Lecturer Dashboard

* Total Classes
* Total Students
* Pending Reviews
* Flagged Submissions
* AI Usage Distribution

### Subject Head Dashboard

* AI Usage Trends
* High Dependency Cases
* Academic Performance Summary

### Admin Dashboard

* Total Users
* Total Classes
* Total Submissions
* Total AI Interactions

---

# 10. AI Usage Declaration

## 10.1 Business Rules

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

## 10.2 AI Interaction APIs

* Create Interaction
* Update Interaction
* Delete Interaction
* View Interaction
* View Submission Interactions

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

* Evaluate AI Usage
* View Evaluation
* View Class Evaluations

### AI Usage Pattern

```text
CRITICAL_ENGAGEMENT
COLLABORATIVE_USAGE
PASSIVE_USAGE
HIGH_DEPENDENCY
```

### Evaluation Dimensions

* Prompt Quality
* Reflection Quality
* Critical Thinking
* AI Dependency

---

# 12. Flag Management

## 12.1 Flag APIs

* View Flags
* Create Flag
* Resolve Flag
* Update Flag Level

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

1. Authentication
2. Classes
3. Grade Items
4. Submission
5. AI Interaction
6. AI Evaluation
7. Lecturer Review
8. Reports

---

# 14. Core Philosophy

ART-AI does not evaluate:

* AI Generated Percentage
* AI Generated Text Detection
* Plagiarism Detection

ART-AI evaluates:

* How students use AI
* Whether students critically engage with AI
* Whether students reflect on AI responses
* Whether students depend excessively on AI

The system promotes transparency, accountability, and responsible AI-assisted learning.
