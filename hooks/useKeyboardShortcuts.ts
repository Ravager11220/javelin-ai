'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export const defaultShortcuts = (router: ReturnType<typeof useRouter>): Shortcut[] => [
  {
    key: 'k',
    ctrl: true,
    description: 'Open search',
    action: () => {
      const event = new CustomEvent('open-search');
      window.dispatchEvent(event);
    },
  },
  {
    key: 'd',
    description: 'Go to dashboard',
    action: () => router.push('/dashboard'),
  },
  {
    key: 'a',
    description: 'Go to analytics',
    action: () => router.push('/analytics'),
  },
  {
    key: 'c',
    description: 'Go to coach',
    action: () => router.push('/coach'),
  },
  {
    key: 'p',
    description: 'Go to practice',
    action: () => router.push('/practice'),
  },
];
