// TODO: Replace mock data with API integration
import type { Role } from '../types/role.type';
import type { LucideIcon } from 'lucide-react';
import {
  FileText, Clock, BarChart2, Brain, Flag, BookOpen, Users,
  ClipboardCheck, AlertTriangle, TrendingUp, GraduationCap, Activity,
  Send, Zap,
} from 'lucide-react';

export interface MockStatCard {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  colorClass?: string;
}

export const studentDashboardStats: MockStatCard[] = [
  { label: 'Submitted Assignments', value: 12, icon: FileText, colorClass: 'bg-indigo-50 text-indigo-600', trend: { value: '↑ 3 this week', positive: true } },
  { label: 'Pending Assignments', value: 4, icon: Clock, colorClass: 'bg-amber-50 text-amber-600', trend: { value: '2 due soon' } },
  { label: 'Average Score', value: '78.5', icon: BarChart2, colorClass: 'bg-emerald-50 text-emerald-600', trend: { value: '↑ 2.1 pts', positive: true } },
  { label: 'AI Usage Pattern', value: 'Moderate', icon: Brain, colorClass: 'bg-violet-50 text-violet-600' },
  { label: 'Flags Received', value: 1, icon: Flag, colorClass: 'bg-red-50 text-red-600' },
];

export const lecturerDashboardStats: MockStatCard[] = [
  { label: 'Total Classes', value: 6, icon: BookOpen, colorClass: 'bg-indigo-50 text-indigo-600' },
  { label: 'Total Students', value: 184, icon: Users, colorClass: 'bg-blue-50 text-blue-600', trend: { value: '+12 this semester', positive: true } },
  { label: 'Pending Reviews', value: 23, icon: ClipboardCheck, colorClass: 'bg-amber-50 text-amber-600', trend: { value: '7 urgent' } },
  { label: 'Flagged Submissions', value: 5, icon: AlertTriangle, colorClass: 'bg-red-50 text-red-600' },
  { label: 'AI Usage Distribution', value: '34%', icon: Brain, colorClass: 'bg-violet-50 text-violet-600' },
];

export const subjectHeadDashboardStats: MockStatCard[] = [
  { label: 'Total Classes', value: 18, icon: BookOpen, colorClass: 'bg-indigo-50 text-indigo-600' },
  { label: 'Total Students', value: 542, icon: Users, colorClass: 'bg-blue-50 text-blue-600' },
  { label: 'AI Usage Trends', value: '↑ 12%', icon: TrendingUp, colorClass: 'bg-violet-50 text-violet-600', trend: { value: 'vs last semester' } },
  { label: 'High Dependency Cases', value: 17, icon: AlertTriangle, colorClass: 'bg-red-50 text-red-600' },
  { label: 'Academic Performance', value: 'Good', icon: GraduationCap, colorClass: 'bg-emerald-50 text-emerald-600' },
];

export const adminDashboardStats: MockStatCard[] = [
  { label: 'Total Users', value: 728, icon: Users, colorClass: 'bg-indigo-50 text-indigo-600', trend: { value: '+14 this month', positive: true } },
  { label: 'Total Classes', value: 42, icon: BookOpen, colorClass: 'bg-blue-50 text-blue-600' },
  { label: 'Total Submissions', value: 3_841, icon: Send, colorClass: 'bg-violet-50 text-violet-600', trend: { value: '+203 this week', positive: true } },
  { label: 'Total AI Interactions', value: '12.4K', icon: Zap, colorClass: 'bg-amber-50 text-amber-600' },
  { label: 'System Activity', value: 'Normal', icon: Activity, colorClass: 'bg-emerald-50 text-emerald-600' },
];

export const dashboardStatsByRole: Record<Role, MockStatCard[]> = {
  STUDENT: studentDashboardStats,
  LECTURER: lecturerDashboardStats,
  SUBJECT_HEAD: subjectHeadDashboardStats,
  ADMIN: adminDashboardStats,
};
