import React, { createContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on initial load
    const token = localStorage.getItem('access_token');
    if (token) {
      // In a real app, verify token with backend or fetch profile
      // For now, we mock a logged in state if token exists
      verifyTokenAndFetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyTokenAndFetchProfile = async () => {
    try {
      setLoading(true);
      // Example call: const response = await authApi.getProfile();
      // setUser(response.data);
      
      // Mock successful login
      setUser({ name: 'Admin', email: 'admin@techpro.eng' });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token verification failed", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Example call: 
      // const response = await authApi.login(credentials);
      // const { token, user } = response.data;
      // localStorage.setItem('access_token', token);
      
      // Mocking the response
      localStorage.setItem('access_token', 'mock_token_123');
      setUser({ name: 'Admin', email: 'admin@techpro.eng' });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
