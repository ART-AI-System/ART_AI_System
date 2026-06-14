import { Navigate, Outlet } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import StudentDashboardPage from '../pages/dashboard/StudentDashboardPage';
import LecturerDashboardPage from '../pages/dashboard/LecturerDashboardPage';
import SubjectHeadDashboardPage from '../pages/dashboard/SubjectHeadDashboardPage';
import AdminDashboardPage from '../pages/dashboard/AdminDashboardPage';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import AccessDeniedPage from '../components/common/AccessDeniedPage';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { useAuth } from './App';
import { ROUTES } from '../config/routes';
import type { Role } from '../types/role.type';

// ─── AUTH GUARD ───
const AuthGuard = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

// ─── GUEST GUARD ───
const GuestGuard = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }
  
  return !isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.DASHBOARD} replace />;
};

// ─── ROLE GUARD ───
interface RoleGuardProps {
  allowedRoles: Role[];
}

const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <AccessDeniedPage />;
  }

  return <Outlet />;
};

// ─── DASHBOARD REDIRECTOR ───
const DashboardRedirector = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to={ROUTES.DASHBOARD_ADMIN} replace />;
    case 'LECTURER':
      return <Navigate to={ROUTES.DASHBOARD_LECTURER} replace />;
    case 'SUBJECT_HEAD':
      return <Navigate to={ROUTES.DASHBOARD_SUBJECT_HEAD} replace />;
    case 'STUDENT':
      return <Navigate to={ROUTES.DASHBOARD_STUDENT} replace />;
    default:
      return <AccessDeniedPage />;
  }
};

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
                element: (
                  <EmptyState
                    title="System User Directory"
                    description="Perform CRUD user actions, configure database listings, or upload CSV rosters."
                  />
                ),
              },
              {
                path: ROUTES.USER_DETAIL,
                element: (
                  <EmptyState
                    title="Account Identity File"
                    description="View academic log archives, details and metadata for this account."
                  />
                ),
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

          // Academic Structure Management
          {
            element: <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']} />,
            children: [
              {
                path: ROUTES.CLASSES,
                element: (
                  <EmptyState
                    title="Academic Classes Listing"
                    description="Overview of structural class sections and syllabi parameters assigned to you."
                  />
                ),
              },
              {
                path: ROUTES.CLASS_DETAIL,
                element: (
                  <EmptyState
                    title="Class Detail & Student Roster"
                    description="Manage student groups, course checkpoints, and overall status."
                  />
                ),
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
                element: (
                  <EmptyState
                    title="Submission Artifact View"
                    description="Detailed view of submitted work files, verification logs, and code hashes."
                  />
                ),
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={['STUDENT']} />,
            children: [
              {
                path: ROUTES.MY_SUBMISSIONS,
                element: (
                  <EmptyState
                    title="My Coursework Submissions"
                    description="Chronological record of files you uploaded for instructor audits."
                  />
                ),
              },
            ],
          },

          // Lecturer Review Section
          {
            element: <RoleGuard allowedRoles={['LECTURER']} />,
            children: [
              {
                path: ROUTES.LECTURER_CLASS_SUBMISSIONS,
                element: (
                  <EmptyState
                    title="Class Submission Audits"
                    description="Instructor review hub containing overview statistics of class works."
                  />
                ),
              },
              {
                path: ROUTES.LECTURER_SUBMISSION_REVIEW,
                element: (
                  <EmptyState
                    title="Instructors Evaluation Dashboard"
                    description="Review documents, run integrity checkers, and add comments."
                  />
                ),
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
                element: (
                  <EmptyState
                    title="My Final Performance Report"
                    description="Review official final grades, transcripts, and comments."
                  />
                ),
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
    ],
  },

  // Global Wildcard Page Route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
