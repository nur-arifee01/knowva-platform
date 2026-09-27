'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PRICING_PLANS } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  CheckCircle2,
  QrCode,
  CreditCard,
  Tag,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  UserCheck,
  Upload,
  Image as ImageIcon,
  Clock,
  ExternalLink,
  Trash2,
  Copy,
} from 'lucide-react';

export const EnrollModal: React.FC = () => {
  const router = useRouter();
  const {
    isEnrollModalOpen,
    closeEnrollModal,
    selectedPlan,
    currentUser,
    upgradeUserPlan,
    showToast,
    appliedPromoCode,
    setAppliedPromoCode,
    supabase,
    isStaff,
    isAdmin,
  } = useApp();

  const [activePlanKey, setActivePlanKey] = useState<'basic' | 'pro' | 'vip'>(selectedPlan);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [appliedCode, setAppliedCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card'>('promptpay');

  // Slip & Submission Mode
  const [submissionMode, setSubmissionMode] = useState<'slip' | 'instant'>('slip');
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [slipFileName, setSlipFileName] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPendingReview, setIsPendingReview] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [submittedOrderId, setSubmittedOrderId] = useState('');

  // Sync with selectedPlan and appliedPromoCode when modal opens
  useEffect(() => {
    if (isEnrollModalOpen) {
      setActivePlanKey(selectedPlan);
      setIsSuccess(false);
      setIsPendingReview(false);
      setSlipImage(null);
      setSlipFileName('');
      setSubmissionMode('slip');

      if (appliedPromoCode) {
        const clean = appliedPromoCode.trim().toUpperCase();
        setCouponCode(clean);
        setAppliedCode(clean);
        setIsCouponApplied(true);
        const targetPlan = PRICING_PLANS[selectedPlan] || PRICING_PLANS.pro;
        if (clean === 'EARLYBIRD') {
          setDiscountAmount(Math.round(targetPlan.price * 0.4));
        } else if (clean === 'DEV1000') {
          setDiscountAmount(1000);
        }
      } else {
        setCouponCode('');
        setAppliedCode('');
        setIsCouponApplied(false);
        setDiscountAmount(0);
      }
    }
  }, [isEnrollModalOpen, selectedPlan, appliedPromoCode]);

  // Pre-fill user data when currentUser changes or modal opens
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser, isEnrollModalOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEnrollModalOpen && !isSubmitting) {
        closeEnrollModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnrollModalOpen, isSubmitting, closeEnrollModal]);

  // Auto-redirect countdown only when instant auto-approved
  useEffect(() => {
    if (!isSuccess || isPendingReview) return;
    if (redirectCountdown <= 0) {
      closeEnrollModal();
      router.push('/dashboard');
      return;
    }
    const timer = setTimeout(() => {
      setRedirectCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isSuccess, isPendingReview, redirectCountdown, router, closeEnrollModal]);

  // Early return ONLY after all React Hooks have been declared
  if (!isEnrollModalOpen) return null;

  const currentPlan = PRICING_PLANS[activePlanKey] || PRICING_PLANS.pro;
  const subtotal = currentPlan.price;
  const total = Math.max(0, subtotal - discountAmount);

  const handleSelectPlan = (key: 'basic' | 'pro' | 'vip') => {
    setActivePlanKey(key);
    if (isCouponApplied && appliedCode === 'EARLYBIRD') {
      const targetPlan = PRICING_PLANS[key] || PRICING_PLANS.pro;
      setDiscountAmount(Math.round(targetPlan.price * 0.4));
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) {
      showToast('กรุณากรอกโค้ดส่วนลด');
      return;
    }

    if (cleanCode === 'EARLYBIRD') {
      const discount = Math.round(currentPlan.price * 0.4);
      setDiscountAmount(discount);
      setIsCouponApplied(true);
      setAppliedCode('EARLYBIRD');
      showToast(`🎉 ใช้สิทธิ์ Early Bird สำเร็จ! ลดทันที 40% (-${formatCurrency(discount)})`);
    } else if (cleanCode === 'DEV1000') {
      setDiscountAmount(1000);
      setIsCouponApplied(true);
      setAppliedCode('DEV1000');
      showToast('🎉 ใช้โค้ด DEV1000 สำเร็จ! ลดทันที ฿1,000');
    } else {
      showToast('❌ รหัสโค้ดไม่ถูกต้องหรือหมดอายุ');
    }
  };

  const handleSlipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('❌ กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 700;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setSlipImage(dataUrl);
        setSlipFileName(file.name);
        showToast('📸 แนบรูปภาพสลิปเรียบร้อยแล้ว');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      showToast('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    setIsSubmitting(true);
    const orderId = `ord-${Date.now().toString().slice(-6)}`;
    setSubmittedOrderId(orderId);

    const isStaffOrAdmin = isAdmin || isStaff;
    const effectiveMode = isStaffOrAdmin ? submissionMode : 'slip';

    // MODE 1: PromptPay Slip Verification Mode
    if (paymentMethod === 'promptpay' && effectiveMode === 'slip') {
      if (!slipImage) {
        setIsSubmitting(false);
        showToast('⚠️ กรุณาแนบรูปภาพสลิปโอนเงินเพื่อยืนยันรายการ');
        return;
      }

      const newOrder = {
        id: orderId,
        user_id: currentUser?.id || `guest-${Date.now()}`,
        plan: activePlanKey,
        amount_paid: total,
        payment_method: 'promptpay',
        payment_status: 'pending',
        slip_url: slipImage,
        created_at: new Date().toISOString(),
        user_name: fullName,
        user_email: email,
        user_phone: phone,
        current_tier: currentUser?.tier || 'free',
      };

      // 1. Try Supabase insert
      if (currentUser?.id) {
        try {
          await supabase.from('enrollments').insert({
            user_id: currentUser.id,
            plan: activePlanKey,
            amount_paid: total,
            payment_method: 'promptpay',
            payment_status: 'pending',
            slip_url: slipImage,
          });
        } catch (err) {
          console.warn('Supabase enrollment insert error:', err);
        }
      }

      // 2. Save in localStorage for Admin Orders view
      try {
        const cached = localStorage.getItem('knowva_admin_orders');
        const list = cached ? JSON.parse(cached) : [];
        localStorage.setItem('knowva_admin_orders', JSON.stringify([newOrder, ...list]));
      } catch (e) {}

      setIsSubmitting(false);
      setIsPendingReview(true);
      setIsSuccess(true);
      showToast('🎉 แจ้งชำระเงินสำเร็จ! สลิปของคุณถูกส่งไปยังระบบตรวจสอบของแอดมินแล้ว');
      return;
    }

    // MODE 2: Card Payment for normal users (Pending verification until gateway configured)
    if (!isStaffOrAdmin && paymentMethod === 'card') {
      const newOrder = {
        id: orderId,
        user_id: currentUser?.id || `guest-${Date.now()}`,
        plan: activePlanKey,
        amount_paid: total,
        payment_method: 'card',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        user_name: fullName,
        user_email: email,
        user_phone: phone,
        current_tier: currentUser?.tier || 'free',
      };

      if (currentUser?.id) {
        try {
          await supabase.from('enrollments').insert({
            user_id: currentUser.id,
            plan: activePlanKey,
            amount_paid: total,
            payment_method: 'card',
            payment_status: 'pending',
          });
        } catch (err) {
          console.warn('Supabase enrollment insert error:', err);
        }
      }

      try {
        const cached = localStorage.getItem('knowva_admin_orders');
        const list = cached ? JSON.parse(cached) : [];
        localStorage.setItem('knowva_admin_orders', JSON.stringify([newOrder, ...list]));
      } catch (e) {}

      setIsSubmitting(false);
      setIsPendingReview(true);
      setIsSuccess(true);
      showToast('🎉 บันทึกข้อมูลคำสั่งซื้อแล้ว อยู่ระหว่างรอเจ้าหน้าที่ตรวจสอบและเปิดสิทธิ์');
      return;
    }

    // MODE 3: Staff/Admin Instant Auto-Approve Test Mode
    setTimeout(async () => {
      setIsSubmitting(false);
      upgradeUserPlan(activePlanKey, total);

      const newOrder = {
        id: orderId,
        user_id: currentUser?.id || `guest-${Date.now()}`,
        plan: activePlanKey,
        amount_paid: total,
        payment_method: paymentMethod,
        payment_status: 'completed',
        slip_url: slipImage || undefined,
        created_at: new Date().toISOString(),
        user_name: fullName,
        user_email: email,
        user_phone: phone,
        current_tier: activePlanKey,
      };

      try {
        const cached = localStorage.getItem('knowva_admin_orders');
        const list = cached ? JSON.parse(cached) : [];
        localStorage.setItem('knowva_admin_orders', JSON.stringify([newOrder, ...list]));
      } catch (e) {}

      setIsPendingReview(false);
      setRedirectCountdown(3);
      setIsSuccess(true);
      showToast('🎉 สมัครเรียนสำเร็จ! กำลังนำคุณไปยังห้องเรียนของคุณ...');
    }, 1000);
  };

  const handleGoToDashboard = () => {
    closeEnrollModal();
    router.push('/dashboard');
  };

  const handleGoToAdminOrders = () => {
    closeEnrollModal();
    router.push('/admin/orders');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) closeEnrollModal();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <span>สมัครเรียนหลักสูตร</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-semibold uppercase">
                {currentPlan.name}
              </span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              ระบบรับชำระเงินมาตรฐานความปลอดภัยระดับสากล SSL 256-bit
            </p>
          </div>

          <button
            type="button"
            onClick={closeEnrollModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            /* Success / Pending Screen */
            <div className="text-center py-6 space-y-6">
              {isPendingReview ? (
                /* Pending Verification Screen */
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm animate-pulse">
                    <Clock className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900">
                      ส่งหลักฐานการชำระเงินเรียบร้อยแล้ว!
                    </h3>
                    <p className="text-sm text-zinc-600 mt-1 max-w-md mx-auto">
                      ระบบได้บันทึกสลิปโอนเงินของคุณแล้ว ทีมงานกำลังดำเนินการตรวจสอบยอดเงิน โดยปกติจะใช้เวลาไม่เกิน <span className="font-semibold text-zinc-900">5-15 นาที</span>
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      <span>สถานะคำสั่งซื้อ: รอเจ้าหน้าที่ตรวจสอบสลิป</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 text-left max-w-md mx-auto space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">รหัสคำสั่งซื้อ:</span>
                      <span className="font-mono font-bold text-zinc-900">{submittedOrderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">ชื่อผู้เรียน:</span>
                      <span className="font-semibold text-zinc-900">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">แพ็กเกจที่สมัคร:</span>
                      <span className="font-semibold text-zinc-900 uppercase">
                        {currentPlan.name} ({activePlanKey})
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-200 pt-2">
                      <span className="text-zinc-500">ยอดที่แจ้งโอน:</span>
                      <span className="font-bold text-emerald-600 text-base font-mono">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={handleGoToDashboard}
                      className="flex-1 py-3 px-6 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-black transition shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>เข้าสู่หน้าแดชบอร์ด</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {isStaff && (
                      <button
                        type="button"
                        onClick={handleGoToAdminOrders}
                        className="py-3 px-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold text-xs hover:bg-emerald-100 transition flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>ไปตรวจสลิปหลังบ้าน (Admin)</span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* Instant Completion Screen */
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900">
                      การสมัครเรียนเสร็จสมบูรณ์!
                    </h3>
                    <p className="text-sm text-zinc-600 mt-1 max-w-md mx-auto">
                      ยินดีต้อนรับสู่หลักสูตร KNOWVA ระบบได้อัปเกรดสิทธิ์ระดับ <span className="font-bold text-zinc-900 uppercase">[{activePlanKey}]</span> ให้กับบัญชีของคุณแล้ว
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 animate-pulse">
                      <span>กำลังพาท่านเข้าสู่ห้องเรียนใน {redirectCountdown} วินาที...</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 text-left max-w-md mx-auto space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">ชื่อผู้เรียน:</span>
                      <span className="font-semibold text-zinc-900">{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">อีเมลจัดส่ง:</span>
                      <span className="font-semibold text-zinc-900">{email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">แพ็กเกจที่สมัคร:</span>
                      <span className="font-semibold text-emerald-600 uppercase">
                        {currentPlan.name} ({activePlanKey})
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-zinc-200 pt-2">
                      <span className="text-zinc-500">ยอดชำระสุทธิ:</span>
                      <span className="font-bold text-emerald-600 text-base font-mono">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={handleGoToDashboard}
                      className="w-full py-3 px-6 rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:bg-black transition shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>เข้าสู่คลังคอร์สเรียนทันที</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              {/* Early Bird Special Banner if applied */}
              {isCouponApplied && appliedCode === 'EARLYBIRD' && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-500 text-zinc-950 uppercase tracking-wide shrink-0">
                      Early Bird รุ่นที่ 8
                    </span>
                    <span className="text-xs font-semibold text-emerald-900">
                      ยินดีด้วย! คุณได้รับสิทธิ์ส่วนลดพิเศษ 40% (จำกัด 50 ท่านแรก)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                    ลดทันที {formatCurrency(discountAmount)}
                  </span>
                </div>
              )}

              {/* Package Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                  1. เลือกแพ็กเกจที่คุณต้องการสมัคร
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['basic', 'pro', 'vip'] as const).map((key) => {
                    const plan = PRICING_PLANS[key];
                    const isSelected = activePlanKey === key;
                    return (
                      <div
                        key={key}
                        onClick={() => handleSelectPlan(key)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition text-left relative ${
                          isSelected
                            ? 'border-zinc-950 bg-zinc-50/90 shadow-sm'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        {plan.badge && (
                          <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900 text-white">
                            {plan.badge}
                          </span>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-zinc-900">
                            {key === 'basic' ? 'Self-Paced' : key === 'pro' ? 'Pro Cohort' : 'VIP Mentorship'}
                          </span>
                          <input
                            type="radio"
                            name="packageRadio"
                            checked={isSelected}
                            onChange={() => handleSelectPlan(key)}
                            className="text-zinc-950 focus:ring-zinc-950 cursor-pointer"
                          />
                        </div>
                        <div className="text-base font-extrabold text-zinc-950">
                          {formatCurrency(plan.price)}
                        </div>
                        <div className="text-[11px] text-zinc-400 line-through">
                          {formatCurrency(plan.originalPrice)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Student Information */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    2. ข้อมูลผู้เรียนสำหรับจัดส่งใบรับรอง
                  </label>
                  {currentUser && (
                    <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      กรอกข้อมูลอัตโนมัติจากบัญชีของคุณ
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      ชื่อ-นามสกุล (ภาษาไทย หรือ อังกฤษ สำหรับออก Certificate) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="เช่น ธนกร วัฒนพานิช"
                      className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      อีเมล (สำหรับส่งลิงก์เข้าเรียนและรหัสผ่าน) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      เบอร์โทรศัพท์ติดต่อ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081-234-5678"
                      className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Engine */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  3. ส่วนลดและโปรโมชันพิเศษ
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      disabled={isCouponApplied}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="กรอกโค้ดส่วนลด (เช่น EARLYBIRD หรือ DEV1000)"
                      className="w-full pl-9 pr-3 py-2 text-sm uppercase tracking-wider font-semibold border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isCouponApplied}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition shrink-0 ${
                      isCouponApplied
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-zinc-900 hover:bg-black text-white'
                    }`}
                  >
                    {isCouponApplied ? 'ใช้แล้ว' : 'ใช้โค้ด'}
                  </button>
                </div>
                {isCouponApplied && (
                  <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {appliedCode === 'EARLYBIRD'
                      ? `สิทธิ์พิเศษ Early Bird รุ่นที่ 8 (ลดทันที 40%) ประหยัด ${formatCurrency(discountAmount)}`
                      : `ใช้โค้ด ${appliedCode} สำเร็จ ลดเพิ่ม ${formatCurrency(discountAmount)}`}
                  </p>
                )}
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                  4. ช่องทางการชำระเงิน
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'promptpay'
                        ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="promptpay"
                      checked={paymentMethod === 'promptpay'}
                      onChange={() => setPaymentMethod('promptpay')}
                      className="text-zinc-950 focus:ring-zinc-950"
                    />
                    <QrCode className="w-4 h-4 text-zinc-700" />
                    <span className="text-xs font-semibold text-zinc-900">
                      พร้อมเพย์ (QR Code & สลิป)
                    </span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'card'
                        ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-zinc-950 focus:ring-zinc-950"
                    />
                    <CreditCard className="w-4 h-4 text-zinc-700" />
                    <span className="text-xs font-semibold text-zinc-900">
                      บัตรเครดิต / เดบิต
                    </span>
                  </label>
                </div>

                {paymentMethod === 'promptpay' ? (
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-4">
                    {/* Mode Toggle: Slip vs Instant (Staff/Admin Dev Testing Only) */}
                    {(isAdmin || isStaff) ? (
                      <div className="flex rounded-lg bg-zinc-200/70 p-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setSubmissionMode('slip')}
                          className={`flex-1 py-1.5 rounded-md font-semibold transition flex items-center justify-center gap-1.5 ${
                            submissionMode === 'slip'
                              ? 'bg-white text-zinc-950 shadow-xs'
                              : 'text-zinc-600 hover:text-zinc-950'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>แนบสลิปโอนเงิน (Slip Upload)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubmissionMode('instant')}
                          className={`flex-1 py-1.5 rounded-md font-semibold transition flex items-center justify-center gap-1.5 ${
                            submissionMode === 'instant'
                              ? 'bg-white text-zinc-950 shadow-xs'
                              : 'text-zinc-600 hover:text-zinc-950'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>⚡ อนุมัติทันที (แอดมินทดสอบ)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-800">
                        <Upload className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium">กรุณาสแกน QR และแนบสลิปการโอนเงินด้านล่างเพื่อรอเจ้าหน้าที่ตรวจสอบและเปิดสิทธิ์</span>
                      </div>
                    )}

                    {/* QR Code & Transfer Details */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-zinc-200/80">
                      {/* Stylized QR */}
                      <div className="w-28 h-28 bg-white border border-zinc-300 rounded-xl p-2 shrink-0 flex flex-col items-center justify-center shadow-inner">
                        <div className="w-full h-full grid grid-cols-5 gap-1 bg-zinc-100 p-1 rounded">
                          <div className="col-span-2 row-span-2 bg-zinc-900 rounded-xs"></div>
                          <div className="col-span-1 bg-zinc-900 rounded-xs"></div>
                          <div className="col-span-2 row-span-2 bg-zinc-900 rounded-xs"></div>
                          <div className="col-span-1 bg-zinc-400 rounded-xs"></div>
                          <div className="col-span-3 bg-zinc-900 rounded-xs"></div>
                          <div className="col-span-1 bg-zinc-400 rounded-xs"></div>
                          <div className="col-span-2 row-span-2 bg-zinc-900 rounded-xs"></div>
                          <div className="col-span-1 bg-zinc-900 rounded-xs"></div>
                          <div className="col-span-2 row-span-2 bg-zinc-900 rounded-xs"></div>
                        </div>
                      </div>

                      {/* Transfer Details */}
                      <div className="text-left space-y-1 text-xs w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500">บัญชีรับเงิน:</span>
                          <span className="font-bold text-zinc-900">KNOWVA ACADEMY (บจก. โนวาเลิร์น)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500">พร้อมเพย์ ID:</span>
                          <span className="font-mono font-bold text-zinc-900 flex items-center gap-1">
                            081-998-8776
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('0819988776');
                                showToast('คัดลอกหมายเลขพร้อมเพย์แล้ว');
                              }}
                              className="text-zinc-400 hover:text-zinc-700"
                              title="คัดลอกเบอร์"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500">ธนาคาร:</span>
                          <span className="text-zinc-700 font-medium">กสิกรไทย (KBANK)</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-zinc-100 pt-1">
                          <span className="text-zinc-500">ยอดที่ต้องโอนสุทธิ:</span>
                          <span className="font-bold text-emerald-600 font-mono text-sm">
                            {formatCurrency(total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Slip Uploader (When in slip mode) */}
                    {submissionMode === 'slip' ? (
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-zinc-700">
                          แนบรูปถ่ายสลิปโอนเงิน (Slip Image) *
                        </label>

                        {slipImage ? (
                          <div className="flex items-center gap-3 p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl">
                            <img
                              src={slipImage}
                              alt="Uploaded Slip"
                              className="w-12 h-14 object-cover rounded-lg border border-emerald-200 shadow-xs"
                            />
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-xs font-bold text-emerald-950 truncate">
                                {slipFileName || 'payment_slip.jpg'}
                              </p>
                              <p className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                พร้อมส่งให้ทีมงานตรวจสอบ
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSlipImage(null);
                                setSlipFileName('');
                              }}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition"
                              title="ลบสลิป"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-zinc-300 hover:border-zinc-400 bg-white rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition group text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSlipFileChange}
                              className="hidden"
                            />
                            <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-zinc-200 text-zinc-600 flex items-center justify-center mb-1.5 transition">
                              <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold text-zinc-800">
                              คลิกเพื่อเลือกรูปภาพสลิป หรือลากไฟล์มาวางที่นี่
                            </span>
                            <span className="text-[11px] text-zinc-400 mt-0.5">
                              รองรับไฟล์ JPG, PNG (ระบบจะย่อขนาดให้อัตโนมัติ)
                            </span>
                          </label>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>เปิดโหมดจำลองชำระเงินสำเร็จ (Instant Auto-Approve)</strong>
                          <p className="text-[11px] text-amber-700 mt-0.5">
                            ระบบจะข้ามการตรวจสอบสลิป และอัปเกรดระดับบัญชีผู้เรียนเป็น <span className="font-bold uppercase">[{activePlanKey}]</span> ทันทีหลังจากกดยืนยัน
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                    <input
                      type="text"
                      placeholder="หมายเลขบัตร 16 หลัก"
                      defaultValue="4242 •••• •••• 4242"
                      className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-md bg-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-md bg-white"
                      />
                      <input
                        type="password"
                        placeholder="CVC"
                        defaultValue="•••"
                        className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-md bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="p-4 rounded-xl bg-zinc-900 text-white space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>ราคาแพ็กเกจ ({currentPlan.name})</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-medium">
                    <span>
                      {appliedCode === 'EARLYBIRD'
                        ? 'ส่วนลดพิเศษ Early Bird รุ่นที่ 8 (ลด 40%)'
                        : `ส่วนลดโปรโมชันพิเศษ (${appliedCode})`}
                    </span>
                    <span>- {formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-zinc-800">
                  <span className="text-sm font-semibold">ยอดชำระสุทธิทั้งสิ้น</span>
                  <span className="text-xl font-extrabold text-white">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-zinc-950 text-white font-bold text-sm hover:bg-black transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>กำลังประมวลผลคำสั่งซื้อ...</span>
                    </>
                  ) : paymentMethod === 'promptpay' && submissionMode === 'slip' ? (
                    <>
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>ส่งหลักฐานการชำระเงิน (แจ้งโอน)</span>
                    </>
                  ) : (
                    <>
                      <span>ยืนยันการสมัครและชำระเงิน</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  การันตีคืนเงินภายใน 7 วันหากเนื้อหาไม่ตรงกับคำอธิบาย
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
