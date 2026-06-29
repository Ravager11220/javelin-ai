'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { 
  Palette, 
  Ruler, 
  MapPin, 
  Bell, 
  User as UserIcon, 
  Save, 
  RotateCcw,
  Moon,
  Sun
} from 'lucide-react';

interface Settings {
  appearance: 'dark' | 'light';
  units: 'metric' | 'imperial';
  defaultLocation: string;
  emailNotifications: boolean;
  practiceReminders: boolean;
  competitionReminders: boolean;
}

const defaultSettings: Settings = {
  appearance: 'dark',
  units: 'metric',
  defaultLocation: '',
  emailNotifications: true,
  practiceReminders: true,
  competitionReminders: true,
};

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);

        // Load settings from localStorage
        const savedSettings = localStorage.getItem('javelin-settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('javelin-settings', JSON.stringify(settings));
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('javelin-settings');
    showToast('Settings reset to defaults', 'success');
  };

  const shortenUserId = (userId: string) => {
    if (!userId) return '';
    return `${userId.slice(0, 8)}...${userId.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading settings...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-zinc-400">Please log in to view settings.</div>
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

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-zinc-400">Manage your application preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-sm text-zinc-400">Use dark theme</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('appearance')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    settings.appearance === 'dark' ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                      settings.appearance === 'dark' ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-white font-medium">Light Mode</p>
                    <p className="text-sm text-zinc-400">Use light theme</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('appearance')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    settings.appearance === 'light' ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                      settings.appearance === 'light' ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Units */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Units</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleInputChange('units', 'metric')}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  settings.units === 'metric'
                    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/50 text-white'
                    : 'bg-slate-800/30 border-slate-700/50 text-zinc-400 hover:border-slate-600'
                }`}
              >
                <p className="font-semibold">Metric</p>
                <p className="text-sm mt-1">cm, kg, m</p>
              </button>

              <button
                onClick={() => handleInputChange('units', 'imperial')}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  settings.units === 'imperial'
                    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/50 text-white'
                    : 'bg-slate-800/30 border-slate-700/50 text-zinc-400 hover:border-slate-600'
                }`}
              >
                <p className="font-semibold">Imperial</p>
                <p className="text-sm mt-1">ft, lbs, yd</p>
              </button>
            </div>
          </div>

          {/* Default Practice Location */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Default Practice Location</h2>
            </div>

            <input
              type="text"
              value={settings.defaultLocation}
              onChange={(e) => handleInputChange('defaultLocation', e.target.value)}
              placeholder="Enter your city"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Notifications */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-zinc-400">Receive email updates</p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    settings.emailNotifications ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                      settings.emailNotifications ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div>
                  <p className="text-white font-medium">Practice Reminders</p>
                  <p className="text-sm text-zinc-400">Get reminded about practice</p>
                </div>
                <button
                  onClick={() => handleToggle('practiceReminders')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    settings.practiceReminders ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                      settings.practiceReminders ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div>
                  <p className="text-white font-medium">Competition Reminders</p>
                  <p className="text-sm text-zinc-400">Get reminded about competitions</p>
                </div>
                <button
                  onClick={() => handleToggle('competitionReminders')}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    settings.competitionReminders ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                      settings.competitionReminders ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Account</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <p className="text-sm text-zinc-400 mb-1">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <p className="text-sm text-zinc-400 mb-1">User ID</p>
                <p className="text-white font-medium font-mono text-sm">{shortenUserId(user.id)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              onClick={handleReset}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-zinc-300 font-semibold rounded-xl hover:bg-slate-700 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
