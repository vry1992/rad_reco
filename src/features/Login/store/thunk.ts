import { createAsyncThunk } from '@reduxjs/toolkit';
import { STORAGE_AUTH_TOKEN_KEY } from '../constants';
import { LoginService } from '../services/login.service';
import type { LoginPayload, LoginResponse } from '../types';

const loginThunk = createAsyncThunk<LoginResponse, LoginPayload>(
  'login/auth',
  async (payload) => {
    const response = await LoginService.login(payload);
    if (response.token) {
      sessionStorage.setItem(STORAGE_AUTH_TOKEN_KEY, response.token);
    }
    return response;
  }
);

const meThunk = createAsyncThunk<LoginResponse>('login/me', async () => {
  const response = await LoginService.me();
  if (response.token) {
    sessionStorage.setItem(STORAGE_AUTH_TOKEN_KEY, response.token);
  }
  return response;
});

export const loginThunks = {
  login: loginThunk,
  me: meThunk,
};
