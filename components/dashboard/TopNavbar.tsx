'use client';

import React from 'react';
import { Search, Bell, Sun } from 'lucide-react';

export default function TopNavbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 z-40 transition-all duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md sm:max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4 ml-4 sm:ml-6">
          {/* Notification Bell */}
          <button 
            aria-label="Notifications"
            className="relative p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true" />
          </button>

          {/* Theme Toggle */}
          <button 
            aria-label="Toggle theme"
            className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <Sun className="w-5 h-5" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-2 sm:space-x-3 pl-3 sm:pl-4 border-l border-slate-700/50">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
              AJ
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
