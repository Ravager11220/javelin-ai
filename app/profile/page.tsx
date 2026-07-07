'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { User as UserIcon, Mail, Calendar, Ruler, Weight, Target, Edit, Plus, TrendingUp, Award, Activity, Flame, Trophy, Clock, Zap } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import { motion } from 'framer-motion';

interface AthleteProfile {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  height: number;
  weight: number;
  dominant_arm: string;
  personal_best: number;
  bio: string;
  avatar_url: string;
  created_at: string;
}

interface Practice {
  id: string;
  user_id: string;
  date: string;
  best_throw: number;
  average_throw: number;
  total_throws: number;
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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndProfile() {
      try {
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) {
          setLoading(false);
          return;
        }

        setUser(user);

        // Fetch athlete profile
        const { data: profileData, error: profileError } = await supabase
          .from('athlete_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        setProfile(profileData);

        // Fetch practices and competitions
        const [practicesData, competitionsData] = await Promise.all([
          supabase.from('practices').select('*').eq('user_id', user.id).order('date', { ascending: false }),
          supabase.from('competitions').select('*').eq('user_id', user.id).order('competition_date', { ascending: false }),
        ]);

        setPractices(practicesData.data || []);
        setCompetitions(competitionsData.data || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndProfile();
  }, []);

  // Calculate performance metrics
  const calculatePerformanceScore = () => {
    if (!profile || practices.length === 0) return 0;
    
    let score = 0;
    
    // Practice consistency (30 points)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentPractices = practices.filter(p => new Date(p.date) >= last30Days);
    score += Math.min(recentPractices.length * 3, 30);
    
    // Personal best progress (25 points)
    if (profile.personal_best > 0) {
      const avgThrow = practices.reduce((sum, p) => sum + p.average_throw, 0) / practices.length;
      const progressRatio = avgThrow / profile.personal_best;
      score += Math.min(progressRatio * 25, 25);
    }
    
    // Competition participation (25 points)
    const completedCompetitions = competitions.filter(c => c.status === 'completed').length;
    score += Math.min(completedCompetitions * 5, 25);
    
    // Profile completeness (20 points)
    const completionRate = calculateProfileCompletion();
    score += completionRate * 0.2;
    
    return Math.round(score);
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    const fields = [
      profile.full_name,
      profile.age,
      profile.height,
      profile.weight,
      profile.dominant_arm,
      profile.personal_best,
      profile.bio,
      profile.avatar_url,
    ];
    
    const filledFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const calculateBestMonth = () => {
    if (practices.length === 0) return null;
    
    const monthlyStats: { [key: string]: { total: number; count: number } } = {};
    
    practices.forEach(practice => {
      const month = new Date(practice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!monthlyStats[month]) {
        monthlyStats[month] = { total: 0, count: 0 };
      }
      monthlyStats[month].total += practice.best_throw;
      monthlyStats[month].count += 1;
    });
    
    let bestMonth = null;
    let bestAvg = 0;
    
    Object.entries(monthlyStats).forEach(([month, stats]) => {
      const avg = stats.total / stats.count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestMonth = month;
      }
    });
    
    return bestMonth;
  };

  const calculateTotalThrowDistance = () => {
    return practices.reduce((sum, p) => sum + (p.total_throws * p.average_throw), 0);
  };

  const calculateTotalPracticeHours = () => {
    // Estimate 1 hour per practice session (can be adjusted based on actual data)
    return practices.length;
  };

  const calculateCompetitionWinRate = () => {
    const completedCompetitions = competitions.filter(c => c.status === 'completed');
    if (completedCompetitions.length === 0) return 0;
    
    const wonCompetitions = completedCompetitions.filter(c => {
      if (!c.result_distance || !profile?.personal_best) return false;
      return c.result_distance >= profile.personal_best * 0.9; // Consider winning if within 90% of PB
    });
    
    return Math.round((wonCompetitions.length / completedCompetitions.length) * 100);
  };

  const getMonthlyActivityData = () => {
    const activityData: { [key: string]: number } = {};
    const now = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      activityData[key] = 0;
    }
    
    practices.forEach(practice => {
      const month = new Date(practice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (activityData.hasOwnProperty(month)) {
        activityData[month]++;
      }
    });
    
    return Object.entries(activityData).map(([month, count]) => ({ month, count }));
  };

  const getPersonalRecordsTimeline = () => {
    const records: { date: string; distance: number }[] = [];
    let currentBest = 0;
    
    [...practices].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(practice => {
      if (practice.best_throw > currentBest) {
        currentBest = practice.best_throw;
        records.push({
          date: practice.date,
          distance: practice.best_throw,
        });
      }
    });
    
    return records;
  };

  const performanceScore = calculatePerformanceScore();
  const profileCompletion = calculateProfileCompletion();
  const bestMonth = calculateBestMonth();
  const totalThrowDistance = calculateTotalThrowDistance();
  const totalPracticeHours = calculateTotalPracticeHours();
  const competitionWinRate = calculateCompetitionWinRate();
  const monthlyActivityData = getMonthlyActivityData();
  const personalRecordsTimeline = getPersonalRecordsTimeline();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <TopNavbar />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
            <div className="space-y-6">
              <div className="h-10 w-48 bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-6 w-64 bg-slate-800 rounded-lg animate-pulse" />
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 animate-pulse">
                <div className="h-32 w-32 bg-slate-800 rounded-2xl mb-6" />
                <div className="h-8 w-3/4 bg-slate-800 rounded-lg mb-4" />
                <div className="h-4 w-1/2 bg-slate-800 rounded" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <TopNavbar />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 flex items-center justify-center">
            <p className="text-slate-400">Please log in to view your profile.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <TopNavbar />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 sm:p-12 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserIcon className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">No profile created yet.</h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Create your athlete profile to start tracking your training and performance.
                </p>
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                >
                  <Plus className="w-5 h-5" />
                  Create Profile
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <TopNavbar />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-8"
            >
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Profile</h1>
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Link>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 sm:p-8 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-slate-700"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-slate-700">
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {profile.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Email */}
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{profile.full_name}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            {/* Bio */}
            {profile.bio && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">About</h3>
                <p className="text-slate-300 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Age */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Age</span>
                </div>
                <p className="text-xl font-bold text-white">{profile.age}</p>
              </div>

              {/* Height */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Ruler className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Height</span>
                </div>
                <p className="text-xl font-bold text-white">{profile.height} <span className="text-sm font-normal text-slate-400">cm</span></p>
              </div>

              {/* Weight */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Weight className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Weight</span>
                </div>
                <p className="text-xl font-bold text-white">{profile.weight} <span className="text-sm font-normal text-slate-400">kg</span></p>
              </div>

              {/* Dominant Arm */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Arm</span>
                </div>
                <p className="text-xl font-bold text-white capitalize">{profile.dominant_arm}</p>
              </div>

              {/* Personal Best */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Best</span>
                </div>
                <p className="text-xl font-bold text-white">{profile.personal_best} <span className="text-sm font-normal text-slate-400">m</span></p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Score & Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Performance Score Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Performance Score</h3>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 352' }}
                    animate={{ strokeDasharray: `${(performanceScore / 100) * 352} 352` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{performanceScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Profile Completion</h3>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 352' }}
                    animate={{ strokeDasharray: `${(profileCompletion / 100) * 352} 352` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{profileCompletion}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Best Month</span>
                <span className="text-white font-medium">{bestMonth || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Total Distance</span>
                <span className="text-white font-medium">{totalThrowDistance}m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Practice Hours</span>
                <span className="text-white font-medium">{totalPracticeHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Win Rate</span>
                <span className="text-white font-medium">{competitionWinRate}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Monthly Activity</h3>
          </div>
          <div className="grid grid-cols-12 gap-2">
            {monthlyActivityData.map((data, index) => (
              <motion.div
                key={data.month}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative"
              >
                <div
                  className={`h-16 rounded-lg transition-all duration-300 ${
                    data.count === 0
                      ? 'bg-slate-800/50'
                      : data.count <= 2
                      ? 'bg-blue-500/30'
                      : data.count <= 4
                      ? 'bg-blue-500/50'
                      : data.count <= 6
                      ? 'bg-blue-500/70'
                      : 'bg-blue-500'
                  }`}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {data.month}: {data.count} sessions
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-slate-800/50 rounded" />
              <div className="w-3 h-3 bg-blue-500/30 rounded" />
              <div className="w-3 h-3 bg-blue-500/50 rounded" />
              <div className="w-3 h-3 bg-blue-500/70 rounded" />
              <div className="w-3 h-3 bg-blue-500 rounded" />
            </div>
            <span>More</span>
          </div>
        </motion.div>

        {/* Personal Records Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Personal Records Timeline</h3>
          </div>
          {personalRecordsTimeline.length > 0 ? (
            <div className="space-y-4">
              {personalRecordsTimeline.map((record, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                >
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{record.distance}m</p>
                    <p className="text-slate-400 text-sm">{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">New Record</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No personal records yet. Keep practicing!</p>
          )}
        </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
