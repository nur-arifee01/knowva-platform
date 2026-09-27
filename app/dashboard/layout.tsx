'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  LogOut,
  LogIn,
  Crown,
  Shield,
  Layers,
  UserCheck,
  Headphones,
  ShieldAlert
} from 'lucide-react';
import { TIER_BENEFITS } from '@/lib/coursesData';
import { AuthModal } from '@/components/auth/AuthModal';
import { EnrollModal } from '@/components/enroll/EnrollModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isStaff, isAdmin, userRole, logout, openAuthModal, openEnrollModal, openSupportModal } = useApp();
  const userTier = currentUser?.tier || 'free';
  const tierInfo = TIER_BENEFITS[userTier] || TIER_BENEFITS.free;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      {/* Dashboard Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand & Back to Home */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform">
                K
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-zinc-950 font-en leading-none">
                  KNOWVA<span className="text-emerald-500">.</span>
                </span>
                <span className="text-[9px] text-zinc-400 font-semibold tracking-wider uppercase leading-none mt-0.5">
                  LMS Dashboard
                </span>
              </div>
            </Link>

            <div className="h-5 w-px bg-zinc-200 hidden sm:block" />

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors py-1 px-2.5 rounded-lg hover:bg-zinc-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าหลักสูตร</span>
            </Link>
          </div>

          {/* Right: User State, Tier Badge, CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Support Ticket Modal Button */}
            <button
              onClick={() => openSupportModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition shadow-sm"
              title="แจ้งปัญหาการใช้งาน"
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">แจ้งปัญหา</span>
            </button>

            {/* Admin Portal Link if Staff/Admin */}
            {isStaff && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ระบบหลังบ้าน</span>
                <span className="text-[10px] uppercase px-1 py-0.2 rounded bg-purple-800">
                  {userRole}
                </span>
              </Link>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Active Tier Pill */}
                <div
                  className={`hidden xs:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tierInfo.badgeColor}`}
                >
                  {userTier === 'vip' && <Crown className="w-3.5 h-3.5 text-amber-600" />}
                  {userTier === 'pro' && <Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
                  {userTier === 'basic' && <Layers className="w-3.5 h-3.5 text-blue-600" />}
                  {userTier === 'free' && <Shield className="w-3.5 h-3.5 text-zinc-500" />}
                  <span className="uppercase">{userTier} TIER</span>
                </div>

                {/* Upgrade Button if not VIP */}
                {userTier !== 'vip' && (
                  <button
                    onClick={() => openEnrollModal('vip')}
                    className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>อัปเกรด VIP</span>
                  </button>
                )}

                {/* User Info & Logout */}
                <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-zinc-200">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                    {(currentUser.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-zinc-900 truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate max-w-[120px]">
                      {currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={() => logout()}
                    title="ออกจากระบบ"
                    aria-label="ออกจากระบบ"
                    className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-zinc-100 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal()}
                  className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>เข้าสู่ระบบ</span>
                </button>
                <button
                  onClick={() => openEnrollModal('pro')}
                  className="btn btn-primary text-xs py-1.5 px-3"
                >
                  สมัครเรียน
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 KNOWVA Academy. All rights reserved. Full-Stack Web & AI Engineering Cohort.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-900 transition">หน้าแรก</Link>
            <Link href="/#curriculum" className="hover:text-zinc-900 transition">หลักสูตร</Link>
            <Link href="/#pricing" className="hover:text-zinc-900 transition">แพ็กเกจราคา</Link>
          </div>
        </div>
      </footer>

      {/* Modals available inside dashboard */}
      <AuthModal />
      <EnrollModal />
    </div>
  );
}

