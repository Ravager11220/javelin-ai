'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { User as UserIcon, Mail, Calendar, Ruler, Weight, Target, Edit, Plus } from 'lucide-react';

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

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndProfile() {
      try {
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) {
          setLoading(false);
          return;
        }

        setUser(user);

        // Fetch athlete profile
        const { data: profileData, error: profileError } = await supabase
          .from('athlete_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-zinc-400">Please log in to view your profile.</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="w-10 h-10 text-zinc-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">No profile created yet.</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Create your athlete profile to start tracking your training and performance.
            </p>
            <Link
              href="/profile/edit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Profile</h1>
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-zinc-300 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-300"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 sm:p-8 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-slate-700"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-slate-700">
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {profile.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Email */}
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{profile.full_name}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-zinc-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            {/* Bio */}
            {profile.bio && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">About</h3>
                <p className="text-zinc-300 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Age */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Age</span>
                </div>
                <p className="text-xl font-bold text-white">{profile.age}</p>
              </div>

              {/* Height */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Ruler className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Height</span>
                </div>
                <p className="text-xl font-bold text-white">{profile.height} <span className="text-sm font-normal text-zinc-400">cm</span></p>
              </div>

              {/* Weight */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Weight className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Weight</span>
                </div>
                <p className="text-xl font-bold text-white">{profile.weight} <span className="text-sm font-normal text-zinc-400">kg</span></p>
              </div>

              {/* Dominant Arm */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Arm</span>
                </div>
                <p className="text-xl font-bold text-white capitalize">{profile.dominant_arm}</p>
              </div>

              {/* Personal Best */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Best</span>
                </div>
                <p className="text-xl font-bold text-white">{profile.personal_best} <span className="text-sm font-normal text-zinc-400">m</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
