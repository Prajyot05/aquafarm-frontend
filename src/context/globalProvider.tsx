import { User } from '@/types/user';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextProps {
  userInfo: User;
  setUserInfo: (userInfo: User) => void;
  clearUserInfo: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userInfo, setUserInfoState] = useState<User>(null);

  const setUserInfo = (userInfo: User) => {
    setUserInfoState(userInfo);
  };

  const clearUserInfo = () => {
    setUserInfoState(null);
  };

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, clearUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};