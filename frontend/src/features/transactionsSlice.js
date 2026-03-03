import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client';

export const fetchInitialData = createAsyncThunk(
  'transactions/fetchInitial',
  async (_, { rejectWithValue }) => {
    try {
      const [transactionsRes, trendRes] = await Promise.all([
        api.get('/transactions?limit=100'),
        api.get('/transactions/risk-trend?sinceMinutes=60'),
      ]);

      return {
        transactions: transactionsRes.data,
        trend: trendRes.data,
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Failed to load initial transaction data.';
      return rejectWithValue(message);
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    trend: [],
    highRiskAlerts: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addTransaction(state, action) {
      state.items.unshift(action.payload);
      if (state.items.length > 200) {
        state.items.pop();
      }
    },
    addHighRiskAlert(state, action) {
      state.highRiskAlerts.unshift(action.payload);
      if (state.highRiskAlerts.length > 20) {
        state.highRiskAlerts.pop();
      }
    },
    setTrend(state, action) {
      state.trend = action.payload;
    },
    clearDataOnLogout(state) {
      state.items = [];
      state.trend = [];
      state.highRiskAlerts = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.transactions;
        state.trend = action.payload.trend;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load data';
      });
  },
});

export const {
    addTransaction,
    addHighRiskAlert,
    setTrend,
    clearDataOnLogout,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;

