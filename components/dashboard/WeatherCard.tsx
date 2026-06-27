'use client';

import React from 'react';
import { Cloud, Wind, Droplets, Thermometer, ArrowUpRight } from 'lucide-react';

export default function WeatherCard() {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Training Conditions</h3>
          <p className="text-slate-400 text-xs sm:text-sm">Current weather at your location</p>
        </div>
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" aria-hidden="true" />
        </div>
      </div>

      {/* Main Weather Info */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <div className="text-3xl sm:text-4xl font-bold text-white mb-1">24°C</div>
          <div className="text-slate-400 text-sm">Partly Cloudy</div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-xs sm:text-sm">Wind Speed</div>
          <div className="text-white font-semibold text-base sm:text-lg">12 km/h</div>
        </div>
      </div>

      {/* Weather Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-slate-800/30 rounded-xl p-3 sm:p-4 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-400 text-xs sm:text-sm">Wind Direction</span>
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">NE</div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-3 sm:p-4 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-400 text-xs sm:text-sm">Humidity</span>
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">65%</div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-3 sm:p-4 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-400 text-xs sm:text-sm">Feels Like</span>
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">26°C</div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-3 sm:p-4 hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <Cloud className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" aria-hidden="true" />
            <span className="text-slate-400 text-xs sm:text-sm">Visibility</span>
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">10 km</div>
        </div>
      </div>

      {/* Training Recommendation */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-xl p-3 sm:p-4 border border-emerald-500/20">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <div className="text-emerald-400 font-semibold text-xs sm:text-sm mb-1">Ideal Conditions</div>
            <div className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Perfect weather for outdoor training. Low wind and moderate humidity.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
