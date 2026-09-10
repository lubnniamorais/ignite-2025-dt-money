import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FormLoginParams } from '@/screens/Login/LoginForm';
import { FormRegisterParams } from '@/screens/Register/RegisterForm';

import * as authService from '@/shared/services/dt-money/auth.service';
import { IUser } from '@/shared/interfaces/user-interface';
import { IAuthenticateResponse } from '@/shared/interfaces/https/authenticate-response';

type AuthContextType = {
  user: IUser | null;
  token: string | null;
  handleAuthenticate: (params: FormLoginParams) => Promise<void>;
  handleRegister: (params: FormRegisterParams) => Promise<void>;
  handleLogout: () => void;
  restoreUserSession: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleAuthenticate = async ({ email, password }: FormLoginParams) => {
    const { user, token } = await authService.authenticate({ email, password });

    await AsyncStorage.setItem(
      'dt-money-user',
      JSON.stringify({ user, token })
    );

    setUser(user);
    setToken(token);
  };

  const handleRegister = async ({
    email,
    name,
    password,
    confirmPassword,
  }: FormRegisterParams) => {
    const { user, token } = await authService.registerUser({
      email,
      name,
      password,
      confirmPassword,
    });

    await AsyncStorage.setItem(
      'dt-money-user',
      JSON.stringify({ user, token })
    );

    setUser(user);
    setToken(token);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();

    setUser(null);
    setToken(null);
  };

  const restoreUserSession = async () => {
    const userSession = await AsyncStorage.getItem('dt-money-user');

    if (userSession) {
      const { user, token } = JSON.parse(userSession) as IAuthenticateResponse;

      setUser(user);
      setToken(token);
    }

    return userSession;
  };

  return (
    <AuthContext.Provider
      value={{
        handleAuthenticate,
        handleRegister,
        handleLogout,
        restoreUserSession,
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
