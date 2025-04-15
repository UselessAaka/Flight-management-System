
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our context
type UserRole = 'admin' | 'passenger' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: () => {},
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Check if user was previously logged in
  useEffect(() => {
    const savedUserRole = localStorage.getItem('userRole');
    if (savedUserRole) {
      setIsAuthenticated(true);
      setUserRole(savedUserRole as UserRole);
    }
  }, []);

  // Login function
  const login = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('userRole', role as string);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
