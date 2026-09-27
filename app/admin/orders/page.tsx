'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { EnrollmentOrder, PaymentStatus, SubscriptionTier } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  CreditCard,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Check,
  X,
  UserCheck,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  ZoomIn,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

// Default mock slip image (SVG data URL representing a Thai mobile banking transfer slip)
const SAMPLE_SLIP_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="580" viewBox="0 0 400 580">
  <rect width="400" height="580" fill="%23f4fbf7" rx="16"/>
  <rect x="0" y="0" width="400" height="90" fill="%23047857" rx="16"/>
  <rect x="0" y="70" width="400" height="20" fill="%23047857"/>
  <text x="200" y="42" fill="%23ffffff" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">หลักฐานการโอนเงิน (สลิปโอนเงิน)</text>
  <text x="200" y="68" fill="%23a7f3d0" font-family="sans-serif" font-size="12" text-anchor="middle">PromptPay • ธนาคารกสิกรไทย (K PLUS)</text>
  
  <circle cx="200" cy="140" r="28" fill="%23d1fae5"/>
  <path d="M190 140 l8 8 l16 -16" stroke="%23059669" stroke-width="4" fill="none" stroke-linecap="round"/>
  
  <text x="200" y="190" fill="%23065f46" font-family="sans-serif" font-size="14" font-weight="600" text-anchor="middle">โอนเงินสำเร็จ</text>
  <text x="200" y="225" fill="%230f172a" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">฿8,900.00</text>
  
  <line x1="30" y1="250" x2="370" y2="250" stroke="%23e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  
  <text x="40" y="280" fill="%2364748b" font-family="sans-serif" font-size="12">จาก:</text>
  <text x="40" y="302" fill="%230f172a" font-family="sans-serif" font-size="13" font-weight="600">นายธนกร วัฒนพานิช (xxx-x-x1234-x)</text>
  <text x="40" y="322" fill="%2394a3b8" font-family="sans-serif" font-size="11">KBANK • พร้อมเพย์</text>
  
  <text x="40" y="356" fill="%2364748b" font-family="sans-serif" font-size="12">ไปยัง:</text>
  <text x="40" y="378" fill="%230f172a" font-family="sans-serif" font-size="13" font-weight="600">KNOWVA ACADEMY (บจก. โนวาเลิร์น)</text>
  <text x="40" y="398" fill="%2394a3b8" font-family="sans-serif" font-size="11">PromptPay ID: 081-998-8776</text>
  
  <line x1="30" y1="420" x2="370" y2="420" stroke="%23e2e8f0" stroke-width="1" stroke-dasharray="4"/>
  
  <text x="40" y="448" fill="%2364748b" font-family="sans-serif" font-size="11">เลขที่รายการ:</text>
  <text x="360" y="448" fill="%23334155" font-family="monospace" font-size="11" text-anchor="end">2026092288920194</text>
  
  <text x="40" y="475" fill="%2364748b" font-family="sans-serif" font-size="11">วันเวลาที่ทำรายการ:</text>
  <text x="360" y="475" fill="%23334155" font-family="sans-serif" font-size="11" text-anchor="end">22 ก.ย. 2026, 14:15 น.</text>
  
  <text x="40" y="502" fill="%2364748b" font-family="sans-serif" font-size="11">ค่าธรรมเนียม:</text>
  <text x="360" y="502" fill="%23059669" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="end">0.00 บาท</text>
  
  <rect x="30" y="530" width="340" height="34" fill="%23e6f4ea" rx="8"/>
  <text x="200" y="552" fill="%23137333" font-family="sans-serif" font-size="11" font-weight="600" text-anchor="middle">✓ ตรวจสอบข้อมูลสลิปโดยระบบ e-Slip Validation</text>
</svg>`;

const SEED_ORDERS: EnrollmentOrder[] = [
  {
    id: 'ord-9021',
    user_id: 'seed-user-1',
    plan: 'pro',
    amount_paid: 8900,
    payment_method: 'promptpay',
    payment_status: 'pending',
    slip_url: SAMPLE_SLIP_IMAGE,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    user_name: 'ธนกร วัฒนพานิช',
    user_email: 'thanakorn.w@gmail.com',
    user_phone: '081-234-5678',
    current_tier: 'free',
  },
  {
    id: 'ord-8910',
    user_id: 'seed-user-2',
    plan: 'vip',
    amount_paid: 18900,
    payment_method: 'promptpay',
    payment_status: 'pending',
    slip_url: SAMPLE_SLIP_IMAGE,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    user_name: 'อรปรียา รัตนโชติ',
    user_email: 'ornpreeya.r@outlook.com',
    user_phone: '089-876-5432',
    current_tier: 'basic',
  },
  {
    id: 'ord-8801',
    user_id: 'seed-user-3',
    plan: 'pro',
    amount_paid: 8900,
    payment_method: 'card',
    payment_status: 'completed',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    user_name: 'กิตติศักดิ์ เจริญดี',
    user_email: 'kittisak.c@techcorp.co.th',
    user_phone: '086-555-1234',
    current_tier: 'pro',
  },
  {
    id: 'ord-8750',
    user_id: 'seed-user-4',
    plan: 'basic',
    amount_paid: 4900,
    payment_method: 'promptpay',
    payment_status: 'rejected',
    slip_url: SAMPLE_SLIP_IMAGE,
    admin_note: 'ยอดเงินที่โอนไม่ตรงกับราคาแพ็กเกจ (โอนมา 490 บาท)',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    user_name: 'สมชาย รักการเรียน',
    user_email: 'somchai.test@hotmail.com',
    user_phone: '082-111-9988',
    current_tier: 'free',
  },
];

export default function AdminOrdersPage() {
  const { supabase, isAdmin, showToast } = useApp();

  const [orders, setOrders] = useState<EnrollmentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | 'basic' | 'pro' | 'vip'>('all');

  // Inspector Modal State
  const [selectedOrder, setSelectedOrder] = useState<EnrollmentOrder | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Rejection Dialog State
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('ยอดเงินไม่ตรงกับราคาคอร์ส');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch profiles for user mapping
      let profilesMap: Record<string, any> = {};
      try {
        const { data: profilesData } = await supabase.from('profiles').select('*');
        if (profilesData) {
          profilesData.forEach((p: any) => {
            profilesMap[p.id] = p;
          });
        }
      } catch (err) {
        console.warn('Could not fetch profiles map:', err);
      }

      // 2. Fetch enrollments
      const { data: enrollmentsData, error } = await supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch enrollments warning:', error);
      }

      // Read local cache overrides if any
      let localOrders: EnrollmentOrder[] = [];
      try {
        const cached = localStorage.getItem('knowva_admin_orders');
        if (cached) {
          localOrders = JSON.parse(cached);
        }
      } catch (e) {
        // ignore
      }

      if (enrollmentsData && enrollmentsData.length > 0) {
        // Augment with profiles
        const mapped: EnrollmentOrder[] = enrollmentsData.map((item: any) => {
          const profile = profilesMap[item.user_id] || {};
          // Merge any local status if updated locally
          const localMatch = localOrders.find(lo => lo.id === item.id);
          return {
            id: item.id,
            user_id: item.user_id,
            plan: item.plan,
            amount_paid: Number(item.amount_paid) || 0,
            payment_method: item.payment_method || 'promptpay',
            payment_status: localMatch?.payment_status || item.payment_status || 'completed',
            slip_url: localMatch?.slip_url || item.slip_url || (item.payment_method === 'promptpay' ? SAMPLE_SLIP_IMAGE : undefined),
            admin_note: localMatch?.admin_note || item.admin_note,
            created_at: item.created_at,
            user_name: profile.full_name || item.user_name || 'ผู้เรียนนิรนาม',
            user_email: profile.email || item.user_email || 'ไม่ระบุอีเมล',
            user_phone: profile.phone || item.user_phone || '-',
            current_tier: profile.tier || 'free',
          };
        });

        // Merge any purely local orders not in DB
        const dbIds = new Set(mapped.map(m => m.id));
        const extraLocal = localOrders.filter(lo => !dbIds.has(lo.id));
        setOrders([...extraLocal, ...mapped]);
      } else {
        // Use seed or local orders
        if (localOrders.length > 0) {
          setOrders(localOrders);
        } else {
          setOrders(SEED_ORDERS);
          localStorage.setItem('knowva_admin_orders', JSON.stringify(SEED_ORDERS));
        }
      }
    } catch (err: any) {
      console.error('Fetch orders error:', err);
      // Fallback to seeds
      const cached = localStorage.getItem('knowva_admin_orders');
      if (cached) {
        setOrders(JSON.parse(cached));
      } else {
        setOrders(SEED_ORDERS);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveLocalOrders = (updated: EnrollmentOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem('knowva_admin_orders', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save orders locally:', e);
    }
  };

  const handleOpenInspector = (order: EnrollmentOrder) => {
    setSelectedOrder(order);
    setAdminNote(order.admin_note || '');
    setIsInspectorOpen(true);
  };

  const handleApproveOrder = async (orderToApprove?: EnrollmentOrder) => {
    const target = orderToApprove || selectedOrder;
    if (!target) return;

    setIsProcessing(true);
    try {
      // 1. Update enrollment status in Supabase if exists
      try {
        await supabase
          .from('enrollments')
          .update({
            payment_status: 'completed',
            admin_note: adminNote || 'อนุมัติการชำระเงินเรียบร้อยแล้ว',
          })
          .eq('id', target.id);
      } catch (err) {
        console.warn('Could not update enrollments table in Supabase:', err);
      }

      // 2. Automatically upgrade the user's tier in public.profiles!
      if (target.user_id) {
        try {
          await supabase
            .from('profiles')
            .update({
              tier: target.plan,
              updated_at: new Date().toISOString(),
            })
            .eq('id', target.user_id);
        } catch (err) {
          console.warn('Could not update user tier in Supabase:', err);
        }
      }

      // 3. Update local state
      const updatedList = orders.map(o => {
        if (o.id === target.id) {
          return {
            ...o,
            payment_status: 'completed' as PaymentStatus,
            admin_note: adminNote || 'อนุมัติการชำระเงินเรียบร้อยแล้ว',
            current_tier: target.plan,
          };
        }
        return o;
      });

      saveLocalOrders(updatedList);
      showToast(`🎉 อนุมัติสิทธิ์การเรียนแพ็กเกจ ${target.plan.toUpperCase()} ให้กับคุณ ${target.user_name || 'ผู้เรียน'} สำเร็จแล้ว!`);
      setIsInspectorOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error('Approval failed:', err);
      showToast('❌ เกิดข้อผิดพลาดในการอนุมัติคำสั่งซื้อ');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedOrder) return;
    setIsProcessing(true);

    try {
      const finalReason = rejectReason || 'ปฏิเสธคำขอชำระเงิน';
      // 1. Update Supabase
      try {
        await supabase
          .from('enrollments')
          .update({
            payment_status: 'rejected',
            admin_note: finalReason,
          })
          .eq('id', selectedOrder.id);
      } catch (err) {
        console.warn('Could not update enrollments table in Supabase:', err);
      }

      // 2. Update local state
      const updatedList = orders.map(o => {
        if (o.id === selectedOrder.id) {
          return {
            ...o,
            payment_status: 'rejected' as PaymentStatus,
            admin_note: finalReason,
          };
        }
        return o;
      });

      saveLocalOrders(updatedList);
      showToast(`⚠️ ปฏิเสธคำสั่งซื้อ ${selectedOrder.id} เรียบร้อยแล้ว (${finalReason})`);
      setIsRejectDialogOpen(false);
      setIsInspectorOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error('Reject failed:', err);
      showToast('❌ เกิดข้อผิดพลาดในการปฏิเสธคำขอ');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateDemoOrder = () => {
    const plans: ('basic' | 'pro' | 'vip')[] = ['basic', 'pro', 'vip'];
    const randomPlan = plans[Math.floor(Math.random() * plans.length)];
    const priceMap = { basic: 4900, pro: 8900, vip: 18900 };
    const randomNames = [
      'ชานนท์ เลิศวิริยะกุล',
      'พิมพ์พิชชา วรนิติ',
      'ปกรณ์ ชลประเสริฐ',
      'วริศรา ภัทรเดชา',
      'อภิวัฒน์ เกียรติสกุล',
    ];
    const pickedName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const cleanEmail = `${pickedName.split(' ')[0].toLowerCase()}.${Math.floor(Math.random() * 900 + 100)}@gmail.com`;

    const newDemoOrder: EnrollmentOrder = {
      id: `ord-demo-${Math.floor(Math.random() * 8999 + 1000)}`,
      user_id: `user-demo-${Date.now()}`,
      plan: randomPlan,
      amount_paid: priceMap[randomPlan],
      payment_method: 'promptpay',
      payment_status: 'pending',
      slip_url: SAMPLE_SLIP_IMAGE,
      created_at: new Date().toISOString(),
      user_name: pickedName,
      user_email: cleanEmail,
      user_phone: `08${Math.floor(Math.random() * 89999999 + 10000000)}`,
      current_tier: 'free',
    };

    const updated = [newDemoOrder, ...orders];
    saveLocalOrders(updated);
    showToast(`📸 สร้างคำสั่งซื้อทดสอบใหม่เรียบร้อยแล้ว: ${newDemoOrder.user_name} (${randomPlan.toUpperCase()})`);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.user_name && order.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user_email && order.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.id && order.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.payment_status === statusFilter;
    const matchesPlan = planFilter === 'all' || order.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // KPI Calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.payment_status === 'pending');
  const completedOrders = orders.filter(o => o.payment_status === 'completed');
  const rejectedOrders = orders.filter(o => o.payment_status === 'rejected');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.amount_paid || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-zinc-800" />
            <span>ตรวจสอบการชำระเงิน & สลิปโอนเงิน (Orders)</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            ตรวจสอบความถูกต้องของสลิปโอนเงิน PromptPay และอนุมัติสิทธิ์ปลดล็อกคอร์สเรียนให้นักเรียนทันที
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreateDemoOrder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition"
            title="สร้างคำสั่งซื้อสลิปจำลองสำหรับทดสอบระบบตรวจสอบ"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ จำลองสลิปทดสอบ</span>
          </button>

          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-zinc-900' : 'text-zinc-500'}`} />
            <span>รีเฟรช</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-500 block mb-1">คำสั่งซื้อทั้งหมด</span>
            <span className="text-2xl font-black text-zinc-950">{totalOrders}</span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">รายการทั้งหมดในระบบ</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 block mb-1">รอตรวจสอบสลิป</span>
            <span className="text-2xl font-black text-amber-950">{pendingOrders.length}</span>
            <span className="text-[11px] text-amber-700 font-medium block mt-0.5">ต้องการการตรวจสอบด่วน</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200 animate-pulse">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 block mb-1">อนุมัติแล้ว (สำเร็จ)</span>
            <span className="text-2xl font-black text-emerald-950">{completedOrders.length}</span>
            <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">ผู้เรียนเข้าเรียนได้ทันที</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-500 block mb-1">ยอดชำระที่ยืนยันแล้ว</span>
            <span className="text-2xl font-black text-zinc-950">{formatCurrency(totalRevenue)}</span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">รายได้จากคอร์สที่อนุมัติ</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === 'all'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            ทั้งหมด ({totalOrders})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>รอตรวจสอบ ({pendingOrders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>อนุมัติแล้ว ({completedOrders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              statusFilter === 'rejected'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>ปฏิเสธ ({rejectedOrders.length})</span>
          </button>
        </div>

        {/* Search and Plan Filter */}
        <div className="flex items-center gap-2">
          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-medium border border-zinc-200 rounded-lg bg-white text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 cursor-pointer"
          >
            <option value="all">ทุกแพ็กเกจ (All Plans)</option>
            <option value="basic">Basic (Self-Paced)</option>
            <option value="pro">Pro (Cohort)</option>
            <option value="vip">VIP (Mentorship)</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อ, อีเมล, รหัส..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 bg-zinc-50/50"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">รหัส / วันเวลา</th>
                <th className="py-3 px-4">ผู้เรียน (Student)</th>
                <th className="py-3 px-4">แพ็กเกจที่สมัคร</th>
                <th className="py-3 px-4 text-right">ยอดชำระ</th>
                <th className="py-3 px-4 text-center">สลิปโอนเงิน</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-400" />
                    <span>กำลังโหลดข้อมูลคำสั่งซื้อ...</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400 space-y-2">
                    <CreditCard className="w-8 h-8 mx-auto text-zinc-300" />
                    <p className="text-sm font-medium text-zinc-600">ไม่พบข้อมูลคำสั่งซื้อตามเงื่อนไข</p>
                    <p className="text-xs text-zinc-400">ลองล้างตัวกรอง หรือกดปุ่ม "+ จำลองสลิปทดสอบ" เพื่อเริ่มทดสอบ</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPending = order.payment_status === 'pending';
                  const isCompleted = order.payment_status === 'completed';
                  const isRejected = order.payment_status === 'rejected';

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-zinc-50/80 transition ${
                        isPending ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Order ID & Time */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="font-bold text-zinc-900">{order.id}</div>
                        <div className="text-zinc-400 text-[10px] mt-0.5">
                          {new Date(order.created_at).toLocaleString('th-TH', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <span>{order.user_name}</span>
                          {order.current_tier && order.current_tier !== 'free' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 uppercase font-semibold">
                              {order.current_tier}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-zinc-400" />
                            {order.user_email}
                          </span>
                          {order.user_phone && order.user_phone !== '-' && (
                            <span className="flex items-center gap-1 text-zinc-400">
                              • <Phone className="w-3 h-3" />
                              {order.user_phone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${
                            order.plan === 'vip'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : order.plan === 'pro'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {order.plan}
                        </span>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          {order.payment_method === 'card' ? 'บัตรเครดิต' : 'PromptPay QR'}
                        </div>
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 text-right font-bold text-zinc-950 font-mono text-sm">
                        {formatCurrency(order.amount_paid)}
                      </td>

                      {/* Slip Preview Thumbnail */}
                      <td className="py-3.5 px-4 text-center">
                        {order.slip_url ? (
                          <button
                            type="button"
                            onClick={() => handleOpenInspector(order)}
                            className="group relative inline-flex items-center justify-center p-1 rounded-lg border border-zinc-200 bg-white hover:border-emerald-500 transition shadow-xs"
                            title="คลิกเพื่อตรวจสลิปฉบับเต็ม"
                          >
                            <img
                              src={order.slip_url}
                              alt="Slip Preview"
                              className="w-10 h-12 object-cover rounded shadow-inner"
                            />
                            <div className="absolute inset-0 bg-black/30 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                              <ZoomIn className="w-4 h-4" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-[11px] text-zinc-400 italic">ไม่มีสลิป</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                            <span>รอตรวจสอบ</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>อนุมัติแล้ว</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>ปฏิเสธ</span>
                          </span>
                        )}
                        {order.admin_note && (
                          <div className="text-[10px] text-zinc-400 mt-1 max-w-[150px] truncate mx-auto" title={order.admin_note}>
                            โน้ต: {order.admin_note}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenInspector(order)}
                            className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition"
                            title="ดูรายละเอียด & ตรวจสอบสลิป"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveOrder(order)}
                                className="p-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition"
                                title="อนุมัติคำสั่งซื้อทันที"
                              >
                                <Check className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsRejectDialogOpen(true);
                                }}
                                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 transition"
                                title="ปฏิเสธคำสั่งซื้อ"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Inspector & Approval Modal */}
      {isInspectorOpen && selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/70 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isProcessing) {
              setIsInspectorOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                    <span>ตรวจสอบสลิปการชำระเงิน</span>
                    <span className="text-xs font-mono font-normal text-zinc-500">
                      [{selectedOrder.id}]
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-500">
                    ตรวจเช็กยอดเงิน วันเวลา และชื่อบัญชีปลายทางให้ถูกต้องก่อนอนุมัติสิทธิ์
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsInspectorOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Split Layout */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: High-Res Slip View */}
              <div className="md:col-span-6 bg-zinc-100/80 rounded-2xl p-4 border border-zinc-200 flex flex-col items-center justify-center min-h-[400px]">
                {selectedOrder.slip_url ? (
                  <div className="relative group max-w-sm w-full bg-white rounded-xl shadow-lg border border-zinc-200 overflow-hidden">
                    <img
                      src={selectedOrder.slip_url}
                      alt="Full Payment Slip"
                      className="w-full h-auto object-contain max-h-[480px]"
                    />
                    <div className="p-2.5 bg-zinc-900 text-white text-[11px] text-center font-medium flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ภาพสลิปที่ส่งมาจากผู้เรียน</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-zinc-400 p-8">
                    <CreditCard className="w-12 h-12 mx-auto mb-2 text-zinc-300" />
                    <p className="text-sm font-medium text-zinc-600">ไม่มีรูปภาพสลิปแนบมา</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      รายการนี้ชำระด้วย: {selectedOrder.payment_method}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Verification Details & Action */}
              <div className="md:col-span-6 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-xs text-zinc-500 font-medium">สถานะคำสั่งซื้อ:</span>
                    {selectedOrder.payment_status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                        รอการตรวจสอบและอนุมัติ
                      </span>
                    )}
                    {selectedOrder.payment_status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        อนุมัติสิทธิ์เรียบร้อยแล้ว
                      </span>
                    )}
                    {selectedOrder.payment_status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        ปฏิเสธคำสั่งซื้อ
                      </span>
                    )}
                  </div>

                  {/* Student Details Card */}
                  <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2 text-xs">
                    <h4 className="font-bold text-zinc-900 uppercase tracking-wide text-[11px] mb-2 text-zinc-400">
                      ข้อมูลผู้เรียน
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">ชื่อ-นามสกุล:</span>
                      <span className="font-bold text-zinc-900">{selectedOrder.user_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">อีเมล:</span>
                      <span className="font-semibold text-zinc-900">{selectedOrder.user_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">เบอร์โทรติดต่อ:</span>
                      <span className="font-medium text-zinc-900">{selectedOrder.user_phone || '-'}</span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-100 pt-2">
                      <span className="text-zinc-500">สิทธิ์ปัจจุบัน:</span>
                      <span className="uppercase font-bold text-zinc-600">
                        {selectedOrder.current_tier || 'free'}
                      </span>
                    </div>
                  </div>

                  {/* Payment Verification Card */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2 text-xs">
                    <h4 className="font-bold text-emerald-900 uppercase tracking-wide text-[11px] mb-2">
                      ข้อมูลการชำระเงินที่ต้องการ
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">แพ็กเกจที่สมัคร:</span>
                      <span className="font-extrabold uppercase text-emerald-800">
                        {selectedOrder.plan} Cohort
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">ยอดที่ต้องชำระ:</span>
                      <span className="text-base font-black text-emerald-950 font-mono">
                        {formatCurrency(selectedOrder.amount_paid)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">ช่องทางชำระเงิน:</span>
                      <span className="font-medium text-zinc-900">
                        {selectedOrder.payment_method === 'card' ? 'บัตรเครดิต' : 'โอนเงินผ่าน PromptPay'}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-emerald-200/60 pt-2 text-[11px] text-zinc-500">
                      <span>เวลาที่แจ้งโอน:</span>
                      <span>
                        {new Date(selectedOrder.created_at).toLocaleString('th-TH')}
                      </span>
                    </div>
                  </div>

                  {/* Admin Note Box */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      บันทึกช่วยจำสำหรับผู้ดูแลระบบ (Admin Note)
                    </label>
                    <textarea
                      rows={2}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="เช่น ตรวจสอบยอดเงินตรงตามสลิป, บัญชีปลายทางถูกต้อง..."
                      className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-zinc-200">
                  {selectedOrder.payment_status === 'pending' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => {
                          setIsRejectDialogOpen(true);
                        }}
                        className="py-2.5 px-4 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        <span>ปฏิเสธสลิป</span>
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleApproveOrder()}
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isProcessing ? 'กำลังบันทึก...' : 'อนุมัติการชำระเงิน'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleApproveOrder()}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-3 rounded-lg border border-zinc-300 bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50"
                      >
                        อัปเดตบันทึกช่วยจำ
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsInspectorOpen(false)}
                        className="py-2 px-4 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-black"
                      >
                        ปิดหน้าต่าง
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-400 text-center">
                    💡 เมื่อกดอนุมัติ ระบบจะปรับสิทธิ์ระดับ <strong className="uppercase text-zinc-700">[{selectedOrder.plan}]</strong> ให้ผู้เรียนทันที
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Dialog */}
      {isRejectDialogOpen && selectedOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">ปฏิเสธคำสั่งซื้อ</h3>
                <p className="text-xs text-zinc-500">ระบุเหตุผลเพื่อแจ้งผู้เรียน</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-zinc-700">
                เลือกเหตุผลที่ปฏิเสธ:
              </label>
              {[
                'ยอดเงินไม่ตรงกับราคาคอร์ส',
                'ภาพสลิปไม่ชัดเจน ไม่สามารถตรวจสอบได้',
                'สลิปซ้ำซ้อน เคยถูกใช้งานไปแล้ว',
                'ไม่พบยอดเงินเข้าบัญชีปลายทางตามเวลาที่ระบุ',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 cursor-pointer text-xs"
                >
                  <input
                    type="radio"
                    name="rejectReasonRadio"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="text-zinc-900"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              <input
                type="text"
                placeholder="หรือระบุเหตุผลอื่นๆ..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setIsRejectDialogOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                {isProcessing ? 'กำลังดำเนินการ...' : 'ยืนยันปฏิเสธ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

