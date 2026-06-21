import { Navigate } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import StudentDashboardPage from '../pages/dashboard/StudentDashboardPage';
import LecturerDashboardPage from '../pages/dashboard/LecturerDashboardPage';
import SubjectHeadDashboardPage from '../pages/dashboard/SubjectHeadDashboardPage';
import AdminDashboardPage from '../pages/dashboard/AdminDashboardPage';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import { EmptyState } from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import GradebookPage from '../pages/dashboard/GradebookPage';
import MessagesPage from '../pages/dashboard/MessagesPage';
import SchedulePage from '../pages/dashboard/SchedulePage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import MySubmissionsPage from '../pages/dashboard/MySubmissionsPage';
import SubmissionDetailPage from '../pages/dashboard/SubmissionDetailPage';
import UsersPage from '../pages/dashboard/UsersPage';
import UserDetailPage from '../pages/dashboard/UserDetailPage';

// Lecturer Pages
import LecturerSubjectDetailPage from '../pages/dashboard/LecturerSubjectDetailPage';
import LecturerGradingListPage from '../pages/dashboard/LecturerGradingListPage';
import LecturerGradingDetailPage from '../pages/dashboard/LecturerGradingDetailPage';
import LecturerCreateAssignmentPage from '../pages/dashboard/LecturerCreateAssignmentPage';
import LecturerCreateTestPage from '../pages/dashboard/LecturerCreateTestPage';
import LecturerTestAnalyticsPage from '../pages/dashboard/LecturerTestAnalyticsPage';
import LecturerEditSlotPage from '../pages/dashboard/LecturerEditSlotPage';
import LecturerNewsPage from '../pages/dashboard/LecturerNewsPage';
import LecturerReportsPage from '../pages/dashboard/LecturerReportsPage';
import LecturerSettingsPage from '../pages/dashboard/LecturerSettingsPage';
import LecturerMessagesPage from '../pages/dashboard/LecturerMessagesPage';

// Student Pages
import StudentSettingsPage from '../pages/dashboard/StudentSettingsPage';
import StudentMessagesPage from '../pages/dashboard/StudentMessagesPage';
import StudentNewsPage from '../pages/dashboard/StudentNewsPage';
import StudentAttendancePage from '../pages/dashboard/StudentAttendancePage';
import StudentTranscriptPage from '../pages/dashboard/StudentTranscriptPage';
import StudentCurriculumPage from '../pages/dashboard/StudentCurriculumPage';
import StudentTransactionsPage from '../pages/dashboard/StudentTransactionsPage';
import StudentTakeTestPage from '../pages/dashboard/StudentTakeTestPage';
import StudentTestResultPage from '../pages/dashboard/StudentTestResultPage';

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
            element: <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD', 'STUDENT']} />,
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
            element: <RoleGuard allowedRoles={['STUDENT', 'LECTURER']} />,
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
            element: <RoleGuard allowedRoles={['STUDENT', 'LECTURER']} />,
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
            element: <RoleGuard allowedRoles={['LECTURER']} />,
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
            element: <RoleGuard allowedRoles={['STUDENT', 'LECTURER']} />,
            children: [
              {
                path: ROUTES.SUBMISSION_GRADE,
                element: (
                  <EmptyState
                    title="Submission Grades & Evaluator Feedback"
                    description="Check specific performance feedback, final scores, and grades."
                  />
                ),
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['LECTURER']} />,
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
                element: (
                  <EmptyState
                    title="Suspicious Cases Audit Logs"
                    description="Audit trail of AI usage alerts and potential academic integrity flags."
                  />
                ),
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
