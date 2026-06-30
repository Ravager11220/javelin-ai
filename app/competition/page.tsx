'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import {
  Trophy,
  Plus,
  Calendar,
  MapPin,
  Target,
  FileText,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

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

export default function CompetitionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  async function fetchCompetitions() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('user_id', user.id)
        .order('competition_date', {
          ascending: true,
        });

      if (error) throw error;

      setCompetitions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400';

      case 'completed':
        return 'bg-green-500/20 text-green-400';

      case 'cancelled':
        return 'bg-red-500/20 text-red-400';

      default:
        return 'bg-zinc-500/20 text-zinc-400';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-zinc-400">
        Loading competitions...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-zinc-400">
        Please log in.
      </div>
    );
  }
if (!user) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-zinc-400">
      Please log in.
    </div>
  );
}
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Competition Planner
            </h1>

            <p className="text-zinc-400 mt-2">
              Plan and manage your competitions.
            </p>
          </div>

          <Link
            href="/competition/new"
            className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition px-5 py-3 text-white font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Competition
          </Link>
        </div>

        {competitions.length === 0 ? (

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-16 text-center">

            <Trophy className="mx-auto w-16 h-16 text-zinc-500 mb-6" />

            <h2 className="text-3xl font-bold text-white mb-3">
              No competitions yet
            </h2>

            <p className="text-zinc-400 mb-8">
              Create your first competition and start planning your season.
            </p>

            <Link
              href="/competition/new"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition px-6 py-3 text-white font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add Competition
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {competitions.map((competition) => (

              <Link
                key={competition.id}
                href={`/competition/${competition.id}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-purple-500 transition block cursor-pointer"
              >

                <div className="flex justify-between items-start mb-5">

                  <h2 className="text-xl font-bold text-white">
                    {competition.competition_name}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      competition.status
                    )}`}
                  >
                    {competition.status}
                  </span>

                </div>

                <div className="space-y-3 text-zinc-400">

                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    {competition.venue}
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(competition.competition_date)}
                  </div>

                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4" />
                    {competition.target_distance} m
                  </div>

                  {competition.notes && (
                    <div className="flex items-start gap-3 pt-2">
                      <FileText className="w-4 h-4 mt-1" />
                      <p>{competition.notes}</p>
                    </div>
                  )}

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}