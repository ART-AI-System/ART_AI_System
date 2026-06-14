export type Role = 'STUDENT' | 'LECTURER' | 'SUBJECT_HEAD' | 'ADMIN';

export const ROLES: Record<Role, Role> = {
  STUDENT: 'STUDENT',
  LECTURER: 'LECTURER',
  SUBJECT_HEAD: 'SUBJECT_HEAD',
  ADMIN: 'ADMIN',
};
