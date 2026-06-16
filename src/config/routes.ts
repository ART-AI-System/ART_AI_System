export const ROUTES = {
  // Auth
  LOGIN: '/login',

  // Dashboards
  DASHBOARD: '/dashboard',
  DASHBOARD_STUDENT: '/dashboard/student',
  DASHBOARD_LECTURER: '/dashboard/lecturer',
  DASHBOARD_SUBJECT_HEAD: '/dashboard/subject-head',
  DASHBOARD_ADMIN: '/dashboard/admin',

  // User Management
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Academic Structure
  CLASSES: '/classes',
  CLASS_DETAIL: '/classes/:id',
  CLASS_GRADE_ITEMS: '/classes/:classId/grade-items',

  // Assignment Submission Management
  GRADE_ITEM_SUBMISSIONS: '/grade-items/:gradeItemId/submissions',
  SUBMISSION_DETAIL: '/submissions/:id',
  MY_SUBMISSIONS: '/my-submissions',

  // Lecturer Review
  LECTURER_CLASS_SUBMISSIONS: '/lecturer/classes/:classId/submissions',
  LECTURER_SUBMISSION_REVIEW: '/lecturer/submissions/:id/review',

  // Score & Grading Management
  SUBMISSION_GRADE: '/submissions/:id/grade',
  CLASS_GRADEBOOK: '/classes/:classId/gradebook',

  // Final Result Management
  CLASS_FINAL_RESULTS: '/classes/:classId/final-results',
  CLASS_RANKINGS: '/classes/:classId/rankings',
  MY_RESULTS: '/my-results',

  // Reporting & Export
  CLASS_REPORTS: '/reports/classes/:classId',
  SUSPICIOUS_CASES: '/reports/suspicious-cases',

  // General Features
  SCHEDULE: '/schedule',
  MESSAGES: '/messages',
} as const;
