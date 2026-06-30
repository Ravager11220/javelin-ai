'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

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

export default function EditCompetitionPage() {
  const params = useParams();
  const router = useRouter();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    competition_name: '',
    venue: '',
    competition_date: '',
    target_distance: '',
    notes: '',
    status: 'upcoming' as 'upcoming' | 'completed' | 'cancelled',
  });

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
        setFormData({
          competition_name: data.competition_name,
          venue: data.venue,
          competition_date: data.competition_date,
          target_distance: data.target_distance.toString(),
          notes: data.notes || '',
          status: data.status,
        });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.competition_name.trim()) {
      setToast({ type: 'error', message: 'Competition name is required' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!formData.venue.trim()) {
      setToast({ type: 'error', message: 'Venue is required' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!formData.competition_date) {
      setToast({ type: 'error', message: 'Competition date is required' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!formData.target_distance || isNaN(Number(formData.target_distance))) {
      setToast({ type: 'error', message: 'Target distance is required' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setSaving(true);

    try {
      // Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Verify ownership
      if (competition?.user_id !== user.id) {
        throw new Error('You do not have permission to edit this competition');
      }

      // Update competition
      const { error: updateError } = await supabase
        .from('competitions')
        .update({
          competition_name: formData.competition_name,
          venue: formData.venue,
          competition_date: formData.competition_date,
          target_distance: Number(formData.target_distance),
          notes: formData.notes,
          status: formData.status,
        })
        .eq('id', params.id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Show success toast
      setToast({ type: 'success', message: 'Competition updated successfully!' });
      setTimeout(() => setToast(null), 3000);

      // Redirect to competition details after short delay
      setTimeout(() => {
        router.push(`/competition/${params.id}`);
      }, 1000);

    } catch (error) {
      console.error('Error updating competition:', error);
      setToast({ type: 'error', message: 'Failed to update competition. Please try again.' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
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

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/competition/${params.id}`}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Competition
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Edit Competition</h1>
          <p className="text-zinc-400">Update your competition details.</p>
        </div>

        {/* Form */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Competition Name */}
            <div>
              <label htmlFor="competition_name" className="block text-sm font-medium text-white mb-2">
                Competition Name
              </label>
              <input
                type="text"
                id="competition_name"
                name="competition_name"
                value={formData.competition_name}
                onChange={handleInputChange}
                placeholder="e.g., National Championships 2024"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Venue */}
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-white mb-2">
                Venue
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                placeholder="e.g., Olympic Stadium, London"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Competition Date */}
            <div>
              <label htmlFor="competition_date" className="block text-sm font-medium text-white mb-2">
                Competition Date
              </label>
              <input
                type="date"
                id="competition_date"
                name="competition_date"
                value={formData.competition_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Target Distance */}
            <div>
              <label htmlFor="target_distance" className="block text-sm font-medium text-white mb-2">
                Target Distance (meters)
              </label>
              <input
                type="number"
                id="target_distance"
                name="target_distance"
                value={formData.target_distance}
                onChange={handleInputChange}
                placeholder="e.g., 80"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-white mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-white mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional notes about this competition..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <Link
                href={`/competition/${params.id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all duration-300"
              >
                <X className="w-5 h-5" />
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
