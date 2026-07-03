'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  BarChart2,
  Brain,
  CheckCircle,
  Award,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Practice Logger', href: '/practice', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'AI Coach', href: '/coach', icon: Brain },
  { name: 'Goals', href: '/goals', icon: CheckCircle },
  { name: 'Competition', href: '/competition', icon: Award },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900/80 backdrop-blur-lg border border-purple-500/30 text-white hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onKeyDown={(e) => e.key === 'Enter' && setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-50
          bg-black/50 backdrop-blur-xl
          border-r border-purple-500/30
          text-white
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          rounded-r-2xl
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-purple-500/30">
          {!collapsed && (
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                Javelin AI
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          )}
          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-2 rounded-lg hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300"
          >
            {collapsed ? <ChevronRight className="w-5 h-5 text-slate-400" /> : <ChevronLeft className="w-5 h-5 text-slate-400" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-label={item.name}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }
                  ${collapsed ? 'justify-center' : 'space-x-3'}
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-purple-400' : 'group-hover:text-purple-400 transition-colors'}`} />
                {!collapsed && <span className="font-medium">{item.name}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-purple-500 animate-pulse" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Season Sync Card */}
        <div className="p-4">
          <div className={`
            bg-gradient-to-br from-purple-500/10 to-blue-500/10 
            backdrop-blur-sm rounded-2xl border border-purple-500/20
            p-4 transition-all duration-300
            ${collapsed ? 'hidden' : 'block'}
          `}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Season Sync</h3>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
            
            {/* Circular Progress */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="rgba(168, 85, 247, 0.2)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="226"
                    strokeDashoffset="45"
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">80%</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-slate-400 mb-2">12 weeks remaining</p>
              <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5">
                View Progress
              </button>
            </div>
          </div>

          {/* Collapsed Season Sync Icon */}
          {collapsed && (
            <div className="flex items-center justify-center">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="rgba(168, 85, 247, 0.2)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="url(#gradient-collapsed)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="125"
                    strokeDashoffset="25"
                  />
                  <defs>
                    <linearGradient id="gradient-collapsed" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
