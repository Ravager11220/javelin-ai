'use client';

import React from 'react';
import { CheckCircle, Brain, Trophy, Bell, Clock } from 'lucide-react';

export default function ActivityTimeline() {
  const activities = [
    {
      id: 1,
      type: 'training',
      title: 'Training Session Completed',
      description: 'Morning practice - 45 throws, avg distance 82.3m',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'emerald',
    },
    {
      id: 2,
      type: 'analysis',
      title: 'AI Analysis Finished',
      description: 'Technique score improved by 5% from last session',
      time: '3 hours ago',
      icon: Brain,
      color: 'purple',
    },
    {
      id: 3,
      type: 'goal',
      title: 'Goal Achieved',
      description: 'Reached weekly training target of 6 sessions',
      time: '5 hours ago',
      icon: Trophy,
      color: 'amber',
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Competition Reminder',
      description: 'National Championship in 14 days - review preparation plan',
      time: '1 day ago',
      icon: Bell,
      color: 'blue',
    },
    {
      id: 5,
      type: 'training',
      title: 'Training Session Completed',
      description: 'Evening training - 38 throws, avg distance 79.1m',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'emerald',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'purple':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'amber':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'blue':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-600/20 flex items-center justify-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Activity Timeline</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Recent activities</p>
          </div>
        </div>
        <button 
          aria-label="View all activities"
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-3 sm:space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const colorClasses = getColorClasses(activity.color);

          return (
            <div key={activity.id} className="relative">
              {/* Timeline Line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-4 sm:left-5 top-10 sm:top-12 bottom-0 w-0.5 bg-slate-700/30" aria-hidden="true" />
              )}

              <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Icon */}
                <div className={`
                  w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 border
                  ${colorClasses}
                `}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-3 sm:pb-4 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-medium text-sm sm:text-base truncate">{activity.title}</h4>
                    <span className="text-slate-400 text-xs flex-shrink-0 ml-2">{activity.time}</span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2">{activity.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="text-slate-400 text-xs sm:text-sm">
            This week: <span className="text-white font-semibold">12 activities</span>
          </div>
          <button 
            aria-label="View full activity history"
            className="text-purple-400 text-xs sm:text-sm font-semibold hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:rounded px-2 py-1 transition-colors"
          >
            View Full History
          </button>
        </div>
      </div>
    </div>
  );
}
