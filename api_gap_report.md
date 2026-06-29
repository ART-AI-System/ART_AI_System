# API Specification Gap Report

## 1. Implemented Endpoints
Based on the backend source code (`src/routes`), the following API modules are implemented:
- **Authentication APIs**: `/auth/*` (in `auth.routes.ts`)
- **User Management APIs**: `/users/*` (in `users.routes.ts`)
- **Academic Structure APIs**: `/semesters/*`, `/subjects/*`, `/classes/*`
- **Assignment Management APIs**: `/assignments/*` and `/grade-items/*` (in `assignments.routes.ts` and `gradeItems.routes.ts`)
- **Submission Management APIs**: `/submissions/*`, `/assignments/:assignmentId/submissions` (in `submissions.routes.ts`)
- **AI Declaration APIs**: `/ai-interactions/*` (in `aiDeclaration.routes.ts`)
- **AI Evaluation APIs**: `/submissions/:submissionId/ai-evaluation` (in `aiEvaluation.routes.ts`)
- **Review Management APIs**: `/submissions/:id/review`, `/submissions/:id/review-status` (in `submissionReviews.routes.ts`)
- **Grading & Final Results APIs**: `/submissions/:submissionId/grade`, `/classes/:classId/final-results` (in `grades.routes.ts` and `finalResult.routes.ts`)

## 2. Missing Endpoints
- **News APIs**: Section 14 in the spec mentions `/news` endpoints, but there is no `news.routes.ts` or corresponding controller in the backend codebase.
- **Flag Management APIs**: Section 13 mentions `/flags` endpoints. While there is a schema for `submissionFlags`, there is no `flags.routes.ts`.

## 3. Mismatched Payloads / Architecture Drift
- **Grade Items vs Assignments**: The API spec states "Assignments replace the old `grade-items` concept". The codebase currently contains both `gradeItems.routes.ts` and `assignments.routes.ts`, and `submissions.routes.ts` supports both `/grade-items/:gradeItemId/submissions` and `/assignments/:assignmentId/submissions`. This indicates an incomplete transition to the new `assignments` structure.
- **File Upload constraints**: The middleware may or may not enforce the exact 10 MB limit or specific formats (PDF, DOCX, XLSX, PPTX, ZIP) specified in the API Spec. Needs strict validation on the frontend.
- **Lecturer Overview**: `/lecturer/classes/:classId/submission-overview` is implemented in `submissionReviews.routes.ts`, which perfectly matches the specification for the review flow.
