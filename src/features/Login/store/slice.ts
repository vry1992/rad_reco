import { createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from '../../../store/helpers';
import {
  StateStatus,
  useActionCreators,
  type RootState,
} from '../../../store/types';
import { loginThunks } from './thunk';

export interface LoginState {
  me: {
    id: string | null;
    name: string | null;
    isAuthenticated: boolean;
  };
  status: StateStatus;
}

const defaultState = {
  me: {
    id: null,
    name: null,
    isAuthenticated: false,
  },
  status: StateStatus.INIT,
};

const initialState: LoginState = defaultState;

export const counterSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loginThunks.login.pending, (state) => {
      state.status = StateStatus.LOADING;
    });
    builder.addCase(loginThunks.login.rejected, (state) => {
      state.status = StateStatus.ERROR;
      state.me = defaultState.me;
    });
    builder.addCase(loginThunks.login.fulfilled, (state, { payload }) => {
      state.status = StateStatus.SUCCESS;
      state.me = {
        ...payload.user,
        isAuthenticated: !!payload.token,
      };
    });
    builder.addCase(loginThunks.me.pending, (state) => {
      state.status = StateStatus.LOADING;
    });
    builder.addCase(loginThunks.me.rejected, (state) => {
      state.status = StateStatus.ERROR;
      state.me = defaultState.me;
    });
    builder.addCase(loginThunks.me.fulfilled, (state, { payload }) => {
      state.status = StateStatus.SUCCESS;
      state.me = {
        ...payload.user,
        isAuthenticated: !!payload.token,
      };
    });
  },
});

const loginActions = {
  ...counterSlice.actions,
  ...loginThunks,
};

export const loginReducer = counterSlice.reducer;

export const useLoginActionCreators = () => {
  return useActionCreators(loginActions);
};

export const useLoginSelectors = () => {
  const select = (state: RootState) => state.login;
  return useAppSelector(select);
};
