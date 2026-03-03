import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client';

const tokenFromStorage = localStorage.getItem('authToken');
const userFromStorage = localStorage.getItem('authUser');

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: tokenFromStorage || null,
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('authUser', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

