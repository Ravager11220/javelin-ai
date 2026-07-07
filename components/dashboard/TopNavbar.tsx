'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Sun } from 'lucide-react';
import GlobalSearch from '@/components/shared/GlobalSearch';
import NotificationCenter, { Notification } from '@/components/shared/NotificationCenter';

export default function TopNavbar() {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUnreadCount = () => {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const notifications: Notification[] = JSON.parse(saved);
        setUnreadCount(notifications.filter(n => !n.read).length);
      }
    };

    updateUnreadCount();
    
    // Listen for storage changes
    const handleStorageChange = () => updateUnreadCount();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 z-40 transition-all duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Global Search */}
        <div className="flex-1 max-w-md sm:max-w-lg">
          <GlobalSearch />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4 ml-4 sm:ml-6">
          {/* Notification Bell */}
          <button 
            onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true" />
            )}
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

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationCenterOpen} 
        onClose={() => setIsNotificationCenterOpen(false)} 
      />
    </nav>
  );
}
