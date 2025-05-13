'use client';
import React from 'react';

interface CitySuggestionsProps {
  suggestions: string[];
  loading: boolean;
  onSelect: (city: string) => void;
}

const CitySuggestions: React.FC<CitySuggestionsProps> = ({ 
  suggestions, 
  loading, 
  onSelect 
}) => {
  if (loading) {
    return (
      <ul className="absolute z-10 w-full mt-2 bg-white/20 backdrop-blur-md rounded-xl shadow-xl border border-white/20">
        <li className="px-5 py-3 text-white/80 flex items-center">
          <div className="animate-pulse mr-3">🔍</div>
          Searching...
        </li>
      </ul>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <ul className="absolute z-10 w-full mt-2 bg-white/20 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/20">
      {suggestions.map((city, index) => (
        <li
          key={index}
          onClick={() => onSelect(city)}
          className="px-5 py-3 text-black hover:bg-white/30 cursor-pointer 
                    transition-all duration-200 flex items-center"
        >
          <span className="mr-2">📍</span>
          {city}
        </li>
      ))}
    </ul>
  );
};

export default CitySuggestions;