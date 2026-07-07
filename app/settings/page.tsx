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
  Sun,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNavbar from '@/components/dashboard/TopNavbar';
import { motion } from 'framer-motion';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);

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

  const handleExportData = async () => {
    try {
      if (!user) return;

      // Fetch all user data
      const [profileData, practicesData, competitionsData] = await Promise.all([
        supabase.from('athlete_profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('practices').select('*').eq('user_id', user.id),
        supabase.from('competitions').select('*').eq('user_id', user.id),
      ]);

      const exportData = {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        profile: profileData.data,
        practices: practicesData.data,
        competitions: competitionsData.data,
        exported_at: new Date().toISOString(),
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `javelin-ai-data-${user.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Data exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showToast('Error exporting data', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      showToast('Please type DELETE to confirm', 'error');
      return;
    }

    setDeleting(true);
    try {
      if (!user) return;

      // Delete user data from tables
      await Promise.all([
        supabase.from('practices').delete().eq('user_id', user.id),
        supabase.from('competitions').delete().eq('user_id', user.id),
        supabase.from('athlete_profiles').delete().eq('user_id', user.id),
      ]);

      // Delete auth user
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      showToast('Account deleted successfully', 'success');
      
      // Sign out and redirect
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      showToast('Error deleting account', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirmation('');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <TopNavbar />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
            <div className="space-y-6">
              <div className="h-10 w-48 bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-6 w-64 bg-slate-800 rounded-lg animate-pulse" />
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <TopNavbar />
          <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 flex items-center justify-center">
            <p className="text-slate-400">Please log in to view settings.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <TopNavbar />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your application preferences</p>
        </motion.div>

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
                  <Moon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-sm text-slate-400">Use dark theme</p>
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
                  <Sun className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Light Mode</p>
                    <p className="text-sm text-slate-400">Use light theme</p>
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
                    : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600'
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
                    : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600'
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
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
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
                  <p className="text-sm text-slate-400">Receive email updates</p>
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
                  <p className="text-sm text-slate-400">Get reminded about practice</p>
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
                  <p className="text-sm text-slate-400">Get reminded about competitions</p>
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
                <p className="text-sm text-slate-400 mb-1">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">User ID</p>
                <p className="text-white font-medium font-mono text-sm">{shortenUserId(user.id)}</p>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Data Management</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium mb-1">Export Personal Data</p>
                    <p className="text-sm text-slate-400">Download all your data as a JSON file</p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium mb-1">Delete Account</p>
                    <p className="text-sm text-slate-400">Permanently delete your account and all data</p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
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
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Settings
            </button>
          </div>
        </div>
          </div>
        </div>
      </main>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Account</h3>
                <p className="text-slate-400 text-sm">This action cannot be undone</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-slate-300">
                This will permanently delete your account and all associated data including:
              </p>
              <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
                <li>Profile information</li>
                <li>Practice sessions</li>
                <li>Competition records</li>
                <li>All other personal data</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Type <span className="text-red-400 font-bold">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmation !== 'DELETE'}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
