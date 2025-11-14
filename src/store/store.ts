import { configureStore } from '@reduxjs/toolkit';
import { loginReducer } from '../features/Login/store/slice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});
