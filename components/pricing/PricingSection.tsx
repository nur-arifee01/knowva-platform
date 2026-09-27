'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PRICING_PLANS } from '@/lib/data';
import { Check, ShieldCheck, Zap, Gift, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const PricingSection: React.FC = () => {
  const { openEnrollModal, openAuthModal, currentUser } = useApp();

  return (
    <section id="pricing" className="py-20 bg-zinc-50 border-y border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            PRICING PACKAGES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mt-2">
            เลือกแพ็กเกจการเรียนที่เหมาะกับเป้าหมายของคุณ
          </h2>
          <p className="mt-4 text-zinc-600 text-base leading-relaxed">
            ลงทุนครั้งเดียวเพื่อทักษะที่จะสร้างมูลค่าให้คุณตลอดชีวิต พร้อมการรับประกันความพึงพอใจ คืนเงินเต็มจำนวนใน 7 วัน
          </p>
        </div>

        {/* Free Starter Tier Callout Banner */}
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-white border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  FREE STARTER
                </span>
                <span className="text-sm sm:text-base font-bold text-zinc-900">
                  ต้องการเริ่มต้นเรียนรู้แบบไม่มีค่าใช้จ่าย?
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                สมัครสมาชิกฟรี เข้าเรียน 5 คอร์สพื้นฐานทันที (Web 101, Git Workflow, Cursor AI, Docker, Figma to UI) ไม่มีวันหมดอายุ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            {currentUser ? (
              <Link
                href="/dashboard"
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>เข้าสู่ห้องเรียนฟรี 5 คอร์ส</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>สมัครสมาชิกเรียนฟรี 5 คอร์ส</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* 1. Self-Paced */}
          <div className="card-clean flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-zinc-950">{PRICING_PLANS.basic.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{PRICING_PLANS.basic.subtitle}</p>
              </div>

              <div className="my-6">
                <span className="text-xs text-zinc-400 line-through">
                  {formatCurrency(PRICING_PLANS.basic.originalPrice)}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-en">
                    {formatCurrency(PRICING_PLANS.basic.price)}
                  </span>
                  <span className="text-xs text-zinc-500">/ ตลอดชีพ</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 mb-8">
                {PRICING_PLANS.basic.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => openEnrollModal('basic')}
              className="btn btn-secondary w-full justify-center"
            >
              สมัครแพ็กเกจ Self-Paced
            </button>
          </div>

          {/* 2. Pro Cohort (Recommended) */}
          <div className="card-clean border-2 border-zinc-950 flex flex-col justify-between relative shadow-xl">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{PRICING_PLANS.pro.badge}</span>
            </div>

            <div>
              <div className="mb-4 mt-2">
                <h3 className="text-xl font-bold text-zinc-950">{PRICING_PLANS.pro.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{PRICING_PLANS.pro.subtitle}</p>
              </div>

              <div className="my-6">
                <span className="text-xs text-zinc-400 line-through">
                  {formatCurrency(PRICING_PLANS.pro.originalPrice)}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-en">
                    {formatCurrency(PRICING_PLANS.pro.price)}
                  </span>
                  <span className="text-xs text-zinc-500">/ 8 สัปดาห์</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 mb-8">
                {PRICING_PLANS.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 font-bold mt-0.5 flex-shrink-0" />
                    <span className={i < 3 ? 'font-semibold text-zinc-900' : ''}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => openEnrollModal('pro')}
              className="btn btn-primary w-full justify-center py-3"
            >
              สมัครแพ็กเกจ Pro Cohort &rarr;
            </button>
          </div>

          {/* 3. VIP Mentorship */}
          <div className="card-clean flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-zinc-950">{PRICING_PLANS.vip.name}</h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                    {PRICING_PLANS.vip.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{PRICING_PLANS.vip.subtitle}</p>
              </div>

              <div className="my-6">
                <span className="text-xs text-zinc-400 line-through">
                  {formatCurrency(PRICING_PLANS.vip.originalPrice)}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-en">
                    {formatCurrency(PRICING_PLANS.vip.price)}
                  </span>
                  <span className="text-xs text-zinc-500">/ Private Coaching</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 mb-8">
                {PRICING_PLANS.vip.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => openEnrollModal('vip')}
              className="btn btn-secondary w-full justify-center"
            >
              สมัครแพ็กเกจ VIP Mentorship
            </button>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ทุกแพ็กเกจรองรับการชำระผ่าน QR พร้อมเพย์ และบัตรเครดิต ผ่อน 0% สูงสุด 10 เดือน</span>
        </div>
      </div>
    </section>
  );
};

