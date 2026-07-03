'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Target, Plus, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PracticeSession {
  id: string;
  session_date: string;
  distance: number;
  release_angle: number | null;
  wind_speed: number | null;
  weather: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
}

interface ChartData {
  distanceTrend: { date: string; distance: number }[];
  weeklyProgress: { week: string; sessions: number; avgDistance: number }[];
  monthlyProgress: { month: string; sessions: number; avgDistance: number }[];
  performanceSummary: {
    bestDistance: number;
    worstDistance: number;
    avgDistance: number;
    totalDistance: number;
    improvement: number;
  };
}

type DateRange = '7d' | '30d' | '90d' | 'all';

export default function ChartsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [insufficientData, setInsufficientData] = useState(false);

  useEffect(() => {
    fetchChartData();
  }, [dateRange]);

  const fetchChartData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: sessions, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: true });

      if (error) throw error;

      // Filter by date range
      let filteredSessions = sessions || [];
      if (sessions && sessions.length > 0) {
        const now = new Date();
        if (dateRange === '7d') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredSessions = sessions.filter(s => new Date(s.session_date) >= sevenDaysAgo);
        } else if (dateRange === '30d') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filteredSessions = sessions.filter(s => new Date(s.session_date) >= thirtyDaysAgo);
        } else if (dateRange === '90d') {
          const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          filteredSessions = sessions.filter(s => new Date(s.session_date) >= ninetyDaysAgo);
        }
      }

      if (filteredSessions && filteredSessions.length > 0) {
        setSessions(filteredSessions);
        setInsufficientData(filteredSessions.length < 2);
        calculateChartData(filteredSessions);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateChartData = (sessions: PracticeSession[]) => {
    // Distance Trend - last 10 sessions
    const distanceTrend = sessions.slice(-10).map(s => ({
      date: new Date(s.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      distance: s.distance,
    }));

    // Weekly Progress - last 8 weeks
    const weeklyProgress: { week: string; sessions: number; avgDistance: number }[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weekSessions = sessions.filter(
        s => new Date(s.session_date) >= weekStart && new Date(s.session_date) < weekEnd
      );
      if (weekSessions.length > 0) {
        const avgDistance = weekSessions.reduce((a, b) => a + b.distance, 0) / weekSessions.length;
        weeklyProgress.push({
          week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sessions: weekSessions.length,
          avgDistance: Math.round(avgDistance * 10) / 10,
        });
      }
    }

    // Monthly Progress - last 6 months
    const monthlyProgress: { month: string; sessions: number; avgDistance: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthSessions = sessions.filter(
        s => new Date(s.session_date) >= monthDate && new Date(s.session_date) < monthEnd
      );
      if (monthSessions.length > 0) {
        const avgDistance = monthSessions.reduce((a, b) => a + b.distance, 0) / monthSessions.length;
        monthlyProgress.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          sessions: monthSessions.length,
          avgDistance: Math.round(avgDistance * 10) / 10,
        });
      }
    }

    // Performance Summary
    const distances = sessions.map(s => s.distance);
    const bestDistance = Math.max(...distances);
    const worstDistance = Math.min(...distances);
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const totalDistance = distances.reduce((a, b) => a + b, 0);
    
    // Calculate improvement (compare first half vs second half)
    const midPoint = Math.floor(sessions.length / 2);
    const firstHalfAvg = sessions.slice(0, midPoint).reduce((a, b) => a + b.distance, 0) / midPoint || 0;
    const secondHalfAvg = sessions.slice(midPoint).reduce((a, b) => a + b.distance, 0) / (sessions.length - midPoint) || 0;
    const improvement = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 || 0;

    setChartData({
      distanceTrend,
      weeklyProgress,
      monthlyProgress,
      performanceSummary: {
        bestDistance,
        worstDistance,
        avgDistance: Math.round(avgDistance * 10) / 10,
        totalDistance: Math.round(totalDistance * 10) / 10,
        improvement: Math.round(improvement * 10) / 10,
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <TopNavbar />
        <div className="p-4 sm:p-6 lg:p-8 pt-24">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Link
                  href="/analytics"
                  className="inline-flex items-center text-slate-400 hover:text-white mb-4 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Analytics
                </Link>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Charts & Visualizations</h1>
                <p className="text-slate-400">Visualize your training progress</p>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as DateRange)}
                  className="bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500/50 transition-colors"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 animate-pulse">
                <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-slate-700/30 rounded-xl p-4">
                      <div className="h-4 bg-slate-600/50 rounded w-1/2 mb-2" />
                      <div className="h-8 bg-slate-600/50 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 animate-pulse">
                <div className="h-6 bg-slate-700/50 rounded w-1/4 mb-6" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-20 h-4 bg-slate-700/50 rounded" />
                      <div className="flex-1 h-8 bg-slate-700/50 rounded" />
                      <div className="w-20 h-4 bg-slate-700/50 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 animate-pulse">
                <div className="h-6 bg-slate-700/50 rounded w-1/4 mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-slate-700/30 rounded-xl p-4">
                      <div className="h-4 bg-slate-600/50 rounded w-1/3 mb-2" />
                      <div className="h-8 bg-slate-600/50 rounded w-1/2 mb-2" />
                      <div className="h-2 bg-slate-600/50 rounded w-full" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 animate-pulse">
                <div className="h-6 bg-slate-700/50 rounded w-1/4 mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-24 h-4 bg-slate-700/50 rounded" />
                      <div className="flex-1 h-10 bg-slate-700/50 rounded" />
                      <div className="w-24 h-4 bg-slate-700/50 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : !chartData ? (
            /* Empty State */
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
              <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No chart data yet</h3>
              <p className="text-slate-400 mb-6">Start logging your practice sessions to see your progress charts</p>
              <Link
                href="/practice/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Practice Session
              </Link>
            </div>
          ) : insufficientData ? (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
              <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">More practice sessions needed</h3>
              <p className="text-slate-400">More practice sessions are needed to generate analytics.</p>
            </div>
          ) : (
            /* Charts Grid */
            <div className="space-y-6">
              {/* Performance Summary */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-purple-400" />
                  Performance Summary
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
                    <div className="text-slate-400 text-sm mb-1">Best Distance</div>
                    <div className="text-2xl font-bold text-white">{chartData!.performanceSummary.bestDistance.toFixed(1)}m</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105">
                    <div className="text-slate-400 text-sm mb-1">Worst Distance</div>
                    <div className="text-2xl font-bold text-white">{chartData!.performanceSummary.worstDistance.toFixed(1)}m</div>
                  </div>
                  <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-105">
                    <div className="text-slate-400 text-sm mb-1">Average</div>
                    <div className="text-2xl font-bold text-white">{chartData!.performanceSummary.avgDistance.toFixed(1)}m</div>
                  </div>
                  <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:scale-105">
                    <div className="text-slate-400 text-sm mb-1">Total Distance</div>
                    <div className="text-2xl font-bold text-white">{chartData!.performanceSummary.totalDistance.toFixed(1)}m</div>
                  </div>
                  <div className="bg-pink-500/10 rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:scale-105">
                    <div className="text-slate-400 text-sm mb-1">Improvement</div>
                    <div className={`text-2xl font-bold ${chartData!.performanceSummary.improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {chartData!.performanceSummary.improvement >= 0 ? '+' : ''}{chartData!.performanceSummary.improvement.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Distance Trend */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
                  Distance Trend (Last 10 Sessions)
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData!.distanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '#334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) =>`${Number(value).toFixed(1)}m`}
                    />
                    <Line type="monotone" dataKey="distance" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} animationDuration={1000} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Progress */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-emerald-400" />
                  Weekly Sessions
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData!.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '#334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="sessions" fill="#10b981" animationDuration={1000} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Progress */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-amber-400" />
                  Monthly Distance
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData!.monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '#334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                     formatter={(value) =>`${Number(value).toFixed(1)}m`}
                    />
                    <Bar dataKey="avgDistance" fill="#f59e0b" animationDuration={1000} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
