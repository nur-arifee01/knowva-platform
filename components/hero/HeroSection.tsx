'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PREVIEW_VIDEOS } from '@/lib/data';
import { Play, Sparkles, Star, ShieldCheck, Users, Code, Terminal, Layers, Video } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { openEnrollModal, openPreviewModal } = useApp();
  const [activeTab, setActiveTab] = useState<'video' | 'app' | 'terminal' | 'arch'>('video');
  const [heroEp, setHeroEp] = useState<number>(1);

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle Background Glow / Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-zinc-50 via-white to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-24 right-1/4 w-80 h-80 bg-zinc-100 rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Status Badge Pill */}
        <div className="inline-flex mb-6">
          <div className="badge-pill">
            <span className="badge-dot"></span>
            <span>เปิดรับสมัครรุ่นที่ 8 • เนื้อหาปรับปรุงใหม่ล่าสุด 2025/2026</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 max-w-4xl mx-auto leading-[1.18] sm:leading-[1.15]">
          สร้างเว็บ & พัฒนา <span className="underline decoration-zinc-300 decoration-wavy underline-offset-8">AI Application</span> จากศูนย์ สู่มืออาชีพใน 8 สัปดาห์
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed">
          คอร์สเดียวที่รวม <strong className="text-zinc-900 font-semibold">Full-Stack Web Development</strong> และ <strong className="text-zinc-900 font-semibold">Generative AI</strong> เข้าด้วยกัน เรียนผ่านการสร้าง 6 โปรเจกต์จริง พร้อมระบบโค้ชชิ่งแบบ 1-on-1 และตรวจโค้ดส่วนตัว
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openEnrollModal('pro', 'EARLYBIRD')}
            className="btn btn-primary text-base py-3.5 px-8 w-full sm:w-auto shadow-lg shadow-zinc-900/10 hover:shadow-xl transition-all"
          >
            <span>สมัครเรียนรุ่นที่ 8 (รับส่วนลด 40%)</span>
            <span className="text-zinc-400">&rarr;</span>
          </button>
          <a
            href="#free-preview"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('free-preview');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-secondary text-base py-3.5 px-7 w-full sm:w-auto hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-zinc-600 fill-zinc-600" />
            <span>ดูตัวอย่างบทเรียนฟรี (3 ตอน)</span>
          </a>
        </div>

        {/* Key Highlights / Social Proof under Hero */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs text-zinc-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-zinc-700 font-semibold">4.9/5</span> (จากผู้เรียนกว่า 1,200+ คน)
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>การันตีความพึงพอใจ คืนเงินใน 7 วัน</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-700" />
            <span>Live Coaching ทุกสัปดาห์ & ตรวจโค้ดส่วนตัว</span>
          </div>
        </div>

        {/* Interactive App / Code Showcase */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-xl shadow-zinc-200/50 text-left">
          {/* Showcase Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-mono text-zinc-400 ml-2">knowva-ai-studio.app</span>
            </div>

            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('video' as any)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === ('video' as any) ? 'bg-white text-zinc-950 font-bold shadow-xs' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                <Video className="w-3.5 h-3.5 text-rose-500" />
                <span>ตัวอย่าง 3 ตอนจริง</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('app')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'app' ? 'bg-white text-zinc-950 font-bold shadow-xs' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Next.js App</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('terminal')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'terminal' ? 'bg-white text-zinc-950 font-bold shadow-xs' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>AI Terminal</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('arch')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'arch' ? 'bg-white text-zinc-950 font-bold shadow-xs' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Architecture</span>
              </button>
            </div>
          </div>

          {/* Tab Screens */}
          <div className="bg-zinc-950 rounded-xl p-6 text-white font-mono text-xs overflow-x-auto min-h-[280px] flex flex-col justify-center">
            {activeTab === 'video' && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black flex flex-col justify-between p-4 sm:p-6 text-white group font-sans">
                {/* Top bar with 3 episode switcher buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-300 z-10">
                  <div className="flex items-center gap-1.5">
                    {PREVIEW_VIDEOS.map((v) => (
                      <button
                        key={v.ep}
                        type="button"
                        onClick={() => setHeroEp(v.ep)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1.5 ${
                          heroEp === v.ep
                            ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                            : 'bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {heroEp === v.ep && <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse"></span>}
                        <span>EP.0{v.ep}</span>
                      </button>
                    ))}
                  </div>
                  <span className="bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-300 font-mono text-[11px] hidden sm:inline">
                    YouTube 1080p
                  </span>
                </div>

                {/* Center Clickable Area */}
                <div className="my-auto text-center cursor-pointer py-2 z-10" onClick={() => openPreviewModal(heroEp)}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-zinc-950 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 ml-1 fill-current" />
                  </div>
                  <p className="text-sm sm:text-base text-white mt-3 font-bold">
                    {PREVIEW_VIDEOS[heroEp - 1]?.title}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    คลิกเพื่อรับชมคลิปตัวอย่างเต็มจอ (หรือสลับดู EP.01, 02, 03 ด้านบน)
                  </p>
                </div>

                {/* Bottom Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs text-zinc-400 z-10">
                  <span className="text-emerald-400 font-medium">ดูฟรีทันที ไม่ต้องสมัครสมาชิก</span>
                  <a
                    href="#free-preview"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('free-preview');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-white hover:text-emerald-400 transition flex items-center gap-1 font-semibold"
                  >
                    <span>เลื่อนดูทั้ง 3 คลิปในหน้านี้ &darr;</span>
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'app' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
                  <span>// Next.js 15 Server Action with Vercel AI SDK</span>
                  <span className="text-emerald-400">● Streaming Active</span>
                </div>
                <pre className="text-zinc-300 leading-relaxed font-mono">
{`export async function generateAICode(prompt: string) {
  const result = await streamText({
    model: openai('gpt-4o'),
    system: 'You are an elite Full-Stack Architect creating clean Next.js 15 apps.',
    prompt,
    tools: {
      deployApp: tool({ description: 'Deploy application to Edge', execute: async () => 'Deployed!' })
    }
  });
  return result.toDataStreamResponse();
}`}
                </pre>
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="space-y-2">
                <p className="text-emerald-400">$ npx create-next-app@latest knowva-fullstack-ai</p>
                <p className="text-zinc-400">✓ Initializing TypeScript, Tailwind CSS, App Router...</p>
                <p className="text-emerald-400">$ npm install ai @ai-sdk/openai @supabase/supabase-js</p>
                <p className="text-zinc-400">✓ Installed AI SDK and Vector Database drivers in 1.4s</p>
                <p className="text-zinc-300 mt-3">$ ready - started server on 0.0.0.0:3000, url: http://localhost:3000</p>
                <p className="text-emerald-400 font-bold">✓ Ready for production deployment with 100% Type-Safety</p>
              </div>
            )}

            {activeTab === 'arch' && (
              <div className="space-y-3 text-zinc-300">
                <p className="text-amber-400 font-bold">// Production Clean Architecture Stack</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <p className="text-white font-bold">Frontend Layer</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Next.js 15 App Router, React Server Components, Tailwind, Lucide</p>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <p className="text-white font-bold">AI & Server Layer</p>
                    <p className="text-[11px] text-zinc-400 mt-1">OpenAI, Claude 3.5, LangChain/LlamaIndex, Streaming Tool Calling</p>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <p className="text-white font-bold">Database & Auth</p>
                    <p className="text-[11px] text-zinc-400 mt-1">PostgreSQL, Supabase, pgvector RAG, NextAuth, Stripe Webhooks</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

