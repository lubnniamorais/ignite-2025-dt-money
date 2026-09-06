import { api } from '@/shared/api/dt-money';
import { IAuthenticateResponse } from '@/shared/interfaces/https/authenticate-response';

import { FormLoginParams } from '@/screens/Login/LoginForm';

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
