import axios from 'axios';
import { handleError } from '../errors.helper';
import { STORAGE_AUTH_TOKEN_KEY } from '../features/Login/constants';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem(STORAGE_AUTH_TOKEN_KEY);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(handleError(error));
  }
);
