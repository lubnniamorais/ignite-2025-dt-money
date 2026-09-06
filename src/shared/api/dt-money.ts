import axios from 'axios';
import { Platform } from 'react-native';

// Teremos duas URLs de acordo com o sistema operacional, durante o desenvolvimento
const baseURL = Platform.select({
  ios: 'http://localhost:3333',
  android: 'http://192.168.100.117:3333',
});

export const api = axios.create({
  baseURL,
});
