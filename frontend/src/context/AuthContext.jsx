import { useState } from 'react';
import authApi from '../api/authApi';
import { AuthContext } from './AuthContextValue';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('techpro_user');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse stored user", error);
      localStorage.removeItem('techpro_user');
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('access_token')));
  const [loading, setLoading] = useState(false);

  const demoUsers = {
    'admin.demo@techpro.eng': {
      id: 'demo-admin',
      fullName: 'Admin Demo',
      email: 'admin.demo@techpro.eng',
      role: 'Admin'
    },
    'user.demo@techpro.eng': {
      id: 'demo-user',
      fullName: 'User Demo',
      email: 'user.demo@techpro.eng',
      role: 'Customer'
    }
  };

  const createLocalDemoSession = (credentials) => {
    const normalizedEmail = credentials.email?.toLowerCase();
    const demoUser = demoUsers[normalizedEmail];

    if (!demoUser || credentials.password !== '123456' || credentials.mode === 'register') {
      return false;
    }

    const token = `demo-token-${demoUser.id}`;
    localStorage.setItem('access_token', token);
    localStorage.setItem('techpro_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setIsAuthenticated(true);
    return true;
  };

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
      const token = response.token || response.accessToken || response.Token || response.access_token;
      const nextUser = response.user || response.User || {
        fullName: credentials.fullName || credentials.email,
        email: credentials.email,
        role: 'User'
      };
      localStorage.setItem('access_token', token);
      localStorage.setItem('techpro_user', JSON.stringify(nextUser));
      setUser(nextUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      if (createLocalDemoSession(credentials)) {
        return true;
      }
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
