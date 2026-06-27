'use client';

import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TrainingCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const trainingDays = [2, 3, 5, 6, 9, 10, 12, 13, 16, 17, 19, 20, 23, 24, 26, 27];
  const restDays = [4, 11, 18, 25];
  const competitionDay = 15;

  const getDayType = (day: number) => {
    if (day === competitionDay) return 'competition';
    if (trainingDays.includes(day)) return 'training';
    if (restDays.includes(day)) return 'rest';
    return 'empty';
  };

  const getDayStyles = (day: number) => {
    const type = getDayType(day);
    switch (type) {
      case 'competition':
        return 'bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold';
      case 'training':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'rest':
        return 'bg-slate-700/30 text-slate-400';
      default:
        return 'bg-slate-800/30 text-slate-500 hover:bg-slate-700/30';
    }
  };

  const getDayLabel = (day: number) => {
    const type = getDayType(day);
    switch (type) {
      case 'competition':
        return 'Competition day';
      case 'training':
        return 'Training day';
      case 'rest':
        return 'Rest day';
      default:
        return 'No training scheduled';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Training Calendar</h3>
            <p className="text-slate-400 text-xs sm:text-sm">June 2026</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            aria-label="Previous month"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            aria-label="Next month"
            className="p-1.5 sm:p-2 rounded-lg bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-4 sm:mb-6">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-slate-400 text-xs sm:text-sm font-medium py-1.5 sm:py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day) => {
          const styles = getDayStyles(day);
          const label = getDayLabel(day);
          return (
            <button
              key={day}
              aria-label={`June ${day}: ${label}`}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                ${styles}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-3 sm:space-x-6 pt-3 sm:pt-4 border-t border-slate-700/30 flex-wrap gap-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-purple-500/20 border border-purple-500/30" aria-hidden="true" />
          <span className="text-slate-400 text-xs sm:text-sm">Training</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-slate-700/30" aria-hidden="true" />
          <span className="text-slate-400 text-xs sm:text-sm">Rest</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-gradient-to-br from-amber-500 to-orange-500" aria-hidden="true" />
          <span className="text-slate-400 text-xs sm:text-sm">Competition</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">{trainingDays.length}</div>
          <div className="text-slate-400 text-xs">Training Days</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">{restDays.length}</div>
          <div className="text-slate-400 text-xs">Rest Days</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-amber-400">1</div>
          <div className="text-slate-400 text-xs">Competition</div>
        </div>
      </div>
    </div>
  );
}
