import { createContext, useContext } from 'react';
import { UserInfo } from '../services/authService';

export interface UserContextType {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
