import { configureStore } from '@reduxjs/toolkit';
import { loginReducer } from '../features/Login/store/slice';
import { listenerMiddleware } from './listener';

export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(listenerMiddleware.middleware),
});
