import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserInfo = {
  id: string;
  username: string;
  emailId?: string;
  phone: string;
  role: string;
} | null;

interface UserContextProps {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
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
  const [userInfo, setUserInfoState] = useState<UserInfo>(null);

  const setUserInfo = (userInfo: UserInfo) => {
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