'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

const WeatherCard: React.FC<{ data: WeatherData }> = ({ data }) => {
  const { theme } = useTheme();
  return (
    <div className={`p-8 rounded-2xl shadow-2xl border transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-cyan-700 to-blue-800 border-white/20'
        : 'bg-gradient-to-br from-cyan-400 to-blue-500 border-gray-200'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white">{data.city}</h2>
          <p className="text-6xl font-extrabold text-white my-4">{data.temperature}°C</p>
          <p className="text-xl text-white/90 capitalize">{data.description}</p>
        </div>
        {data.icon && (
          <Image
            src={`https://openweathermap.org/img/wn/${data.icon}@4x.png`} 
            alt={data.description}
            width={96}  
            height={96} 
            className="w-24 h-24 animate-pulse"
            unoptimized 
          />
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm order-1">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm sm:text-base">💧 Humidity</span>
            <span className="text-white font-bold text-sm sm:text-base">{data.humidity}%</span>
          </div>
        </div>

        <div className="bg-white/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm order-2">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm sm:text-base">💨 Wind</span>
            <span className="text-white font-bold text-sm sm:text-base">{data.windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;