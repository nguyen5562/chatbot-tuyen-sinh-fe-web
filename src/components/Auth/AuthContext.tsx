import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { isLoggedIn as checkIsLoggedIn, login as authLogin, logout as authLogout } from '../../utils/auth';

interface AuthContextType {
  loggedIn: boolean;
  user: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(checkIsLoggedIn());
  const [user, setUser] = useState<string | null>(localStorage.getItem('user'));

  useEffect(() => {
    setLoggedIn(checkIsLoggedIn());
    setUser(localStorage.getItem('user'));
  }, []);

  const login = (username: string, password: string) => {
    authLogin(username, password);
    setLoggedIn(true);
    setUser(username);
  };

  const logout = () => {
    authLogout();
    setLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 