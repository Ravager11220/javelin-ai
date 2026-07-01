'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import { CheckCircle, AlertCircle, ArrowLeft, Target, Calendar, Award, Flag, FileText } from 'lucide-react';
import Link from 'next/link';

export default function CreateGoalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    target_distance: '',
    current_distance: '0',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    notes: '',
    status: 'active' as 'active' | 'completed' | 'paused',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Goal title is required';
    }

    if (!formData.target_distance || parseFloat(formData.target_distance) <= 0) {
      newErrors.target_distance = 'Target distance must be greater than 0';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    if (parseFloat(formData.current_distance) < 0) {
      newErrors.current_distance = 'Current distance cannot be negative';
    }

    if (parseFloat(formData.current_distance) > parseFloat(formData.target_distance || '0')) {
      newErrors.current_distance = 'Current distance cannot exceed target distance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setToast({ type: 'error', message: 'You must be logged in to create a goal' });
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
  .from('goals')
  .insert({
    user_id: user.id,
    goal_title: formData.title,
    target_distance: parseFloat(formData.target_distance),
    current_distance: parseFloat(formData.current_distance),
    deadline: formData.deadline,
    priority: formData.priority,
    notes: formData.notes,
    status: formData.status,
  });

      if (insertError) {
        setToast({ type: 'error', message: 'Failed to create goal. Please try again.' });
        setLoading(false);
        return;
      }

      setToast({ type: 'success', message: 'Goal created successfully!' });
      
      setTimeout(() => {
        router.push('/goals');
      }, 1500);
    } catch (error) {
      console.error('Error creating goal:', error);
      setToast({ type: 'error', message: 'An unexpected error occurred' });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <TopNavbar />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
          {/* Toast Notification */}
          {toast && (
            <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl border shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-500/20 border-green-500/30 text-green-400'
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}>
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <Link
              href="/goals"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Goals
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Goal</h1>
            <p className="text-zinc-400">Set a new training goal to track your progress</p>
          </div>

          {/* Form */}
          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
              {/* Goal Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
                  Goal Title <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Achieve 70m throw distance"
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${
                      errors.title ? 'border-red-500/50' : 'border-slate-700'
                    }`}
                  />
                </div>
                {errors.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
              </div>

              {/* Target Distance */}
              <div className="mb-6">
                <label htmlFor="target_distance" className="block text-sm font-medium text-zinc-300 mb-2">
                  Target Distance (meters) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="number"
                    id="target_distance"
                    name="target_distance"
                    value={formData.target_distance}
                    onChange={handleChange}
                    placeholder="e.g., 70"
                    step="0.1"
                    min="0"
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${
                      errors.target_distance ? 'border-red-500/50' : 'border-slate-700'
                    }`}
                  />
                </div>
                {errors.target_distance && <p className="mt-2 text-sm text-red-400">{errors.target_distance}</p>}
              </div>

              {/* Current Distance */}
              <div className="mb-6">
                <label htmlFor="current_distance" className="block text-sm font-medium text-zinc-300 mb-2">
                  Current Distance (meters)
                </label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="number"
                    id="current_distance"
                    name="current_distance"
                    value={formData.current_distance}
                    onChange={handleChange}
                    placeholder="e.g., 0"
                    step="0.1"
                    min="0"
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${
                      errors.current_distance ? 'border-red-500/50' : 'border-slate-700'
                    }`}
                  />
                </div>
                {errors.current_distance && <p className="mt-2 text-sm text-red-400">{errors.current_distance}</p>}
              </div>

              {/* Deadline */}
              <div className="mb-6">
                <label htmlFor="deadline" className="block text-sm font-medium text-zinc-300 mb-2">
                  Deadline <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${
                      errors.deadline ? 'border-red-500/50' : 'border-slate-700'
                    }`}
                  />
                </div>
                {errors.deadline && <p className="mt-2 text-sm text-red-400">{errors.deadline}</p>}
              </div>

              {/* Priority */}
              <div className="mb-6">
                <label htmlFor="priority" className="block text-sm font-medium text-zinc-300 mb-2">
                  Priority
                </label>
                <div className="relative">
                  <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label htmlFor="status" className="block text-sm font-medium text-zinc-300 mb-2">
                  Status
                </label>
                <div className="relative">
                  <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <label htmlFor="notes" className="block text-sm font-medium text-zinc-300 mb-2">
                  Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes about your goal..."
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/goals"
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-300 text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Save Goal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
