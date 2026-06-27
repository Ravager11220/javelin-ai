'use client';

import React from 'react';
import { Clock, TrendingUp, Target, Calendar } from 'lucide-react';

export default function RecentSessions() {
  const sessions = [
    {
      id: 1,
      date: 'Today, 8:00 AM',
      type: 'Morning Practice',
      distance: '82.3m',
      trend: '+3.2m',
      duration: '45 min',
    },
    {
      id: 2,
      date: 'Yesterday, 6:30 PM',
      type: 'Evening Training',
      distance: '79.1m',
      trend: '+1.8m',
      duration: '52 min',
    },
    {
      id: 3,
      date: '2 days ago',
      type: 'Weekend Session',
      distance: '85.7m',
      trend: '+4.5m',
      duration: '38 min',
    },
    {
      id: 4,
      date: '3 days ago',
      type: 'Technique Focus',
      distance: '76.4m',
      trend: '+2.1m',
      duration: '41 min',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">Recent Sessions</h3>
          <p className="text-slate-400 text-xs sm:text-sm">Your latest training sessions</p>
        </div>
        <button 
          aria-label="View all sessions"
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Sessions List */}
      <div className="space-y-2 sm:space-y-3">
        {sessions.map((session) => (
          <button
            key={session.id}
            className="group w-full flex items-center justify-between p-3 sm:p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-purple-500/30 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 cursor-pointer text-left"
            aria-label={`View session: ${session.type}, ${session.date}, distance ${session.distance}`}
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium text-sm sm:text-base truncate">{session.type}</div>
                <div className="text-slate-400 text-xs sm:text-sm flex items-center">
                  <Calendar className="w-3 h-3 mr-1 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{session.date}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <div className="text-white font-semibold text-sm sm:text-base">{session.distance}</div>
              <div className="text-green-400 text-xs sm:text-sm flex items-center justify-end" aria-label={`Improved by ${session.trend}`}>
                <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" />
                {session.trend}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-400 text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span>Total this week: 6 sessions</span>
          </div>
          <div className="text-purple-400 text-xs sm:text-sm font-semibold">
            Avg: 80.9m
          </div>
        </div>
      </div>
    </div>
  );
}
