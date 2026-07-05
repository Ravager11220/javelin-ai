'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import Link from 'next/link';
import { Target, TrendingUp, Calendar, BarChart3, Plus, ArrowUp, ArrowDown, Filter, Trophy, Award, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

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

interface Practice {
  id: string;
  user_id: string;
  date: string;
  average_throw: number;
  best_throw: number;
  total_throws: number;
  notes: string | null;
  created_at: string;
}

interface Competition {
  id: string;
  user_id: string;
  competition_name: string;
  competition_date: string;
  venue: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  result_distance: number | null;
  created_at: string;
}

interface AthleteProfile {
  id: string;
  user_id: string;
  name: string;
  personal_best: number | null;
  target_distance: number | null;
  height: number | null;
  weight: number | null;
  dominant_hand: string | null;
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
  const [practices, setPractices] = useState<Practice[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [insufficientData, setInsufficientData] = useState(false);

  

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch practices
      const { data: practicesData, error: practicesError } = await supabase
        .from('practices')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (practicesError) throw practicesError;

      // Fetch competitions
      const { data: competitionsData, error: competitionsError } = await supabase
        .from('competitions')
        .select('*')
        .eq('user_id', user.id)
        .order('competition_date', { ascending: true });

      if (competitionsError) throw competitionsError;

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('athlete_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      setCompetitions(competitionsData || []);
      setProfile(profileData);

      // Filter by date range
      let filteredPractices = practicesData || [];
      if (practicesData && practicesData.length > 0) {
        const now = new Date();
        if (dateRange === '7d') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredPractices = practicesData.filter(p => new Date(p.date) >= sevenDaysAgo);
        } else if (dateRange === '30d') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filteredPractices = practicesData.filter(p => new Date(p.date) >= thirtyDaysAgo);
        } else if (dateRange === '90d') {
          const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          filteredPractices = practicesData.filter(p => new Date(p.date) >= ninetyDaysAgo);
        }
      }

      if (filteredPractices && filteredPractices.length > 0) {
        setPractices(filteredPractices);
        setHasData(true);
        setInsufficientData(filteredPractices.length < 2);
        const bestThrows = filteredPractices.map(p => p.best_throw);
        const totalSessions = practicesData.length;
        const personalBest = Math.max(...bestThrows);
        const averageDistance = bestThrows.reduce((a, b) => a + b, 0) / totalSessions;
        const totalDistance = bestThrows.reduce((a, b) => a + b, 0);

        // Calculate this week's sessions
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisWeekSessions = filteredPractices.filter(p => new Date(p.date) >= weekAgo).length;

        // Calculate this month's sessions
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthSessions = filteredPractices.filter(p => new Date(p.date) >= monthAgo).length;

        // Calculate trends (compare with previous period)
        const previousWeekSessions = filteredPractices.filter(p => {
          const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const date = new Date(p.date);
          return date >= twoWeeksAgo && date < weekAgo;
        }).length;
        const thisWeekTrend = previousWeekSessions > 0 ? ((thisWeekSessions - previousWeekSessions) / previousWeekSessions) * 100 : 0;

        const previousMonthSessions = filteredPractices.filter(p => {
          const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const date = new Date(p.date);
          return date >= twoMonthsAgo && date < oneMonthAgo;
        }).length;
        const thisMonthTrend = previousMonthSessions > 0 ? ((thisMonthSessions - previousMonthSessions) / previousMonthSessions) * 100 : 0;

        setStats({
          totalSessions: filteredPractices.length,
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
    if (!practices || practices.length === 0) return null;

    // Personal Best Progress - Line chart with PR highlights
    const personalBestProgress = practices.map((p, index) => {
      const isPR = index === 0 || p.best_throw > Math.max(...practices.slice(0, index).map(pr => pr.best_throw));
      return {
        date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        bestThrow: p.best_throw,
        isPR,
      };
    });

    // Average Throw Trend - Weekly and monthly averages
    const weeklyAverages: { week: string; average: number }[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weekPractices = practices.filter(
        p => new Date(p.date) >= weekStart && new Date(p.date) < weekEnd
      );
      const average = weekPractices.length > 0 
        ? weekPractices.reduce((sum, p) => sum + p.average_throw, 0) / weekPractices.length 
        : 0;
      weeklyAverages.push({
        week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        average: Math.round(average * 10) / 10,
      });
    }

    // Training Volume - Sessions per week
    const trainingVolume: { week: string; sessions: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weekSessions = practices.filter(
        p => new Date(p.date) >= weekStart && new Date(p.date) < weekEnd
      ).length;
      trainingVolume.push({
        week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sessions: weekSessions,
      });
    }

    // Competition Performance - Grouped bars
    const competitionPerformance = competitions
      .filter(c => c.status === 'completed' && c.result_distance !== null)
      .map(c => ({
        name: c.competition_name,
        target: profile?.target_distance || 0,
        actual: c.result_distance || 0,
        pb: profile?.personal_best || 0,
      }));

    // Throw Distribution - Histogram
    const ranges = [
      { name: '0-40m', min: 0, max: 40 },
      { name: '40-50m', min: 40, max: 50 },
      { name: '50-60m', min: 50, max: 60 },
      { name: '60-70m', min: 60, max: 70 },
      { name: '70-80m', min: 70, max: 80 },
      { name: '80m+', min: 80, max: Infinity },
    ];
    const throwDistribution = ranges.map(range => ({
      name: range.name,
      value: practices.filter(p => p.best_throw >= range.min && p.best_throw < range.max).length,
    }));

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

    return {
      personalBestProgress,
      weeklyAverages,
      trainingVolume,
      competitionPerformance,
      throwDistribution,
      COLORS,
    };
  };

  const chartData = getChartData();

  // AI Performance Summary
  const getPerformanceSummary = () => {
    if (!practices || practices.length === 0) return null;

    // Calculate monthly averages
    const monthlyAverages: { month: string; average: number; count: number }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthPractices = practices.filter(
        p => new Date(p.date) >= monthDate && new Date(p.date) < monthEnd
      );
      if (monthPractices.length > 0) {
        const average = monthPractices.reduce((sum, p) => sum + p.best_throw, 0) / monthPractices.length;
        monthlyAverages.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          average: Math.round(average * 10) / 10,
          count: monthPractices.length,
        });
      }
    }

    // Find strongest and weakest months
    const strongestMonth = monthlyAverages.length > 0 
      ? monthlyAverages.reduce((max, m) => m.average > max.average ? m : max)
      : null;
    const weakestMonth = monthlyAverages.length > 0
      ? monthlyAverages.reduce((min, m) => m.average < min.average ? m : min)
      : null;

    // Calculate consistency (variance)
    const allThrows = practices.map(p => p.best_throw);
    const mean = allThrows.reduce((a, b) => a + b, 0) / allThrows.length;
    const variance = allThrows.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allThrows.length;
    const consistencyScore = Math.max(0, 1 - (variance / (mean * mean)));

    // Most consistent period (lowest variance in a 4-week window)
    let mostConsistentPeriod = 'Not enough data';
    if (practices.length >= 4) {
      let bestVariance = Infinity;
      for (let i = 0; i <= practices.length - 4; i++) {
        const window = practices.slice(i, i + 4).map(p => p.best_throw);
        const windowMean = window.reduce((a, b) => a + b, 0) / window.length;
        const windowVariance = window.reduce((sum, val) => sum + Math.pow(val - windowMean, 2), 0) / window.length;
        if (windowVariance < bestVariance) {
          bestVariance = windowVariance;
          const startDate = new Date(practices[i].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const endDate = new Date(practices[i + 3].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          mostConsistentPeriod = `${startDate} - ${endDate}`;
        }
      }
    }

    // Estimated improvement rate (meters/month)
    let improvementRate = 0;
    if (monthlyAverages.length >= 2) {
      const firstMonth = monthlyAverages[0];
      const lastMonth = monthlyAverages[monthlyAverages.length - 1];
      improvementRate = (lastMonth.average - firstMonth.average) / monthlyAverages.length;
    }

    return {
      strongestMonth,
      weakestMonth,
      mostConsistentPeriod,
      improvementRate: Math.round(improvementRate * 10) / 10,
      consistencyScore: Math.round(consistencyScore * 100),
    };
  };

  const performanceSummary = getPerformanceSummary();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <TopNavbar />
        <div className="p-4 sm:p-6 lg:p-8 pt-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
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
          </motion.div>

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
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {/* Total Sessions */}
              <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-105 h-32 flex flex-col justify-between">
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
              </motion.div>

              {/* Personal Best */}
              <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 h-32 flex flex-col justify-between">
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
              </motion.div>

              {/* Average Distance */}
              <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-105 h-32 flex flex-col justify-between">
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
              </motion.div>

              {/* Total Distance */}
              <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-6 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-105 h-32 flex flex-col justify-between">
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
              </motion.div>

              {/* This Week Sessions */}
              <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-pink-500/10 to-pink-500/5 backdrop-blur-sm rounded-2xl border border-pink-500/20 p-6 hover:border-pink-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 hover:scale-105 h-32 flex flex-col justify-between">
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
              </motion.div>

              {/* This Month Sessions */}
              <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105 h-32 flex flex-col justify-between">
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
              </motion.div>
            </motion.div>

            {/* Performance Charts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Performance Charts</h2>
              {insufficientData ? (
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                  <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">More practice sessions needed</h3>
                  <p className="text-slate-400">More practice sessions are needed to generate analytics.</p>
                </div>
              ) : chartData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Best Progress - Line Chart */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-purple-400" />
                      Personal Best Progress
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData.personalBestProgress}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: '#334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: any) => `${value}m`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="bestThrow" 
                          stroke="#8b5cf6" 
                          strokeWidth={2} 
                          dot={(props: any) => {
                            const { payload } = props;
                            return (
                              <circle
                                cx={props.cx}
                                cy={props.cy}
                                r={payload.isPR ? 6 : 4}
                                fill={payload.isPR ? '#f59e0b' : '#8b5cf6'}
                                stroke={payload.isPR ? '#f59e0b' : '#8b5cf6'}
                                strokeWidth={2}
                              />
                            );
                          }}
                          animationDuration={1000} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Average Throw Trend - Line Chart */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                      Average Throw Trend (Weekly)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData.weeklyAverages}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: '#334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: any) => `${value}m`}
                        />
                        <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} animationDuration={1000} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Training Volume - Bar Chart */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-emerald-400" />
                      Training Volume (Sessions/Week)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData.trainingVolume}>
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

                  {/* Competition Performance - Grouped Bar Chart */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-amber-400" />
                      Competition Performance
                    </h3>
                    {chartData.competitionPerformance.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData.competitionPerformance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '#334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any) => `${value}m`}
                          />
                          <Legend />
                          <Bar dataKey="target" name="Target" fill="#64748b" animationDuration={1000} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="actual" name="Actual" fill="#8b5cf6" animationDuration={1000} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="pb" name="PB" fill="#f59e0b" animationDuration={1000} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[250px] text-zinc-400">
                        No completed competitions yet
                      </div>
                    )}
                  </div>

                  {/* Throw Distribution - Histogram */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-pink-400" />
                      Throw Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData.throwDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: '#334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="value" fill="#ec4899" animationDuration={1000} radius={[4, 4, 0, 0]} />
                      </BarChart>
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
            </motion.div>

            {/* AI Performance Summary */}
            {performanceSummary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-purple-400" />
                  AI Performance Summary
                </h2>
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Strongest Month */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Trophy className="w-6 h-6 text-green-400" />
                      </div>
                      <p className="text-sm text-zinc-400 mb-1">Strongest Month</p>
                      <p className="text-lg font-semibold text-white">
                        {performanceSummary.strongestMonth 
                          ? `${performanceSummary.strongestMonth.month} (${performanceSummary.strongestMonth.average}m)`
                          : 'N/A'}
                      </p>
                    </div>

                    {/* Weakest Month */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Target className="w-6 h-6 text-red-400" />
                      </div>
                      <p className="text-sm text-zinc-400 mb-1">Weakest Month</p>
                      <p className="text-lg font-semibold text-white">
                        {performanceSummary.weakestMonth 
                          ? `${performanceSummary.weakestMonth.month} (${performanceSummary.weakestMonth.average}m)`
                          : 'N/A'}
                      </p>
                    </div>

                    {/* Most Consistent Period */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                      </div>
                      <p className="text-sm text-zinc-400 mb-1">Most Consistent Period</p>
                      <p className="text-lg font-semibold text-white">{performanceSummary.mostConsistentPeriod}</p>
                    </div>

                    {/* Improvement Rate */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <ArrowUp className="w-6 h-6 text-amber-400" />
                      </div>
                      <p className="text-sm text-zinc-400 mb-1">Improvement Rate</p>
                      <p className="text-lg font-semibold text-white">
                        {performanceSummary.improvementRate > 0 ? '+' : ''}{performanceSummary.improvementRate}m/month
                      </p>
                    </div>
                  </div>

                  {/* Consistency Score */}
                  <div className="mt-6 pt-6 border-t border-purple-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white">Overall Consistency Score</span>
                      <span className="text-lg font-bold text-purple-400">{performanceSummary.consistencyScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${performanceSummary.consistencyScore}%` }}
                      />
                    </div>
                  </div>
                </div>
            </motion.div>
            )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
