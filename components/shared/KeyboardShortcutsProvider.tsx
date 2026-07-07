'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useKeyboardShortcuts, defaultShortcuts } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export default function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const router = useRouter();
  const shortcuts = defaultShortcuts(router);

  useKeyboardShortcuts(shortcuts);

  return <>{children}</>;
}
