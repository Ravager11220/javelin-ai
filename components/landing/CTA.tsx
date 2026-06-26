import React from 'react';

export default function CTA() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Large gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Glassmorphism Container */}
        <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 lg:p-12 overflow-hidden">
          {/* Inner glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                <span className="text-sm font-semibold text-purple-300 tracking-wider uppercase">
                  Ready To Improve?
                </span>
              </div>
              
              {/* Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Start Throwing Smarter Today
              </h2>
              
              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-400 max-w-xl">
                Join thousands of athletes using AI-powered training insights to improve every throw.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5">
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                </button>
                
                <button className="group relative px-8 py-4 rounded-xl bg-slate-800/50 border border-slate-600 text-white font-semibold text-lg hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10 hover:-translate-y-0.5">
                  Book Demo
                </button>
              </div>
            </div>
            
            {/* Right Side - Floating Dashboard Illustration */}
            <div className="relative h-[400px] lg:h-[500px]">
              {/* Floating Card 1 - Top */}
              <div className="absolute top-0 right-0 w-48 sm:w-56 bg-gradient-to-br from-purple-500/20 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-xs text-purple-300">Performance</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">+24%</div>
                <div className="text-xs text-slate-400">Improvement</div>
                <div className="mt-3 w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-1.5 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
              
              {/* Floating Card 2 - Middle Left */}
              <div className="absolute top-1/3 left-0 w-40 sm:w-48 bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-4 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-blue-300">Accuracy</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">92%</div>
                <div className="text-xs text-slate-400">Consistency</div>
                <div className="mt-3 w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              
              {/* Floating Card 3 - Bottom Right */}
              <div className="absolute bottom-0 right-8 w-44 sm:w-52 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-4 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-emerald-300">Training</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">142</div>
                <div className="text-xs text-slate-400">Sessions</div>
                <div className="mt-3 w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              
              {/* Floating Card 4 - Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-44 bg-gradient-to-br from-amber-500/20 to-amber-500/10 backdrop-blur-sm rounded-2xl border border-amber-500/30 p-4 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs text-amber-300">Power</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">89%</div>
                <div className="text-xs text-slate-400">Output</div>
                <div className="mt-3 w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-1.5 rounded-full" style={{ width: '89%' }} />
                </div>
              </div>
              
              {/* Decorative glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
