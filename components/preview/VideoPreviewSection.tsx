'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PREVIEW_VIDEOS } from '@/lib/data';
import { Play, Sparkles, CheckCircle2, ArrowRight, Video, ExternalLink, ShieldCheck } from 'lucide-react';

export const VideoPreviewSection: React.FC = () => {
  const { openEnrollModal, openPreviewModal } = useApp();
  const [selectedEp, setSelectedEp] = useState<number>(1);

  const currentVideo = PREVIEW_VIDEOS.find(v => v.ep === selectedEp) || PREVIEW_VIDEOS[0];

  return (
    <section id="free-preview" className="py-20 md:py-28 bg-zinc-50/70 border-y border-zinc-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ทดลองเรียนฟรี 3 ตอนจริง (YouTube Full HD)
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            ดูตัวอย่างบทเรียนฟรี 3 คลิปเต็ม <br className="hidden sm:inline" />
            <span className="text-zinc-600 font-semibold">สัมผัสสไตล์การสอนจริงก่อนตัดสินใจ</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            ไม่มีค่าใช้จ่าย ไม่ต้องผูกบัตรเครดิต รับชมความเข้มข้นของการเรียนการสอนแบบ Step-by-Step พร้อมโค้ดจริงระดับ Production ทั้งด้าน Full-Stack AI, Next.js UI และ REST API
          </p>
        </div>

        {/* Main Active Video Player Display */}
        <div className="max-w-5xl mx-auto mb-12 bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
          {/* Top Video Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-zinc-900 border-b border-zinc-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold">
                กำลังเล่น EP.0{currentVideo.ep}
              </span>
              <span className="text-zinc-300 font-medium truncate max-w-xs sm:max-w-md">
                {currentVideo.title}
              </span>
            </div>

            <div className="flex items-center gap-3 text-zinc-400">
              <span className="font-mono">{currentVideo.duration}</span>
              <a
                href={`https://youtu.be/${currentVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
                title="เปิดดูใน YouTube"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 16:9 YouTube Embed Iframe */}
          <div className="relative w-full aspect-video bg-black">
            <iframe
              key={currentVideo.ep}
              src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?rel=0`}
              title={currentVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Bottom Episode Info Bar */}
          <div className="p-5 sm:p-6 bg-zinc-900/90 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                  {currentVideo.topic}
                </span>
                <span className="text-xs text-zinc-400">
                  {currentVideo.duration}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {currentVideo.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                {currentVideo.description}
              </p>
            </div>

            <div className="shrink-0 flex sm:flex-col gap-2">
              <button
                type="button"
                onClick={() => openPreviewModal(currentVideo.ep)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition flex items-center justify-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>ขยายเต็มจอ (Modal)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Interactive Episode Cards Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-zinc-900">
              คลิกเลือกบทเรียนตัวอย่างที่ต้องการรับชม (ทั้งหมด 3 ตอน)
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              คลิกที่การ์ดเพื่อสลับวิดีโอด้านบนทันที หรือเปิดดูแบบเต็มจอ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PREVIEW_VIDEOS.map((video) => {
              const isCurrent = selectedEp === video.ep;
              return (
                <div
                  key={video.ep}
                  onClick={() => setSelectedEp(video.ep)}
                  className={`group relative rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isCurrent
                      ? 'border-zinc-950 bg-white shadow-xl ring-2 ring-zinc-950/10 -translate-y-1'
                      : 'border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-md'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                    {/* Real YouTube Thumbnail */}
                    <img
                      src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Badge Top Left */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isCurrent ? 'bg-emerald-500 text-zinc-950' : 'bg-black/70 text-white backdrop-blur-xs'
                      }`}>
                        EP.0{video.ep}
                      </span>
                    </div>

                    {/* Free Badge Top Right */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-zinc-900 shadow-sm">
                        บทเรียนฟรี
                      </span>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-emerald-500 text-zinc-950 scale-110 shadow-lg'
                          : 'bg-white/90 text-zinc-950 group-hover:scale-110 group-hover:bg-white shadow-md'
                      }`}>
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>

                    {/* Duration Bottom Right */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-300">
                      {video.duration}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {video.topic}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 group-hover:text-black line-clamp-2 leading-snug">
                        {video.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-2 line-clamp-3 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                        isCurrent ? 'text-emerald-600' : 'text-zinc-600 group-hover:text-zinc-900'
                      }`}>
                        {isCurrent ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            กำลังเล่นอยู่ด้านบน
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            คลิกเพื่อสลับมาเล่นคลิปนี้
                          </>
                        )}
                      </span>

                      <span className="text-[11px] text-zinc-400">
                        HD 1080p
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upsell / CTA Banner after video preview */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-zinc-950 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-zinc-800">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>หลักสูตรเต็ม 8 สัปดาห์ ครบเครื่องที่สุด</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              ชอบบทเรียนตัวอย่างทั้ง 3 ตอนนี้ใช่ไหม?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              ปลดล็อกบทเรียนฉบับเต็มกว่า 120+ ตอน, 6 โปรเจกต์จริง, ระบบตรวจโค้ดส่วนตัว และสิทธิ์ Live Coaching สัปดาห์ละครั้ง
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => openEnrollModal('pro')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 transition shadow-md flex items-center justify-center gap-2"
            >
              <span>สมัครเรียนคอร์สเต็มทันที</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

