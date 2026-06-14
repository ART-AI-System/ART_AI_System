import React, { createContext, useContext, useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { getMockRole, setMockRole } from '../config/roles';
import type { Role } from '../types/role.type';
import { router } from './router';

interface RoleContextType {
  role: Role;
  changeRole: (newRole: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<Role>(getMockRole());

  useEffect(() => {
    const handleRoleChange = () => {
      setRoleState(getMockRole());
    };
    window.addEventListener('mock-role-changed', handleRoleChange);
    return () => {
      window.removeEventListener('mock-role-changed', handleRoleChange);
    };
  }, []);

  const changeRole = (newRole: Role) => {
    setMockRole(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, changeRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

function App() {
  return (
    <ErrorBoundary>
      <RoleProvider>
        <RouterProvider router={router} />
      </RoleProvider>
    </ErrorBoundary>
  );
}

export default App;
