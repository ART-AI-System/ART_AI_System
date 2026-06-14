import type { Role } from '../types/role.type';

// Default role to fall back on if nothing is set
const DEFAULT_ROLE: Role = 'ADMIN';

// Helper to get role from localStorage
export const getMockRole = (): Role => {
  const saved = localStorage.getItem('ART_AI_MOCK_ROLE');
  return (saved as Role) || DEFAULT_ROLE;
};

// Helper to set role in localStorage
export const setMockRole = (role: Role) => {
  localStorage.setItem('ART_AI_MOCK_ROLE', role);
  // Dispatch custom event to notify other components/hooks of change
  window.dispatchEvent(new Event('mock-role-changed'));
};

export const MOCK_USER = {
  id: '1',
  name: 'Admin User',
  email: 'admin@artai.edu.vn',
  avatar: null as string | null,
};
