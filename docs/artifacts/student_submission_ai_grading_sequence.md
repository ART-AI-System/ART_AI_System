# Student Submission and Lecturer AI-assisted Grading

AI output is advisory only. Academic rubric grading and AI-transparency audit are independent. The system stores a final grade only after the assigned lecturer explicitly reviews every rubric criterion and publishes it.

```mermaid
sequenceDiagram
    actor Student
    participant StudentFE as Student Frontend
    participant API as ART-AI API
    participant DB as MongoDB Atlas
    actor Lecturer
    participant LecturerFE as Lecturer Frontend
    participant Gemini as Gemini AI

    Student->>StudentFE: Select assignment and upload final artifact
    StudentFE->>API: POST /assignments/:id/submissions
    API->>DB: Store draft submission and file metadata
    DB-->>API: Submission ID
    API-->>StudentFE: Draft submission

    loop Each declared AI interaction
        Student->>StudentFE: Enter tool, prompt, summary, decision, reflection
        StudentFE->>API: POST /submissions/:id/ai-interactions
        API->>DB: Store structured AI declaration
    end

    Student->>StudentFE: Finalize submission
    StudentFE->>API: POST /submissions/:id/finalize
    API->>API: Validate file and declaration count
    API->>DB: Mark submission submitted or late
    API-->>StudentFE: Finalized submission

    Lecturer->>LecturerFE: Open submitted artifact
    LecturerFE->>API: GET /submissions/:id
    API->>DB: Load artifact metadata and declarations
    API-->>LecturerFE: Submission detail

    Lecturer->>LecturerFE: Request AI grade suggestion and audit
    LecturerFE->>API: POST /submissions/:id/ai-grade-suggestion
    API->>API: Require configured rubric and readable source
    API->>Gemini: Send assignment, exact rubric and prioritized source excerpts
    Gemini-->>API: Per-criterion scores, evidence, confidence, feedback
    API->>API: Validate criterion IDs, limits, totals and evidence paths
    API->>DB: Append immutable AI grading run
    API-->>LecturerFE: Advisory grading result

    LecturerFE->>API: POST /submissions/:id/ai-audit-viva
    API->>Gemini: Send source excerpts and AI declarations
    Gemini-->>API: Consistency, risks, viva questions
    API->>DB: Append immutable transparency audit run
    API-->>LecturerFE: Advisory audit result

    LecturerFE->>API: POST /submissions/:id/ai-holistic-synthesis
    API->>API: Load server-persisted grading and audit runs
    API->>Gemini: Request narrative and defense plan only
    Note over API,Gemini: Audit never multiplies or reduces the academic score
    API->>DB: Append immutable synthesis run
    API-->>LecturerFE: Separate academic score, audit status and defense plan

    Note over Lecturer,LecturerFE: Match copies exact AI criterion scores into a draft; lecturer may edit each criterion
    Lecturer->>LecturerFE: Review rubric scores, enter feedback and any adjustment reason
    LecturerFE->>API: POST /submissions/:id/grade
    API->>API: Verify lecturer owns the class
    API->>API: Validate rubric total and AI-run reference
    API->>DB: Store lecturer-authored rubric scores and final grade
    API-->>LecturerFE: Grade published

    Student->>StudentFE: Open My Results
    StudentFE->>API: GET /students/me/submissions
    API->>DB: Load submissions, published grades, and AI evaluation summary
    API-->>StudentFE: Published result and feedback
```
