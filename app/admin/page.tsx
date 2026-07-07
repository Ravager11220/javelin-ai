'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import { 
  Users, 
  Target, 
  Trophy, 
  TrendingUp, 
  Activity, 
  UserPlus, 
  Calendar,
  BarChart3,
  Shield
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminStats {
  totalUsers: number;
  totalPracticeSessions: number;
  totalCompetitions: number;
  averagePersonalBest: number;
  activeUsers: number;
}

interface RecentUser {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
}

interface RecentActivity {
  id: string;
  type: 'practice' | 'competition';
  user_id: string;
  date: string;
  details: string;
}

interface UserGrowthData {
  date: string;
  users: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPracticeSessions: 0,
    totalCompetitions: 0,
    averagePersonalBest: 0,
    activeUsers: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user is admin (you can implement your own admin check logic)
      // For now, we'll allow access to authenticated users
      setIsAdmin(true);

      // Fetch total users (count from athlete_profiles as proxy for user count)
      const { count: userCount } = await supabase
        .from('athlete_profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total practice sessions
      const { count: practiceCount } = await supabase
        .from('practices')
        .select('*', { count: 'exact', head: true });

      // Fetch total competitions
      const { count: competitionCount } = await supabase
        .from('competitions')
        .select('*', { count: 'exact', head: true });

      // Fetch average personal best
      const { data: profiles } = await supabase
        .from('athlete_profiles')
        .select('personal_best');

      const avgPB = profiles && profiles.length > 0
        ? profiles.reduce((sum, p) => sum + (p.personal_best || 0), 0) / profiles.length
        : 0;

      // Fetch active users (users with practice in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activePractices } = await supabase
        .from('practices')
        .select('user_id')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

      const activeUserCount = new Set(activePractices?.map(p => p.user_id)).size;

      setStats({
        totalUsers: userCount || 0,
        totalPracticeSessions: practiceCount || 0,
        totalCompetitions: competitionCount || 0,
        averagePersonalBest: Math.round(avgPB * 10) / 10,
        activeUsers: activeUserCount,
      });

      // Fetch recent users (from athlete_profiles as proxy)
      const { data: recentProfiles } = await supabase
        .from('athlete_profiles')
        .select('id, user_id, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get emails for these users
      const userIds = recentProfiles?.map(p => p.user_id) || [];
      const { data: usersData } = await supabase.auth.admin.listUsers();
      
      const recentUsersWithEmail = recentProfiles?.map(profile => {
        const userData = usersData.users.find(u => u.id === profile.user_id);
        return {
          id: profile.id,
          user_id: profile.user_id,
          email: userData?.email || 'Unknown',
          created_at: profile.created_at,
        };
      }) || [];

      setRecentUsers(recentUsersWithEmail);

      // Fetch recent activities (practices and competitions)
      const { data: recentPractices } = await supabase
        .from('practices')
        .select('id, user_id, date, best_throw, average_throw')
        .order('date', { ascending: false })
        .limit(5);

      const { data: recentCompetitions } = await supabase
        .from('competitions')
        .select('id, user_id, competition_date, competition_name, status')
        .order('competition_date', { ascending: false })
        .limit(5);

      const activities: RecentActivity[] = [];

      recentPractices?.forEach(practice => {
        activities.push({
          id: practice.id,
          type: 'practice',
          user_id: practice.user_id,
          date: practice.date,
          details: `Practice: Best ${practice.best_throw}m, Avg ${practice.average_throw}m`,
        });
      });

      recentCompetitions?.forEach(competition => {
        activities.push({
          id: competition.id,
          type: 'competition',
          user_id: competition.user_id,
          date: competition.competition_date,
          details: `Competition: ${competition.competition_name} (${competition.status})`,
        });
      });

      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivities(activities.slice(0, 10));

      // Fetch user growth data (last 6 months)
      const growthData: UserGrowthData[] = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const { count: monthUsers } = await supabase
          .from('athlete_profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        growthData.push({
          date: date.toLocaleDateString('en-US', { month: 'short' }),
          users: monthUsers || 0,
        });
      }

      setUserGrowthData(growthData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <TopNavbar />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
            <div className="space-y-6">
              <div className="h-10 w-48 bg-slate-800 rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <TopNavbar />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 flex items-center justify-center">
            <div className="text-center">
              <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
              <p className="text-slate-400">You don't have permission to access this page.</p>
            </div>
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-slate-400">Monitor platform-wide metrics and user activity</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Total Users */}
            <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Users</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{stats.totalUsers}</p>
              <p className="text-slate-400 text-sm">Registered athletes</p>
            </motion.div>

            {/* Total Practice Sessions */}
            <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Practice Sessions</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{stats.totalPracticeSessions}</p>
              <p className="text-slate-400 text-sm">Total sessions logged</p>
            </motion.div>

            {/* Total Competitions */}
            <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Competitions</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{stats.totalCompetitions}</p>
              <p className="text-slate-400 text-sm">Total competitions</p>
            </motion.div>

            {/* Average Personal Best */}
            <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Avg Personal Best</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{stats.averagePersonalBest}m</p>
              <p className="text-slate-400 text-sm">Across all users</p>
            </motion.div>

            {/* Active Users */}
            <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Active Users</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{stats.activeUsers}</p>
              <p className="text-slate-400 text-sm">Last 30 days</p>
            </motion.div>

            {/* User Activity Rate */}
            <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-pink-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Activity Rate</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-2">
                {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
              </p>
              <p className="text-slate-400 text-sm">User engagement</p>
            </motion.div>
          </motion.div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">User Growth (Last 6 Months)</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Registrations & Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Registrations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <UserPlus className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Recent Registrations</h2>
              </div>
              <div className="space-y-4">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.email}</p>
                          <p className="text-slate-400 text-sm">Joined {formatDate(user.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-8">No recent registrations</p>
                )}
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Recent Activities</h2>
              </div>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'practice' ? 'bg-blue-500/20' : 'bg-orange-500/20'
                      }`}>
                        {activity.type === 'practice' ? (
                          <Target className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Trophy className="w-5 h-5 text-orange-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.details}</p>
                        <p className="text-slate-400 text-sm">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-8">No recent activities</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
