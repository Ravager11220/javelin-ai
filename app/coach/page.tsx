'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import { Dumbbell, Moon, Target, Calendar, CheckCircle, Clock, AlertTriangle, Trophy, TrendingUp, Award, Activity, Brain, Zap, Heart, StretchHorizontal, Play, Coffee, ArrowUp, Minus, ArrowDown, Lightbulb, Shield, AlertOctagon, BarChart3, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

interface RecommendationCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'good' | 'warning' | 'critical';
  statusText: string;
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

interface WorkoutDay {
  day: string;
  type: 'technical' | 'strength' | 'recovery' | 'mobility' | 'simulation' | 'rest';
  icon: React.ReactNode;
  description: string;
  isToday: boolean;
}
interface WeatherData {
  name: string;
  weather: {
    main: string;
    description: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
}

export default function CoachPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);


  useEffect(() => {
    async function fetchCoachData() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setLoading(false);
          return;
        }

        setUser(user);

        // Fetch athlete profile
        const { data: profileData } = await supabase
          .from('athlete_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setProfile(profileData || null);

        // Fetch practice sessions
        const { data: practiceData } = await supabase
          .from('practices')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        setPractices(practiceData || []);

        // Fetch competitions
        const { data: competitionData } = await supabase
          .from('competitions')
          .select('*')
          .eq('user_id', user.id)
          .order('competition_date', { ascending: true })

setCompetitions(competitionData || []);
const weatherResponse = await fetch('/api/weather');

if (weatherResponse.ok) {
  const weatherData = await weatherResponse.json();
  setWeather(weatherData);
}
      } catch (error) {
        console.error('Error fetching coach data:', error);
      } finally {
        setLoading(false);
      }
    }
    

    fetchCoachData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <Clock className="w-4 h-4" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getConsistencyRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Good':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Average':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Needs Improvement':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTrainingLoadColor = (load: string) => {
    switch (load) {
      case 'Light':
        return 'bg-green-500';
      case 'Moderate':
        return 'bg-blue-500';
      case 'Heavy':
        return 'bg-orange-500';
      case 'Overtraining':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getTrainingFocusIcon = (focus: string) => {
    switch (focus) {
      case 'Technical Throws':
        return <Target className="w-6 h-6" />;
      case 'Strength Session':
        return <Zap className="w-6 h-6" />;
      case 'Recovery & Mobility':
        return <Heart className="w-6 h-6" />;
      case 'Competition Simulation':
        return <Play className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

  const getTrainingFocusColor = (focus: string) => {
    switch (focus) {
      case 'Technical Throws':
        return 'bg-purple-500/20 text-purple-400';
      case 'Strength Session':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Recovery & Mobility':
        return 'bg-pink-500/20 text-pink-400';
      case 'Competition Simulation':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low Risk':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Moderate Risk':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High Risk':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const upcomingCompetitions = competitions.filter(c => c.status === 'upcoming');
  
  // Find nearest upcoming competition for countdown
  const nearestCompetition = upcomingCompetitions.length > 0 ? upcomingCompetitions[0] : null;
  const daysUntilCompetition = nearestCompetition
    ? Math.ceil((new Date(nearestCompetition.competition_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Practice Consistency Analysis
  const calculatePracticeConsistency = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const practicesLast7Days = practices.filter(p => new Date(p.date) >= sevenDaysAgo).length;
    const practicesLast30Days = practices.filter(p => new Date(p.date) >= thirtyDaysAgo).length;
    const averageSessionsPerWeek = practicesLast30Days / 4; // Approximate weeks in 30 days

    // Consistency Rating
    let consistencyRating: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
    if (averageSessionsPerWeek >= 5) {
      consistencyRating = 'Excellent';
    } else if (averageSessionsPerWeek >= 3) {
      consistencyRating = 'Good';
    } else if (averageSessionsPerWeek >= 2) {
      consistencyRating = 'Average';
    } else {
      consistencyRating = 'Needs Improvement';
    }

    // Training Load Indicator
    let trainingLoad: 'Light' | 'Moderate' | 'Heavy' | 'Overtraining';
    if (practicesLast7Days <= 2) {
      trainingLoad = 'Light';
    } else if (practicesLast7Days <= 4) {
      trainingLoad = 'Moderate';
    } else if (practicesLast7Days <= 6) {
      trainingLoad = 'Heavy';
    } else {
      trainingLoad = 'Overtraining';
    }

    return {
      practicesLast7Days,
      practicesLast30Days,
      averageSessionsPerWeek: Math.round(averageSessionsPerWeek * 10) / 10,
      consistencyRating,
      trainingLoad,
    };
  };

  const practiceConsistency = calculatePracticeConsistency();

  // AI Performance Prediction
  const calculatePerformancePrediction = () => {
    const recentPractices = practices.slice(0, 10);
    
    if (recentPractices.length < 3) {
      return {
        hasEnoughData: false,
        predictedThrow: null,
        confidence: 0,
        trend: 'stable' as 'improving' | 'stable' | 'declining',
        performanceLevel: '',
        explanation: 'Not enough data to generate a reliable prediction.',
      };
    }

    // Calculate metrics
    const averageThrow = recentPractices.reduce((sum, p) => sum + p.average_throw, 0) / recentPractices.length;
    const bestThrow = Math.max(...recentPractices.map(p => p.best_throw));
    const personalBest = profile?.personal_best || bestThrow;

    // Recent trend (compare first half vs second half of recent practices)
    const midPoint = Math.floor(recentPractices.length / 2);
    const firstHalfAvg = recentPractices.slice(0, midPoint).reduce((sum, p) => sum + p.average_throw, 0) / midPoint;
    const secondHalfAvg = recentPractices.slice(midPoint).reduce((sum, p) => sum + p.average_throw, 0) / (recentPractices.length - midPoint);
    const trendFactor = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;

    let trend: 'improving' | 'stable' | 'declining';
    if (trendFactor > 0.05) {
      trend = 'improving';
    } else if (trendFactor < -0.05) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }

    // Consistency score (lower variance = higher consistency)
    const variance = recentPractices.reduce((sum, p) => Math.pow(p.average_throw - averageThrow, 2), 0) / recentPractices.length;
    const consistencyScore = Math.max(0, 1 - (variance / (averageThrow * averageThrow))); // Normalized 0-1

    // Weighted prediction algorithm
    const recentAvgWeight = 0.5;
    const personalBestWeight = 0.2;
    const trendWeight = 0.2;
    const consistencyWeight = 0.1;

    const trendAdjustment = trend === 'improving' ? 1.05 : trend === 'declining' ? 0.95 : 1.0;
    const predictedThrow = Math.round(
      (averageThrow * recentAvgWeight) +
      (personalBest * personalBestWeight) +
      (averageThrow * trendAdjustment * trendWeight) +
      (averageThrow * consistencyScore * consistencyWeight)
    );

    // Confidence based on data points and consistency
    const dataPointsFactor = Math.min(recentPractices.length / 10, 1);
    const confidence = Math.round((dataPointsFactor * 0.6 + consistencyScore * 0.4) * 100);

    // Performance level
    let performanceLevel = '';
    const pbPercentage = (predictedThrow / personalBest) * 100;
    if (pbPercentage >= 95) {
      performanceLevel = 'Elite';
    } else if (pbPercentage >= 85) {
      performanceLevel = 'High';
    } else if (pbPercentage >= 70) {
      performanceLevel = 'Moderate';
    } else {
      performanceLevel = 'Developing';
    }

    // Generate explanation
    let explanation = '';
    if (trend === 'improving') {
      explanation = `Based on your recent improvement trend and consistent training, you're predicted to perform at ${predictedThrow}m. Your recent average of ${Math.round(averageThrow)}m shows positive momentum.`;
    } else if (trend === 'declining') {
      explanation = `Your recent sessions show a slight decline. With focused training, you can reach ${predictedThrow}m. Focus on technique consistency to reverse this trend.`;
    } else {
      explanation = `Your performance is stable with a recent average of ${Math.round(averageThrow)}m. Maintaining your current training approach should yield a predicted performance of ${predictedThrow}m.`;
    }

    return {
      hasEnoughData: true,
      predictedThrow,
      confidence,
      trend,
      performanceLevel,
      explanation,
    };
  };

  const performancePrediction = calculatePerformancePrediction();

  const weatherRecommendation = (() => {
  if (!weather) {
    return {
      title: "Loading...",
      description: "Fetching current weather conditions...",
      status: "warning" as const,
      statusText: "Loading",
    };
  }

  const windSpeed = weather.wind.speed * 3.6;
  const condition = weather.weather[0].main.toLowerCase();

  if (condition.includes("rain")) {
    return {
      title: "Indoor Training Recommended",
      description:
        "Rain detected. Focus on strength, mobility, and technical drills indoors.",
      status: "warning" as const,
      statusText: "Rain",
    };
  }

  if (windSpeed > 25) {
    return {
      title: "Strong Wind Training",
      description:
        "Strong winds today. Practice release angle and throwing accuracy instead of maximum distance.",
      status: "warning" as const,
      statusText: "Wind",
    };
  }

  return {
    title: "Ideal Training Conditions",
    description: "Weather conditions are excellent for outdoor javelin practice.",
    status: "good" as const,
    statusText: "Good",
  };
})();
  const averageThrow = practices.length > 0
    ? Math.round(practices.reduce((sum, p) => sum + p.average_throw, 0) / practices.length)
    : null;

  // Calculate AI Readiness Score
  const calculateReadinessScore = (): { score: number; explanation: string } => {
    let score = 0;
    let practiceConsistencyScore = 0;
    let competitionPrepScore = 0;
    let personalBestProgressScore = 0;
    let recoveryScore = 0;

    // Practice consistency (40%)
    const recentPractices = practices.filter(p => {
      const practiceDate = new Date(p.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return practiceDate >= weekAgo;
    });
    
    if (recentPractices.length >= 5) practiceConsistencyScore = 100;
    else if (recentPractices.length >= 3) practiceConsistencyScore = 75;
    else if (recentPractices.length >= 1) practiceConsistencyScore = 50;
    else practiceConsistencyScore = 0;

    // Competition preparation (30%)
    const nextCompetition = upcomingCompetitions[0];
    if (nextCompetition) {
      const daysUntil = Math.ceil((new Date(nextCompetition.competition_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil > 30) competitionPrepScore = 100;
      else if (daysUntil >= 14) competitionPrepScore = 85;
      else if (daysUntil >= 7) competitionPrepScore = 70;
      else competitionPrepScore = 50;
    } else {
      competitionPrepScore = 40;
    }

    // Personal best progress (20%)
    if (profile?.personal_best && averageThrow) {
      const progressPercentage = (averageThrow / profile.personal_best) * 100;
      if (progressPercentage >= 95) personalBestProgressScore = 100;
      else if (progressPercentage >= 85) personalBestProgressScore = 80;
      else if (progressPercentage >= 70) personalBestProgressScore = 60;
      else personalBestProgressScore = 40;
    } else {
      personalBestProgressScore = 50;
    }

    // Recovery recommendation (10%)
    if (recentPractices.length <= 4) recoveryScore = 100;
    else if (recentPractices.length <= 6) recoveryScore = 70;
    else recoveryScore = 40;

    // Calculate weighted score
    score = Math.round(
      (practiceConsistencyScore * 0.4) +
      (competitionPrepScore * 0.3) +
      (personalBestProgressScore * 0.2) +
      (recoveryScore * 0.1)
    );

    // Generate explanation
    let explanation = '';
    if (score >= 80) {
      explanation = 'Your training readiness is excellent. You are well-prepared for competition.';
    } else if (score >= 60) {
      explanation = 'Your training readiness is improving. Continue practicing consistently.';
    } else {
      explanation = 'Your training readiness needs attention. Focus on consistency and recovery.';
    }

    return { score, explanation };
  };

  const { score: readinessScore, explanation: readinessExplanation } = calculateReadinessScore();

  // Personalized AI Coach - must be after readinessScore is calculated
  const personalizedCoach = (() => {
    const today = new Date().getDay();
    const dayOfWeek = today === 0 ? 6 : today - 1; // Monday = 0, Sunday = 6

    // Determine training focus based on multiple factors
    let trainingFocus: 'Technical Throws' | 'Strength Session' | 'Recovery & Mobility' | 'Competition Simulation';
    let coachAdvice = '';
    let riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk';
    let riskExplanation = '';
    const dailyGoals: string[] = [];

    // Weather considerations
    const isRainy = !!(weather && weather.weather && weather.weather[0] && weather.weather[0].main && weather.weather[0].main.toLowerCase().includes('rain'));
    const isWindy = !!(weather && weather.wind && (weather.wind.speed * 3.6) > 25);
    const isBadWeather = isRainy || isWindy;

    // Competition proximity
    const daysUntilComp = daysUntilCompetition || 999;

    // Training load
    const trainingLoad = practiceConsistency.trainingLoad;

    // AI readiness
    const readiness = readinessScore;

    // Generate training focus
    if (isBadWeather) {
      trainingFocus = 'Strength Session';
      coachAdvice = `Due to ${isRainy ? 'rain' : 'strong winds'}, focus on indoor strength training. Work on explosive power and core stability to maintain your conditioning without risking injury in poor conditions.`;
    } else if (daysUntilComp < 7) {
      trainingFocus = 'Recovery & Mobility';
      coachAdvice = `With your competition in ${daysUntilComp} days, prioritize recovery and mobility. Light stretching and visualization will keep you sharp without fatiguing your muscles before the big event.`;
    } else if (daysUntilComp < 14) {
      trainingFocus = 'Competition Simulation';
      coachAdvice = `Competition is approaching in ${daysUntilComp} days. Focus on competition-specific drills and simulate match conditions to prepare mentally and physically.`;
    } else if (trainingLoad === 'Overtraining') {
      trainingFocus = 'Recovery & Mobility';
      coachAdvice = `Your training load indicates overtraining. Take a recovery day with light mobility work and extra hydration to prevent burnout and injury.`;
    } else if (trainingLoad === 'Heavy') {
      trainingFocus = 'Recovery & Mobility';
      coachAdvice = `You've had a heavy training week. Focus on active recovery, stretching, and light mobility to allow your muscles to repair and grow stronger.`;
    } else if (readiness < 60) {
      trainingFocus = 'Technical Throws';
      coachAdvice = `Your readiness score suggests you need consistency. Focus on technical fundamentals with moderate volume to build a solid foundation and improve your overall readiness.`;
    } else if (performancePrediction.trend === 'declining') {
      trainingFocus = 'Technical Throws';
      coachAdvice = `Your recent trend shows a decline. Return to basics with technical drills focusing on form and mechanics to reverse this trend and rebuild confidence.`;
    } else if (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 4) {
      trainingFocus = 'Technical Throws';
      coachAdvice = `Focus on technical precision today. Work on your release mechanics and follow-through to build muscle memory and consistency.`;
    } else if (dayOfWeek === 1 || dayOfWeek === 3) {
      trainingFocus = 'Strength Session';
      coachAdvice = `Today is a strength day. Focus on explosive power development through plyometrics and resistance training to improve your throwing distance.`;
    } else {
      trainingFocus = 'Recovery & Mobility';
      coachAdvice = `Take a recovery day to allow your body to adapt to the training stimulus. Focus on mobility, stretching, and light active recovery.`;
    }

    // Risk assessment
    if (trainingLoad === 'Overtraining') {
      riskLevel = 'High Risk';
      riskExplanation = 'High training volume increases injury risk. Prioritize recovery and reduce intensity.';
    } else if (isBadWeather) {
      riskLevel = 'Moderate Risk';
      riskExplanation = `Weather conditions (${isRainy ? 'rain' : 'strong winds'}) increase injury risk. Adjust training to indoor activities.`;
    } else if (daysUntilComp < 7 && trainingLoad === 'Heavy') {
      riskLevel = 'High Risk';
      riskExplanation = 'Heavy training close to competition may impair performance. Reduce intensity immediately.';
    } else if (readiness < 50) {
      riskLevel = 'Moderate Risk';
      riskExplanation = 'Low readiness score indicates potential overtraining or inadequate recovery. Monitor fatigue levels closely.';
    } else if (performancePrediction.trend === 'declining') {
      riskLevel = 'Moderate Risk';
      riskExplanation = 'Declining performance trend may indicate overtraining or technical issues. Review training load and form.';
    } else {
      riskLevel = 'Low Risk';
      riskExplanation = 'Training load and recovery are well-balanced. Continue with current approach while monitoring for changes.';
    }

    // Generate daily goals based on training focus and other factors
    if (trainingFocus === 'Technical Throws') {
      dailyGoals.push('Complete 40-50 throws with focus on form');
      dailyGoals.push('Record distance for every throw');
      dailyGoals.push('Video record 5 throws for technique review');
      dailyGoals.push('Focus on release point consistency');
    } else if (trainingFocus === 'Strength Session') {
      dailyGoals.push('Complete 3 sets of plyometric exercises');
      dailyGoals.push('Focus on explosive power movements');
      dailyGoals.push('Core stability workout (15 minutes)');
      dailyGoals.push('Upper body resistance training');
    } else if (trainingFocus === 'Recovery & Mobility') {
      dailyGoals.push('Stretch for 20 minutes focusing on shoulders and hips');
      dailyGoals.push('Foam roll major muscle groups (15 minutes)');
      dailyGoals.push('Light mobility exercises');
      dailyGoals.push('Hydrate with at least 3L of water');
    } else if (trainingFocus === 'Competition Simulation') {
      dailyGoals.push('Simulate competition warm-up routine');
      dailyGoals.push('Practice 6 competition-style throws');
      dailyGoals.push('Visualize successful throws');
      dailyGoals.push('Review competition strategy');
    }

    // Add universal goals based on other factors
    if (trainingLoad === 'Heavy' || trainingLoad === 'Overtraining') {
      dailyGoals.push('Sleep 8+ hours for recovery');
    }
    if (readiness < 70) {
      dailyGoals.push('Monitor fatigue levels throughout the day');
    }
    if (daysUntilComp < 14) {
      dailyGoals.push('Visualize competition success (10 minutes)');
    }

    // Ensure we have 3-5 goals
    const finalGoals = dailyGoals.slice(0, 5);

    return {
      trainingFocus,
      coachAdvice,
      riskLevel,
      riskExplanation,
      dailyGoals: finalGoals,
    };
  })();

  // Generate Weekly Training Plan
  const generateWeeklyPlan = (): WorkoutDay[] => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1; // Convert Sunday (0) to 6, Monday (1) to 0

    const nextCompetition = upcomingCompetitions[0];
    let daysUntilCompetition = 999;
    if (nextCompetition) {
      daysUntilCompetition = Math.ceil((new Date(nextCompetition.competition_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    }

    const plan: WorkoutDay[] = [];

    days.forEach((day, index) => {
      const dayOfWeek = index;
      let workoutType: WorkoutDay['type'];
      let icon: React.ReactNode;
      let description: string;

      // Generate plan based on competition timeline
      if (daysUntilCompetition < 7) {
        // Peak phase - light training
        if (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 4) {
          workoutType = 'technical';
          icon = <Target className="w-5 h-5" />;
          description = 'Light technical work - 30 throws max';
        } else if (dayOfWeek === 6) {
          workoutType = 'rest';
          icon = <Coffee className="w-5 h-5" />;
          description = 'Complete rest day';
        } else {
          workoutType = 'mobility';
          icon = <StretchHorizontal className="w-5 h-5" />;
          description = 'Mobility and stretching';
        }
      } else if (daysUntilCompetition < 14) {
        // Taper phase
        if (dayOfWeek === 0 || dayOfWeek === 3) {
          workoutType = 'technical';
          icon = <Target className="w-5 h-5" />;
          description = 'Technical focus with moderate volume';
        } else if (dayOfWeek === 1 || dayOfWeek === 4) {
          workoutType = 'strength';
          icon = <Zap className="w-5 h-5" />;
          description = 'Light strength maintenance';
        } else if (dayOfWeek === 2) {
          workoutType = 'simulation';
          icon = <Play className="w-5 h-5" />;
          description = 'Competition simulation drills';
        } else if (dayOfWeek === 6) {
          workoutType = 'rest';
          icon = <Coffee className="w-5 h-5" />;
          description = 'Complete rest day';
        } else {
          workoutType = 'recovery';
          icon = <Heart className="w-5 h-5" />;
          description = 'Active recovery';
        }
      } else if (daysUntilCompetition < 30) {
        // Competition preparation phase
        if (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 4) {
          workoutType = 'technical';
          icon = <Target className="w-5 h-5" />;
          description = 'Technical drills with full volume';
        } else if (dayOfWeek === 1 || dayOfWeek === 3) {
          workoutType = 'strength';
          icon = <Zap className="w-5 h-5" />;
          description = 'Explosive power training';
        } else if (dayOfWeek === 5) {
          workoutType = 'simulation';
          icon = <Play className="w-5 h-5" />;
          description = 'Full competition simulation';
        } else {
          workoutType = 'rest';
          icon = <Coffee className="w-5 h-5" />;
          description = 'Complete rest day';
        }
      } else {
        // General training phase
        if (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 4) {
          workoutType = 'technical';
          icon = <Target className="w-5 h-5" />;
          description = 'Technical training - focus on form';
        } else if (dayOfWeek === 1 || dayOfWeek === 3) {
          workoutType = 'strength';
          icon = <Zap className="w-5 h-5" />;
          description = 'Strength and power development';
        } else if (dayOfWeek === 5) {
          workoutType = 'mobility';
          icon = <StretchHorizontal className="w-5 h-5" />;
          description = 'Mobility and flexibility work';
        } else {
          workoutType = 'rest';
          icon = <Coffee className="w-5 h-5" />;
          description = 'Complete rest day';
        }
      }

      plan.push({
        day,
        type: workoutType,
        icon,
        description,
        isToday: index === todayIndex,
      });
    });

    return plan;
  };

  const weeklyPlan = generateWeeklyPlan();

  // Generate AI Insights
  const generateInsights = () => {
    const insights = {
      strengths: [] as string[],
      weaknesses: [] as string[],
      improvements: [] as string[],
      trend: 'stable' as 'improving' | 'stable' | 'declining',
      motivation: '',
    };

    // Analyze practice data
    if (practices.length >= 3) {
      const recentAvg = practices.slice(0, 3).reduce((sum, p) => sum + p.average_throw, 0) / 3;
      const olderAvg = practices.slice(3, 6).reduce((sum, p) => sum + p.average_throw, 0) / Math.min(3, practices.length - 3);
      const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;

      if (improvement > 5) {
        insights.trend = 'improving';
        insights.strengths.push('Consistent improvement in average throw distance');
        insights.motivation = "You're on an upward trajectory! Keep pushing your limits.";
      } else if (improvement < -5) {
        insights.trend = 'declining';
        insights.weaknesses.push('Recent decline in average throw distance');
        insights.improvements.push('Review technique and focus on fundamentals');
        insights.motivation = "Every setback is a setup for a comeback. Stay focused.";
      } else {
        insights.trend = 'stable';
        insights.strengths.push('Consistent performance levels');
        insights.motivation = "Consistency is key to long-term success. Keep it up!";
      }
    }

    // Analyze best throws
    if (practices.length >= 5) {
      const bestThrows = practices.map(p => p.best_throw);
      const maxThrow = Math.max(...bestThrows);
      const avgBest = bestThrows.reduce((a, b) => a + b, 0) / bestThrows.length;
      
      if (maxThrow > avgBest * 1.1) {
        insights.strengths.push('Ability to achieve peak performance when needed');
      } else {
        insights.weaknesses.push('Inconsistent peak performance');
        insights.improvements.push('Practice competition simulation to improve peak throws');
      }
    }

    // Analyze practice consistency
    const recentPractices = practices.filter(p => {
      const practiceDate = new Date(p.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return practiceDate >= weekAgo;
    });

    if (recentPractices.length >= 4) {
      insights.strengths.push('Excellent training consistency');
    } else if (recentPractices.length >= 2) {
      insights.strengths.push('Good training habits');
    } else {
      insights.weaknesses.push('Low training frequency');
      insights.improvements.push('Increase practice sessions to 3-4 per week');
    }

    // Analyze competition history
    const completedCompetitions = competitions.filter(c => c.status === 'completed');
    if (completedCompetitions.length > 0) {
      insights.strengths.push('Competition experience');
      if (completedCompetitions.length >= 3) {
        insights.strengths.push('Strong competitive track record');
      }
    } else {
      insights.weaknesses.push('Limited competition experience');
      insights.improvements.push('Register for competitions to gain experience');
    }

    // Personal best analysis
    if (profile?.personal_best && averageThrow) {
      const pbPercentage = (averageThrow / profile.personal_best) * 100;
      if (pbPercentage >= 90) {
        insights.strengths.push('Training close to personal best levels');
      } else if (pbPercentage >= 70) {
        insights.strengths.push('Solid training performance');
        insights.improvements.push('Focus on technique to reach personal best');
      } else {
        insights.weaknesses.push('Training below personal best potential');
        insights.improvements.push('Increase training intensity and technical focus');
      }
    }

    // Add default motivation if empty
    if (!insights.motivation) {
      insights.motivation = "Your dedication to improvement will lead to success. Keep training!";
    }

    return insights;
  };

  const insights = generateInsights();

  // Generate dynamic recommendations based on data
  const generateRecommendations = (): RecommendationCard[] => {
    const recommendations: RecommendationCard[] = [];

    // TRAINING RECOMMENDATION
    const nextCompetition = upcomingCompetitions[0];
    let trainingRec: RecommendationCard;
    // Weather takes priority
if (weather && weather.wind.speed * 3.6 > 25) {
  trainingRec = {
    icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
    title: "Strong Wind Alert",
    description:
      "Strong winds detected. Focus on release angle, footwork, and throwing accuracy instead of maximum distance.",
    status: "warning",
    statusText: "Weather",
  };
} else {

    if (!nextCompetition) {
      trainingRec = {
        icon: <Dumbbell className="w-6 h-6 text-purple-400" />,
        title: 'Training Recommendation',
        description: weather
  ? `Current weather: ${weather.weather[0].description}. ${
      weather.wind.speed * 3.6 > 25
        ? 'Strong winds detected. Focus on release angle and throwing accuracy.'
        : 'Great conditions for outdoor training.'
    }`
  : 'Create a competition goal to structure your training.',
        status: 'warning',
        statusText: 'Warning',
      };
    } else {
      const daysUntil = Math.ceil((new Date(nextCompetition.competition_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil > 30) {
        trainingRec = {
          icon: <Dumbbell className="w-6 h-6 text-purple-400" />,
          title: 'Training Recommendation',
          description: 'Strength phase: Focus on building explosive power with technical drills. Increase throwing volume gradually to build endurance.',
          status: 'good',
          statusText: 'Good',
        };
      } else if (daysUntil >= 15) {
        trainingRec = {
          icon: <Dumbbell className="w-6 h-6 text-purple-400" />,
          title: 'Training Recommendation',
          description: 'Competition simulation phase: Include speed work and competition-specific drills. Refine your technique under pressure.',
          status: 'good',
          statusText: 'Good',
        };
      } else if (daysUntil >= 7) {
        trainingRec = {
          icon: <Dumbbell className="w-6 h-6 text-purple-400" />,
          title: 'Training Recommendation',
          description: 'Taper phase: Reduce heavy lifting and volume. Focus on recovery and maintaining technique consistency.',
          status: 'warning',
          statusText: 'Warning',
        };
      } else {
        trainingRec = {
          icon: <Dumbbell className="w-6 h-6 text-purple-400" />,
          title: 'Training Recommendation',
          description: 'Peak phase: Light throwing only. Focus on stretching, visualization, and sleep 8+ hours to be competition-ready.',
          status: 'critical',
          statusText: 'Critical',
        };
      }
    }
    }
    recommendations.push(trainingRec);

    // RECOVERY RECOMMENDATION
    let recoveryRec: RecommendationCard;
    const recentPractices = practices.filter(p => {
      const practiceDate = new Date(p.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return practiceDate >= weekAgo;
    });

    if (recentPractices.length === 0) {
      recoveryRec = {
        icon: <Moon className="w-6 h-6 text-blue-400" />,
        title: 'Recovery Recommendation',
        description: 'Start with 2-3 technical sessions this week to build your training base.',
        status: 'warning',
        statusText: 'Warning',
      };
    } else if (recentPractices.length <= 4) {
      recoveryRec = {
        icon: <Moon className="w-6 h-6 text-blue-400" />,
        title: 'Recovery Recommendation',
        description: 'Maintain your current training schedule. Ensure adequate rest between sessions.',
        status: 'good',
        statusText: 'Good',
      };
    } else {
      recoveryRec = {
        icon: <Moon className="w-6 h-6 text-blue-400" />,
        title: 'Recovery Recommendation',
        description: 'High training volume detected. Schedule a recovery day with extra hydration and mobility work.',
        status: 'warning',
        statusText: 'Warning',
      };
    }
    recommendations.push(recoveryRec);

    // PERFORMANCE INSIGHT
    let performanceRec: RecommendationCard;
    if (practices.length < 2) {
      performanceRec = {
        icon: <Target className="w-6 h-6 text-green-400" />,
        title: 'Performance Insight',
        description: 'Complete more practice sessions to unlock performance insights and trend analysis.',
        status: 'warning',
        statusText: 'Warning',
      };
    } else {
      const recentAvg = practices.slice(0, 3).reduce((sum, p) => sum + p.average_throw, 0) / Math.min(3, practices.length);
      const olderAvg = practices.slice(3, 6).reduce((sum, p) => sum + p.average_throw, 0) / Math.min(3, practices.length - 3);
      const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;

      if (improvement > 5) {
        performanceRec = {
          icon: <Target className="w-6 h-6 text-green-400" />,
          title: 'Performance Insight',
          description: `Great progress! Your average throw has improved by ${improvement.toFixed(1)}%. Keep up the excellent work.`,
          status: 'good',
          statusText: 'Good',
        };
      } else if (improvement < -5) {
        performanceRec = {
          icon: <Target className="w-6 h-6 text-green-400" />,
          title: 'Performance Insight',
          description: `Your average throw has decreased by ${Math.abs(improvement).toFixed(1)}%. Review your technique and consider consulting with your coach.`,
          status: 'critical',
          statusText: 'Critical',
        };
      } else {
        performanceRec = {
          icon: <Target className="w-6 h-6 text-green-400" />,
          title: 'Performance Insight',
          description: 'Your performance is stable. Continue focusing on technique consistency and gradual improvement.',
          status: 'good',
          statusText: 'Good',
        };
      }
    }
    recommendations.push(performanceRec);

    // COMPETITION PREPARATION
    let competitionRec: RecommendationCard;
    if (!nextCompetition) {
      competitionRec = {
        icon: <Calendar className="w-6 h-6 text-orange-400" />,
        title: 'Competition Preparation',
        description: 'No upcoming competitions scheduled. Create a competition goal to give your training purpose and direction.',
        status: 'warning',
        statusText: 'Warning',
      };
    } else {
      const daysUntil = Math.ceil((new Date(nextCompetition.competition_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil > 30) {
        competitionRec = {
          icon: <Calendar className="w-6 h-6 text-orange-400" />,
          title: 'Competition Preparation',
          description: `Competition in ${daysUntil} days: ${nextCompetition.competition_name}. Focus on building strength and technical foundation.`,
          status: 'good',
          statusText: 'Good',
        };
      } else if (daysUntil >= 14) {
        competitionRec = {
          icon: <Calendar className="w-6 h-6 text-orange-400" />,
          title: 'Competition Preparation',
          description: `Competition in ${daysUntil} days: ${nextCompetition.competition_name}. Begin competition-specific training and mental preparation.`,
          status: 'warning',
          statusText: 'Warning',
        };
      } else if (daysUntil >= 7) {
        competitionRec = {
          icon: <Calendar className="w-6 h-6 text-orange-400" />,
          title: 'Competition Preparation',
          description: `Competition in ${daysUntil} days: ${nextCompetition.competition_name}. Taper training and focus on visualization and rest.`,
          status: 'critical',
          statusText: 'Critical',
        };
      } else {
        competitionRec = {
          icon: <Calendar className="w-6 h-6 text-orange-400" />,
          title: 'Competition Preparation',
          description: `Competition in ${daysUntil} days: ${nextCompetition.competition_name}. Light warm-ups only. Focus on mental readiness and sleep.`,
          status: 'critical',
          statusText: 'Critical',
        };
      }
    }
    recommendations.push(competitionRec);

    return recommendations;
  };

  const recommendations = generateRecommendations();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <TopNavbar />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
            <div className="mb-8">
              <div className="h-10 w-64 bg-slate-800 rounded-lg animate-pulse mb-2" />
              <div className="h-6 w-96 bg-slate-800 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="h-12 w-12 bg-slate-800 rounded-xl animate-pulse mb-4" />
                  <div className="h-6 w-24 bg-slate-800 rounded-lg animate-pulse mb-2" />
                  <div className="h-8 w-16 bg-slate-800 rounded-lg animate-pulse" />
                </div>
              ))}
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">AI Coach</h1>
            <p className="text-zinc-400">Personalized training recommendations powered by your athlete data.</p>
          </div>

          {/* Dashboard Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* AI Readiness Score */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:col-span-2 lg:col-span-4">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Circular Progress Indicator */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke={readinessScore >= 80 ? '#22c55e' : readinessScore >= 60 ? '#eab308' : '#ef4444'}
                      strokeWidth="3"
                      strokeDasharray={`${readinessScore} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">{readinessScore}</p>
                      <p className="text-xs text-zinc-400">Score</p>
                    </div>
                  </div>
                </div>

                {/* Score details */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">AI Readiness Score</h3>
                  </div>
                  <p className="text-zinc-400 mb-4">{readinessExplanation}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-zinc-400">Practice (40%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-zinc-400">Competition (30%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-zinc-400">Progress (20%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-zinc-400">Recovery (10%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Personal Best */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-zinc-400">Personal Best</h3>
              </div>
              {profile?.personal_best ? (
                <p className="text-3xl font-bold text-white">{profile.personal_best}m</p>
              ) : (
                <p className="text-zinc-500">Not set</p>
              )}
            </div>

            {/* Total Practice Sessions */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-zinc-400">Total Sessions</h3>
              </div>
              <p className="text-3xl font-bold text-white">{practices.length}</p>
            </div>

            {/* Upcoming Competitions */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-sm font-medium text-zinc-400">Upcoming</h3>
              </div>
              <p className="text-3xl font-bold text-white">{upcomingCompetitions.length}</p>
            </div>

            {/* Average Throw Distance */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-sm font-medium text-zinc-400">Average Throw</h3>
              </div>
              {averageThrow !== null ? (
                <p className="text-3xl font-bold text-white">{averageThrow}m</p>
              ) : (
                <p className="text-zinc-500">No data</p>
              )}
            </div>
          </div>

          {/* Competition Countdown Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Competition Countdown</h3>
            </div>
            {nearestCompetition ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-white mb-1">{nearestCompetition.competition_name}</p>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    <span>{nearestCompetition.venue}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-orange-400">{daysUntilCompetition}</p>
                    <p className="text-sm text-zinc-400">Days Remaining</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-zinc-400">No upcoming competitions. Create one to receive personalized preparation advice.</p>
              </div>
            )}
          </div>

          {/* Practice Consistency Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Practice Consistency</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sessions Last 7 Days */}
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{practiceConsistency.practicesLast7Days}</p>
                <p className="text-sm text-zinc-400">Sessions (7 days)</p>
              </div>
              {/* Sessions Last 30 Days */}
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{practiceConsistency.practicesLast30Days}</p>
                <p className="text-sm text-zinc-400">Sessions (30 days)</p>
              </div>
              {/* Average Per Week */}
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{practiceConsistency.averageSessionsPerWeek}</p>
                <p className="text-sm text-zinc-400">Avg/Week</p>
              </div>
              {/* Consistency Rating */}
              <div className="text-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full border ${getConsistencyRatingColor(practiceConsistency.consistencyRating)}`}>
                  <CheckCircle className="w-4 h-4" />
                  {practiceConsistency.consistencyRating}
                </span>
              </div>
            </div>
            {/* Training Load Indicator */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-medium text-zinc-300">Training Load</span>
                </div>
                <span className="text-sm font-semibold text-white">{practiceConsistency.trainingLoad}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getTrainingLoadColor(practiceConsistency.trainingLoad)}`}
                  style={{
                    width: practiceConsistency.trainingLoad === 'Light' ? '25%' :
                           practiceConsistency.trainingLoad === 'Moderate' ? '50%' :
                           practiceConsistency.trainingLoad === 'Heavy' ? '75%' : '100%'
                  }}
                />
              </div>
            </div>
          </div>

          {/* AI Performance Prediction Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Performance Prediction</h3>
            </div>
            {performancePrediction.hasEnoughData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Prediction Metrics */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <p className="text-sm text-zinc-400 mb-1">Predicted Throw</p>
                      <p className="text-3xl font-bold text-white">{performancePrediction.predictedThrow}m</p>
                    </div>
                    <Target className="w-10 h-10 text-purple-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-sm text-zinc-400 mb-1">Confidence</p>
                      <p className="text-2xl font-bold text-green-400">{performancePrediction.confidence}%</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-sm text-zinc-400 mb-1">Trend</p>
                      <div className="flex items-center gap-2">
                        {performancePrediction.trend === 'improving' && <ArrowUp className="w-5 h-5 text-green-400" />}
                        {performancePrediction.trend === 'declining' && <ArrowDown className="w-5 h-5 text-red-400" />}
                        {performancePrediction.trend === 'stable' && <Minus className="w-5 h-5 text-yellow-400" />}
                        <p className="text-xl font-bold text-white capitalize">{performancePrediction.trend}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-sm text-zinc-400 mb-1">Expected Performance Level</p>
                    <p className="text-xl font-bold text-purple-400">{performancePrediction.performanceLevel}</p>
                  </div>
                </div>
                {/* AI Explanation */}
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <p className="text-sm font-medium text-white">AI Analysis</p>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{performancePrediction.explanation}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">{performancePrediction.explanation}</p>
              </div>
            )}
          </div>

          {/* Personalized AI Coach Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Personalized AI Coach</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Today's Training Focus */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTrainingFocusColor(personalizedCoach.trainingFocus)}`}>
                      {getTrainingFocusIcon(personalizedCoach.trainingFocus)}
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Today's Training Focus</p>
                      <p className="text-lg font-semibold text-white">{personalizedCoach.trainingFocus}</p>
                    </div>
                  </div>
                </div>

                {/* Coach's Advice */}
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <p className="text-sm font-medium text-white">Coach's Advice</p>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{personalizedCoach.coachAdvice}</p>
                </div>

                {/* Risk Assessment */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-zinc-400" />
                      <p className="text-sm font-medium text-white">Risk Assessment</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getRiskLevelColor(personalizedCoach.riskLevel)}`}>
                      {personalizedCoach.riskLevel}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">{personalizedCoach.riskExplanation}</p>
                </div>
              </div>

              {/* Right Column - Daily Goals */}
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <p className="text-sm font-medium text-white">Daily Goals</p>
                </div>
                <ul className="space-y-3">
                  {personalizedCoach.dailyGoals.map((goal: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-zinc-300">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center">
                      {recommendation.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{recommendation.title}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border mt-2 ${getStatusColor(recommendation.status)}`}>
                        {getStatusIcon(recommendation.status)}
                        {recommendation.statusText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-zinc-400 leading-relaxed">{recommendation.description}</p>
              </div>
            ))}
          </div>

          {/* Weekly Training Plan */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Weekly Training Plan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {weeklyPlan.map((workout, index) => (
                <div
                  key={index}
                  className={`bg-slate-900/50 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-300 ${
                    workout.isToday
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{workout.day}</h3>
                    {workout.isToday && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      workout.type === 'technical' ? 'bg-purple-500/20' :
                      workout.type === 'strength' ? 'bg-yellow-500/20' :
                      workout.type === 'recovery' ? 'bg-pink-500/20' :
                      workout.type === 'mobility' ? 'bg-cyan-500/20' :
                      workout.type === 'simulation' ? 'bg-green-500/20' :
                      'bg-slate-500/20'
                    }`}>
                      {workout.icon}
                    </div>
                    <span className="text-sm font-medium text-zinc-300 capitalize">{workout.type}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{workout.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">AI Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trend */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Performance Trend</h3>
                </div>
                <div className="flex items-center gap-3">
                  {insights.trend === 'improving' && (
                    <>
                      <ArrowUp className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-2xl font-bold text-green-400">Improving</p>
                        <p className="text-sm text-zinc-400">Your performance is trending upward</p>
                      </div>
                    </>
                  )}
                  {insights.trend === 'stable' && (
                    <>
                      <Minus className="w-8 h-8 text-yellow-400" />
                      <div>
                        <p className="text-2xl font-bold text-yellow-400">Stable</p>
                        <p className="text-sm text-zinc-400">Consistent performance levels</p>
                      </div>
                    </>
                  )}
                  {insights.trend === 'declining' && (
                    <>
                      <ArrowDown className="w-8 h-8 text-red-400" />
                      <div>
                        <p className="text-2xl font-bold text-red-400">Declining</p>
                        <p className="text-sm text-zinc-400">Performance needs attention</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Motivation Message */}
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Motivation</h3>
                </div>
                <p className="text-lg text-white italic">"{insights.motivation}"</p>
              </div>

              {/* Strengths */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Strengths</h3>
                </div>
                {insights.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {insights.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-zinc-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500">Not enough data to analyze strengths</p>
                )}
              </div>

              {/* Weaknesses */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertOctagon className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">Areas for Improvement</h3>
                </div>
                {insights.weaknesses.length > 0 ? (
                  <ul className="space-y-2">
                    {insights.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2 text-zinc-300">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500">No significant weaknesses identified</p>
                )}
              </div>

              {/* Suggested Improvements */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Suggested Improvements</h3>
                </div>
                {insights.improvements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {insights.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-slate-800/50 rounded-lg">
                        <ArrowUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-zinc-300">{improvement}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500">Continue your current training approach</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
