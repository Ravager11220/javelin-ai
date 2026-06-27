'use client';

import React from 'react';
import { Trophy, MapPin, Target, Clock } from 'lucide-react';

export default function CompetitionCard() {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Next Competition</h3>
            <p className="text-slate-400 text-xs sm:text-sm">National Championship</p>
          </div>
        </div>
        <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Registered
        </span>
      </div>

      {/* Countdown */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-amber-500/20">
        <div className="text-center">
          <div className="text-slate-400 text-xs sm:text-sm mb-2">Days Until Competition</div>
          <div className="text-3xl sm:text-4xl font-bold text-white mb-1">14</div>
          <div className="text-amber-400 text-xs sm:text-sm">June 15, 2026</div>
        </div>
      </div>

      {/* Competition Details */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-slate-400 text-xs sm:text-sm">Venue</div>
            <div className="text-white font-medium text-sm sm:text-base truncate">Olympic Stadium, Berlin</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-slate-400 text-xs sm:text-sm">Goal Distance</div>
            <div className="text-white font-medium text-sm sm:text-base">85m (Qualification)</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-slate-400 text-xs sm:text-sm">Event Time</div>
            <div className="text-white font-medium text-sm sm:text-base">10:30 AM Local</div>
          </div>
        </div>
      </div>

      {/* Progress to Goal */}
      <div className="bg-slate-800/30 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs sm:text-sm">Current Best vs Goal</span>
          <span className="text-white font-semibold text-sm sm:text-base">84.2m / 85m</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-1.5 sm:h-2 mb-2" role="progressbar" aria-valuenow={99} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to goal">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
            style={{ width: '99%' }}
          />
        </div>
        <div className="text-emerald-400 text-xs sm:text-sm font-semibold">
          Only 0.8m to go! You're almost there.
        </div>
      </div>
    </div>
  );
}
