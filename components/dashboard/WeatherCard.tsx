'use client';

import React, { useEffect, useState } from 'react';
import { Cloud, Wind, Droplets, Thermometer, ArrowUpRight } from 'lucide-react';
interface WeatherData {
  name: string;
  weather: {
    main: string;
    description: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
}
function getWindDirection(deg: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
}
function getTrainingAdvice(weather: WeatherData | null) {
  if (!weather) {
    return {
      title: "Loading...",
      advice: "Fetching weather conditions..."
    };
  }

  const wind = weather.wind.speed * 3.6;
  const condition = weather.weather[0].main.toLowerCase();
  const temp = weather.main.temp;

  if (condition.includes("rain")) {
    return {
      title: "Rain Alert",
      advice: "Rain detected. Focus on indoor strength, mobility, or technique drills."
    };
  }

  if (wind > 25) {
    return {
      title: "Strong Wind",
      advice: "Strong winds today. Practice release angle and throwing accuracy instead of maximum distance."
    };
  }

  if (temp > 35) {
    return {
      title: "High Temperature",
      advice: "Hot conditions. Stay hydrated and reduce training intensity."
    };
  }

  return {
    title: "Ideal Conditions",
    advice: "Perfect weather for outdoor training. Great day to chase a personal best!"
  };
}
export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const recommendation = getTrainingAdvice(weather);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Weather fetch failed:', error);
      }
    }

    fetchWeather();
  }, []);
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Training Conditions</h3>
          <p className="text-slate-400 text-xs sm:text-sm">
  📍 {weather ? weather.name : "Loading..."}
</p>
        </div>
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" aria-hidden="true" />
        </div>
      </div>

      {/* Main Weather Info */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{weather ? `${Math.round(weather.main.temp)}°C` : '--°C'}</div>
          <div className="text-slate-400 text-sm">{weather ? weather.weather[0].description : 'Loading...'}</div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-xs sm:text-sm">Wind Speed</div>
          <div className="text-white font-semibold text-base sm:text-lg">{weather ? `${(weather.wind.speed * 3.6).toFixed(1)} km/h` : '--'}</div>
        </div>
      </div>

      {/* Weather Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-slate-800/30 rounded-xl p-3 sm:p-4 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-400 text-xs sm:text-sm">Wind Direction</span>
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">
  {weather ? getWindDirection(weather.wind.deg) : '--'}
</div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-3 sm:p-4 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-400 text-xs sm:text-sm">Humidity</span>
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">{weather ? `${weather.main.humidity}%` : '--'}</div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-3 sm:p-4 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-400 text-xs sm:text-sm">Feels Like</span>
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">{weather ? `${Math.round(weather.main.feels_like)}°C` : '--°C'}</div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-3 sm:p-4 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <Cloud className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-400 text-xs sm:text-sm">Visibility</span>
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">{weather ? `${(weather.visibility / 1000).toFixed(1)} km` : '--'}</div>
        </div>
      </div>

      {/* Training Recommendation */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-xl p-3 sm:p-4 border border-emerald-500/20">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <div className="text-emerald-400 font-semibold text-xs sm:text-sm mb-1">{recommendation.title}</div>
          <div className="text-slate-300 text-xs sm:text-sm leading-relaxed">
  {recommendation.advice}
</div>
          </div>
        </div>
      </div>
    </div>
  );
}
