'use client';

import React from 'react';
import { Play, FileText } from 'lucide-react';

export default function WelcomeCard() {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 sm:p-8 mb-8 hover:border-slate-600/50 transition-all duration-300">
      {/* Greeting */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">
          Welcome back, Aditya 👋
        </h2>
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text mb-4 leading-tight">
        Precision starts where effort becomes intelligence.
      </h1>

      {/* Description */}
      <p className="text-slate-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl leading-relaxed">
        Leverage AI-powered training insights to optimize your throwing technique, track progress, and achieve peak performance.
      </p>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {/* AI Confidence */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-3 sm:p-4 hover:border-slate-600/30 transition-all duration-300">
          <div className="text-xs sm:text-sm text-slate-400 mb-1">AI Confidence</div>
          <div className="text-xl sm:text-2xl font-bold text-white">96%</div>
        </div>

        {/* Model Version */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-3 sm:p-4 hover:border-slate-600/30 transition-all duration-300">
          <div className="text-xs sm:text-sm text-slate-400 mb-1">Model Version</div>
          <div className="text-xl sm:text-2xl font-bold text-white">v4.8</div>
        </div>

        {/* Next Review */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-3 sm:p-4 hover:border-slate-600/30 transition-all duration-300">
          <div className="text-xs sm:text-sm text-slate-400 mb-1">Next Review</div>
          <div className="text-xl sm:text-2xl font-bold text-white">Today</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button 
          aria-label="Start practice session"
          className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>Start Practice</span>
        </button>

        <button 
          aria-label="View AI report"
          className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white font-semibold hover:bg-slate-700/50 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          <FileText className="w-5 h-5" />
          <span>View AI Report</span>
        </button>
      </div>
    </div>
  );
}
