# ART-AI Mongoose Database Schema

## Overview

This document defines the MongoDB/Mongoose schema design for ART-AI.

ART-AI is not an AI detector, plagiarism checker, or AI-generated percentage checker.

The system focuses on:

* AI Usage Declaration
* Prompt & Response Tracking
* Reflection & Critical Thinking Assessment
* AI Dependency Evaluation
* Lecturer Review
* Grading and Final Result Management

---

# 1. Common Setup

```js
const mongoose = require('mongoose')
const { Schema } = mongoose
```

---

# 2. Sub-Schemas / Embedded Snapshots

These schemas are embedded into other documents to optimize read performance.

In ART-AI, `classes` embeds snapshots of lecturer and students to quickly display class information without extra joins.

## 2.1 Lecturer Snapshot Schema

```js
const LecturerSnapshotSchema = new Schema(
  {
    lecturerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  { _id: false }
)
```

---

## 2.2 Student Snapshot Schema

```js
const StudentSnapshotSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentCode: {
      type: String,
      required: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  { _id: false }
)
```

---

# 3. User Schema

Stores all system users including students, lecturers, subject heads, and administrators.

```js
const UserSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    studentCode: {
      type: String,
      default: null,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'lecturer', 'subject_head', 'admin']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    profile: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
)

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ studentCode: 1 }, { unique: true, sparse: true })

const User = mongoose.model('User', UserSchema)
```

---

# 4. Class Schema

Stores class information.

This schema embeds lecturer and student snapshots for faster class display.

```js
const ClassSchema = new Schema(
  {
    classCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    subjectName: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: String,
      required: true,
      trim: true
    },
    academicYear: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: Object,
      default: {}
    },
    lecturer: {
      type: LecturerSnapshotSchema,
      required: true
    },
    students: {
      type: [StudentSnapshotSchema],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

ClassSchema.index({ classCode: 1 }, { unique: true })
ClassSchema.index({ 'lecturer.lecturerId': 1 })
ClassSchema.index({ 'students.studentId': 1 })

const Class = mongoose.model('Class', ClassSchema)
```

---

# 5. Grade Item Schema

Grade items represent assignment milestones inside a class.

Examples:

* Proposal
* Literature Review
* Methodology
* Final Report

```js
const GradeItemSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    maxScore: {
      type: Number,
      required: true,
      default: 10,
      min: 0
    },
    deadline: {
      type: Date,
      required: true
    },
    aiInteractionRequired: {
      type: Boolean,
      default: true
    },
    minAiInteractions: {
      type: Number,
      default: 5,
      min: 0
    },
    maxAiInteractions: {
      type: Number,
      default: 10,
      min: 0
    },
    sequenceOrder: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

GradeItemSchema.index({ classId: 1, sequenceOrder: 1 })

const GradeItem = mongoose.model('GradeItem', GradeItemSchema)
```

---

# 6. Submission Schema

Stores assignment submission artifacts.

Uploaded files are only final deliverables.

The system does not detect AI-generated content from these files.

Supported files:

* PDF
* DOCX
* XLSX
* PPTX
* ZIP

Maximum file size should be validated at API/middleware level.

```js
const SubmissionSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true
    },
    gradeItemId: {
      type: Schema.Types.ObjectId,
      ref: 'GradeItem',
      required: true
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    versionNumber: {
      type: Number,
      required: true,
      default: 1
    },
    fileName: {
      type: String,
      required: true
    },
    fileStorageKey: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    contentHash: {
      type: String,
      default: null
    },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'submitted', 'evaluated', 'reviewed', 'graded', 'flagged'],
      default: 'submitted'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    isLatest: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

SubmissionSchema.index({ studentId: 1, gradeItemId: 1, isLatest: 1 })
SubmissionSchema.index({ classId: 1, gradeItemId: 1 })
SubmissionSchema.index({ uuid: 1 }, { unique: true })

const Submission = mongoose.model('Submission', SubmissionSchema)
```

---

# 7. AI Interaction Schema

Stores student-declared AI interactions.

This is the core feature of ART-AI.

Each submission should contain 5 to 10 important AI interactions.

Each interaction records:

* AI tool
* Usage purpose
* Prompt
* AI response
* Student decision
* Reflection

```js
const AiInteractionSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true
    },
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      required: true
    },
    aiTool: {
      type: String,
      required: true,
      enum: ['chatgpt', 'gemini', 'claude', 'copilot', 'other']
    },
    usagePurpose: {
      type: String,
      required: true,
      enum: [
        'brainstorming',
        'topic_research',
        'summarization',
        'writing_improvement',
        'critical_feedback',
        'methodology_review',
        'data_analysis',
        'other'
      ]
    },
    promptContent: {
      type: String,
      required: true
    },
    aiResponse: {
      type: String,
      required: true
    },
    studentDecision: {
      type: String,
      required: true,
      enum: ['accepted', 'partially_accepted', 'rejected', 'reference_only']
    },
    reflectionText: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

AiInteractionSchema.index({ submissionId: 1 })
AiInteractionSchema.index({ uuid: 1 }, { unique: true })

const AiInteraction = mongoose.model('AiInteraction', AiInteractionSchema)
```

---

# 8. AI Evaluation Schema

Stores system evaluation results based on AI interactions.

The system evaluates how students interact with AI, not whether AI wrote the final submission.

```js
const AiEvaluationSchema = new Schema(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      unique: true
    },
    aiInteractionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'AiInteraction'
      }
    ],
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    pattern: {
      type: String,
      required: true,
      enum: [
        'critical_engagement',
        'collaborative_usage',
        'passive_usage',
        'high_dependency'
      ]
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    promptQualityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    reflectionQualityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    criticalThinkingScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    aiDependencyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    summary: {
      type: String,
      default: ''
    },
    evaluatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

AiEvaluationSchema.index({ submissionId: 1 }, { unique: true })
AiEvaluationSchema.index({ classId: 1 })
AiEvaluationSchema.index({ studentId: 1 })

const AiEvaluation = mongoose.model('AiEvaluation', AiEvaluationSchema)
```

---

# 9. Submission Flag Schema

Stores suspicious AI usage behavior.

Flags are not used to detect AI-generated content.

Flags are used to indicate problematic AI usage patterns.

```js
const SubmissionFlagSchema = new Schema(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      required: true
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    flagType: {
      type: String,
      required: true,
      enum: [
        'low_quality_prompt',
        'high_ai_dependency',
        'weak_reflection',
        'all_responses_accepted',
        'missing_ai_interactions',
        'suspicious_declaration',
        'manual'
      ]
    },
    description: {
      type: String,
      default: ''
    },
    flaggedBy: {
      type: String,
      required: true,
      enum: ['system', 'lecturer', 'subject_head']
    },
    flaggedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    suspectLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    isResolved: {
      type: Boolean,
      default: false
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

SubmissionFlagSchema.index({ submissionId: 1 })
SubmissionFlagSchema.index({ classId: 1, suspectLevel: 1 })
SubmissionFlagSchema.index({ studentId: 1 })

const SubmissionFlag = mongoose.model('SubmissionFlag', SubmissionFlagSchema)
```

---

# 10. Submission Review Schema

Stores lecturer review comments and review status.

```js
const SubmissionReviewSchema = new Schema(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      required: true
    },
    lecturerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewStatus: {
      type: String,
      required: true,
      enum: ['pending', 'reviewed', 'needs_revision', 'flagged'],
      default: 'pending'
    },
    comment: {
      type: String,
      default: ''
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

SubmissionReviewSchema.index({ submissionId: 1 })
SubmissionReviewSchema.index({ lecturerId: 1 })

const SubmissionReview = mongoose.model('SubmissionReview', SubmissionReviewSchema)
```

---

# 11. Grade Schema

Stores lecturer grading result for a submission.

Each student should have only one grade per grade item.

```js
const GradeSchema = new Schema(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      unique: true
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    gradeItemId: {
      type: Schema.Types.ObjectId,
      ref: 'GradeItem',
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    maxScore: {
      type: Number,
      required: true,
      default: 10
    },
    feedback: {
      type: String,
      default: ''
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    gradedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

GradeSchema.index({ submissionId: 1 }, { unique: true })
GradeSchema.index({ studentId: 1, gradeItemId: 1 }, { unique: true })
GradeSchema.index({ classId: 1 })

const Grade = mongoose.model('Grade', GradeSchema)
```

---

# 12. Final Result Schema

Stores final weighted result of a student in a class.

```js
const FinalResultSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    finalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    classification: {
      type: String,
      required: true,
      enum: ['poor', 'average', 'good', 'very_good', 'excellent']
    },
    calculatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

FinalResultSchema.index({ studentId: 1, classId: 1 }, { unique: true })
FinalResultSchema.index({ classId: 1 })

const FinalResult = mongoose.model('FinalResult', FinalResultSchema)
```

---

# 13. Notification Schema

Stores user notifications.

```js
const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        'submission_created',
        'submission_reviewed',
        'flag_created',
        'grade_updated',
        'final_result_released'
      ]
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

NotificationSchema.index({ userId: 1, isRead: 1 })

const Notification = mongoose.model('Notification', NotificationSchema)
```

---

# 14. Important Implementation Notes

## 14.1 Snapshot Strategy

`classes` embeds snapshots of lecturer and students.

This improves read performance for class detail screens.

However, if a user updates their name or email, the embedded snapshot inside `classes` will not automatically update.

If synchronization is required, implement one of the following:

* update related class snapshots manually in service layer
* use MongoDB Change Streams
* use Mongoose middleware/hooks

---

## 14.2 File Upload Strategy

Submission file is only an artifact.

Do not calculate:

* AI-generated percentage
* plagiarism score
* AI-written score

File metadata is stored in `submissions`.

Actual file is stored in Object Storage such as:

* MinIO
* AWS S3
* Cloudinary
* Firebase Storage

---

## 14.3 AI Usage Rules

Each submission should include:

```text
Minimum AI Interactions: 5
Maximum AI Interactions: 10
```

This should be validated in middleware/service layer based on the grade item configuration.

---

## 14.4 Evaluation Rules

AI evaluation should be calculated from:

* prompt quality
* reflection quality
* critical thinking
* AI dependency

The result is stored in `AiEvaluation`.

---

## 14.5 Flag Rules

Flags should only represent suspicious AI usage behavior.

Do not use flags for plagiarism or AI-generated text detection.

Valid flag examples:

* all responses accepted
* weak reflection
* low quality prompt
* high AI dependency
* missing AI interactions

---

# 15. Model Exports

```js
module.exports = {
  User,
  Class,
  GradeItem,
  Submission,
  AiInteraction,
  AiEvaluation,
  SubmissionFlag,
  SubmissionReview,
  Grade,
  FinalResult,
  Notification
}
```
