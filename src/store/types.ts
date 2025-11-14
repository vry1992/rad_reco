import {
  bindActionCreators,
  type ActionCreator,
  type ActionCreatorsMapObject,
  type AsyncThunk,
} from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useAppDispatch } from './helpers';
import type { store } from './store';
export enum StateStatus {
  INIT,
  LOADING,
  SUCCESS,
  ERROR,
}
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

type BoundAsyncThunk<Action extends ActionCreator<any>> = (
  ...args: Parameters<Action>
) => ReturnType<ReturnType<Action>>;

type BoundActions<Actions extends ActionCreatorsMapObject> = {
  [key in keyof Actions]: Actions[key] extends AsyncThunk<any, any, any>
    ? BoundAsyncThunk<Actions[key]>
    : Actions[key];
};

export const useActionCreators = <
  Actions extends ActionCreatorsMapObject = ActionCreatorsMapObject
>(
  actions: Actions
): BoundActions<Actions> => {
  const dispatch = useAppDispatch();

  return useMemo(() => bindActionCreators(actions, dispatch), []);
};
