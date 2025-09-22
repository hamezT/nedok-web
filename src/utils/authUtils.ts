// Utility functions for handling authentication
import { getCookie, removeCookie, clearLocalStorageAuthData } from './cookieUtils';
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const clearAuthData = (): void => {
  // Clear cookies
  removeCookie('accessToken', { path: '/' });
  removeCookie('refreshToken', { path: '/' });

  // Clear old localStorage data (for migration)
  clearLocalStorageAuthData();
};

export const getStoredToken = (): string | null => {
  return getCookie('accessToken');
};

export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  return token !== null && !isTokenExpired(token);
};

export const handleAuthError = (error: any): boolean => {
  // Check if it's a 401 error (Unauthorized) or token expired
  if (error?.status === 401 || error?.message?.includes('401') ||
      error?.message?.includes('Unauthorized') || error?.message?.includes('Token expired')) {
    clearAuthData();
    return true; // Token expired, need redirect to login
  }
  return false; // Not an auth error
};
