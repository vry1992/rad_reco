import { api } from '../../../services/api';
import type { LoginPayload, LoginResponse } from '../types';

const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return await api.post('/user/login', payload);
};

const me = async (): Promise<LoginResponse> => {
  return await api.get('/user/me');
};

export const LoginService = { login, me };
