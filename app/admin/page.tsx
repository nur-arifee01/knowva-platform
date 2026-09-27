'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { SupportTicket } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  CreditCard,
  LifeBuoy,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Shield,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { supabase, userRole, isAdmin } = useApp();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    pendingTickets: 0,
    resolvedTickets: 0,
  });
  const [recentTickets, setRecentTickets] = useState<SupportTicket[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Users Count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch Enrollments
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false });

      const totalRev = (enrollments || [])
        .filter((curr: any) => curr.payment_status === 'completed')
        .reduce((acc: number, curr: any) => {
          return acc + (Number(curr.amount_paid) || 0);
        }, 0);

      // 3. Fetch Support Tickets
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      const pending = (tickets || []).filter((t: any) => t.status === 'pending').length;
      const resolved = (tickets || []).filter((t: any) => t.status === 'resolved' || t.status === 'closed').length;

      setStats({
        totalUsers: usersCount || 0,
        totalEnrollments: enrollments?.length || 0,
        totalRevenue: totalRev,
        pendingTickets: pending,
        resolvedTickets: resolved,
      });

      setRecentTickets((tickets || []).slice(0, 5));
      setRecentEnrollments((enrollments || []).slice(0, 5));
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner - Clean Minimal White with subtle border */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-zinc-200/80 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
              {isAdmin ? 'Super Admin' : 'Staff'}
            </span>
            <span className="text-xs text-zinc-500 font-medium">ระบบบริหารจัดการหลังบ้าน</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            แดชบอร์ดภาพรวมระบบ (Admin Overview)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            ตรวจสอบสถานะการแจ้งปัญหาของผู้เรียน สถิติการสมัครเรียน และการทำงานของระบบ
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/tickets"
            className="py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
          >
            <LifeBuoy className="w-4 h-4 text-emerald-400" />
            <span>ตรวจ Tickets รอดำเนินการ ({stats.pendingTickets})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards - White with crisp typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">ผู้ใช้งานทั้งหมด</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            {isLoading ? '...' : stats.totalUsers.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">บัญชีผู้เรียนที่ลงทะเบียนในระบบ</p>
        </div>

        {/* Total Enrollments */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">ยอดสมัครเรียน (Orders)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            {isLoading ? '...' : stats.totalEnrollments.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-500 font-medium">
            ยอดเงินรวม: <span className="text-emerald-600 font-bold">{isLoading ? '...' : formatCurrency(stats.totalRevenue)}</span>
          </p>
        </div>

        {/* Pending Tickets */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2 relative overflow-hidden">
          {stats.pendingTickets > 0 && (
            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          )}
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">ปัญหาที่รอดำเนินการ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
            {isLoading ? '...' : stats.pendingTickets}
          </div>
          <p className="text-[11px] text-zinc-400">ต้องการความช่วยเหลือจาก Staff</p>
        </div>

        {/* Resolved Tickets */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">แก้ไขเสร็จสิ้นแล้ว</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center border border-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            {isLoading ? '...' : stats.resolvedTickets}
          </div>
          <p className="text-[11px] text-zinc-400">เรื่องที่ได้รับการแก้ไขเรียบร้อย</p>
        </div>
      </div>

      {/* Main Grid: Pending Tickets Queue & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Tickets Queue (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
                <LifeBuoy className="w-4 h-4 text-zinc-700" />
              </div>
              <h2 className="text-sm font-bold text-zinc-950">
                รายการแจ้งปัญหาล่าสุด (Support Queue)
              </h2>
            </div>
            <Link
              href="/admin/tickets"
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1 transition"
            >
              <span>ดูทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-zinc-400">กำลังโหลดข้อมูล...</div>
          ) : recentTickets.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="text-xs">ไม่มีรายการแจ้งปัญหาที่ค้างอยู่ในระบบ</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-50 transition flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : t.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {t.status === 'pending' ? 'รอดำเนินการ' : t.status === 'in_progress' ? 'กำลังตรวจสอบ' : 'แก้ไขแล้ว'}
                      </span>
                      <span className="text-[11px] text-zinc-700 font-semibold font-mono">
                        {t.user_name}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        ({new Date(t.created_at).toLocaleDateString('th-TH')})
                      </span>
                    </div>
                    <h4 className="font-bold text-zinc-900 truncate">{t.title}</h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">{t.description}</p>
                  </div>

                  <Link
                    href="/admin/tickets"
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold shrink-0 transition shadow-xs"
                  >
                    จัดการ
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Enrollments (1 Column) */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-sm font-bold text-zinc-950">
                การสมัครล่าสุด
              </h2>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1 transition"
            >
              <span>สถิติ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-zinc-400">กำลังโหลดข้อมูล...</div>
          ) : recentEnrollments.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 space-y-2">
              <CreditCard className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="text-xs">ยังไม่มีรายการสมัครเรียน</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentEnrollments.map((en, i) => (
                <div
                  key={en.id || i}
                  className="p-3.5 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-zinc-900 uppercase tracking-wide">
                      {en.plan}
                    </span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      {new Date(en.created_at).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-emerald-600">
                    {formatCurrency(Number(en.amount_paid) || 0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
