import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

// Safely read and parse a value from localStorage.
// Handles missing keys, the literal string "undefined", and malformed JSON.
const safeParse = (key) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored || stored === 'undefined') return null;
    return JSON.parse(stored);
  } catch (err) {
    console.error(`Failed to parse localStorage key "${key}":`, err);
    localStorage.removeItem(key);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeParse('aqb_user'));
  const [loading, setLoading] = useState(true);

  // On mount, verify the stored token is still valid and refresh the user object
  useEffect(() => {
    const token = localStorage.getItem('aqb_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        localStorage.setItem('aqb_user', JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem('aqb_token');
        localStorage.removeItem('aqb_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (token, userObj) => {
    if (!token || !userObj) {
      console.error('persistSession called with invalid data:', { token, userObj });
      return;
    }
    localStorage.setItem('aqb_token', token);
    localStorage.setItem('aqb_user', JSON.stringify(userObj));
    setUser(userObj);
  };

  const login = useCallback(async (credentials) => {
    const { token, user: userObj } = await authService.login(credentials);
    persistSession(token, userObj);
    return userObj;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user: userObj } = await authService.register(payload);
    persistSession(token, userObj);
    return userObj;
  }, []);

  const loginUser = useCallback((data) => {
    const { token, user: userObj } = data || {};
    persistSession(token, userObj);
    return userObj;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const { user: userObj } = await authService.updateMe(payload);
    localStorage.setItem('aqb_user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('aqb_token');
    localStorage.removeItem('aqb_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginUser, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};