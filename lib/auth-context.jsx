'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUser, getToken, setUser as saveUserToStorage, clearUser as removeUserFromStorage } from './auth';

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  isHelper: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUser();
    const storedToken = getToken();
    if (storedUser) setUserState(storedUser);
    if (storedToken) setTokenState(storedToken);
    setIsLoading(false);
  }, []);

  const login = useCallback((userData, authToken) => {
    saveUserToStorage(userData, authToken);
    const updatedUser = getUser();
    setUserState(updatedUser);
    if (authToken) setTokenState(authToken);
  }, []);

  const logout = useCallback(() => {
    removeUserFromStorage();
    setUserState(null);
    setTokenState(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUserState((prev) => {
      const merged = { ...prev, ...updatedData };
      saveUserToStorage(merged, getToken());
      return merged;
    });
  }, []);

  const isAuthenticated = Boolean(user && (user.id || user._id));
  const isHelper = user?.role === 'helper' || user?.accountType === 'helper';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isHelper,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
