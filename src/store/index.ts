import { configureStore } from '@reduxjs/toolkit';
import authentication from './authenticationSlice';

export const store = configureStore({
  reducer: {
    authentication
  },
});

export type RootState = ReturnType<typeof store.getState>;
