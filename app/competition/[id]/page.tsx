'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, Target, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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

export default function CompetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function fetchCompetition() {
      try {
        const { data, error } = await supabase
          .from('competitions')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        setCompetition(data);
      } catch (error) {
        console.error('Error fetching competition:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchCompetition();
    }
  }, [params.id]);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      // Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Verify ownership
      if (competition?.user_id !== user.id) {
        throw new Error('You do not have permission to delete this competition');
      }

      // Delete competition
      const { error: deleteError } = await supabase
        .from('competitions')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Show success toast
      setToast({ type: 'success', message: 'Competition deleted successfully!' });
      setTimeout(() => setToast(null), 3000);

      // Redirect to competition list
      setTimeout(() => {
        router.push('/competition');
      }, 1000);

    } catch (error) {
      console.error('Error deleting competition:', error);
      setToast({ type: 'error', message: 'Failed to delete competition. Please try again.' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading competition...</div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-zinc-400">Competition not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            toast.type === 'success'
              ? 'bg-green-500/20 border-green-500/30 text-green-400'
              : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Delete Competition</h3>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to delete "{competition.competition_name}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <Link
            href="/competition"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Competitions
          </Link>
          <div className="flex gap-3">
            <Link
              href={`/competition/${params.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 font-semibold rounded-xl hover:bg-red-500/30 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Competition Details */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
          {/* Title and Status */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {competition.competition_name}
              </h1>
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Clock className="w-4 h-4" />
                Created on {formatDate(competition.created_at)}
              </div>
            </div>
            <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(competition.status)}`}>
              {competition.status.charAt(0).toUpperCase() + competition.status.slice(1)}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Venue */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Venue</span>
              </div>
              <p className="text-white text-lg">{competition.venue}</p>
            </div>

            {/* Competition Date */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Date</span>
              </div>
              <p className="text-white text-lg">{formatDate(competition.competition_date)}</p>
            </div>

            {/* Target Distance */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <Target className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Target Distance</span>
              </div>
              <p className="text-white text-lg">{competition.target_distance} meters</p>
            </div>

            {/* Status */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Status</span>
              </div>
              <p className="text-white text-lg capitalize">{competition.status}</p>
            </div>
          </div>

          {/* Notes */}
          {competition.notes && (
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 text-zinc-400 mb-3">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Notes</span>
              </div>
              <p className="text-white whitespace-pre-wrap">{competition.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
