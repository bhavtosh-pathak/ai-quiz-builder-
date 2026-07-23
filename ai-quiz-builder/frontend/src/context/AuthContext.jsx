// import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { authService } from '../services/authService';

// const AuthContext = createContext(null);

// // Safely read and parse a value from sessionStorage.
// // Handles missing keys, the literal string "undefined", and malformed JSON.
// // sessionStorage (not localStorage) is used deliberately — it's cleared
// // automatically when the browser/tab is closed, so the login doesn't
// // persist across sessions the way localStorage would.
// const safeParse = (key) => {
//   try {
//     const stored = sessionStorage.getItem(key);
//     if (!stored || stored === 'undefined') return null;
//     return JSON.parse(stored);
//   } catch (err) {
//     console.error(`Failed to parse sessionStorage key "${key}":`, err);
//     sessionStorage.removeItem(key);
//     return null;
//   }
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => safeParse('aqb_user'));
//   const [loading, setLoading] = useState(true);

//   // On mount, verify the stored token is still valid and refresh the user object
//   useEffect(() => {
//     const token = sessionStorage.getItem('aqb_token');
//     if (!token) {
//       setLoading(false);
//       return;
//     }
//     authService
//       .getMe()
//       .then(({ user: freshUser }) => {
//         setUser(freshUser);
//         sessionStorage.setItem('aqb_user', JSON.stringify(freshUser));
//       })
//       .catch(() => {
//         sessionStorage.removeItem('aqb_token');
//         sessionStorage.removeItem('aqb_user');
//         setUser(null);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const persistSession = (token, userObj) => {
//     if (!token || !userObj) {
//       console.error('persistSession called with invalid data:', { token, userObj });
//       return;
//     }
//     sessionStorage.setItem('aqb_token', token);
//     sessionStorage.setItem('aqb_user', JSON.stringify(userObj));
//     setUser(userObj);
//   };

//   const login = useCallback(async (credentials) => {
//     const { token, user: userObj } = await authService.login(credentials);
//     persistSession(token, userObj);
//     return userObj;
//   }, []);

//   const register = useCallback(async (payload) => {
//     const { token, user: userObj } = await authService.register(payload);
//     persistSession(token, userObj);
//     return userObj;
//   }, []);

//   const loginUser = useCallback((data) => {
//     const { token, user: userObj } = data || {};
//     persistSession(token, userObj);
//     return userObj;
//   }, []);

//   const updateProfile = useCallback(async (payload) => {
//     const { user: userObj } = await authService.updateMe(payload);
//     sessionStorage.setItem('aqb_user', JSON.stringify(userObj));
//     setUser(userObj);
//     return userObj;
//   }, []);

//   const logout = useCallback(() => {
//     sessionStorage.removeItem('aqb_token');
//     sessionStorage.removeItem('aqb_user');
//     setUser(null);
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, loginUser, register, logout, updateProfile }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
//   return ctx;
// };


import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

const clearSession = () => {
  sessionStorage.removeItem('aqb_token');
  sessionStorage.removeItem('aqb_user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('aqb_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // Any API call that gets a 401 (expired token, deleted user, wrong
  // JWT_SECRET after a server config change, etc.) routes here — one
  // single place that clears the session and lets React Router's
  // ProtectedRoute redirect naturally, instead of a hard page reload.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      const wasLoggedIn = !!sessionStorage.getItem('aqb_token');
      clearSession();
      setUser(null);
      if (wasLoggedIn) {
        toast.error('Your session expired — please log in again.');
      }
    });
  }, []);

  // On mount, verify the stored token is still valid and refresh the user object
  useEffect(() => {
    const token = sessionStorage.getItem('aqb_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        sessionStorage.setItem('aqb_user', JSON.stringify(freshUser));
      })
      .catch((err) => {
        // A 401 is already handled by the unauthorizedHandler above (it
        // clears storage + shows a toast). Anything else here means the
        // backend itself was unreachable — don't log the user out for that,
        // since their session may still be perfectly valid.
        if (err.status !== 401) {
          toast.error('Could not reach the server — check that the backend is running.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (token, userObj) => {
    if (!token || !userObj) {
      // Defensive guard: never write a broken session to storage. This is
      // the exact bug that caused "persistSession called with invalid
      // data" — register() no longer returns a token (the account isn't
      // usable until the OTP is verified), so register() must NOT call
      // this. Only login() and verifyEmail() should ever reach here.
      console.error('persistSession called with invalid data:', { token, userObj });
      return;
    }
    sessionStorage.setItem('aqb_token', token);
    sessionStorage.setItem('aqb_user', JSON.stringify(userObj));
    setUser(userObj);
  };

  const login = useCallback(async (credentials) => {
    const { token, user: userObj } = await authService.login(credentials);
    persistSession(token, userObj);
    return userObj;
  }, []);

  // Registration only creates the account and triggers an OTP email — it
  // does NOT log the user in. No token is returned by the backend at this
  // stage, so nothing is persisted here. The caller (Register page) is
  // expected to navigate to /verify-email with the email address.
  const register = useCallback(async (payload) => {
    const res = await authService.register(payload);
    return res; // { success, message }
  }, []);

  // Completes registration: verifies the OTP and, on success, the backend
  // returns a real token + user — this is the step that actually logs
  // the person in for the first time.
  const verifyEmail = useCallback(async (payload) => {
    const { token, user: userObj } = await authService.verifyEmail(payload);
    persistSession(token, userObj);
    return userObj;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const { user: userObj } = await authService.updateMe(payload);
    sessionStorage.setItem('aqb_user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  }, []);

  const forgotPassword = useCallback(async (payload) => authService.forgotPassword(payload), []);
  const verifyResetOTP = useCallback(async (payload) => authService.verifyOTP(payload), []);
  const resetPassword = useCallback(async (payload) => authService.resetPassword(payload), []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyEmail,
        forgotPassword,
        verifyResetOTP,
        resetPassword,
        logout,
        updateProfile,
      }}
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