'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
 
}) => {
  const { theme } = useTheme();
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search for a city..."
      className={`w-full px-5 py-4 rounded-xl transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-white/20 text-white placeholder-white/50 border-white/30'
          : 'bg-white/90 text-gray-800 placeholder-gray-500 border-gray-300'
      } border focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent shadow-lg`}
    />
  );
};

export default SearchBar;