'use client';

import React from 'react';
import { Target, CheckCircle, TrendingUp, Award } from 'lucide-react';

export default function GoalsProgress() {
  const goals = [
    {
      id: 1,
      title: 'Distance Goal',
      current: 84.2,
      target: 90,
      unit: 'm',
      progress: 94,
      icon: Target,
      color: 'purple' as const,
    },
    {
      id: 2,
      title: 'Technique Score',
      current: 8.4,
      target: 9.0,
      unit: '/10',
      progress: 93,
      icon: CheckCircle,
      color: 'blue' as const,
    },
    {
      id: 3,
      title: 'Weekly Sessions',
      current: 6,
      target: 8,
      unit: '',
      progress: 75,
      icon: TrendingUp,
      color: 'emerald' as const,
    },
    {
      id: 4,
      title: 'Competition Prep',
      current: 3,
      target: 5,
      unit: '/5',
      progress: 60,
      icon: Award,
      color: 'amber' as const,
    },
  ];

  const colorClasses = {
    purple: {
      bg: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-purple-400',
    },
    blue: {
      bg: 'from-blue-500/20 to-blue-500/5',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      gradient: 'from-blue-500 to-blue-400',
    },
    emerald: {
      bg: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500 to-emerald-400',
    },
    amber: {
      bg: 'from-amber-500/20 to-amber-500/5',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      gradient: 'from-amber-500 to-amber-400',
    },
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Goals Progress</h3>
          <p className="text-slate-400 text-xs sm:text-sm">Track your training objectives</p>
        </div>
        <button 
          aria-label="Add new goal"
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
        >
          Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const colors = colorClasses[goal.color];

          return (
            <div
              key={goal.id}
              className="group relative bg-gradient-to-br bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-3 sm:p-4 hover:border-slate-600/50 focus-within:border-slate-600/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} aria-hidden="true" />
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${colors.text}`} aria-label={`${goal.progress} percent complete`}>
                  {goal.progress}%
                </span>
              </div>

              <div className="mb-2 sm:mb-3">
                <div className="text-white font-medium text-sm sm:text-base mb-1">{goal.title}</div>
                <div className="text-slate-400 text-xs sm:text-sm">
                  {goal.current}{goal.unit} / {goal.target}{goal.unit}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700/50 rounded-full h-1.5 sm:h-2" role="progressbar" aria-valuenow={goal.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${goal.title} progress`}>
                <div
                  className={`bg-gradient-to-r ${colors.gradient} h-1.5 sm:h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-700/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs sm:text-sm">Overall Progress</span>
          <span className="text-white font-semibold text-sm sm:text-base">81%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-1.5 sm:h-2" role="progressbar" aria-valuenow={81} aria-valuemin={0} aria-valuemax={100} aria-label="Overall progress">
          <div
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
            style={{ width: '81%' }}
          />
        </div>
      </div>
    </div>
  );
}
