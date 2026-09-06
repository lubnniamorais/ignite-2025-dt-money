import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

import { FormLoginParams } from '@/screens/Login/LoginForm';
import { RegisterFormParams } from '@/screens/Register/RegisterForm';

import * as authService from '@/shared/services/dt-money/auth.service';
import { IUser } from '@/shared/interfaces/user-interface';

type AuthContextType = {
  user: IUser | null;
  token: string | null;
  handleAuthenticate: (params: FormLoginParams) => Promise<void>;
  handleRegister: (params: RegisterFormParams) => Promise<void>;
  handleLogout: () => void;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleAuthenticate = async ({ email, password }: FormLoginParams) => {
    const { user, token } = await authService.authenticate({ email, password });

    setUser(user);
    setToken(token);
  };

  const handleRegister = async ({
    email,
    name,
    password,
  }: RegisterFormParams) => {};

  const handleLogout = () => {};

  return (
    <AuthContext.Provider
      value={{
        handleAuthenticate,
        handleRegister,
        handleLogout,
        user,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within a AuthContextProvider');
  }

  return context;
};
