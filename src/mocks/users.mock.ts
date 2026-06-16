import type { UserSession } from '../config/roles';

export const MOCK_USERS: UserSession[] = [
  {
    id: 'SE18D01',
    name: 'Viet Khoa',
    email: 'khoavse18d01@fpt.edu.vn',
    role: 'STUDENT',
    code: 'SE18D01'
  },
  {
    id: 'ALAN123',
    name: 'Dr. Alan Smith',
    email: 'alansmith@fpt.edu.vn',
    role: 'LECTURER',
    code: 'ALAN123'
  },
  {
    id: 'HEAD001',
    name: 'Prof. David Chen',
    email: 'davidchen@fpt.edu.vn',
    role: 'SUBJECT_HEAD',
    code: 'HEAD001'
  },
  {
    id: 'ADMIN999',
    name: 'System Admin',
    email: 'admin@fpt.edu.vn',
    role: 'ADMIN',
    code: 'ADMIN999'
  },
];
