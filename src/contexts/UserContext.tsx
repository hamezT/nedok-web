import React, { useState, ReactNode, useCallback } from 'react';
import { getUserInfo, UserInfo } from '../services/authService';
import { UserContext } from '../hooks/useUserContext';
import { clearAuthData, isTokenExpired, getStoredToken } from '../utils/authUtils';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  const logout = useCallback(() => {
    clearAuthData();
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    // If user data already exists, don't call API again
    if (user !== null) {
      return;
    }

    try {
      const token = getStoredToken();
      if (!token || isTokenExpired(token)) {
        logout();
        return;
      }

      const userInfo = await getUserInfo();
      setUser(userInfo);
    } catch (error: unknown) {
      console.error('Error fetching user information:', error);

      // Check if it's an auth error (401, token expired)
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401') ||
          errorMessage.includes('Unauthorized') ||
          errorMessage.includes('Token expired')) {
        logout();
        return;
      }

      setUser(null);
    }
  }, [user, logout]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
