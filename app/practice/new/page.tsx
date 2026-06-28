'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function NewPracticePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    session_date: '',
    distance: '',
    release_angle: '',
    wind_speed: '',
    weather: '',
    location: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to create a practice session');
        return;
      }

      const { error } = await supabase.from('practice_sessions').insert({
        user_id: user.id,
        session_date: formData.session_date,
        distance: parseFloat(formData.distance),
        release_angle: formData.release_angle ? parseFloat(formData.release_angle) : null,
        wind_speed: formData.wind_speed ? parseFloat(formData.wind_speed) : null,
        weather: formData.weather || null,
        location: formData.location || null,
        notes: formData.notes || null,
      });

      if (error) throw error;

      setSuccess(true);
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push('/practice/history');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create practice session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <TopNavbar />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/practice"
              className="inline-flex items-center text-slate-400 hover:text-white mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Practice
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">New Practice Session</h1>
            <p className="text-slate-400">Log your training session details</p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400">Practice session saved successfully! Redirecting...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 space-y-6">
              {/* Session Date */}
              <div>
                <label htmlFor="session_date" className="block text-sm font-medium text-slate-300 mb-2">
                  Session Date *
                </label>
                <input
                  type="date"
                  id="session_date"
                  name="session_date"
                  value={formData.session_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Distance */}
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-slate-300 mb-2">
                  Distance (meters) *
                </label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  required
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 82.5"
                />
              </div>

              {/* Release Angle */}
              <div>
                <label htmlFor="release_angle" className="block text-sm font-medium text-slate-300 mb-2">
                  Release Angle (degrees)
                </label>
                <input
                  type="number"
                  id="release_angle"
                  name="release_angle"
                  value={formData.release_angle}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="90"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 32"
                />
              </div>

              {/* Wind Speed */}
              <div>
                <label htmlFor="wind_speed" className="block text-sm font-medium text-slate-300 mb-2">
                  Wind Speed (m/s)
                </label>
                <input
                  type="number"
                  id="wind_speed"
                  name="wind_speed"
                  value={formData.wind_speed}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 2.5"
                />
              </div>

              {/* Weather */}
              <div>
                <label htmlFor="weather" className="block text-sm font-medium text-slate-300 mb-2">
                  Weather
                </label>
                <select
                  id="weather"
                  name="weather"
                  value={formData.weather}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select weather condition</option>
                  <option value="Sunny">Sunny</option>
                  <option value="Cloudy">Cloudy</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Windy">Windy</option>
                  <option value="Overcast">Overcast</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Olympic Stadium"
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Add any additional notes about this session..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : 'Save Session'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
