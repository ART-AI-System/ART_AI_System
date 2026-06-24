export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

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

  // Admin Module
  ADMIN_STUDENTS: '/dashboard/admin/students',
  ADMIN_TEACHERS: '/dashboard/admin/teachers',
  ADMIN_HEAD_SUBJECTS: '/dashboard/admin/head-subjects',
  ADMIN_SEMESTERS: '/dashboard/admin/semesters',
  ADMIN_SUBJECTS: '/dashboard/admin/subjects',
  ADMIN_CLASSES: '/dashboard/admin/classes',
  ADMIN_MESSAGES: '/dashboard/admin/messages',
  ADMIN_FEEDBACK: '/dashboard/admin/feedback',
  ADMIN_SETTINGS: '/dashboard/admin/settings',

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
  GRADING_SUBJECTS: '/grading',
  GRADING_ASSIGNMENTS: '/grading/subjects/:subjectId',
  CREATE_ASSIGNMENT: '/assignments/create',
  CREATE_TEST: '/tests/create',
  TEST_ANALYTICS: '/tests/analytics',
  EDIT_SLOT: '/schedule/:slotId/edit',
  NEWS: '/news',
} as const;
