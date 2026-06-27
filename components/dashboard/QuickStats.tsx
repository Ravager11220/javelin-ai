'use client';

import React from 'react';
import { TrendingUp, Calendar, Flame, Target } from 'lucide-react';

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {/* Best Throw */}
      <div className="group relative bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-4 sm:p-6 hover:border-purple-500/40 focus-within:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 focus-within:shadow-lg focus-within:shadow-purple-500/10 focus-within:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" aria-hidden="true" />
            </div>
            <span className="text-green-400 text-xs sm:text-sm font-semibold flex items-center" aria-label="Increased by 2.1%">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" aria-hidden="true" />
              +2.1%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">84.2m</div>
          <div className="text-slate-400 text-xs sm:text-sm">Best Throw</div>
        </div>
      </div>

      {/* Average Distance */}
      <div className="group relative bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-4 sm:p-6 hover:border-blue-500/40 focus-within:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 focus-within:shadow-lg focus-within:shadow-blue-500/10 focus-within:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" aria-hidden="true" />
            </div>
            <span className="text-green-400 text-xs sm:text-sm font-semibold flex items-center" aria-label="Increased by 1.4%">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" aria-hidden="true" />
              +1.4%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">78.6m</div>
          <div className="text-slate-400 text-xs sm:text-sm">Average Distance</div>
        </div>
      </div>

      {/* Weekly Sessions */}
      <div className="group relative bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-4 sm:p-6 hover:border-emerald-500/40 focus-within:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 focus-within:shadow-lg focus-within:shadow-emerald-500/10 focus-within:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" aria-hidden="true" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">6</div>
          <div className="text-slate-400 text-xs sm:text-sm">This Week</div>
        </div>
      </div>

      {/* Training Streak */}
      <div className="group relative bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-4 sm:p-6 hover:border-amber-500/40 focus-within:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 focus-within:shadow-lg focus-within:shadow-amber-500/10 focus-within:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" aria-hidden="true" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">28 Days</div>
          <div className="text-slate-400 text-xs sm:text-sm">Keep Going!</div>
        </div>
      </div>
    </div>
  );
}
