import React, { createContext, useEffect, useMemo, useState } from 'react';
import { apiLogin, setupAuthInterceptors } from '../api/axiosInstance.js';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'ridesync_token';
const USER_KEY = 'ridesync_user';

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function decodeJwtPayload(token) {
  // Basic JWT payload decode (no verification). Useful for UI only.
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(normalized);
    return safeParseJson(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [user, setUser] = useState(() => safeParseJson(localStorage.getItem(USER_KEY)) || null);
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    setupAuthInterceptors({
      getToken: () => localStorage.getItem(STORAGE_KEY),
      onUnauthorized: () => {
        // Token expired/invalid -> hard logout
        logout();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  async function login(email, password) {
    const data = await apiLogin({ email, password });

    const receivedToken = data?.accessToken || data?.token || data?.jwt || '';
    if (!receivedToken) {
      throw new Error('Login succeeded but token not found in response');
    }

    setToken(receivedToken);

    // Prefer server-provided user info; otherwise decode from JWT payload
    const role = data?.role || null;
    const name = data?.name || null;
    const decoded = decodeJwtPayload(receivedToken);
    const emailFromToken = decoded?.sub || decoded?.email || email;

    const userData = {
      name: name || emailFromToken,
      email: data?.email || emailFromToken,
      role: role || decoded?.roles || null
    };
    
    setUser(userData);

    return { ...data, ...userData };
  }

  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      logout
    }),
    [token, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
