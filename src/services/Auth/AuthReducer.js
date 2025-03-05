import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
  name: 'login',
  initialState: {
    user: null,
    token: null,
    fcmToken: null,
    isAuthenticated: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;

      // Store Access Token
      AsyncStorage.setItem('accessToken', action.payload.token);

      // Store FCM Token if it exists

      AsyncStorage.setItem('fcmToken', action.payload.fcmToken);
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.fcmToken = null;
      state.isAuthenticated = false;

      // Remove tokens from storage
      AsyncStorage.removeItem('fcmToken');
      AsyncStorage.removeItem('accessToken');
    },
  },
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;
