'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CURRICULUM_WEEKS } from '@/lib/data';
import { ChevronDown, Play, Sparkles, BookOpen, CheckCircle } from 'lucide-react';

export const CurriculumSection: React.FC = () => {
  const { openPreviewModal } = useApp();
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]); // Week 1 open by default

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev =>
      prev.includes(weekNum) ? prev.filter(w => w !== weekNum) : [...prev, weekNum]
    );
  };

  const handleExpandAll = () => {
    if (expandedWeeks.length === CURRICULUM_WEEKS.length) {
      setExpandedWeeks([]);
    } else {
      setExpandedWeeks(CURRICULUM_WEEKS.map(w => w.week));
    }
  };

  const isAllExpanded = expandedWeeks.length === CURRICULUM_WEEKS.length;

  return (
    <section id="curriculum" className="py-20 bg-zinc-50 border-y border-zinc-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              CURRICULUM OVERVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mt-1">
              เนื้อหาหลักสูตร 8 สัปดาห์
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              ออกแบบอย่างพิถีพิถันเพื่อปูพื้นฐานสู่การสร้างระบบ Full-Stack AI ระดับมืออาชีพ
            </p>
          </div>

          <button
            type="button"
            onClick={handleExpandAll}
            className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 underline self-start sm:self-auto cursor-pointer"
          >
            {isAllExpanded ? 'ย่อเนื้อหาทั้งหมด' : 'ขยายเนื้อหาทั้งหมด'}
          </button>
        </div>

        {/* Weeks Accordion List */}
        <div className="space-y-3">
          {CURRICULUM_WEEKS.map(week => {
            const isOpen = expandedWeeks.includes(week.week);
            return (
              <div
                key={week.week}
                className={`border rounded-xl bg-white transition-all overflow-hidden ${isOpen ? 'border-zinc-400 shadow-sm' : 'border-zinc-200'}`}
              >
                <button
                  type="button"
                  onClick={() => toggleWeek(week.week)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      W{week.week}
                    </span>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-sm sm:text-base">
                        สัปดาห์ที่ {week.week}: {week.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{week.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {week.projectTag && (
                      <span className="hidden sm:inline-block text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {week.projectTag}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-zinc-900' : ''}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-zinc-100 text-xs sm:text-sm text-zinc-600 space-y-2 animate-fadeIn">
                    <ul className="space-y-2 mt-2">
                      {week.topics.map((topic, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Sample Preview Callout */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-zinc-600 font-medium">
            💡 ต้องการดูรูปแบบการสอนจริงก่อนสมัครเรียน?
          </span>
          <button
            type="button"
            onClick={() => openPreviewModal(1)}
            className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-zinc-700 text-zinc-700" />
            <span>ดูตัวอย่างบทเรียนฟรี (3 ตอน) &rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

