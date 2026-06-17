import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, setSession, clearSession, type UserSession } from '../config/roles';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (session: UserSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(() => getSession());
  const [loading] = useState<boolean>(false);

  useEffect(() => {

    const handleAuthChange = () => {
      setUser(getSession());
    };
    window.addEventListener('art_ai_auth_state_change', handleAuthChange);
    return () => {
      window.removeEventListener('art_ai_auth_state_change', handleAuthChange);
    };
  }, []);

  const login = (session: UserSession) => {
    setSession(session);
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
