import {configureStore} from '@reduxjs/toolkit';
import {apiSlice} from './Auth/AuthApi';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables warnings related to non-serializable values
      immutableCheck: false, // Disables warnings related to state immutability
    }).concat(apiSlice.middleware),
});

export default store;
