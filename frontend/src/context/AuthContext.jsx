import { useState } from 'react';
import authApi from '../api/authApi';
import { AuthContext } from './AuthContextValue';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('techpro_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('access_token')));
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('techpro_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = credentials.mode === 'register'
        ? await authApi.register(credentials)
        : await authApi.login(credentials);
      localStorage.setItem('access_token', response.token);
      localStorage.setItem('techpro_user', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (nextUser) => {
    localStorage.setItem('techpro_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
