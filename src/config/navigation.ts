import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  ClipboardCheck,
  BarChart2,
  Trophy,
  FileBarChart,
  UserCircle,
  Flag,
} from 'lucide-react';
import type { NavGroup } from '../types/navigation.type';
import { ROUTES } from './routes';

export const navigationConfig: NavGroup[] = [
  {
    groupLabel: 'Dashboard',
    items: [
      {
        label: 'Dashboard',
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        allowedRoles: 'ALL',
      },
    ],
  },
  {
    groupLabel: 'User Management',
    items: [
      {
        label: 'Users',
        path: ROUTES.USERS,
        icon: Users,
        allowedRoles: ['ADMIN'],
      },
    ],
  },
  {
    groupLabel: 'Academic Structure',
    items: [
      {
        label: 'Classes',
        path: ROUTES.CLASSES,
        icon: BookOpen,
        allowedRoles: ['LECTURER', 'SUBJECT_HEAD'],
      },
    ],
  },
  {
    groupLabel: 'Submissions',
    items: [
      {
        label: 'My Submissions',
        path: ROUTES.MY_SUBMISSIONS,
        icon: FileText,
        allowedRoles: ['STUDENT'],
      },
    ],
  },
  {
    groupLabel: 'Lecturer Review',
    items: [
      {
        label: 'Class Submissions',
        // Points to first class for demonstration
        path: '/lecturer/classes/class-101/submissions',
        icon: ClipboardCheck,
        allowedRoles: ['LECTURER'],
      },
    ],
  },
  {
    groupLabel: 'Grading',
    items: [
      {
        label: 'Gradebook',
        // Points to first class gradebook for mock navigation
        path: '/classes/class-101/gradebook',
        icon: BarChart2,
        allowedRoles: ['LECTURER'],
      },
    ],
  },
  {
    groupLabel: 'Final Results',
    items: [
      {
        label: 'My Results',
        path: ROUTES.MY_RESULTS,
        icon: Trophy,
        allowedRoles: ['STUDENT'],
      },
      {
        label: 'Class Results',
        // Points to first class final results for mock
        path: '/classes/class-101/final-results',
        icon: Trophy,
        allowedRoles: ['LECTURER', 'SUBJECT_HEAD'],
      },
    ],
  },
  {
    groupLabel: 'Reports',
    items: [
      {
        label: 'Class Reports',
        // Points to class reports for class-101 for mock
        path: '/reports/classes/class-101',
        icon: FileBarChart,
        allowedRoles: ['LECTURER', 'SUBJECT_HEAD'],
      },
      {
        label: 'Suspicious Cases',
        path: ROUTES.SUSPICIOUS_CASES,
        icon: Flag,
        allowedRoles: ['SUBJECT_HEAD'],
      },
    ],
  },
  {
    groupLabel: 'Profile',
    items: [
      {
        label: 'My Profile',
        path: ROUTES.PROFILE,
        icon: UserCircle,
        allowedRoles: 'ALL',
      },
    ],
  },
];
