'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import WeatherCard from '@/components/dashboard/WeatherCard';
import { Trophy, Target, Calendar, Plus, Edit, TrendingUp } from 'lucide-react';


interface Competition {
  id: string;
  user_id: string;
  competition_name: string;
  venue: string;
  competition_date: string;
  target_distance: number;
  notes: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
}

interface AthleteProfile {
  id: string;
  user_id: string;
  personal_best: number;
}

interface Practice {
  id: string;
  user_id: string;
  date: string;
  best_throw: number;
  average_throw: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [nextCompetition, setNextCompetition] = useState<Competition | null>(null);
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [recentPractice, setRecentPractice] = useState<Practice | null>(null);
  const [practiceHistory, setPracticeHistory] = useState<Practice[]>([]);
  const [competitionStatus, setCompetitionStatus] = useState<{ upcoming: number; completed: number; cancelled: number }>({ upcoming: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setLoading(false);
          return;
        }

        setUser(user);

        // Fetch next upcoming competition
        const { data: competitionsData } = await supabase
          .from('competitions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'upcoming')
          .gte('competition_date', new Date().toISOString().split('T')[0])
          .order('competition_date', { ascending: true })
          .limit(1);

        setNextCompetition(competitionsData?.[0] || null);

        // Fetch personal best from athlete profile
        const { data: profileData } = await supabase
          .from('athlete_profiles')
          .select('personal_best')
          .eq('user_id', user.id)
          .single();

        setPersonalBest(profileData?.personal_best || null);

        // Fetch recent practice
        const { data: practiceData } = await supabase
          .from('practices')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(1);

        setRecentPractice(practiceData?.[0] || null);

        // Fetch practice history for chart (last 10)
        const { data: practiceHistoryData } = await supabase
          .from('practices')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .limit(10);

        setPracticeHistory(practiceHistoryData || []);

        // Fetch all competitions for status chart
        const { data: allCompetitions } = await supabase
          .from('competitions')
          .select('status')
          .eq('user_id', user.id);

        const statusCounts = { upcoming: 0, completed: 0, cancelled: 0 };
        allCompetitions?.forEach(comp => {
          if (comp.status === 'upcoming') statusCounts.upcoming++;
          else if (comp.status === 'completed') statusCounts.completed++;
          else if (comp.status === 'cancelled') statusCounts.cancelled++;
        });
        setCompetitionStatus(statusCounts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const competitionDate = new Date(dateString);
    const diffTime = competitionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <TopNavbar />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
            <div className="text-zinc-400">Loading dashboard...</div>
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
          <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

          {/* Dashboard Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Next Competition */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Next Competition</h2>
              </div>
              {nextCompetition ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-white">{nextCompetition.competition_name}</p>
                    <p className="text-zinc-400">{nextCompetition.venue}</p>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(nextCompetition.competition_date)}</span>
                  </div>
                  <div className="mt-4 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                    <p className="text-purple-400 font-semibold">
                      {getDaysRemaining(nextCompetition.competition_date)} days remaining
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-400">No upcoming competitions.</p>
              )}
            </div>

            {/* Personal Best */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Personal Best</h2>
              </div>
              {personalBest !== null ? (
                <div>
                  <p className="text-4xl font-bold text-white">{personalBest}m</p>
                  <p className="text-zinc-400 mt-2">Your best throw to date</p>
                </div>
              ) : (
                <p className="text-zinc-400">No personal best recorded yet.</p>
              )}
            </div>

            {/* Recent Practice */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Recent Practice</h2>
              </div>
              {recentPractice ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(recentPractice.date)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-zinc-400 text-sm">Best Throw</p>
                      <p className="text-xl font-bold text-white">{recentPractice.best_throw}m</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <p className="text-zinc-400 text-sm">Average</p>
                      <p className="text-xl font-bold text-white">{recentPractice.average_throw}m</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-400">No practice sessions recorded yet.</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Plus className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                <Link
                  href="/practice/new"
                  className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all text-white"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Practice</span>
                </Link>
                <Link
                  href="/competition/new"
                  className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all text-white"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Add Competition</span>
                </Link>
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all text-white"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          {/* Weather Card */}
<div className="mb-6">
  <WeatherCard />
</div>

{/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Practice Performance Trend Chart */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Practice Performance Trend</h2>
              </div>
              {practiceHistory.length > 0 ? (
                <div className="relative h-64">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-zinc-400">
                    <span>{Math.max(...practiceHistory.map(p => p.best_throw))}m</span>
                    <span>{Math.round(Math.max(...practiceHistory.map(p => p.best_throw)) / 2)}m</span>
                    <span>0m</span>
                  </div>
                  
                  {/* Chart area */}
                  <div className="ml-14 h-full relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      <div className="border-t border-slate-700/30" />
                      <div className="border-t border-slate-700/30" />
                      <div className="border-t border-slate-700/30" />
                    </div>
                    
                    {/* Line chart */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      <polyline
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        points={practiceHistory.map((p, i) => {
                          const x = (i / (practiceHistory.length - 1)) * 100;
                          const maxThrow = Math.max(...practiceHistory.map(p => p.best_throw));
                          const y = 100 - (p.best_throw / maxThrow) * 100;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Data points */}
                    {practiceHistory.map((p, i) => {
                      const maxThrow = Math.max(...practiceHistory.map(p => p.best_throw));
                      const x = (i / (practiceHistory.length - 1)) * 100;
                      const y = 100 - (p.best_throw / maxThrow) * 100;
                      return (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-purple-500 rounded-full border-2 border-slate-900"
                          style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                          title={`${formatDate(p.date)}: ${p.best_throw}m`}
                        />
                      );
                    })}
                    
                    {/* X-axis labels */}
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-zinc-400">
                      {practiceHistory.map((p, i) => (
                        <span key={i} className="transform -translate-x-1/2" style={{ left: `${(i / (practiceHistory.length - 1)) * 100}%`, position: 'absolute' }}>
                          {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-zinc-400">
                  No practice data available.
                </div>
              )}
            </div>

            {/* Competition Status Pie Chart */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Competition Status</h2>
              </div>
              {competitionStatus.upcoming + competitionStatus.completed + competitionStatus.cancelled > 0 ? (
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {/* Upcoming */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray={`${(competitionStatus.upcoming / (competitionStatus.upcoming + competitionStatus.completed + competitionStatus.cancelled)) * 100} 100`}
                        strokeDashoffset="0"
                      />
                      {/* Completed */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="3"
                        strokeDasharray={`${(competitionStatus.completed / (competitionStatus.upcoming + competitionStatus.completed + competitionStatus.cancelled)) * 100} 100`}
                        strokeDashoffset={`-${(competitionStatus.upcoming / (competitionStatus.upcoming + competitionStatus.completed + competitionStatus.cancelled)) * 100}`}
                      />
                      {/* Cancelled */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3"
                        strokeDasharray={`${(competitionStatus.cancelled / (competitionStatus.upcoming + competitionStatus.completed + competitionStatus.cancelled)) * 100} 100`}
                        strokeDashoffset={`-${((competitionStatus.upcoming + competitionStatus.completed) / (competitionStatus.upcoming + competitionStatus.completed + competitionStatus.cancelled)) * 100}`}
                      />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">
                          {competitionStatus.upcoming + competitionStatus.completed + competitionStatus.cancelled}
                        </p>
                        <p className="text-xs text-zinc-400">Total</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="ml-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-white text-sm">Upcoming ({competitionStatus.upcoming})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-white text-sm">Completed ({competitionStatus.completed})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-white text-sm">Cancelled ({competitionStatus.cancelled})</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-zinc-400">
                  No competition data available.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
