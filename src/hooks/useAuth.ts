import { useEffect, useState } from 'react';
import { useUser } from './useUserContext';
import { isAuthenticated, clearAuthData } from '../utils/authUtils';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, fetchUser, logout } = useUser();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          // Fetch user info in background if not already loaded
          if (!user) {
            // Don't await fetchUser to avoid blocking the UI
            fetchUser().catch(error => {
              console.error('Error fetching user info:', error);
              // If fetch fails, clear auth and redirect
              if (isMounted) {
                clearAuthData();
                window.location.href = '/login';
              }
            });
          }
          // Always allow access when authenticated, regardless of user data loading status
        } else {
          if (isMounted) {
            clearAuthData();
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        if (isMounted) {
          clearAuthData();
          window.location.href = '/login';
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [user, fetchUser]);

  const handleLogout = () => {
    logout();
    // Use window.location to force a full page reload
    window.location.href = '/login';
  };

  return {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    logout: handleLogout,
  };
};
