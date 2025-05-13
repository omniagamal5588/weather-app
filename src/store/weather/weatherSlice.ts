import { createSlice } from '@reduxjs/toolkit';
import { fetchWeatherData } from './weatherActions';
import { WeatherDataPayload } from './weatherActions';

interface WeatherState {
  city: string;
  loading: boolean;
  error: string | null;
  data: WeatherDataPayload | null;
}

const initialState: WeatherState = {
  city: '',
  loading: false,
  error: null,
  data: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCity: (state, action) => {
      state.city = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = null;
      });
  },
});

export const { setCity, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;