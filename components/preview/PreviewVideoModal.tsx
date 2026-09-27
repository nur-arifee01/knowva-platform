'use client';

import React, { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { PREVIEW_VIDEOS } from '@/lib/data';
import { X, Play, Sparkles, ArrowRight, ExternalLink, Video } from 'lucide-react';

export const PreviewVideoModal: React.FC = () => {
  const {
    isPreviewModalOpen,
    closePreviewModal,
    activeEpisode,
    setActiveEpisode,
    openEnrollModal,
  } = useApp();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentEp = PREVIEW_VIDEOS.find(v => v.ep === activeEpisode) || PREVIEW_VIDEOS[0];

  // Stop video playback when modal closes by resetting iframe
  useEffect(() => {
    if (!isPreviewModalOpen && iframeRef.current) {
      iframeRef.current.src = '';
    }
  }, [isPreviewModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewModalOpen) {
        closePreviewModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewModalOpen, closePreviewModal]);

  if (!isPreviewModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-zinc-950/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePreviewModal();
      }}
    >
      <div className="relative w-full max-w-5xl lg:max-w-6xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[90vh] max-h-[820px] animate-scale-up">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200/80 bg-zinc-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ทดลองเรียนฟรี 3 ตอนจริง (YouTube HD)
            </span>
            <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">
              กำลังรับชม: EP.0{currentEp.ep}
            </span>
          </div>

          <button
            type="button"
            onClick={closePreviewModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body (2-Column Split: Left Playlist with Left-side Scrollbar + Right Video Player) */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Column: Episode Playlist with Visible Left-side Scrollbar */}
          <div className="w-full md:w-80 lg:w-[380px] shrink-0 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col bg-zinc-50/90 min-h-0">
            {/* Playlist Header */}
            <div className="p-3.5 border-b border-zinc-200/80 bg-white/70 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-zinc-700" />
                  <span>รายการบทเรียน (3 ตอนฟรี)</span>
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  เลื่อนรายการด้านล่างเพื่อเลือกคลิปที่ 2 และ 3
                </p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                3 ตอน
              </span>
            </div>

            {/* Scrollable Playlist Cards with Explicit Left-side Scrollbar */}
            <div className="flex-1 scrollbar-left visible-scrollbar p-3 space-y-2.5 overflow-y-auto">
              {PREVIEW_VIDEOS.map((video) => {
                const isActive = activeEpisode === video.ep;
                return (
                  <div
                    key={video.ep}
                    onClick={() => setActiveEpisode(video.ep)}
                    className={`group rounded-xl p-2.5 transition-all cursor-pointer border-2 flex gap-3 text-left ${
                      isActive
                        ? 'border-zinc-950 bg-white shadow-md ring-1 ring-zinc-950/10'
                        : 'border-zinc-200/80 bg-white hover:border-zinc-400 hover:shadow-xs'
                    }`}
                  >
                    {/* Thumbnail with duration */}
                    <div className="relative w-28 h-18 sm:w-32 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-black">
                      <img
                        src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-emerald-500 text-zinc-950 scale-110 shadow' : 'bg-white/90 text-zinc-950'
                        }`}>
                          <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white">
                        EP.0{video.ep}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {isActive ? '● กำลังเล่น' : `EP.0${video.ep}`}
                          </span>
                          <span className="text-[10px] text-zinc-400 truncate">
                            {video.duration}
                          </span>
                        </div>
                        <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${
                          isActive ? 'text-zinc-950' : 'text-zinc-700 group-hover:text-zinc-900'
                        }`}>
                          {video.title}
                        </h4>
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1">
                        {video.description}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Notice in playlist */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900 text-xs text-left space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>ทดลองเรียนได้ครบทั้ง 3 คลิปฟรี</span>
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  เนื้อหาจริงที่ใช้สอนในรุ่นปัจจุบัน หากต้องการเรียนเนื้อหาเต็ม 120+ ตอน สามารถสมัครแพ็กเกจด้านล่างได้ทันที
                </p>
              </div>
            </div>

            {/* Bottom Sticky Action inside Sidebar */}
            <div className="p-3 border-t border-zinc-200 bg-white shrink-0">
              <button
                type="button"
                onClick={() => {
                  closePreviewModal();
                  openEnrollModal('pro');
                }}
                className="w-full py-2.5 px-4 bg-zinc-950 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-1.5"
              >
                <span>สมัครคอร์สเต็ม (Pro Cohort)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: 16:9 Video Player & Video Details */}
          <div className="flex-1 flex flex-col min-h-0 bg-white p-4 sm:p-6 overflow-y-auto visible-scrollbar">
            {/* 16:9 Responsive Video Iframe */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-zinc-800 shrink-0">
              <iframe
                ref={iframeRef}
                key={currentEp.ep}
                src={currentEp.videoUrl}
                title={currentEp.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Active Video Info */}
            <div className="mt-4 pt-3 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-zinc-950 text-white">
                    EP.0{currentEp.ep}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {currentEp.topic || 'Full-Stack & AI'}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {currentEp.duration}
                  </span>
                </div>

                <a
                  href={`https://youtu.be/${currentEp.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 hover:text-zinc-900 transition flex items-center gap-1 font-medium"
                >
                  <span>เปิดดูใน YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-950">
                  {currentEp.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
                  {currentEp.description}
                </p>
              </div>

              {/* Upsell Alert */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                    เข้าถึงคอร์สเต็ม 120+ ตอน & 6 โปรเจกต์จริง
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    พร้อม Live Coaching ถาม-ตอบสด และโค้ดรีวิวรายบุคคล
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closePreviewModal();
                    openEnrollModal('pro');
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition shrink-0"
                >
                  สมัครเรียนรุ่นที่ 8 &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
