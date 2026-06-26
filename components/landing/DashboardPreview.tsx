import React from 'react';

export default function DashboardPreview() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
            <span className="text-sm font-semibold text-purple-300 tracking-wider uppercase">
              Live Analytics
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Your Performance At A Glance
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Monitor every throw using beautiful dashboards and AI-powered insights.
          </p>
        </div>

        {/* Dashboard Container */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-6 lg:p-8 shadow-2xl">
          {/* Top Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {/* Best Throw */}
            <div className="group relative bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm font-medium">Best Throw</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">89.4m</div>
                <div className="text-sm text-green-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +2.3m from last week
                </div>
              </div>
            </div>

            {/* Average Distance */}
            <div className="group relative bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm font-medium">Average Distance</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">76.8m</div>
                <div className="text-sm text-green-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +1.8m from last week
                </div>
              </div>
            </div>

            {/* Weekly Throws */}
            <div className="group relative bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm font-medium">Weekly Throws</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">142</div>
                <div className="text-sm text-green-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +18 from last week
                </div>
              </div>
            </div>

            {/* Consistency */}
            <div className="group relative bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl border border-amber-500/20 p-6 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm font-medium">Consistency</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">87%</div>
                <div className="text-sm text-green-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +5% from last week
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Chart */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">Week</button>
                    <button className="px-3 py-1 text-sm rounded-lg text-slate-400 hover:bg-slate-700/50 transition-colors">Month</button>
                    <button className="px-3 py-1 text-sm rounded-lg text-slate-400 hover:bg-slate-700/50 transition-colors">Year</button>
                  </div>
                </div>
                
                {/* Placeholder Chart */}
                <div className="relative h-64 bg-gradient-to-b from-slate-700/30 to-slate-800/30 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-between px-4 pb-4 pt-12">
                    {/* Chart bars */}
                    <div className="flex flex-col items-center space-y-2 flex-1">
                      <div className="w-full max-w-12 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500 hover:from-purple-400 hover:to-purple-300" style={{ height: '60%' }} />
                      <span className="text-xs text-slate-400">Mon</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 flex-1">
                      <div className="w-full max-w-12 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500 hover:from-purple-400 hover:to-purple-300" style={{ height: '75%' }} />
                      <span className="text-xs text-slate-400">Tue</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 flex-1">
                      <div className="w-full max-w-12 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500 hover:from-purple-400 hover:to-purple-300" style={{ height: '45%' }} />
                      <span className="text-xs text-slate-400">Wed</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 flex-1">
                      <div className="w-full max-w-12 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500 hover:from-purple-400 hover:to-purple-300" style={{ height: '90%' }} />
                      <span className="text-xs text-slate-400">Thu</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 flex-1">
                      <div className="w-full max-w-12 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500 hover:from-purple-400 hover:to-purple-300" style={{ height: '70%' }} />
                      <span className="text-xs text-slate-400">Fri</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 flex-1">
                      <div className="w-full max-w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-400 hover:to-blue-300" style={{ height: '85%' }} />
                      <span className="text-xs text-slate-400">Sat</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 flex-1">
                      <div className="w-full max-w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-400 hover:to-blue-300" style={{ height: '65%' }} />
                      <span className="text-xs text-slate-400">Sun</span>
                    </div>
                  </div>
                  {/* Grid lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="border-t border-slate-600/30 absolute top-1/4 left-0 right-0" />
                    <div className="border-t border-slate-600/30 absolute top-2/4 left-0 right-0" />
                    <div className="border-t border-slate-600/30 absolute top-3/4 left-0 right-0" />
                  </div>
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Technique Score */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm font-medium">Technique Score</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-3">8.4/10</div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500" style={{ width: '84%' }} />
                  </div>
                </div>

                {/* Power Output */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm font-medium">Power Output</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-3">92%</div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500" style={{ width: '92%' }} />
                  </div>
                </div>

                {/* Release Angle */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm font-medium">Release Angle</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-3">34.2°</div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: '78%' }} />
                  </div>
                </div>

                {/* Follow-through */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm font-medium">Follow-through</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-3">Excellent</div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Recent Sessions */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400 font-semibold text-sm">M</span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">Morning Practice</div>
                        <div className="text-slate-400 text-xs">Today, 8:00 AM</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">82.3m</div>
                      <div className="text-green-400 text-xs">+3.2m</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 font-semibold text-sm">E</span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">Evening Training</div>
                        <div className="text-slate-400 text-xs">Yesterday, 6:30 PM</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">79.1m</div>
                      <div className="text-green-400 text-xs">+1.8m</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 font-semibold text-sm">W</span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">Weekend Session</div>
                        <div className="text-slate-400 text-xs">2 days ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">85.7m</div>
                      <div className="text-green-400 text-xs">+4.5m</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Best */}
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Personal Best</h3>
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">89.4m</div>
                <div className="text-slate-300 text-sm mb-4">Achieved on June 15, 2024</div>
                <div className="flex items-center space-x-2 text-sm text-purple-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Top 5% of athletes</span>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">AI Insight</h3>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Your release angle has improved by 3.2° this week. Focus on maintaining your follow-through consistency to maximize distance gains.
                  </p>
                </div>
                <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium text-sm hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                  View Detailed Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
