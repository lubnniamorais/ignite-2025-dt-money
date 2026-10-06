import axios from 'axios';
import { Platform } from 'react-native';
import { AppError } from '../helpers/AppError';
import { addTokenToRequest } from '../helpers/axios.helper';

// Teremos duas URLs de acordo com o sistema operacional, durante o desenvolvimento
const baseURL = Platform.select({
  ios: 'http://localhost:3333',
  android: 'http://192.168.100.117:3333',
});

export const api = axios.create({
  baseURL,
});

addTokenToRequest(api);

api.interceptors.response.use(
  (config) => config,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.message));
    } else {
      return Promise.reject(new AppError('Falha na requisição'));
    }
  }
);
