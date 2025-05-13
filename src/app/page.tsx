'use client';
import React  from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWeather } from '@/hooks/useWeather';
import SearchBar from '@/_components/SearchBar';
import CitySuggestions from '@/_components/CitySuggestions';
import WeatherCard from '@/_components/WeatherCard';
import { useTheme } from '@/context/ThemeContext';

export default function Home() {
  const {
    city,
    loading,
    data,
    suggestions,
    loadingSuggestions,
    handleSearchChange,
    handleCitySelect
  } = useWeather();
  const { theme, toggleTheme } = useTheme();

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100'
    } p-6 md:p-12`}>
    
    <button 
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/20 backdrop-blur-md shadow-lg"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className={`max-w-2xl mx-auto transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-white/10 border-white/20' 
          : 'bg-white/80 border-gray-200'
      } backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 border`}>
       
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 border border-white/20">
       
        <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            ☀️ WeatherApp
          </span>
        </h1>
        
        <div className="relative">
          <SearchBar value={city} onChange={handleSearchChange} />
          <CitySuggestions
            suggestions={suggestions}
            loading={loadingSuggestions}
            onSelect={handleCitySelect}
          />
        </div>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : data ? (
          <WeatherCard data={data} />
        ) : (
          <div className="text-center">
            <p className="text-black/70 mb-4">🔍 Search for a city to discover the weather</p>
            <div className="inline-block animate-bounce">👇</div>
          </div>
        )}
      </div>

      
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
         
          overflow: "hidden",
          scrollbarWidth: "none" 
        }}
        toastStyle={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      />
      </div>
    </main>
  );
}