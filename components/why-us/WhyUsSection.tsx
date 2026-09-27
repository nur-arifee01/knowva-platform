'use client';

import React from 'react';
import { CheckCircle2, XCircle, Code2, Cpu, Rocket, Users2, ShieldCheck, Zap } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  return (
    <section id="why-us" className="py-20 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            WHY CHOOSE THIS COURSE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mt-2">
            ไม่ใช่แค่คอร์สสอนเขียนโค้ด แต่คือเส้นทางสู่การเป็น Full-Stack AI Engineer
          </h2>
          <p className="mt-4 text-zinc-600 text-base leading-relaxed">
            ในยุคที่ AI เข้ามาเปลี่ยนวิธีการเขียนโปรแกรม การรู้แค่พื้นฐาน HTML/CSS/JS ไม่เพียงพออีกต่อไป คอร์สนี้สอนให้คุณเป็นคนที่ควบคุม AI และสร้างระบบที่มีมูลค่าจริง
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="card-clean">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center mb-5">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950 mb-2">Modern Full-Stack</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              เชี่ยวชาญ Next.js 15, TypeScript, React Server Components และ PostgreSQL แบบ Production-ready
            </p>
          </div>

          <div className="card-clean">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950 mb-2">Generative AI & Agents</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              เรียนรู้ RAG, Vector Search, pgvector, Function Calling และ Autonomous Multi-Agent Workflows
            </p>
          </div>

          <div className="card-clean">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center mb-5">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950 mb-2">6 โปรเจกต์ใช้งานจริง</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              สร้างแอปพลิเคชันเชิงพาณิชย์ตั้งแต่ E-Commerce, SaaS Multi-Tenant ไปจนถึง AI Knowledge Assistant
            </p>
          </div>

          <div className="card-clean">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center mb-5">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950 mb-2">โค้ชชิ่ง & Code Review</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              มีผู้สอนตรวจโค้ดส่วนตัว ให้ Feedback ปรับปรุง พร้อมถาม-ตอบใน Live Coaching ทุกสัปดาห์
            </p>
          </div>
        </div>

        {/* Comparison: Old Way vs KNOWVA Way */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950">
              ความแตกต่างที่คุณจะได้รับจากหลักสูตรนี้
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">เปรียบเทียบการศึกษาด้วยตนเองกับการเรียนรู้ผ่านโครงสร้างของ KNOWVA</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-rose-100">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-4">
                <XCircle className="w-5 h-5" />
                <span>การศึกษาด้วยตนเองทั่วไป</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 mt-0.5">•</span>
                  <span>เรียนจากคลิป YouTube กระจัดกระจาย ไม่เชื่อมโยงกันเป็นสถาปัตยกรรมเดียว</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 mt-0.5">•</span>
                  <span>ติดบั๊กแล้วไม่มีคนช่วยตอบ ต้องงมหาทางแก้เองหลายวันจนท้อ</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 mt-0.5">•</span>
                  <span>ทำตามแค่ Todo App พื้นฐาน ไม่เคยสัมผัสระบบ Payment หรือ AI API จริง</span>
                </li>
              </ul>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-white border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span>เมื่อเรียนกับ KNOWVA Academy</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>หลักสูตร 8 สัปดาห์เรียงลำดับจากง่ายไปยาก พร้อม Best Practices ระดับองค์กร</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>มีผู้สอนและ TA คอยแนะนำใน Discord VIP และตรวจ Code Review ทุกโปรเจกต์</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>สร้าง 6 โปรเจกต์จริงลง Portfolio ที่นายจ้างและลูกค้ายอมรับในมาตรฐาน</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

