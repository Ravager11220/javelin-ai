'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, X, Filter, Trophy, Target, Award, Calendar, Settings, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type NotificationType = 'system' | 'training' | 'competition';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'training' | 'competition'>('all');

  // Load notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      // Initialize with sample notifications
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          type: 'training',
          title: 'Practice Session Completed',
          message: 'Great job! You completed today\'s practice with a personal best of 65m.',
          timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
          read: false,
        },
        {
          id: '2',
          type: 'competition',
          title: 'Competition Reminder',
          message: 'Your competition "Regional Championship" is scheduled for tomorrow at 10:00 AM.',
          timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
          read: false,
        },
        {
          id: '3',
          type: 'system',
          title: 'Profile Updated',
          message: 'Your athlete profile has been successfully updated.',
          timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
          read: true,
        },
        {
          id: '4',
          type: 'training',
          title: 'Weekly Goal Achieved',
          message: 'Congratulations! You\'ve reached your weekly training goal of 10 practice sessions.',
          timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
          read: true,
        },
        {
          id: '5',
          type: 'competition',
          title: 'New Competition Added',
          message: 'A new competition "National Qualifiers" has been added to your schedule.',
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
          read: true,
        },
      ];
      setNotifications(sampleNotifications);
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'training':
        return <Target className="w-5 h-5 text-blue-400" />;
      case 'competition':
        return <Trophy className="w-5 h-5 text-orange-400" />;
      case 'system':
        return <Settings className="w-5 h-5 text-purple-400" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const groupNotifications = () => {
    const now = Date.now();
    const today = now - 1000 * 60 * 60 * 24;
    const yesterday = today - 1000 * 60 * 60 * 24;

    const filtered = notifications.filter(notif => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !notif.read;
      return notif.type === filter;
    });

    const groups = {
      today: filtered.filter(n => n.timestamp >= today),
      yesterday: filtered.filter(n => n.timestamp >= yesterday && n.timestamp < today),
      older: filtered.filter(n => n.timestamp < yesterday),
    };

    return groups;
  };

  const groupedNotifications = groupNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 sm:right-6 w-full max-w-sm sm:max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 max-h-[calc(100vh-6rem)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-5 h-5 text-slate-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-800 overflow-x-auto">
              {(['all', 'unread', 'system', 'training', 'competition'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${
                    filter === f
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-96 p-2">
              {Object.entries(groupedNotifications).map(([group, notifs]) => {
                if (notifs.length === 0) return null;
                
                return (
                  <div key={group} className="mb-4">
                    <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {group === 'today' ? 'Today' : group === 'yesterday' ? 'Yesterday' : 'Older'}
                    </h3>
                    {notifs.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`relative p-3 rounded-xl mb-2 transition-all ${
                          !notification.read
                            ? 'bg-purple-500/10 border border-purple-500/20'
                            : 'bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getIconForType(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-white font-medium text-sm">{notification.title}</p>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-slate-400 text-sm mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-slate-500 text-xs mt-2">{formatTime(notification.timestamp)}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                            title="Delete"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })}

              {Object.values(groupedNotifications).every(notifs => notifs.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Bell className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">No notifications found</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
