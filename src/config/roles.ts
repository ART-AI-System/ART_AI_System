import type { Role } from '../types/role.type';

export type UserRole = Role;

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  code: string;
}

// Hardcoded sample accounts for 4 roles
export const MOCK_ADMIN_USER: UserSession = {
  id: 'admin-1',
  name: 'Nguyễn Công Khoa',
  email: 'khoanc@artai.edu.vn',
  role: 'ADMIN',
  code: 'EMP-2026-001',
};

export const MOCK_LECTURER_USER: UserSession = {
  id: 'lecturer-1',
  name: 'Phạm Minh Hoàng',
  email: 'hoangpm@artai.edu.vn',
  role: 'LECTURER',
  code: 'LEC-2026-015',
};

export const MOCK_SUBJECT_HEAD_USER: UserSession = {
  id: 'head-1',
  name: 'Lê Thị Khánh Vân',
  email: 'vanltk@artai.edu.vn',
  role: 'SUBJECT_HEAD',
  code: 'HD-2026-003',
};

export const MOCK_STUDENT_USER: UserSession = {
  id: 'student-1',
  name: 'Trần Viết Tài',
  email: 'tainv@artai.edu.vn',
  role: 'STUDENT',
  code: 'GCS210456',
};

const SESSION_KEY = 'ART_AI_USER_SESSION';

// Helpers for sessionStorage management
export const getSession = (): UserSession | null => {
  try {
    const sessionStr = sessionStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    return JSON.parse(sessionStr) as UserSession;
  } catch (error) {
    console.error('Error reading session from sessionStorage', error);
    return null;
  }
};

export const setSession = (session: UserSession): void => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('art_ai_auth_state_change'));
  } catch (error) {
    console.error('Error writing session to sessionStorage', error);
  }
};

export const clearSession = (): void => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event('art_ai_auth_state_change'));
  } catch (error) {
    console.error('Error clearing session from sessionStorage', error);
  }
};
export const MOCK_USER = MOCK_ADMIN_USER;
