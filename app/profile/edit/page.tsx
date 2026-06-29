'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';

interface AthleteProfile {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  height: number;
  weight: number;
  dominant_arm: string;
  personal_best: number;
  bio: string;
  avatar_url: string;
  created_at: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    height: '',
    weight: '',
    dominant_arm: '',
    personal_best: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    async function fetchUserAndProfile() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) {
          setLoading(false);
          return;
        }

        setUser(user);

        const { data: profileData, error: profileError } = await supabase
          .from('athlete_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (profileData) {
          setProfile(profileData);
          setFormData({
            full_name: profileData.full_name || '',
            age: profileData.age?.toString() || '',
            height: profileData.height?.toString() || '',
            weight: profileData.weight?.toString() || '',
            dominant_arm: profileData.dominant_arm || '',
            personal_best: profileData.personal_best?.toString() || '',
            bio: profileData.bio || '',
            avatar_url: profileData.avatar_url || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        showToast('Error loading profile', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndProfile();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    try {
      const profileData = {
        user_id: user.id,
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseInt(formData.height) : null,
        weight: formData.weight ? parseInt(formData.weight) : null,
        dominant_arm: formData.dominant_arm,
        personal_best: formData.personal_best ? parseFloat(formData.personal_best) : null,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
      };

      let error;
      if (profile) {
        const { error: updateError } = await supabase
          .from('athlete_profiles')
          .update(profileData)
          .eq('id', profile.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('athlete_profiles')
          .insert([profileData]);
        error = insertError;
      }

      if (error) throw error;

      showToast('Profile saved successfully!', 'success');
      setTimeout(() => router.push('/profile'), 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Error saving profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-zinc-400">Please log in to edit your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium animate-in slide-in-from-right-4 duration-300`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleCancel}
            className="p-2 text-zinc-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {profile ? 'Edit Profile' : 'Create Profile'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-zinc-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your full name"
            />
          </div>

          {/* Age, Height, Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-zinc-400 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="25"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-zinc-400 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="180"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-zinc-400 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="75"
              />
            </div>
          </div>

          {/* Dominant Arm */}
          <div>
            <label htmlFor="dominant_arm" className="block text-sm font-medium text-zinc-400 mb-2">
              Dominant Arm
            </label>
            <select
              id="dominant_arm"
              name="dominant_arm"
              value={formData.dominant_arm}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">Select arm</option>
              <option value="right">Right</option>
              <option value="left">Left</option>
            </select>
          </div>

          {/* Personal Best */}
          <div>
            <label htmlFor="personal_best" className="block text-sm font-medium text-zinc-400 mb-2">
              Personal Best (m)
            </label>
            <input
              type="number"
              step="0.01"
              id="personal_best"
              name="personal_best"
              value={formData.personal_best}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="82.50"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label htmlFor="avatar_url" className="block text-sm font-medium text-zinc-400 mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-zinc-400 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-zinc-300 font-semibold rounded-xl hover:bg-slate-700 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
