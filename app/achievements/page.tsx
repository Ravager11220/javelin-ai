'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import Link from 'next/link';
import { 
  Trophy, 
  Target, 
  Award, 
  Flame, 
  Zap, 
  TrendingUp, 
  Star, 
  Lock, 
  Unlock, 
  Calendar,
  CheckCircle2,
  Medal,
  Crown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'practice' | 'competition' | 'milestone' | 'consistency';
}

interface Level {
  level: number;
  name: string;
  xpRequired: number;
  color: string;
}

const LEVELS: Level[] = [
  { level: 1, name: 'Rookie', xpRequired: 0, color: '#94a3b8' },
  { level: 2, name: 'Beginner', xpRequired: 100, color: '#10b981' },
  { level: 3, name: 'Intermediate', xpRequired: 300, color: '#3b82f6' },
  { level: 4, name: 'Advanced', xpRequired: 600, color: '#8b5cf6' },
  { level: 5, name: 'Elite', xpRequired: 1000, color: '#f59e0b' },
];

export default function AchievementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level>(LEVELS[0]);
  const [nextLevel, setNextLevel] = useState<Level | null>(null);
  const [xpProgress, setXpProgress] = useState(0);

  const fetchAchievementData = async () => {
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

      setPractices(practicesData || []);
      setCompetitions(competitionsData || []);
      setProfile(profileData);

      // Calculate achievements
      const calculatedAchievements = calculateAchievements(
        practicesData || [],
        competitionsData || [],
        profileData
      );
      setAchievements(calculatedAchievements);

      // Calculate XP and level
      const xp = calculatedAchievements.reduce((sum, a) => sum + (a.unlocked ? a.xpReward : 0), 0);
      setTotalXP(xp);

      // Calculate level
      let level = LEVELS[0];
      let nextLvl = LEVELS[1] || null;
      for (let i = 0; i < LEVELS.length; i++) {
        if (xp >= LEVELS[i].xpRequired) {
          level = LEVELS[i];
          nextLvl = LEVELS[i + 1] || null;
        }
      }
      setCurrentLevel(level);
      setNextLevel(nextLvl);

      // Calculate XP progress
      if (nextLvl) {
        const progress = ((xp - level.xpRequired) / (nextLvl.xpRequired - level.xpRequired)) * 100;
        setXpProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setXpProgress(100);
      }
    } catch (error) {
      console.error('Error fetching achievement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = (
    practices: Practice[],
    competitions: Competition[],
    profile: AthleteProfile | null
  ): Achievement[] => {
    const now = new Date();
    const completedCompetitions = competitions.filter(c => c.status === 'completed');
    const bestThrow = profile?.personal_best || Math.max(...practices.map(p => p.best_throw), 0);

    // Calculate training streak
    const practiceDates = practices.map(p => new Date(p.date).setHours(0, 0, 0, 0));
    const uniqueDates = [...new Set(practiceDates)].sort((a, b) => a - b);
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const date = uniqueDates[i];
      const prevDate = uniqueDates[i - 1];
      
      if (i === uniqueDates.length - 1) {
        const daysDiff = Math.floor((now.getTime() - date) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) {
          tempStreak = 1;
        }
      } else if (prevDate && (date - prevDate) === 86400000) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 0;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);
    currentStreak = tempStreak;

    // Calculate 30-day consistency
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentPractices = practices.filter(p => new Date(p.date) >= thirtyDaysAgo);
    const thirtyDayConsistency = recentPractices.length;

    // Calculate PB improvement
    const pbImproved = practices.length > 1 && bestThrow > practices[0].best_throw;

    const achievementList: Achievement[] = [
      // Practice achievements
      {
        id: 'first-practice',
        name: 'First Practice',
        description: 'Complete your first practice session',
        icon: <Target className="w-6 h-6" />,
        xpReward: 10,
        unlocked: practices.length >= 1,
        unlockedAt: practices.length >= 1 ? practices[0].created_at : undefined,
        progress: Math.min(practices.length, 1),
        maxProgress: 1,
        category: 'practice',
      },
      {
        id: '10-practices',
        name: '10 Practice Sessions',
        description: 'Complete 10 practice sessions',
        icon: <Award className="w-6 h-6" />,
        xpReward: 50,
        unlocked: practices.length >= 10,
        unlockedAt: practices.length >= 10 ? practices[9].created_at : undefined,
        progress: practices.length,
        maxProgress: 10,
        category: 'practice',
      },
      {
        id: '50-practices',
        name: '50 Practice Sessions',
        description: 'Complete 50 practice sessions',
        icon: <Trophy className="w-6 h-6" />,
        xpReward: 200,
        unlocked: practices.length >= 50,
        unlockedAt: practices.length >= 50 ? practices[49].created_at : undefined,
        progress: practices.length,
        maxProgress: 50,
        category: 'practice',
      },

      // Competition achievements
      {
        id: 'first-competition',
        name: 'First Competition',
        description: 'Participate in your first competition',
        icon: <Medal className="w-6 h-6" />,
        xpReward: 30,
        unlocked: competitions.length >= 1,
        unlockedAt: competitions.length >= 1 ? competitions[0].created_at : undefined,
        progress: competitions.length,
        maxProgress: 1,
        category: 'competition',
      },
      {
        id: '5-competitions',
        name: '5 Competitions',
        description: 'Participate in 5 competitions',
        icon: <Crown className="w-6 h-6" />,
        xpReward: 100,
        unlocked: competitions.length >= 5,
        unlockedAt: competitions.length >= 5 ? competitions[4].created_at : undefined,
        progress: competitions.length,
        maxProgress: 5,
        category: 'competition',
      },

      // Consistency achievements
      {
        id: '7-day-streak',
        name: '7-Day Training Streak',
        description: 'Train for 7 consecutive days',
        icon: <Flame className="w-6 h-6" />,
        xpReward: 75,
        unlocked: maxStreak >= 7,
        progress: maxStreak,
        maxProgress: 7,
        category: 'consistency',
      },
      {
        id: '30-day-consistency',
        name: '30-Day Consistency',
        description: 'Train at least 20 times in 30 days',
        icon: <Zap className="w-6 h-6" />,
        xpReward: 150,
        unlocked: thirtyDayConsistency >= 20,
        progress: thirtyDayConsistency,
        maxProgress: 20,
        category: 'consistency',
      },

      // Milestone achievements
      {
        id: 'pb-improved',
        name: 'Personal Best Improved',
        description: 'Improve your personal best throw',
        icon: <TrendingUp className="w-6 h-6" />,
        xpReward: 40,
        unlocked: pbImproved,
        progress: pbImproved ? 1 : 0,
        maxProgress: 1,
        category: 'milestone',
      },
      {
        id: '40m-club',
        name: '40m Club',
        description: 'Throw over 40 meters',
        icon: <Star className="w-6 h-6" />,
        xpReward: 60,
        unlocked: bestThrow >= 40,
        progress: bestThrow,
        maxProgress: 40,
        category: 'milestone',
      },
      {
        id: '50m-club',
        name: '50m Club',
        description: 'Throw over 50 meters',
        icon: <Star className="w-6 h-6" />,
        xpReward: 80,
        unlocked: bestThrow >= 50,
        progress: bestThrow,
        maxProgress: 50,
        category: 'milestone',
      },
      {
        id: '60m-club',
        name: '60m Club',
        description: 'Throw over 60 meters',
        icon: <Star className="w-6 h-6" />,
        xpReward: 120,
        unlocked: bestThrow >= 60,
        progress: bestThrow,
        maxProgress: 60,
        category: 'milestone',
      },
      {
        id: 'elite-thrower',
        name: 'Elite Thrower',
        description: 'Throw over 70 meters',
        icon: <Crown className="w-6 h-6" />,
        xpReward: 200,
        unlocked: bestThrow >= 70,
        progress: bestThrow,
        maxProgress: 70,
        category: 'milestone',
      },
    ];

    return achievementList;
  };

  useEffect(() => {
    fetchAchievementData();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'practice':
        return 'from-purple-500/20 to-purple-500/5 border-purple-500/30';
      case 'competition':
        return 'from-amber-500/20 to-amber-500/5 border-amber-500/30';
      case 'consistency':
        return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30';
      case 'milestone':
        return 'from-blue-500/20 to-blue-500/5 border-blue-500/30';
      default:
        return 'from-slate-500/20 to-slate-500/5 border-slate-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'practice':
        return <Target className="w-4 h-4" />;
      case 'competition':
        return <Award className="w-4 h-4" />;
      case 'consistency':
        return <Flame className="w-4 h-4" />;
      case 'milestone':
        return <Star className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

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
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Achievements</h1>
                <p className="text-slate-400">Track your progress and unlock rewards</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="h-48 bg-slate-800/50 rounded-2xl border border-slate-700/50 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-40 bg-slate-800/50 rounded-2xl border border-slate-700/50 animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Level & XP Section */}
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Level Badge */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{currentLevel.level}</div>
                        <div className="text-xs text-white/80">Level</div>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-slate-900 rounded-full border border-purple-500/30">
                      <span className="text-xs font-medium" style={{ color: currentLevel.color }}>
                        {currentLevel.name}
                      </span>
                    </div>
                  </div>

                  {/* XP Progress */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Total XP</h3>
                        <p className="text-sm text-slate-400">{totalXP} XP earned</p>
                      </div>
                      {nextLevel && (
                        <div className="text-right">
                          <p className="text-sm text-slate-400">
                            {nextLevel.xpRequired - totalXP} XP to {nextLevel.name}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">{currentLevel.xpRequired} XP</span>
                      <span className="text-xs text-slate-400">
                        {nextLevel ? `${nextLevel.xpRequired} XP` : 'Max Level'}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="text-2xl font-bold text-purple-400">{unlockedCount}</div>
                      <div className="text-xs text-slate-400">Unlocked</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="text-2xl font-bold text-blue-400">{completionPercentage}%</div>
                      <div className="text-xs text-slate-400">Complete</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty State */}
              {achievements.length === 0 ? (
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                  <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No achievements yet</h3>
                  <p className="text-slate-400 mb-6">Start logging your practice sessions to unlock achievements</p>
                  <Link
                    href="/practice/new"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Add Practice Session
                  </Link>
                </div>
              ) : (
                <>
                  {/* Achievement Categories */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Hall of Achievements</h2>
                    <div className="flex flex-wrap gap-2">
                      {['practice', 'competition', 'consistency', 'milestone'].map((category) => (
                        <button
                          key={category}
                          className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-purple-500/30 transition-all duration-300 capitalize"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Achievements Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`
                          relative bg-gradient-to-br ${getCategoryColor(achievement.category)}
                          backdrop-blur-sm rounded-2xl border p-6
                          transition-all duration-300 hover:scale-105 hover:shadow-lg
                          ${achievement.unlocked 
                            ? 'opacity-100' 
                            : 'opacity-60 hover:opacity-80'
                          }
                        `}
                      >
                        {/* Achievement Icon */}
                        <div className={`
                          w-16 h-16 rounded-xl flex items-center justify-center mb-4
                          ${achievement.unlocked 
                            ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                            : 'bg-slate-700/50'
                          }
                        `}>
                          {achievement.unlocked ? (
                            <div className="text-white">
                              {achievement.icon}
                            </div>
                          ) : (
                            <Lock className="w-8 h-8 text-slate-500" />
                          )}
                        </div>

                        {/* Achievement Info */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-white">{achievement.name}</h3>
                            {achievement.unlocked && (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            {getCategoryIcon(achievement.category)}
                            <span className="capitalize">{achievement.category}</span>
                            <span>•</span>
                            <span className="text-purple-400">+{achievement.xpReward} XP</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-white">
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`
                                h-full transition-all duration-500 ease-out
                                ${achievement.unlocked 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
                                }
                              `}
                              style={{ 
                                width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` 
                              }}
                            />
                          </div>
                        </div>

                        {/* Unlock Date */}
                        {achievement.unlocked && achievement.unlockedAt && (
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {/* Locked Badge */}
                        {!achievement.unlocked && (
                          <div className="absolute top-4 right-4">
                            <div className="px-2 py-1 bg-slate-800/80 rounded-full border border-slate-700/50">
                              <span className="text-xs text-slate-400">Locked</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
