import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import type { Role } from '../../types/role.type';

import AccessDeniedPage from '../common/AccessDeniedPage';
import LecturerClassesPage from '../../pages/lecturer/LecturerClassesPage';
import LecturerClassDetailPage from '../../pages/lecturer/LecturerClassDetailPage';
import ClassesPage from '../../pages/student/StudentClassesPage';
import ClassDetailPage from '../../pages/student/StudentClassDetailPage';

// ─── AUTH GUARD ───
export const AuthGuard = () => {
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
export const GuestGuard = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }
  
  // If user is already logged in and tries to access login/register,
  // redirect them to their dashboard
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />;
};

// ─── ROLE GUARD ───
export const RoleGuard = ({ allowedRoles }: { allowedRoles: Role[] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }
  
  if (!user || !allowedRoles.includes(user.role as Role)) {
    // If not authorized for this role, show an access denied page
    return <Navigate to="/access-denied" replace />;
  }
  
  return <Outlet />;
};

// ─── DASHBOARD REDIRECTOR ───
export const DashboardRedirector = () => {
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

// ─── ROLE-BASED ROUTE SWITCHERS ───
export const ClassesRoute = () => {
  const { user } = useAuth();
  if (user?.role === 'LECTURER') return <LecturerClassesPage />;
  if (user?.role === 'STUDENT' || user?.role === 'SUBJECT_HEAD') return <ClassesPage />;
  return <AccessDeniedPage />;
};

export const ClassDetailRoute = () => {
  const { user } = useAuth();
  if (user?.role === 'LECTURER') return <LecturerClassDetailPage />;
  if (user?.role === 'STUDENT' || user?.role === 'SUBJECT_HEAD') return <ClassDetailPage />;
  return <AccessDeniedPage />;
};
