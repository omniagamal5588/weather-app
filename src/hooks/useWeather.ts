'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCity } from '@/store/weather/weatherSlice';
import { fetchWeatherData } from '@/store/weather/weatherActions';
import { toast } from 'react-toastify';

const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

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

        const data = await res.json();
        const uniqueCities = new Set<string>();
        
        data.forEach((item: any) => {
          if (item.name && item.country) {
            uniqueCities.add(`${item.name}, ${item.country}`);
          }
        });

        setSuggestions(Array.from(uniqueCities));
      } catch (err: any) {
        if (err.name !== 'AbortError') {
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
      await dispatch(fetchWeatherData(cityName));
      toast.success(`Weather data loaded for ${cityName}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } catch (error) {
      toast.error(`City "${cityName}" not found! Please try another name.`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
    setSuggestions([]);
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