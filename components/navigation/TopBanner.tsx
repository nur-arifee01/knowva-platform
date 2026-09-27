'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Clock } from 'lucide-react';

export const TopBanner: React.FC = () => {
  const { openEnrollModal } = useApp();
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft('00:00:00');
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const pad = (n: number) => String(n).padStart(2, '0');
      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="bg-zinc-950 text-white text-xs sm:text-sm py-2.5 px-4 sticky top-0 z-50 border-b border-zinc-800">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500 text-zinc-950 uppercase tracking-wide">
            Early Bird
          </span>
          <span className="text-zinc-300">
            เปิดรับรุ่นที่ 8 จำกัดเพียง 50 ท่านแรก (ลดทันที 40%)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 hidden md:inline">เหลือเวลาอีกเพียง:</span>
          <div className="inline-flex items-center gap-1.5 font-mono font-semibold bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 text-emerald-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}</span>
          </div>
          <button
            onClick={() => openEnrollModal('pro', 'EARLYBIRD')}
            className="underline hover:text-emerald-400 font-semibold text-xs ml-1 transition-colors cursor-pointer"
          >
            รับสิทธิ์ด่วน &rarr;
          </button>
        </div>
      </div>
    </aside>
  );
};

