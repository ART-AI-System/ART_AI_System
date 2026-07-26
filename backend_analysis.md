# Backend Analysis Report

## 1. Submission Flow
**Endpoints**:
- `POST /grade-items/:gradeItemId/submissions`
- `POST /assignments/:assignmentId/submissions`
- `POST /submissions/:id/finalize`
- `POST /submissions/:submissionId/versions` (resubmit version)
- `DELETE /submissions/:id` (withdraw)

**Process**:
1. Students upload a file for an assignment or grade item.
2. The system tracks multiple fields in the `Submission` model including `versionNumber`, `status` (`draft`, `submitted`, `evaluated`, `reviewed`, `graded`, `flagged`, `late`, `withdrawn`), and timestamps.
3. Students can resubmit versions before finalization.
4. Students can finalize a submission, locking it for evaluation/grading.

## 2. File Upload Flow
**Middleware**: `parseSubmissionFile` in `submissions.middleware.ts`.
**Process**:
1. When a submission is created or a new version is uploaded, `parseSubmissionFile` handles the multipart payload.
2. The `Submission` schema tracks `fileName`, `fileStorageKey` (reference to local/cloud storage), `fileSize`, `mimeType`, and `contentHash`.
3. Separate endpoints exist to download specific submission versions (`/submissions/:id/download` and `/submission-versions/:versionId/download`).

## 3. AI Evaluation Flow
**Endpoints**:
- `POST /submissions/:submissionId/ai-evaluation`
- `POST /submissions/:submissionId/ai-evaluation/recalculate`
- `GET /submissions/:submissionId/ai-evaluation`

**Process**:
1. Triggered by a lecturer or admin, or potentially automatically after submission.
2. Analyzes the submission based on AI usage patterns (`critical_engagement`, `collaborative_usage`, `passive_usage`, `high_dependency`).
3. Results are saved in the `AiEvaluation` model containing:
   - `riskLevel`: low, medium, high
   - Scores: `transparencyScore`, `promptQualityScore`, `reflectionQualityScore`, `criticalThinkingScore`, `aiDependencyScore`.
   - `summary`: text feedback on AI usage.

## 4. Lecturer Review Flow
**Endpoints**:
- `GET /lecturer/classes/:classId/submission-overview`
- `POST /submissions/:id/review`
- `PATCH /submissions/:id/review-status`
- `POST /submissions/:id/comments`

**Process**:
1. Lecturers fetch an overview of submissions by class.
2. They review individual submissions, creating a `SubmissionReview` document.
3. Review states include `PENDING`, `REVIEWED`, `NEEDS_REVISION`, `FLAGGED`.
4. Lecturers can add comments and update the review status based on the AI evaluation results and manual check.
