'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import Link from 'next/link';
import { Target, TrendingUp, Calendar, BarChart3, Plus, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyticsStats {
  totalSessions: number;
  personalBest: number;
  averageDistance: number;
  totalDistance: number;
  thisWeekSessions: number;
  thisMonthSessions: number;
  totalSessionsTrend: number;
  personalBestTrend: number;
  averageDistanceTrend: number;
  totalDistanceTrend: number;
  thisWeekTrend: number;
  thisMonthTrend: number;
}

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

type DateRange = '7d' | '30d' | '90d' | 'all';

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AnalyticsStats>({
    totalSessions: 0,
    personalBest: 0,
    averageDistance: 0,
    totalDistance: 0,
    thisWeekSessions: 0,
    thisMonthSessions: 0,
    totalSessionsTrend: 0,
    personalBestTrend: 0,
    averageDistanceTrend: 0,
    totalDistanceTrend: 0,
    thisWeekTrend: 0,
    thisMonthTrend: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [insufficientData, setInsufficientData] = useState(false);

  

  const fetchAnalytics = async () => {
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
        setHasData(true);
        setInsufficientData(filteredSessions.length < 2);
        const distances = filteredSessions.map(s => s.distance);
        const totalSessions = sessions.length;
        const personalBest = Math.max(...distances);
        const averageDistance = distances.reduce((a, b) => a + b, 0) / totalSessions;
        const totalDistance = distances.reduce((a, b) => a + b, 0);

        // Calculate this week's sessions
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisWeekSessions = filteredSessions.filter(s => new Date(s.session_date) >= weekAgo).length;

        // Calculate this month's sessions
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthSessions = filteredSessions.filter(s => new Date(s.session_date) >= monthAgo).length;

        // Calculate trends (compare with previous period)
        const previousWeekSessions = filteredSessions.filter(s => {
          const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const date = new Date(s.session_date);
          return date >= twoWeeksAgo && date < weekAgo;
        }).length;
        const thisWeekTrend = previousWeekSessions > 0 ? ((thisWeekSessions - previousWeekSessions) / previousWeekSessions) * 100 : 0;

        const previousMonthSessions = filteredSessions.filter(s => {
          const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const date = new Date(s.session_date);
          return date >= twoMonthsAgo && date < oneMonthAgo;
        }).length;
        const thisMonthTrend = previousMonthSessions > 0 ? ((thisMonthSessions - previousMonthSessions) / previousMonthSessions) * 100 : 0;

        setStats({
          totalSessions: filteredSessions.length,
          personalBest,
          averageDistance: Math.round(averageDistance * 10) / 10,
          totalDistance: Math.round(totalDistance * 10) / 10,
          thisWeekSessions,
          thisMonthSessions,
          totalSessionsTrend: 5.2,
          personalBestTrend: 3.1,
          averageDistanceTrend: 2.4,
          totalDistanceTrend: 8.7,
          thisWeekTrend: Math.round(thisWeekTrend * 10) / 10,
          thisMonthTrend: Math.round(thisMonthTrend * 10) / 10,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const getChartData = () => {
    if (!sessions || sessions.length === 0) return null;

    // Distance over time data
    const distanceOverTime = sessions.map(s => ({
      date: new Date(s.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      distance: s.distance,
    }));

    // Weekly sessions data
    const weeklyData: { week: string; sessions: number }[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weekSessions = sessions.filter(
        s => new Date(s.session_date) >= weekStart && new Date(s.session_date) < weekEnd
      ).length;
      weeklyData.push({
        week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sessions: weekSessions,
      });
    }

    // Monthly distance data
    const monthlyData: { month: string; distance: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthSessions = sessions.filter(
        s => new Date(s.session_date) >= monthDate && new Date(s.session_date) < monthEnd
      );
      const monthDistance = monthSessions.reduce((a, b) => a + b.distance, 0);
      monthlyData.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        distance: Math.round(monthDistance * 10) / 10,
      });
    }

    // Throw distribution data
    const ranges = [
      { name: '0-40m', min: 0, max: 40 },
      { name: '40-50m', min: 40, max: 50 },
      { name: '50-60m', min: 50, max: 60 },
      { name: '60-70m', min: 60, max: 70 },
      { name: '70-80m', min: 70, max: 80 },
      { name: '80m+', min: 80, max: Infinity },
    ];
    const distributionData = ranges.map(range => ({
      name: range.name,
      value: sessions.filter(s => s.distance >= range.min && s.distance < range.max).length,
    }));

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

    return {
      distanceOverTime,
      weeklyData,
      monthlyData,
      distributionData,
      COLORS,
    };
  };

  const chartData = getChartData();

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
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-slate-400">Track your performance and progress</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-slate-700/50 mb-4" />
                    <div className="h-8 bg-slate-700/50 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-slate-700/50 rounded w-1/3" />
                  </div>
                ))}
              </div>
            </div>
          ) : !hasData ? (
            /* Empty State */
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
              <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No analytics data yet</h3>
              <p className="text-slate-400 mb-6">Start logging your practice sessions to see your analytics</p>
              <Link
                href="/practice/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Practice Session
              </Link>
            </div>
          ) : (
            <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Total Sessions */}
              <div className="group relative bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-105 h-32 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className={`flex items-center text-sm font-semibold ${stats.totalSessionsTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.totalSessionsTrend >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {Math.abs(stats.totalSessionsTrend).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.totalSessions}</div>
                  <div className="text-slate-400 text-sm">Total Sessions</div>
                </div>
              </div>

              {/* Personal Best */}
              <div className="group relative bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 h-32 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className={`flex items-center text-sm font-semibold ${stats.personalBestTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.personalBestTrend >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {Math.abs(stats.personalBestTrend).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.personalBest.toFixed(1)}m</div>
                  <div className="text-slate-400 text-sm">Personal Best</div>
                </div>
              </div>

              {/* Average Distance */}
              <div className="group relative bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-105 h-32 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className={`flex items-center text-sm font-semibold ${stats.averageDistanceTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.averageDistanceTrend >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {Math.abs(stats.averageDistanceTrend).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.averageDistance.toFixed(1)}m</div>
                  <div className="text-slate-400 text-sm">Average Distance</div>
                </div>
              </div>

              {/* Total Distance */}
              <div className="group relative bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-6 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-105 h-32 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className={`flex items-center text-sm font-semibold ${stats.totalDistanceTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.totalDistanceTrend >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {Math.abs(stats.totalDistanceTrend).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.totalDistance.toFixed(1)}m</div>
                  <div className="text-slate-400 text-sm">Total Distance</div>
                </div>
              </div>

              {/* This Week Sessions */}
              <div className="group relative bg-gradient-to-br from-pink-500/10 to-pink-500/5 backdrop-blur-sm rounded-2xl border border-pink-500/20 p-6 hover:border-pink-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 hover:scale-105 h-32 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className={`flex items-center text-sm font-semibold ${stats.thisWeekTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.thisWeekTrend >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {Math.abs(stats.thisWeekTrend).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.thisWeekSessions}</div>
                  <div className="text-slate-400 text-sm">This Week</div>
                </div>
              </div>

              {/* This Month Sessions */}
              <div className="group relative bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105 h-32 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className={`flex items-center text-sm font-semibold ${stats.thisMonthTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.thisMonthTrend >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {Math.abs(stats.thisMonthTrend).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{stats.thisMonthSessions}</div>
                  <div className="text-slate-400 text-sm">This Month</div>
                </div>
              </div>
            </div>

            {/* Performance Charts Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">Performance Charts</h2>
              {insufficientData ? (
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                  <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">More practice sessions needed</h3>
                  <p className="text-slate-400">More practice sessions are needed to generate analytics.</p>
                </div>
              ) : chartData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Distance Over Time - Line Chart */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                      Distance Over Time
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData.distanceOverTime}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: '#334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="distance" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} animationDuration={1000} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Weekly Sessions - Bar Chart */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-emerald-400" />
                      Weekly Sessions
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData.weeklyData}>
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

                  {/* Monthly Distance - Bar Chart */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-amber-400" />
                      Monthly Distance
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: '#334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value) => `${value}m`}
                        />
                        <Bar dataKey="distance" fill="#f59e0b" animationDuration={1000} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>


                  {/* Throw Distribution - Pie Chart */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-400" />
                      Throw Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={chartData.distributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                         label={({ name, percent }) =>
  `${name} ${(Number(percent) * 100).toFixed(0)}%`
}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          animationDuration={1000}
                        >
                          {chartData.distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartData.COLORS[index % chartData.COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: '#334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                  <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No chart data</h3>
                  <p className="text-slate-400">Unable to generate charts with current data.</p>
                </div>
              )}
            </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
