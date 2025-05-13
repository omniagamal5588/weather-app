// src/store/weather/weatherActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';

const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

interface WeatherResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

export type WeatherDataPayload = {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
};

export const fetchWeatherData = createAsyncThunk<
  WeatherDataPayload,
  string,
  { rejectValue: string }
>(
  'weather/fetchWeatherData',
  async (city: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch weather data');
      }

      const data: WeatherResponse = await response.json();
      
      return {
        city: data.name,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);