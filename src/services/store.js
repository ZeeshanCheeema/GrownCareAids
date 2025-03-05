import {configureStore} from '@reduxjs/toolkit';
// import {authApi} from './Auth/AuthApi';
// import {campaignApi} from './Campaign/CampaignApi';
// import authReducer from '../services/Auth/AuthReducer';

// const store = configureStore({
//   reducer: {
//     [authApi.reducerPath]: authApi.reducer,
//     [campaignApi.reducerPath]: campaignApi.reducer,
//     auth: authReducer,
//   },
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware().concat(authApi.middleware, campaignApi.middleware),
// });

// export default store;
// //import { configureStore } from "@reduxjs/toolkit";
import {apiSlice} from './Auth/AuthApi';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in development
});

export default store;
