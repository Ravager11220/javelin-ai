'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Search, X, Clock, Target, Trophy, Award, MessageSquare, TrendingUp, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'practice' | 'competition' | 'goal' | 'achievement' | 'chat';
  title: string;
  subtitle: string;
  date: string;
  url: string;
  icon: React.ReactNode;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleOpenSearch = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-search', handleOpenSearch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-search', handleOpenSearch);
    };
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search functionality
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const searchResults: SearchResult[] = [];

      // Search practices
      const { data: practices } = await supabase
        .from('practices')
        .select('*')
        .eq('user_id', user.id)
        .ilike('notes', `%${searchQuery}%`)
        .order('date', { ascending: false })
        .limit(5);

      practices?.forEach(practice => {
        searchResults.push({
          id: practice.id,
          type: 'practice',
          title: `Practice - ${new Date(practice.date).toLocaleDateString()}`,
          subtitle: practice.notes || `Best: ${practice.best_throw}m, Avg: ${practice.average_throw}m`,
          date: practice.date,
          url: `/practice/history`,
          icon: <Target className="w-5 h-5 text-blue-400" />,
        });
      });

      // Search competitions
      const { data: competitions } = await supabase
        .from('competitions')
        .select('*')
        .eq('user_id', user.id)
        .ilike('competition_name', `%${searchQuery}%`)
        .order('competition_date', { ascending: false })
        .limit(5);

      competitions?.forEach(competition => {
        searchResults.push({
          id: competition.id,
          type: 'competition',
          title: competition.competition_name,
          subtitle: `${competition.venue} - ${competition.status}`,
          date: competition.competition_date,
          url: `/competition/${competition.id}`,
          icon: <Trophy className="w-5 h-5 text-orange-400" />,
        });
      });

      // Search goals
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .ilike('title', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(5);

      goals?.forEach(goal => {
        searchResults.push({
          id: goal.id,
          type: 'goal',
          title: goal.title,
          subtitle: goal.description || `Target: ${goal.target_distance}m`,
          date: goal.created_at,
          url: `/goals`,
          icon: <TrendingUp className="w-5 h-5 text-green-400" />,
        });
      });

      // Search achievements (simulated - would need actual data)
      const { data: profiles } = await supabase
        .from('athlete_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profiles && profiles.personal_best) {
        const pb = profiles.personal_best;
        if (searchQuery.toLowerCase().includes('personal') || searchQuery.toLowerCase().includes('best')) {
          searchResults.push({
            id: 'pb',
            type: 'achievement',
            title: 'Personal Best',
            subtitle: `${pb}m - Your best throw`,
            date: profiles.created_at,
            url: '/profile',
            icon: <Award className="w-5 h-5 text-purple-400" />,
          });
        }
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecentSearches = [
      { query, timestamp: Date.now() },
      ...recentSearches.filter(s => s.query !== query).slice(0, 4),
    ];
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recent-searches', JSON.stringify(newRecentSearches));

    router.push(result.url);
    setIsOpen(false);
    setQuery('');
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    performSearch(recentQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    }
  };

  // Highlight matched text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-purple-500/30 text-purple-300 rounded px-0.5">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-all duration-300"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden flex items-center justify-center w-10 h-10 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all duration-300"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 pointer-events-none"
            >
              <div className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
                {/* Search Input */}
                <div className="flex items-center gap-4 p-4 border-b border-slate-800">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search practices, competitions, goals..."
                    className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-lg"
                  />
                  <button
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                    }}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto p-4">
                  {/* Recent Searches */}
                  {!query && recentSearches.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recent
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleRecentSearchClick(search.query)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors text-left"
                          >
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-300">{search.query}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search Results */}
                  {query && (
                    <>
                      {loading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : results.length > 0 ? (
                        <div className="space-y-2">
                          {results.map((result, index) => (
                            <button
                              key={result.id}
                              onClick={() => handleResultClick(result)}
                              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                                index === selectedIndex
                                  ? 'bg-purple-500/20 border border-purple-500/30'
                                  : 'hover:bg-slate-800/50 border border-transparent'
                              }`}
                            >
                              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                {result.icon}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className="text-white font-medium truncate">
                                  {highlightText(result.title, query)}
                                </p>
                                <p className="text-slate-400 text-sm truncate">
                                  {highlightText(result.subtitle, query)}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                          <p className="text-slate-400">No results found for "{query}"</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Quick Actions */}
                  {!query && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            router.push('/practice/new');
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors text-left"
                        >
                          <Target className="w-4 h-4 text-blue-400" />
                          <span className="text-slate-300 text-sm">Add Practice</span>
                        </button>
                        <button
                          onClick={() => {
                            router.push('/competition/new');
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors text-left"
                        >
                          <Trophy className="w-4 h-4 text-orange-400" />
                          <span className="text-slate-300 text-sm">Add Competition</span>
                        </button>
                        <button
                          onClick={() => {
                            router.push('/goals/new');
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors text-left"
                        >
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-slate-300 text-sm">Add Goal</span>
                        </button>
                        <button
                          onClick={() => {
                            router.push('/ai-chat');
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors text-left"
                        >
                          <MessageSquare className="w-4 h-4 text-purple-400" />
                          <span className="text-slate-300 text-sm">AI Coach</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↵</kbd>
                      Select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">esc</kbd>
                      Close
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
