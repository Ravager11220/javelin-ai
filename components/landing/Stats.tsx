import React from 'react';

export default function Stats() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 mb-6">
            <span className="text-sm font-semibold text-purple-300 tracking-wider uppercase">
              Results
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Trusted By Athletes
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Data-driven training for throwers at every level.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Training Sessions */}
          <div className="group relative bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-8 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="relative">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                10,000+
              </div>
              <div className="text-lg sm:text-xl text-slate-300 font-medium">
                Training Sessions Logged
              </div>
              <div className="mt-4 w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full group-hover:w-full transition-all duration-500" />
            </div>
          </div>

          {/* Athletes Improving */}
          <div className="group relative bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-8 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="relative">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                2,500+
              </div>
              <div className="text-lg sm:text-xl text-slate-300 font-medium">
                Athletes Improving
              </div>
              <div className="mt-4 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full group-hover:w-full transition-all duration-500" />
            </div>
          </div>

          {/* User Satisfaction */}
          <div className="group relative bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="relative">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors">
                98%
              </div>
              <div className="text-lg sm:text-xl text-slate-300 font-medium">
                User Satisfaction
              </div>
              <div className="mt-4 w-12 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full group-hover:w-full transition-all duration-500" />
            </div>
          </div>

          {/* Certified Coaches */}
          <div className="group relative bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-8 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="relative">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                150+
              </div>
              <div className="text-lg sm:text-xl text-slate-300 font-medium">
                Certified Coaches
              </div>
              <div className="mt-4 w-12 h-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full group-hover:w-full transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
