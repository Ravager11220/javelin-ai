'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import { Send, MessageSquare, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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

interface WeatherData {
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  temp: number;
}

export default function AIChatCoachPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI Chat Coach. I can help you with training advice, performance analysis, and competition preparation. Ask me anything about your javelin journey!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'How should I train today?',
    'How can I improve my throw?',
    'Am I ready for competition?',
    'Analyze my recent performance.',
    'What should I focus on this week?',
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('athlete_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile(profileData);

      // Fetch practices
      const { data: practicesData } = await supabase
        .from('practices')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      setPractices(practicesData || []);

      // Fetch competitions
      const { data: competitionsData } = await supabase
        .from('competitions')
        .select('*')
        .eq('user_id', user.id)
        .order('competition_date', { ascending: true });

      setCompetitions(competitionsData || []);

      // Fetch weather
      try {
        const weatherResponse = await fetch('/api/weather');
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          setWeather(weatherData);
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateReadinessScore = (): number => {
    let score = 0;

    // Practice consistency (40%)
    if (practices.length >= 10) score += 40;
    else if (practices.length >= 5) score += 30;
    else if (practices.length >= 3) score += 20;
    else score += 10;

    // Competition preparation (30%)
    const upcomingCompetitions = competitions.filter(c => c.status === 'upcoming');
    if (upcomingCompetitions.length > 0) score += 30;
    else score += 15;

    // Progress (20%)
    if (practices.length >= 2) {
      const recentAvg = practices.slice(0, 3).reduce((sum, p) => sum + p.average_throw, 0) / Math.min(3, practices.length);
      const olderAvg = practices.slice(3, 6).reduce((sum, p) => sum + p.average_throw, 0) / Math.min(3, practices.length - 3);
      if (recentAvg > olderAvg) score += 20;
      else score += 10;
    }

    // Recovery (10%)
    score += 10;

    return score;
  };

  const calculatePracticeConsistency = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const practicesLast7Days = practices.filter(p => new Date(p.date) >= sevenDaysAgo).length;
    const averageSessionsPerWeek = practicesLast7Days;

    let consistencyRating: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
    if (averageSessionsPerWeek >= 5) consistencyRating = 'Excellent';
    else if (averageSessionsPerWeek >= 3) consistencyRating = 'Good';
    else if (averageSessionsPerWeek >= 2) consistencyRating = 'Average';
    else consistencyRating = 'Needs Improvement';

    return { practicesLast7Days, consistencyRating };
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const readinessScore = calculateReadinessScore();
    const { practicesLast7Days, consistencyRating } = calculatePracticeConsistency();
    const upcomingCompetitions = competitions.filter(c => c.status === 'upcoming');
    const nearestCompetition = upcomingCompetitions.length > 0 ? upcomingCompetitions[0] : null;
    const daysUntilCompetition = nearestCompetition
      ? Math.ceil((new Date(nearestCompetition.competition_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null;
    const isWindy = weather && (weather.wind.speed * 3.6) > 25;
    const isRainy = weather?.weather?.[0]?.main?.toLowerCase().includes('rain');
    const personalBest = profile?.personal_best;
    const averageThrow = practices.length > 0
      ? Math.round(practices.reduce((sum, p) => sum + p.average_throw, 0) / practices.length)
      : null;

    // Training today
    if (lowerMessage.includes('train') && lowerMessage.includes('today')) {
      if (isWindy || isRainy) {
        return isRainy
          ? "Due to rainy conditions, I recommend indoor strength training today. Focus on explosive power exercises, core stability, and technique visualization. This will keep you conditioned without risking injury in poor weather. 💪"
          : "With strong winds today, practice release angle and accuracy instead of maximum distance. Work on your technique in a sheltered area or focus on indoor strength training. Wind can significantly affect javelin trajectory, so use this time to refine your form. 🎯";
      } else if (daysUntilCompetition && daysUntilCompetition < 7) {
        return `With your competition in ${daysUntilCompetition} days, prioritize light technical work and recovery. Focus on visualization, light stretching, and maintaining your routine without fatiguing your muscles. You're in the taper phase! 🏆`;
      } else if (readinessScore < 60) {
        return `Your readiness score is ${readinessScore}/100, which suggests you need consistency. Focus on technical fundamentals with moderate volume today. Work on your release mechanics and follow-through to build a solid foundation. Quality over quantity! 🎯`;
      } else if (consistencyRating === 'Needs Improvement') {
        return `Your practice consistency needs attention. Today, commit to a focused session of 30-40 throws with full attention to form. Consistency is the key to long-term improvement. Let's build that habit! 📈`;
      } else {
        return "Great question! Based on your current training load and readiness, I recommend a balanced session today. Start with warm-up, then 40-50 throws focusing on technique, followed by strength work. Finish with mobility and recovery. You've got this! 💪";
      }
    }

    // Improve throw
    if (lowerMessage.includes('improve') && lowerMessage.includes('throw')) {
      if (averageThrow && personalBest) {
        const percentage = Math.round((averageThrow / personalBest) * 100);
        return `To improve your throw, focus on these key areas:\n\n1. **Release Mechanics**: Ensure you're releasing at the optimal angle (32-36 degrees)\n2. **Run-up Speed**: Your approach speed directly impacts distance\n3. **Core Strength**: Explosive power comes from a strong core\n4. **Consistency**: Your current average is ${averageThrow}m (${percentage}% of PB)\n\nI recommend filming your throws to analyze your technique. Small adjustments in form can lead to big gains! 🎯`;
      }
      return "To improve your throw, focus on the fundamentals: proper grip, run-up mechanics, release angle, and follow-through. Work with your coach to identify specific areas for improvement. Consistent practice with attention to form is the fastest path to progress! 🎯";
    }

    // Ready for competition
    if (lowerMessage.includes('ready') && lowerMessage.includes('competition')) {
      if (!nearestCompetition) {
        return "You don't have any upcoming competitions scheduled. Consider registering for one to give your training a specific goal and timeline. Having a target event can significantly boost motivation and focus! 🏆";
      }
      if (daysUntilCompetition && daysUntilCompetition < 7) {
        return `Your competition is in ${daysUntilCompetition} days! Your readiness score is ${readinessScore}/100. You're in the final preparation phase. Focus on visualization, light technical work, and recovery. Trust your training - you've put in the work. Stay confident and focused! 🏆`;
      } else if (readinessScore >= 80) {
        return `Your readiness score is ${readinessScore}/100 - excellent! You're showing great consistency and preparation. With ${daysUntilCompetition} days until your competition, continue your current training approach while tapering intensity as the event approaches. You're on track for a strong performance! 🏆`;
      } else if (readinessScore >= 60) {
        return `Your readiness score is ${readinessScore}/100 - good but room for improvement. With ${daysUntilCompetition} days until competition, focus on consistency and recovery. Increase practice frequency slightly while ensuring adequate rest. You can reach peak readiness with focused effort! 💪`;
      } else {
        return `Your readiness score is ${readinessScore}/100, indicating you need more preparation. With ${daysUntilCompetition} days until competition, prioritize consistent practice and technical refinement. Consider increasing training intensity while monitoring fatigue. There's still time to improve! 📈`;
      }
    }

    // Analyze recent performance
    if (lowerMessage.includes('analyze') && lowerMessage.includes('performance')) {
      if (practices.length < 3) {
        return "You need at least 3 practice sessions for me to analyze your performance trends. Keep logging your practices, and I'll provide detailed insights once you have more data! 📊";
      }
      const recentAvg = practices.slice(0, 3).reduce((sum, p) => sum + p.average_throw, 0) / 3;
      const olderAvg = practices.slice(3, 6).reduce((sum, p) => sum + p.average_throw, 0) / Math.min(3, practices.length - 3);
      const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;
      
      if (improvement > 5) {
        return `Great news! Your recent performance shows an improvement of ${improvement.toFixed(1)}%. Your recent average is ${Math.round(recentAvg)}m compared to ${Math.round(olderAvg)}m earlier. Keep up the excellent work! Your training is paying off. 📈`;
      } else if (improvement < -5) {
        return `I notice a slight decline of ${Math.abs(improvement).toFixed(1)}% in your recent performance. This could be due to fatigue, technique issues, or training load. Consider reviewing your form, adjusting training intensity, and focusing on recovery. Every setback is a setup for a comeback! 💪`;
      } else {
        return `Your performance is stable, with recent averages around ${Math.round(recentAvg)}m. Consistency is valuable, but to break through to the next level, try incorporating new drills or slightly increasing training intensity. Small progressive overload leads to gains! 🎯`;
      }
    }

    // Focus this week
    if (lowerMessage.includes('focus') && lowerMessage.includes('week')) {
      if (daysUntilCompetition && daysUntilCompetition < 14) {
        return `With competition approaching in ${daysUntilCompetition} days, this week's focus should be:\n\n1. **Competition Simulation**: Practice your competition routine\n2. **Technical Refinement**: Fine-tune your release mechanics\n3. **Recovery**: Prioritize sleep and mobility\n4. **Visualization**: Mental rehearsal of successful throws\n\nTaper intensity as you get closer to the event. You're almost there! 🏆`;
      } else if (consistencyRating === 'Needs Improvement') {
        return `Based on your practice consistency, this week's focus should be building a training habit:\n\n1. **Frequency**: Aim for 4-5 practice sessions\n2. **Technique**: Focus on form over distance\n3. **Progressive Loading**: Gradually increase volume\n4. **Recovery**: Don't skip rest days\n\nConsistency beats intensity. Build the habit first! 📈`;
      } else if (readinessScore < 70) {
        return `This week, focus on building your readiness:\n\n1. **Technical Drills**: 40-50 throws per session\n2. **Strength Work**: 2-3 sessions focusing on explosive power\n3. **Recovery**: Prioritize sleep (8+ hours) and nutrition\n4. **Mental Training**: Visualization and goal setting\n\nYour readiness score will improve with consistent effort! 💪`;
      } else {
        return `This week's training focus:\n\n1. **Technical Throws**: 3 sessions focusing on form\n2. **Strength Training**: 2 sessions for power development\n3. **Recovery & Mobility**: 2 sessions for active recovery\n4. **Competition Prep**: If you have upcoming events\n\nBalance is key. Train hard, recover harder! 🎯`;
      }
    }

    // Default response
    return "I'm here to help with your javelin training! You can ask me about:\n\n• Today's training recommendations\n• How to improve your throwing technique\n• Your competition readiness\n• Performance analysis\n• Weekly training focus\n\nWhat would you like to know? 🎯";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateAIResponse(inputValue),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <TopNavbar />
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Loading your AI Coach...</p>
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
        <div className="flex flex-col h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Chat Coach</h1>
              <p className="text-slate-400 text-sm">Your personal javelin training assistant</p>
            </div>
          </motion.div>

          {/* Chat Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-slate-900/50 backdrop-blur-sm border border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      <div className={`flex items-center gap-2 mt-2 text-xs ${message.role === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
                        <Clock className="w-3 h-3" />
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>

          {/* Suggested Prompts */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-full text-sm text-slate-300 hover:text-white transition-all duration-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4">
            <div className="flex items-end gap-3">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your AI Coach anything..."
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none min-h-[44px] max-h-32"
                style={{ fieldSizing: 'content' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
