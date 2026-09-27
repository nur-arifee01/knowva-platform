'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  LifeBuoy,
  BookOpen,
  Users,
  BarChart3,
  ArrowLeft,
  Shield,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronRight,
  Lock,
  GraduationCap,
  CreditCard,
} from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin', label: 'ภาพรวมระบบ', icon: LayoutDashboard },
  { href: '/admin/users', label: 'จัดการผู้เรียน (Users)', icon: Users },
  { href: '/admin/orders', label: 'ตรวจสอบชำระเงิน (Orders)', icon: CreditCard },
  { href: '/admin/tickets', label: 'จัดการปัญหา (Tickets)', icon: LifeBuoy },
  { href: '/admin/courses', label: 'จัดการคอร์สเรียน', icon: BookOpen },
  { href: '/admin/instructors', label: 'จัดการข้อมูลผู้สอน', icon: GraduationCap },
  { href: '/admin/analytics', label: 'สถิติ & ยอดการสมัคร', icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, userRole, isStaff, isAdmin, logout } = useApp();

  // Client-side Access Guard: Must be Staff or Admin
  if (!isStaff) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-zinc-200 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-zinc-950">
              สิทธิ์การเข้าถึงถูกจำกัด (Access Restricted)
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed">
              หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (<strong className="text-zinc-900">Admin</strong>) และเจ้าหน้าที่เท่านั้น บัญชีปัจจุบันของคุณมีสิทธิ์ระดับ: <span className="uppercase font-mono text-amber-700 font-bold">[{userRole}]</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left">
            <p className="text-xs text-zinc-600 leading-relaxed">
              หากคุณเป็นผู้ดูแลระบบ กรุณาตรวจสอบว่าอีเมลของคุณได้รับการกำหนดสิทธิ์เป็น <strong className="text-emerald-700 font-bold">admin</strong> ในตาราง profiles บน Supabase เรียบร้อยแล้ว
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/dashboard"
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 transition"
            >
              กลับหน้าคลังคอร์ส
            </Link>
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-black text-xs font-semibold text-white transition shadow-sm"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-zinc-200/80 flex flex-col shrink-0 shadow-sm">
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-black text-sm shadow-sm">
              K
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-zinc-950 font-en leading-none block">
                KNOWVA<span className="text-emerald-500">.</span> Admin
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider leading-none mt-0.5 block">
                {isAdmin ? 'Super Admin Portal' : 'Staff Portal'}
              </span>
            </div>
          </Link>

          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
            isAdmin ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {userRole}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            ระบบจัดการ (Management)
          </div>
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </Link>
            );
          })}

          <div className="pt-6 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            ทางลัดหน้าบ้าน (Shortcuts)
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>หน้าคลังคอร์สเรียน (LMS)</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>หน้าหลักเว็บไซต์ (Home)</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
          </Link>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {(currentUser?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="font-bold text-zinc-900 truncate text-xs">{currentUser?.name || 'Admin User'}</p>
                <p className="text-[10px] text-zinc-400 truncate font-mono">{currentUser?.email || 'admin@knowva.ac'}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="ออกจากระบบ"
              className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-zinc-200/60 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">สถานะสิทธิ์ในระบบ:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              isAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {userRole}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-50/60 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
