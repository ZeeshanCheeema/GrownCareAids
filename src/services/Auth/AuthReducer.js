import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
  name: 'login',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;

      // Store Access Token
      AsyncStorage.setItem('accessToken', action.payload.token);
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('accessToken');
    },
  },
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;
