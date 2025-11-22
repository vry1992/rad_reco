import {
  createAction,
  createListenerMiddleware,
  type UnknownAction,
} from '@reduxjs/toolkit';
import { UnauthorizedError } from '../errors.helper';
import { isInstanceOf } from '../utils';
import { useActionCreators, type RootState } from './types';

export const listenerMiddleware = createListenerMiddleware<RootState>();

export const errorAction = createAction<unknown, 'error'>('error');

listenerMiddleware.startListening({
  actionCreator: errorAction,
  effect: async (action: UnknownAction) => {
    const error = action.payload;
    if (!isInstanceOf(error, UnauthorizedError)) {
      alert(action.payload.message);
    }
  },
});

export const useErrorActionCreators = () => {
  const errorActions = useActionCreators({ error: errorAction });
  return errorActions;
};
