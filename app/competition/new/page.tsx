'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewCompetitionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    competition_name: '',
    venue: '',
    competition_date: '',
    target_distance: '',
    notes: '',
    status: 'upcoming' as 'upcoming' | 'completed' | 'cancelled',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

    setLoading(true);

    try {
      // Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Insert competition
      const { error: insertError } = await supabase
        .from('competitions')
        .insert({
          user_id: user.id,
          competition_name: formData.competition_name,
          venue: formData.venue,
          competition_date: formData.competition_date,
          target_distance: Number(formData.target_distance),
          notes: formData.notes,
          status: formData.status,
        });

      if (insertError) {
        throw insertError;
      }

      // Show success toast
      setToast({ type: 'success', message: 'Competition created successfully!' });
      setTimeout(() => setToast(null), 3000);

      // Redirect to competition list after short delay
      setTimeout(() => {
        router.push('/competition');
      }, 1000);

    } catch (error) {
      console.error('Error creating competition:', error);
      setToast({ type: 'error', message: 'Failed to create competition. Please try again.' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

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
            href="/competition"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Competitions
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Competition</h1>
          <p className="text-zinc-400">Add a new competition to track your goals and progress.</p>
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
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Competition
                  </>
                )}
              </button>
              <Link
                href="/competition"
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
