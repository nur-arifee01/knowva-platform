'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 bg-zinc-950 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium border border-zinc-800 animate-slide-in-right"
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

