'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCity } from '@/store/weather/weatherSlice';
import { fetchWeatherData } from '@/store/weather/weatherActions';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat?: number;
  lon?: number;
}

export function useWeather() {
  const dispatch = useDispatch();
  const { city, loading, error, data } = useSelector((state: RootState) => state.weather);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    if (city.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${apiKey}`,
          { signal: abortController.signal }
        );

        if (!res.ok) throw new Error('Failed to fetch suggestions');

        const data: CitySuggestion[] = await res.json();
        const uniqueCities = new Set<string>();
        
        data.forEach((item) => {
          if (item.name && item.country) {
            uniqueCities.add(`${item.name}, ${item.country}`);
          }
        });

        setSuggestions(Array.from(uniqueCities));
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error(err.message);
          setSuggestions([]);
        }
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 500);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [city]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCity(e.target.value));
  };

  const handleCitySelect = async (selectedCity: string) => {
    const cityName = selectedCity.split(',')[0].trim();
    dispatch(setCity(cityName));
    try {
      const result = await dispatch(fetchWeatherData(cityName)).unwrap();
      toast.success(`Weather data loaded for ${cityName}`, {
        position: "top-right",
        autoClose: 5000,
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to load data for "${cityName}": ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
      throw error;
    } finally {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  return {
    city,
    loading,
    error,
    data,
    suggestions,
    loadingSuggestions,
    handleSearchChange,
    handleCitySelect
  };
}