import { Navigate } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import LecturerDashboardPage from '../pages/lecturer/LecturerDashboardPage';
import SubjectHeadDashboardPage from '../pages/subjectHead/SubjectHeadDashboardPage';
import SuspiciousCasesPage from '../pages/subjectHead/SuspiciousCasesPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminClassesPage from '../pages/admin/AdminClassesPage';
import AdminStudentsPage from '../pages/admin/AdminStudentsPage';
import AdminTeachersPage from '../pages/admin/AdminTeachersPage';
import AdminSemestersPage from '../pages/admin/AdminSemestersPage';
import AdminSubjectsPage from '../pages/admin/AdminSubjectsPage';
import AdminMessagesPage from '../pages/admin/AdminMessagesPage';
import AdminFeedbackPage from '../pages/admin/AdminFeedbackPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import { EmptyState } from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import GradebookPage from '../pages/student/GradebookPage';
import MessagesPage from '../pages/student/MessagesPage';
import SchedulePage from '../pages/student/SchedulePage';
import SettingsPage from '../pages/student/SettingsPage';
import MySubmissionsPage from '../pages/student/MySubmissionsPage';
import SubmissionDetailPage from '../pages/student/SubmissionDetailPage';
import SubmissionGradePage from '../pages/student/SubmissionGradePage';
import UsersPage from '../pages/admin/UsersPage';
import UserDetailPage from '../pages/admin/UserDetailPage';

// Lecturer Pages
import LecturerSubjectDetailPage from '../pages/lecturer/LecturerSubjectDetailPage';
import LecturerGradingListPage from '../pages/lecturer/LecturerGradingListPage';
import LecturerGradingDetailPage from '../pages/lecturer/LecturerGradingDetailPage';
import LecturerCreateAssignmentPage from '../pages/lecturer/LecturerCreateAssignmentPage';
import LecturerCreateTestPage from '../pages/lecturer/LecturerCreateTestPage';
import LecturerTestAnalyticsPage from '../pages/lecturer/LecturerTestAnalyticsPage';
import LecturerEditSlotPage from '../pages/lecturer/LecturerEditSlotPage';
import LecturerNewsPage from '../pages/lecturer/LecturerNewsPage';
import LecturerReportsPage from '../pages/lecturer/LecturerReportsPage';
import LecturerSettingsPage from '../pages/lecturer/LecturerSettingsPage';
import LecturerMessagesPage from '../pages/lecturer/LecturerMessagesPage';
import LecturerGradingSubjectsPage from '../pages/lecturer/LecturerGradingSubjectsPage';
import LecturerGradingAssignmentsPage from '../pages/lecturer/LecturerGradingAssignmentsPage';

// Student Pages
import StudentSettingsPage from '../pages/student/StudentSettingsPage';
import StudentMessagesPage from '../pages/student/StudentMessagesPage';
import StudentNewsPage from '../pages/student/StudentNewsPage';
import StudentAttendancePage from '../pages/student/StudentAttendancePage';
import StudentTranscriptPage from '../pages/student/StudentTranscriptPage';
import StudentCurriculumPage from '../pages/student/StudentCurriculumPage';
import StudentTransactionsPage from '../pages/student/StudentTransactionsPage';
import StudentTakeTestPage from '../pages/student/StudentTakeTestPage';
import StudentTestResultPage from '../pages/student/StudentTestResultPage';

import { ROUTES } from '../config/routes';

import { AuthGuard, GuestGuard, RoleGuard, DashboardRedirector, ClassesRoute, ClassDetailRoute } from '../components/guards/Guards';

// ─── ROUTER DEFINITION ───
export const router = createBrowserRouter([
  // Guest-only Layout & Routes
  {
    element: <GuestGuard />,
    errorElement: <ErrorState />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <LoginPage />,
          },
          {
            path: ROUTES.REGISTER,
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },

  // Auth-Protected Layout & Routes
  {
    element: <AuthGuard />,
    errorElement: <ErrorState />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          // Index Root Redirect
          {
            index: true,
            element: <Navigate to={ROUTES.DASHBOARD} replace />,
          },

          // Dashboards Redirector Route
          {
            path: ROUTES.DASHBOARD,
            element: <DashboardRedirector />,
          },

          // Dashboards by Role
          {
            element: <RoleGuard allowedRoles={['STUDENT']} />,
            children: [
              {
                path: ROUTES.DASHBOARD_STUDENT,
                element: <StudentDashboardPage />,
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['LECTURER']} />,
            children: [
              {
                path: ROUTES.DASHBOARD_LECTURER,
                element: <LecturerDashboardPage />,
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.DASHBOARD_SUBJECT_HEAD,
                element: <SubjectHeadDashboardPage />,
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['ADMIN']} />,
            children: [
              {
                path: ROUTES.DASHBOARD_ADMIN,
                element: <AdminDashboardPage />,
              },
            ],
          },

          // User Management Module
          {
            element: <RoleGuard allowedRoles={['ADMIN']} />,
            children: [
              {
                path: ROUTES.USERS,
                element: <UsersPage />,
              },
              {
                path: ROUTES.USER_DETAIL,
                element: <UserDetailPage />,
              },
              {
                path: ROUTES.ADMIN_STUDENTS,
                element: <AdminStudentsPage />,
              },
              {
                path: ROUTES.ADMIN_TEACHERS,
                element: <AdminTeachersPage />,
              },
              {
                path: ROUTES.ADMIN_HEAD_SUBJECTS,
                element: <AdminTeachersPage />, // Fallback for Head Subjects right now
              },
              {
                path: ROUTES.ADMIN_SEMESTERS,
                element: <AdminSemestersPage />,
              },
              {
                path: ROUTES.ADMIN_SUBJECTS,
                element: <AdminSubjectsPage />,
              },
              {
                path: ROUTES.ADMIN_CLASSES,
                element: <AdminClassesPage />,
              },
              {
                path: ROUTES.ADMIN_MESSAGES,
                element: <AdminMessagesPage />,
              },
              {
                path: ROUTES.ADMIN_FEEDBACK,
                element: <AdminFeedbackPage />,
              },
              {
                path: ROUTES.ADMIN_SETTINGS,
                element: <AdminSettingsPage />,
              },
            ],
          },

          // Shared Profile View (All Authenticated)
          {
            path: ROUTES.PROFILE,
            element: (
              <EmptyState
                title="My Personal Profile"
                description="Manage your account profile, configure settings, and view dynamic credentials."
              />
            ),
          },
          {
            path: ROUTES.SETTINGS,
            element: <SettingsPage />,
          },
          {
            path: ROUTES.SCHEDULE,
            element: <SchedulePage />,
          },
          {
            path: ROUTES.MESSAGES,
            element: <MessagesPage />,
          },

          // Academic Structure Management
          {
            element: <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD', 'STUDENT', 'ADMIN']} />,
            children: [
              {
                path: ROUTES.CLASSES,
                element: <ClassesRoute />,
              },
              {
                path: ROUTES.SUBJECT_DETAIL,
                element: <LecturerSubjectDetailPage />,
              },
              {
                path: ROUTES.CLASS_DETAIL,
                element: <ClassDetailRoute />,
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['STUDENT', 'LECTURER', 'SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.CLASS_GRADE_ITEMS,
                element: (
                  <EmptyState
                    title="Course Checkpoints & Grade Items"
                    description="List of core assignments, grading checkpoints, and criteria weightings."
                  />
                ),
              },
            ],
          },

          // Assignment Submission Management
          {
            element: <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.GRADE_ITEM_SUBMISSIONS,
                element: (
                  <EmptyState
                    title="Checkpoint Submissions Log"
                    description="Lists of submissions uploaded by students under this assignment checkpoint."
                  />
                ),
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['STUDENT', 'LECTURER', 'SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.SUBMISSION_DETAIL,
                element: <SubmissionDetailPage />,
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['STUDENT']} />,
            children: [
              {
                path: ROUTES.MY_SUBMISSIONS,
                element: <MySubmissionsPage />,
              },
            ],
          },

          // Lecturer Review Section
          {
            element: <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.LECTURER_CLASS_SUBMISSIONS,
                element: <LecturerGradingListPage />,
              },
              {
                path: ROUTES.LECTURER_SUBMISSION_REVIEW,
                element: <LecturerGradingDetailPage />,
              },
              {
                path: ROUTES.CLASS_GRADING,
                element: <LecturerGradingListPage />,
              },
              {
                path: ROUTES.GRADING_DETAIL,
                element: <LecturerGradingDetailPage />,
              },
              {
                path: ROUTES.GRADING_SUBJECTS,
                element: <LecturerGradingSubjectsPage />,
              },
              {
                path: ROUTES.GRADING_ASSIGNMENTS,
                element: <LecturerGradingAssignmentsPage />,
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['LECTURER']} />,
            children: [
              {
                path: ROUTES.CREATE_ASSIGNMENT,
                element: <LecturerCreateAssignmentPage />,
              },
              {
                path: ROUTES.CREATE_TEST,
                element: <LecturerCreateTestPage />,
              },
              {
                path: ROUTES.TEST_ANALYTICS,
                element: <LecturerTestAnalyticsPage />,
              },
              {
                path: ROUTES.EDIT_SLOT,
                element: <LecturerEditSlotPage />,
              },
              {
                path: ROUTES.NEWS,
                element: <LecturerNewsPage />,
              },
              {
                path: ROUTES.LECTURER_REPORTS,
                element: <LecturerReportsPage />,
              },
              {
                path: ROUTES.LECTURER_SETTINGS,
                element: <LecturerSettingsPage />,
              },
              {
                path: ROUTES.LECTURER_MESSAGES,
                element: <LecturerMessagesPage />,
              },
            ],
          },
          
          // Student specific routes
          {
            element: <RoleGuard allowedRoles={['STUDENT']} />,
            children: [
              {
                path: ROUTES.STUDENT_NEWS,
                element: <StudentNewsPage />,
              },
              {
                path: ROUTES.STUDENT_MESSAGES,
                element: <StudentMessagesPage />,
              },
              {
                path: ROUTES.STUDENT_SETTINGS,
                element: <StudentSettingsPage />,
              },
              {
                path: ROUTES.STUDENT_ATTENDANCE,
                element: <StudentAttendancePage />,
              },
              {
                path: ROUTES.STUDENT_TRANSCRIPT,
                element: <StudentTranscriptPage />,
              },
              {
                path: ROUTES.STUDENT_CURRICULUM,
                element: <StudentCurriculumPage />,
              },
              {
                path: ROUTES.STUDENT_TRANSACTIONS,
                element: <StudentTransactionsPage />,
              },
            ],
          },

          // Score & Grading Management
          {
            element: <RoleGuard allowedRoles={['STUDENT', 'LECTURER', 'SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.SUBMISSION_GRADE,
                element: <SubmissionGradePage />,
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.CLASS_GRADEBOOK,
                element: (
                  <EmptyState
                    title="Instructor Class Gradebook"
                    description="Comprehensive grid of grades and scores across all checkpoints."
                  />
                ),
              },
            ],
          },

          // Final Results Management
          {
            element: <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.CLASS_FINAL_RESULTS,
                element: (
                  <EmptyState
                    title="Final Performance Outcomes"
                    description="Calculate final letter grades and output overall transcript metrics."
                  />
                ),
              },
              {
                path: ROUTES.CLASS_RANKINGS,
                element: (
                  <EmptyState
                    title="Class Rank Distribution Index"
                    description="Analyze percentile indices and student classifications."
                  />
                ),
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['STUDENT']} />,
            children: [
              {
                path: ROUTES.MY_RESULTS,
                element: <GradebookPage />,
              },
            ],
          },

          // Reporting & Auditing Exports
          {
            element: <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.CLASS_REPORTS,
                element: (
                  <EmptyState
                    title="Compliance Export Center"
                    description="Generate and download academic analytics in Excel, PDF, or CSV format."
                  />
                ),
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.SUSPICIOUS_CASES,
                element: <SuspiciousCasesPage />,
              },
            ],
          },

          // Local Layout Wildcard
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
      // Full-screen pages outside MainLayout but still auth-protected
      {
        element: <RoleGuard allowedRoles={['STUDENT']} />,
        children: [
          {
            path: ROUTES.STUDENT_TAKE_TEST,
            element: <StudentTakeTestPage />,
          },
          {
            path: ROUTES.STUDENT_TEST_RESULT,
            element: <StudentTestResultPage />,
          },
        ],
      },
    ],
  },

  // Global Wildcard Page Route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
