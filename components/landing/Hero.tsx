'use client';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Throw Smarter.
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Train Better.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                AI-powered training analytics for javelin athletes. Track your performance, optimize your technique, and achieve your personal best with data-driven insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                Start Training
              </button>
              <button className="px-8 py-4 text-base font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300 transform hover:scale-105">
                View Dashboard
              </button>
            </div>
          </div>

          {/* Right side - Dashboard illustration */}
          <div className="relative">
            <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 shadow-2xl">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-sm text-zinc-500">Dashboard Preview</div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="text-zinc-400 text-sm mb-1">Best Distance</div>
                  <div className="text-2xl font-bold text-white">82.5m</div>
                  <div className="text-green-400 text-sm">+2.3m</div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="text-zinc-400 text-sm mb-1">Avg Speed</div>
                  <div className="text-2xl font-bold text-white">28.4 m/s</div>
                  <div className="text-green-400 text-sm">+0.8 m/s</div>
                </div>
              </div>

              {/* Chart placeholder */}
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 mb-4">
                <div className="text-zinc-400 text-sm mb-3">Performance Trend</div>
                <div className="flex items-end space-x-2 h-24">
                  <div className="flex-1 bg-blue-500/30 rounded-t h-12 hover:bg-blue-500/50 transition-colors duration-200" />
                  <div className="flex-1 bg-blue-500/40 rounded-t h-16 hover:bg-blue-500/60 transition-colors duration-200" />
                  <div className="flex-1 bg-blue-500/50 rounded-t h-14 hover:bg-blue-500/70 transition-colors duration-200" />
                  <div className="flex-1 bg-blue-500/60 rounded-t h-20 hover:bg-blue-500/80 transition-colors duration-200" />
                  <div className="flex-1 bg-blue-500/70 rounded-t h-18 hover:bg-blue-500/90 transition-colors duration-200" />
                  <div className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t h-24 hover:from-blue-400 hover:to-purple-400 transition-colors duration-200" />
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="text-zinc-400 text-sm mb-3">Recent Sessions</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-white text-sm">Training Session #24</div>
                    <div className="text-zinc-400 text-sm">Today</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-white text-sm">Competition Prep</div>
                    <div className="text-zinc-400 text-sm">Yesterday</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-3 shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="text-white font-bold text-lg">+15%</div>
              <div className="text-white/80 text-xs">Improvement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
