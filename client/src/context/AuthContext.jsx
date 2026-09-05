import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { saveAuth, getStoredUser, clearAuth, getToken } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token exists but no stored user, try to fetch profile
    if (getToken() && !getStoredUser()) {
      api
        .get('/auth/me')
        .then((res) => {
          setUser(res.user);
          saveAuth(res.user, getToken());
        })
        .catch(() => clearAuth());
    }
  }, []);

  const login = async (email, password, role, faceImage) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password, role, faceImage });
      setUser(res.user);
      saveAuth(res.user, res.token);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, message: err.message, data: err.data };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      setUser(res.user);
      saveAuth(res.user, res.token);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearAuth();
  };

  const updateUser = (updated) => {
    setUser(updated);
    saveAuth(updated, getToken());
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
