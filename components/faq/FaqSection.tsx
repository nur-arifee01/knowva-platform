'use client';

import React, { useState } from 'react';
import { FAQS } from '@/lib/data';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const toggleFaq = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mt-1">
            คำถามที่พบบ่อย
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            คำตอบสำหรับข้อสงสัยทั่วไปเกี่ยวกับการเรียน รูปแบบการสอน และการชำระเงิน
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-xl transition-all overflow-hidden ${isOpen ? 'border-zinc-400 shadow-sm' : 'border-zinc-200'}`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <span className="text-sm sm:text-base font-bold text-zinc-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180 text-zinc-900' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center p-6 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-600">
          <MessageSquare className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
          <p className="font-bold text-sm text-zinc-900">ยังมีข้อสงสัยเพิ่มเติมหรือไม่?</p>
          <p className="text-zinc-500 mt-1">ทักสอบถามทีมงานผ่าน LINE Official: <strong className="text-zinc-900">@knowva</strong> ได้ทุกวันเวลา 09:00 - 20:00 น.</p>
        </div>
      </div>
    </section>
  );
};

