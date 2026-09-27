'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, ShieldCheck, FileText, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openEnrollModal, openPreviewModal, openAuthModal, openSupportModal, showToast } = useApp();
  const [isLoginGuideOpen, setIsLoginGuideOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleTaxInvoiceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('📄 กำลังเปิดหน้าต่างขอใบกำกับภาษี / ใบเสร็จรับเงิน...');
    openSupportModal();
  };

  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Final High-Conversion CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 mb-16 text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            START YOUR JOURNEY TODAY
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2">
            พร้อมเปลี่ยนผ่านสู่ Full-Stack AI Engineer หรือยัง?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-4 max-w-xl mx-auto leading-relaxed">
            เปิดรับรุ่นที่ 8 จำนวนจำกัด เริ่มต้นเรียนรู้ตั้งแต่วันนี้พร้อมทีมผู้สอนดูแลใกล้ชิด
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openEnrollModal('pro')}
              className="btn bg-white text-zinc-950 hover:bg-zinc-100 text-sm py-3 px-8 font-bold w-full sm:w-auto"
            >
              สมัครเรียนรุ่นที่ 8 ตอนนี้ &rarr;
            </button>
            <button
              onClick={() => openPreviewModal(1)}
              className="btn border border-zinc-700 text-white hover:bg-zinc-900 text-sm py-3 px-6 w-full sm:w-auto"
            >
              ดูตัวอย่างบทเรียนฟรี
            </button>
          </div>
        </div>

        {/* Footer Bottom Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-800/80 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black text-sm">
                K
              </div>
              <span className="font-bold text-base tracking-tight font-en">KNOWVA<span className="text-emerald-500">.</span></span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              สถาบันพัฒนาทักษะด้าน Full-Stack Web Development & Artificial Intelligence แห่งอนาคต
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">คอร์สเรียน</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#why-us" className="hover:text-white">ทำไมต้องคอร์สนี้</a></li>
              <li><a href="#curriculum" className="hover:text-white">เนื้อหา 8 สัปดาห์</a></li>
              <li><a href="#projects" className="hover:text-white">6 โปรเจกต์จริง</a></li>
              <li><a href="#pricing" className="hover:text-white">แพ็กเกจราคา</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">การสนับสนุน</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#faq" className="hover:text-white">คำถามที่พบบ่อย</a></li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsLoginGuideOpen(true)}
                  className="hover:text-white text-left transition"
                >
                  คู่มือการเข้าสู่ระบบ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleTaxInvoiceClick}
                  className="hover:text-white text-left transition"
                >
                  ขอใบกำกับภาษี / ใบเสร็จ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsPrivacyOpen(true)}
                  className="hover:text-white text-left transition"
                >
                  นโยบายความเป็นส่วนตัว (PDPA)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">ติดต่อเรา</h4>
            <p className="text-zinc-400">LINE: @knowva</p>
            <p className="text-zinc-400 mt-1">Email: contact@knowva.ac</p>
            <p className="text-zinc-400 mt-1">เวลาทำการ: ทุกวัน 09:00 - 20:00 น.</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} KNOWVA Academy. All rights reserved.</p>
          <p>The Full-Stack & AI Builder Certification Course</p>
        </div>
      </div>

      {/* LOGIN GUIDE MODAL */}
      {isLoginGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsLoginGuideOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 text-zinc-200 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLoginGuideOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">คู่มือการเข้าสู่ระบบ KNOWVA</h3>
                <span className="text-xs text-zinc-400">ขั้นตอนการเข้าใช้งานห้องเรียนออนไลน์</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-zinc-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>1. เข้าสู่ระบบด้วยอีเมลหรือรหัสผ่าน</span>
                </span>
                <p className="text-zinc-400 pl-5.5">
                  ใช้อีเมลและรหัสผ่านที่คุณระบุไว้ตอนลงทะเบียน หรือเข้าผ่านปุ่มลัด Social Login
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>2. กรณีลืมรหัสผ่าน (Forgot Password)</span>
                </span>
                <p className="text-zinc-400 pl-5.5">
                  คลิกที่ลิงก์ &ldquo;ลืมรหัสผ่าน?&rdquo; ในหน้าต่างเข้าสู่ระบบ กรอกอีเมล แล้วระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังกล่องจดหมายของคุณทันที
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>3. สิทธิ์การเข้าเรียนตามแพ็กเกจ</span>
                </span>
                <p className="text-zinc-400 pl-5.5">
                  สมาชิกทั่วไปสามารถเข้าเรียน 5 คอร์สระดับ Free ได้ทันที ส่วนคอร์สพรีเมียม (Basic, Pro, VIP) จะปลดล็อกทันทีที่แจ้งชำระเงินและได้รับการอนุมัติ
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsLoginGuideOpen(false);
                  openAuthModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>เปิดหน้าต่างเข้าสู่ระบบ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY MODAL (PDPA) */}
      {isPrivacyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsPrivacyOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 text-zinc-200 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">นโยบายความเป็นส่วนตัว (Privacy Policy)</h3>
                <span className="text-xs text-zinc-400">ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <section className="space-y-1">
                <h4 className="font-bold text-white text-sm">1. ข้อมูลที่เราจัดเก็บ</h4>
                <p className="text-zinc-400">
                  เราจัดเก็บข้อมูลที่จำเป็นต่อการให้บริการการเรียนออนไลน์ เช่น ชื่อ-นามสกุล, ที่อยู่อีเมล, หมายเลขโทรศัพท์, ข้อมูลการทำธุรกรรมชำระเงิน, และสถิติความก้าวหน้าในการรับชมบทเรียน
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-white text-sm">2. วัตถุประสงค์ในการประมวลผลข้อมูล</h4>
                <p className="text-zinc-400">
                  ข้อมูลของคุณจะถูกนำมาใช้เพื่อวัตถุประสงค์ในการยืนยันตัวตน, การออกใบเสร็จรับเงิน/ใบกำกับภาษี, การให้บริการห้องเรียนออนไลน์, และการติดต่อประสานงานเกี่ยวกับการเรียนหรือตรวจการบ้านเท่านั้น
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-white text-sm">3. การรักษาความปลอดภัยของข้อมูล</h4>
                <p className="text-zinc-400">
                  KNOWVA Academy มีมาตรการรักษาความปลอดภัยตามมาตรฐานสากล มีการเข้ารหัสข้อมูลขณะส่งผ่านเครือข่าย (SSL/TLS) และจำกัดสิทธิ์การเข้าถึงข้อมูลเฉพาะเจ้าหน้าที่ที่เกี่ยวข้อง
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-white text-sm">4. สิทธิของเจ้าของข้อมูลส่วนบุคคล</h4>
                <p className="text-zinc-400">
                  คุณมีสิทธิ์ในการเข้าถึง, ขอรับสำเนา, แก้ไขให้ถูกต้อง หรือร้องขอให้ลบข้อมูลส่วนบุคคลของคุณได้ตลอดเวลา โดยสามารถติดต่อผ่านศูนย์ช่วยเหลือ (Support Ticket) หรืออีเมล contact@knowva.ac
                </p>
              </section>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                className="py-2 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition"
              >
                เข้าใจและรับทราบ
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

