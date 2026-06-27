'use client';

import React from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export default function AICoach() {
  const insights = [
    {
      id: 1,
      type: 'technique',
      title: 'Release Angle Optimization',
      description: 'Your release angle has improved by 3.2° this week. Focus on maintaining consistency in the final 10° of rotation.',
      impact: 'high',
      tag: 'Live',
    },
    {
      id: 2,
      type: 'recovery',
      title: 'Recovery Pattern Detected',
      description: 'Your shoulder recovery time between throws has decreased by 15%. Consider adding 30s rest intervals.',
      impact: 'moderate',
      tag: 'Analysis',
    },
    {
      id: 3,
      type: 'condition',
      title: 'Crosswind Adaptation',
      description: 'Based on current weather conditions, adjust your release point 2° to the right for optimal trajectory.',
      impact: 'high',
      tag: 'Weather',
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderate':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'technique':
        return TrendingUp;
      case 'recovery':
        return AlertTriangle;
      case 'condition':
        return CheckCircle;
      default:
        return Brain;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">AI Coach Insights</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Personalized recommendations</p>
          </div>
        </div>
        <button 
          aria-label="View all insights"
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-3 sm:space-y-4">
        {insights.map((insight) => {
          const Icon = getIcon(insight.type);
          const impactColor = getImpactColor(insight.impact);

          return (
            <button
              key={insight.id}
              className="group w-full text-left relative bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-3 sm:p-4 hover:border-purple-500/30 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 cursor-pointer"
              aria-label={`View insight: ${insight.title}`}
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <h4 className="text-white font-medium text-sm sm:text-base truncate">{insight.title}</h4>
                    <span className={`px-2 py-0.5 sm:py-1 text-xs rounded-full border ${impactColor} flex-shrink-0 ml-2`}>
                      {insight.tag}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {insight.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      <button 
        aria-label="Generate new AI analysis"
        className="w-full mt-4 sm:mt-6 px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white font-medium hover:from-purple-500/30 hover:to-blue-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5 flex items-center justify-center space-x-2"
      >
        <span className="text-sm sm:text-base">Generate New Analysis</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
