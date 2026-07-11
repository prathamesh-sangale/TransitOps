import { createContext, useState, useEffect } from 'react';
import { authApi } from '../modules/auth/api/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('transitops_user');
    const storedToken = localStorage.getItem('transitops_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from local storage');
        localStorage.removeItem('transitops_user');
        localStorage.removeItem('transitops_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      if (response.success) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem('transitops_user', JSON.stringify(user));
        localStorage.setItem('transitops_token', token);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout API failed, still removing local session', e);
    } finally {
      setUser(null);
      localStorage.removeItem('transitops_user');
      localStorage.removeItem('transitops_token');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
