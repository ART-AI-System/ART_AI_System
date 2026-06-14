import { Navigate, createBrowserRouter } from 'react-router-dom';
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
import { useRole } from './App';
import { ROUTES } from '../config/routes';
import type { Role } from '../types/role.type';

// ─── ROLE GUARD COMPONENT ───
interface RoleGuardProps {
  allowedRoles: Role[] | 'ALL';
  children: React.ReactNode;
}

const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { role } = useRole();

  if (allowedRoles === 'ALL') {
    return <>{children}</>;
  }

  if (!allowedRoles.includes(role)) {
    return <AccessDeniedPage />;
  }

  return <>{children}</>;
};

// ─── DASHBOARD REDIRECTOR COMPONENT ───
const DashboardRedirector = () => {
  const { role } = useRole();

  switch (role) {
    case 'STUDENT':
      return <Navigate to={ROUTES.DASHBOARD_STUDENT} replace />;
    case 'LECTURER':
      return <Navigate to={ROUTES.DASHBOARD_LECTURER} replace />;
    case 'SUBJECT_HEAD':
      return <Navigate to={ROUTES.DASHBOARD_SUBJECT_HEAD} replace />;
    case 'ADMIN':
      return <Navigate to={ROUTES.DASHBOARD_ADMIN} replace />;
    default:
      return <Navigate to={ROUTES.LOGIN} replace />;
  }
};

// ─── ROUTER CONFIGURATION ───
export const router = createBrowserRouter([
  // Public Auth Routes
  {
    element: <AuthLayout />,
    errorElement: <ErrorState />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },

  // Protected Main Routes
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorState />,
    children: [
      // Root redirect to dashboard
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },

      // Dashboards Module
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardRedirector />,
      },
      {
        path: ROUTES.DASHBOARD_STUDENT,
        element: (
          <RoleGuard allowedRoles={['STUDENT']}>
            <StudentDashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.DASHBOARD_LECTURER,
        element: (
          <RoleGuard allowedRoles={['LECTURER']}>
            <LecturerDashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.DASHBOARD_SUBJECT_HEAD,
        element: (
          <RoleGuard allowedRoles={['SUBJECT_HEAD']}>
            <SubjectHeadDashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.DASHBOARD_ADMIN,
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <AdminDashboardPage />
          </RoleGuard>
        ),
      },

      // User Management Module
      {
        path: ROUTES.USERS,
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <EmptyState
              title="User Management"
              description="Manage member accounts and imports here."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.USER_DETAIL,
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <EmptyState
              title="User Detail & Edit"
              description="Edit and view specific member profiles here."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <RoleGuard allowedRoles="ALL">
            <EmptyState
              title="My Profile"
              description="View and update your personal user profile information."
            />
          </RoleGuard>
        ),
      },

      // Academic Structure Management
      {
        path: ROUTES.CLASSES,
        element: (
          <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']}>
            <EmptyState
              title="Academic Classes"
              description="List of academic class sections you teach or oversee."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.CLASS_DETAIL,
        element: (
          <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']}>
            <EmptyState
              title="Class Detail & Roster"
              description="Manage student enrollments and reviews within this class."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.CLASS_GRADE_ITEMS,
        element: (
          <RoleGuard allowedRoles={['STUDENT', 'LECTURER']}>
            <EmptyState
              title="Class Milestones & Grade Items"
              description="View curriculum grading items, milestones and criteria."
            />
          </RoleGuard>
        ),
      },

      // Assignment Submission Management
      {
        path: ROUTES.GRADE_ITEM_SUBMISSIONS,
        element: (
          <RoleGuard allowedRoles={['STUDENT', 'LECTURER']}>
            <EmptyState
              title="Grade Item Submissions"
              description="Track submissions submitted under this grade milestone."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.SUBMISSION_DETAIL,
        element: (
          <RoleGuard allowedRoles={['STUDENT', 'LECTURER', 'SUBJECT_HEAD']}>
            <EmptyState
              title="Submission Files & Detail"
              description="View the submitted work, attachments and system audits."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.MY_SUBMISSIONS,
        element: (
          <RoleGuard allowedRoles={['STUDENT']}>
            <EmptyState
              title="My Personal Submissions"
              description="A chronological record of all your submitted coursework."
            />
          </RoleGuard>
        ),
      },

      // Lecturer Review
      {
        path: ROUTES.LECTURER_CLASS_SUBMISSIONS,
        element: (
          <RoleGuard allowedRoles={['LECTURER']}>
            <EmptyState
              title="Class Submissions Overview"
              description="Dashboard view of students coursework submissions for this class."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.LECTURER_SUBMISSION_REVIEW,
        element: (
          <RoleGuard allowedRoles={['LECTURER']}>
            <EmptyState
              title="Grade & Audit Review"
              description="Evaluate academic work and inspect AI transparency metrics."
            />
          </RoleGuard>
        ),
      },

      // Score & Grading Management
      {
        path: ROUTES.SUBMISSION_GRADE,
        element: (
          <RoleGuard allowedRoles={['STUDENT', 'LECTURER']}>
            <EmptyState
              title="Submission Score & Feedback"
              description="Detailed grading report and comments from the instructor."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.CLASS_GRADEBOOK,
        element: (
          <RoleGuard allowedRoles={['LECTURER']}>
            <EmptyState
              title="Class Gradebook"
              description="Unified spreadsheet of scores across all class grade items."
            />
          </RoleGuard>
        ),
      },

      // Final Result Management & Classification
      {
        path: ROUTES.CLASS_FINAL_RESULTS,
        element: (
          <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']}>
            <EmptyState
              title="Calculate & Export Final Results"
              description="Generate overall grades and publish outcomes."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.CLASS_RANKINGS,
        element: (
          <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']}>
            <EmptyState
              title="Class Rankings & Classifications"
              description="Academic performance distribution and rank index list."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.MY_RESULTS,
        element: (
          <RoleGuard allowedRoles={['STUDENT']}>
            <EmptyState
              title="My Academic Final Results"
              description="View overall scores, classifications and instructor reports."
            />
          </RoleGuard>
        ),
      },

      // Reporting & Export
      {
        path: ROUTES.CLASS_REPORTS,
        element: (
          <RoleGuard allowedRoles={['LECTURER', 'SUBJECT_HEAD']}>
            <EmptyState
              title="Class Reports Center"
              description="Generate and download academic analytics in Excel/PDF/CSV formats."
            />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.SUSPICIOUS_CASES,
        element: (
          <RoleGuard allowedRoles={['SUBJECT_HEAD']}>
            <EmptyState
              title="Suspicious AI Cases"
              description="Audit log of submissions flagged with potential AI abuse patterns."
            />
          </RoleGuard>
        ),
      },

      // Catch-all (for matching main layout sub-paths that do not exist)
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },

  // Public/Standalone Catch-all Page
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
