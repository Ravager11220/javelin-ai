'use client';

import { Target, BarChart3, Sparkles } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Target,
      title: 'Practice Tracking',
      description: 'Record every training session, throw distance, release angle, notes, weather, and equipment.',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Interactive charts visualize trends, consistency, averages, personal bests, and weekly improvements.',
    },
    {
      icon: Sparkles,
      title: 'AI Coach',
      description: 'Receive intelligent insights and personalized recommendations after every training session.',
    },
  ];

  return (
    <section className="relative py-32 bg-zinc-950 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 mb-6">
            <span className="text-sm font-medium text-zinc-300">POWERFUL FEATURES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Everything You Need
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              To Improve Every Throw
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Train smarter with AI-powered tools that help athletes monitor progress, analyze performance, and
            consistently improve.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-8 hover:border-zinc-700/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/5"
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon */}
                <div className="relative mb-6 inline-flex">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="relative text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
