import { api } from '@/shared/api/dt-money';
import { IAuthenticateResponse } from '@/shared/interfaces/https/authenticate-response';

import { FormLoginParams } from '@/screens/Login/LoginForm';
import { FormRegisterParams } from '@/screens/Register/RegisterForm';

export const authenticate = async ({
  email,
  password,
}: FormLoginParams): Promise<IAuthenticateResponse> => {
  const response = await api.post<IAuthenticateResponse>('/auth/login', {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async ({
  name,
  email,
  password,
  confirmPassword,
}: FormRegisterParams): Promise<IAuthenticateResponse> => {
  const response = await api.post<IAuthenticateResponse>('/auth/register', {
    name,
    email,
    password,
    confirmPassword,
  });

  return response.data;
};
