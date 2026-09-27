'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Users,
  LifeBuoy,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  Sparkles,
  Crown,
  Layers,
  Shield,
  Clock,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { supabase, isAdmin } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    pendingRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    planStats: {
      basic: { count: 0, revenue: 0, label: 'Self-Paced (Basic)' },
      pro: { count: 0, revenue: 0, label: 'Pro Cohort' },
      vip: { count: 0, revenue: 0, label: 'VIP Mentorship' },
    },
    ticketStats: {
      total: 0,
      pending: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
    },
    categoryStats: {} as Record<string, number>,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch all enrollments
      const { data: enrollments } = await supabase.from('enrollments').select('*');

      let rev = 0;
      let pendingRev = 0;
      let completedCount = 0;
      let pendingCount = 0;

      const plans = {
        basic: { count: 0, revenue: 0, label: 'Self-Paced (Basic)' },
        pro: { count: 0, revenue: 0, label: 'Pro Cohort' },
        vip: { count: 0, revenue: 0, label: 'VIP Mentorship' },
      };

      (enrollments || []).forEach((e: any) => {
        const amt = Number(e.amount_paid) || 0;
        const status = e.payment_status || 'completed';
        const planKey = (e.plan as 'basic' | 'pro' | 'vip') || 'pro';

        if (status === 'completed') {
          rev += amt;
          completedCount += 1;
          if (plans[planKey]) {
            plans[planKey].count += 1;
            plans[planKey].revenue += amt;
          }
        } else if (status === 'pending') {
          pendingRev += amt;
          pendingCount += 1;
        }
      });

      // 2. Fetch all tickets
      const { data: tickets } = await supabase.from('support_tickets').select('*');

      const tStats = {
        total: tickets?.length || 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0,
      };

      const catStats: Record<string, number> = {};

      (tickets || []).forEach((t: any) => {
        if (t.status in tStats) {
          (tStats as any)[t.status] += 1;
        }
        const cat = t.category || 'general';
        catStats[cat] = (catStats[cat] || 0) + 1;
      });

      setAnalytics({
        totalRevenue: rev,
        pendingRevenue: pendingRev,
        totalOrders: enrollments?.length || 0,
        completedOrders: completedCount,
        pendingOrders: pendingCount,
        planStats: plans,
        ticketStats: tStats,
        categoryStats: catStats,
      });
    } catch (err) {
      console.error('Fetch analytics error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find most popular plan
  const planEntries = Object.entries(analytics.planStats);
  const mostPopular = [...planEntries].sort((a, b) => b[1].count - a[1].count)[0];
  const resolutionRate =
    analytics.ticketStats.total > 0
      ? Math.round(
          ((analytics.ticketStats.resolved + analytics.ticketStats.closed) /
            analytics.ticketStats.total) *
            100
        )
      : 100;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-zinc-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              Analytics & Insights
            </span>
            <span className="text-xs text-zinc-500 font-medium">สถิติเชิงลึก & ยอดการสมัคร</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1.5">
            รายงานสถิติแพลตฟอร์ม (Platform Analytics)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            วิเคราะห์ยอดการสมัครเรียนแต่ละแพ็กเกจ อัตราการแก้ไขปัญหา และสถิติเชิงลึก
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {analytics.pendingRevenue > 0 && (
            <div className="p-3.5 px-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-right">
              <span className="text-[10px] text-amber-700 uppercase font-bold tracking-wider block">
                ยอดรอตรวจสอบ ({analytics.pendingOrders} รายการ)
              </span>
              <span className="text-lg font-black text-amber-800 font-mono">
                {isLoading ? '...' : formatCurrency(analytics.pendingRevenue)}
              </span>
            </div>
          )}

          <div className="p-3.5 px-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-right">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
              รายรับจริง (อนุมัติแล้ว {analytics.completedOrders} รายการ)
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
              {isLoading ? '...' : formatCurrency(analytics.totalRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Subscription Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-zinc-800" />
            <h2 className="text-base font-bold text-zinc-950">
              สถิติยอดการสมัครเรียน (Subscription Breakdown)
            </h2>
          </div>
          {mostPopular && mostPopular[1].count > 0 && (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              แพ็กเกจยอดนิยมอันดับ 1: {mostPopular[1].label}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {planEntries.map(([key, data]) => {
            const percentage =
              analytics.totalOrders > 0
                ? Math.round((data.count / analytics.totalOrders) * 100)
                : 0;
            const isBest = mostPopular && mostPopular[0] === key && data.count > 0;

            return (
              <div
                key={key}
                className={`p-6 rounded-3xl bg-white border transition relative overflow-hidden shadow-sm ${
                  isBest
                    ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-zinc-200/80'
                }`}
              >
                {isBest && (
                  <div className="absolute top-0 right-0 px-3 py-0.5 bg-emerald-600 text-[10px] font-bold text-white rounded-bl-xl uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-2 text-zinc-500 mb-3">
                  {key === 'vip' ? (
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                      <Crown className="w-4 h-4" />
                    </div>
                  ) : key === 'pro' ? (
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                      <Layers className="w-4 h-4" />
                    </div>
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">{data.label}</span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-black text-zinc-950">{data.count}</span>
                  <span className="text-xs font-bold text-zinc-500">{percentage}% ของยอดทั้งหมด</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      key === 'vip'
                        ? 'bg-amber-500'
                        : key === 'pro'
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">รายได้รวมแพ็กเกจนี้:</span>
                  <span className="font-mono font-bold text-zinc-900">
                    {formatCurrency(data.revenue)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Tickets Metrics & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Resolution Rate */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
              ประสิทธิภาพการแก้ไขปัญหา (Support Resolution)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-center space-y-1">
              <span className="text-xs text-zinc-500">อัตราแก้ไขสำเร็จ (Resolution Rate)</span>
              <div className="text-3xl font-black text-emerald-600">{resolutionRate}%</div>
              <p className="text-[10px] text-zinc-400">ของ Tickets ทั้งหมด</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-center space-y-1">
              <span className="text-xs text-zinc-500">Tickets รอดำเนินการ</span>
              <div className="text-3xl font-black text-amber-600">
                {analytics.ticketStats.pending}
              </div>
              <p className="text-[10px] text-zinc-400">ต้องการความช่วยเหลือด่วน</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>กำลังตรวจสอบ (In Progress):</span>
              <span className="font-bold text-blue-600">{analytics.ticketStats.in_progress}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>แก้ไขเสร็จสิ้นแล้ว (Resolved):</span>
              <span className="font-bold text-emerald-600">{analytics.ticketStats.resolved}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>ปิดงานแล้ว (Closed):</span>
              <span className="font-bold text-zinc-800">{analytics.ticketStats.closed}</span>
            </div>
          </div>
        </div>

        {/* Tickets by Category */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">
              จำแนกตามหมวดหมู่ปัญหา (By Category)
            </h3>
          </div>

          {Object.keys(analytics.categoryStats).length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              ยังไม่มีข้อมูลหมวดหมู่ปัญหา
            </div>
          ) : (
            <div className="space-y-3.5">
              {Object.entries(analytics.categoryStats).map(([cat, cnt]) => {
                const pct =
                  analytics.ticketStats.total > 0
                    ? Math.round((cnt / analytics.ticketStats.total) * 100)
                    : 0;
                return (
                  <div key={cat} className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-700">
                      <span className="font-semibold capitalize">{cat.replace('_', ' ')}</span>
                      <span className="font-medium text-zinc-500">{cnt} รายการ ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
