'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function PerformanceChart() {
  const chartData = [
    { day: 'Mon', value: 72 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 75 },
    { day: 'Thu', value: 82 },
    { day: 'Fri', value: 79 },
    { day: 'Sat', value: 84 },
    { day: 'Sun', value: 81 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Performance Overview</h3>
          <p className="text-slate-400 text-xs sm:text-sm">Throw distance over the week</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            aria-label="View weekly data"
            aria-pressed="true"
            className="px-3 py-1.5 text-sm rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            Week
          </button>
          <button 
            aria-label="View monthly data"
            className="px-3 py-1.5 text-sm rounded-lg text-slate-400 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
          >
            Month
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-48 sm:h-64 bg-slate-800/30 rounded-xl p-3 sm:p-4">
        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none px-3 sm:px-4 py-3 sm:py-4" aria-hidden="true">
          <div className="border-t border-slate-700/30 absolute top-1/4 left-0 right-0" />
          <div className="border-t border-slate-700/30 absolute top-2/4 left-0 right-0" />
          <div className="border-t border-slate-700/30 absolute top-3/4 left-0 right-0" />
        </div>

        {/* Bars */}
        <div className="relative h-full flex items-end justify-between px-1 sm:px-2">
          {chartData.map((data, index) => {
            const height = (data.value / maxValue) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1 mx-0.5 sm:mx-1">
                <div
                  className="w-full max-w-8 sm:max-w-12 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-lg transition-all duration-300 hover:from-purple-400 hover:to-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  style={{ height: `${height}%` }}
                  role="img"
                  aria-label={`${data.day}: ${data.value} meters`}
                  tabIndex={0}
                />
                <span className="text-xs text-slate-400 mt-1 sm:mt-2">{data.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">82.4m</div>
          <div className="text-xs text-slate-400">Average</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">84m</div>
          <div className="text-xs text-slate-400">Best</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-1" aria-hidden="true" />
            +12%
          </div>
          <div className="text-xs text-slate-400">Improvement</div>
        </div>
      </div>
    </div>
  );
}
