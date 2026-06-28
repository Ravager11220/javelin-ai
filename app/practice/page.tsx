'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import Link from 'next/link';
import { Plus, History, Target, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PracticeStats {
  totalSessions: number;
  bestThrow: number;
  averageDistance: number;
}

export default function PracticePage() {
  const [stats, setStats] = useState<PracticeStats>({
    totalSessions: 0,
    bestThrow: 0,
    averageDistance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: sessions } = await supabase
        .from('practice_sessions')
        .select('distance')
        .eq('user_id', user.id);

      if (sessions && sessions.length > 0) {
        const distances = sessions.map(s => s.distance || 0);
        const totalSessions = sessions.length;
        const bestThrow = Math.max(...distances);
        const averageDistance = distances.reduce((a, b) => a + b, 0) / totalSessions;

        setStats({
          totalSessions,
          bestThrow,
          averageDistance: Math.round(averageDistance * 10) / 10,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <TopNavbar />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Practice Logger</h1>
            <p className="text-slate-400">Track your training sessions and monitor your progress</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Link
              href="/practice/new"
              className="group relative bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">New Practice</h2>
                  <p className="text-slate-400 text-sm">Log a new training session</p>
                </div>
              </div>
            </Link>

            <Link
              href="/practice/history"
              className="group relative bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <History className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Practice History</h2>
                  <p className="text-slate-400 text-sm">View all your sessions</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Total Sessions */}
            <div className="group relative bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? '-' : stats.totalSessions}
              </div>
              <div className="text-slate-400 text-sm">Total Sessions</div>
            </div>

            {/* Best Throw */}
            <div className="group relative bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? '-' : `${stats.bestThrow}m`}
              </div>
              <div className="text-slate-400 text-sm">Best Throw</div>
            </div>

            {/* Average Distance */}
            <div className="group relative bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? '-' : `${stats.averageDistance}m`}
              </div>
              <div className="text-slate-400 text-sm">Average Distance</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
