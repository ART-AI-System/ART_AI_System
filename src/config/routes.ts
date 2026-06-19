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
  SUBJECT_DETAIL: '/subjects/:id',
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
  MESSAGES: '/messages', // Retain for other roles

  // Student specific
  STUDENT_NEWS: '/student/news',
  STUDENT_MESSAGES: '/student/messages',
  STUDENT_SETTINGS: '/student/settings',
  STUDENT_ATTENDANCE: '/student/attendance',
  STUDENT_TRANSCRIPT: '/student/transcript',
  STUDENT_CURRICULUM: '/student/curriculum',
  STUDENT_TRANSACTIONS: '/student/transactions',
  STUDENT_TAKE_TEST: '/tests/:id/take',
  STUDENT_TEST_RESULT: '/tests/:id/result',

  // Lecturer specific
  LECTURER_REPORTS: '/lecturer/reports',
  LECTURER_MESSAGES: '/lecturer/messages',
  LECTURER_SETTINGS: '/lecturer/settings',
  CLASS_GRADING: '/classes/:classId/grading',
  GRADING_DETAIL: '/grading/:submissionId',
  CREATE_ASSIGNMENT: '/assignments/create',
  CREATE_TEST: '/tests/create',
  TEST_ANALYTICS: '/tests/analytics',
  EDIT_SLOT: '/schedule/:slotId/edit',
  NEWS: '/news',
} as const;
