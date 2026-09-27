'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SupportTicket, TicketMessage, TicketCategory, TicketPriority } from '@/types';
import {
  X,
  LifeBuoy,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  ArrowLeft,
  ShieldAlert,
  User,
  Headphones,
} from 'lucide-react';

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  general: 'ทั่วไป / สอบถามข้อมูล',
  course_content: 'เนื้อหาบทเรียน / โค้ดตัวอย่าง',
  technical: 'ระบบขัดข้อง / ปัญหาทางเทคนิค',
  billing: 'การชำระเงิน / ใบเสร็จรับเงิน',
  mentorship: 'การนัดหมาย Mentorship / ตรวจการบ้าน',
};

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  pending: { label: 'รอดำเนินการ', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  in_progress: { label: 'กำลังตรวจสอบ', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  resolved: { label: 'แก้ไขแล้ว', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  closed: { label: 'ปิดงานแล้ว', color: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
};

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, closeSupportModal, currentUser, supabase, showToast, openAuthModal } = useApp();

  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TicketCategory>('technical');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user's tickets when modal opens or tab changes to 'list'
  useEffect(() => {
    if (isSupportModalOpen && currentUser) {
      fetchMyTickets();
    }
  }, [isSupportModalOpen, activeTab, currentUser]);

  // Fetch messages when a ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchMyTickets = async () => {
    if (!currentUser?.id) return;
    setIsLoadingTickets(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyTickets(data || []);
    } catch (err) {
      console.error('Fetch my tickets error:', err);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      closeSupportModal();
      openAuthModal('enroll');
      showToast('🔒 กรุณาเข้าสู่ระบบก่อนส่งเรื่องแจ้งปัญหาครับ');
      return;
    }

    if (!title.trim() || !description.trim()) {
      showToast('กรุณากรอกหัวข้อและรายละเอียดปัญหาให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = {
        user_id: currentUser.id,
        user_name: currentUser.name || 'ผู้เรียน KNOWVA',
        user_email: currentUser.email || '',
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('support_tickets')
        .insert(newTicket)
        .select()
        .single();

      if (error) throw error;

      // Also create initial ticket message from user
      if (data) {
        await supabase.from('ticket_messages').insert({
          ticket_id: data.id,
          sender_id: currentUser.id,
          sender_name: currentUser.name || 'ผู้เรียน',
          sender_role: 'user',
          message: description.trim(),
        });
      }

      showToast('✅ ส่งเรื่องแจ้งปัญหาเรียบร้อยแล้ว ทีมงานจะเร่งดำเนินการให้ครับ');
      setTitle('');
      setDescription('');
      setActiveTab('list');
      fetchMyTickets();
    } catch (err: any) {
      console.error('Submit ticket error:', err);
      showToast(`❌ เกิดข้อผิดพลาด: ${err.message || 'ไม่สามารถส่งเรื่องได้'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket || !currentUser) return;

    setIsSendingReply(true);
    try {
      const newMessage = {
        ticket_id: selectedTicket.id,
        sender_id: currentUser.id,
        sender_name: currentUser.name || 'ผู้เรียน',
        sender_role: currentUser.role || 'user',
        message: replyMessage.trim(),
      };

      const { error } = await supabase.from('ticket_messages').insert(newMessage);
      if (error) throw error;

      // Update updated_at on ticket
      await supabase
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedTicket.id);

      setReplyMessage('');
      fetchMessages(selectedTicket.id);
      showToast('💬 ส่งข้อความตอบกลับแล้ว');
    } catch (err) {
      console.error('Send reply error:', err);
      showToast('❌ ไม่สามารถส่งข้อความได้');
    } finally {
      setIsSendingReply(false);
    }
  };

  if (!isSupportModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) closeSupportModal();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <span>ศูนย์ช่วยเหลือ & แจ้งปัญหาการใช้งาน</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700 font-semibold uppercase">
                  Support
                </span>
              </h2>
              <p className="text-xs text-zinc-500">
                ทีมงานพร้อมช่วยเหลือและแก้ไขปัญหาตลอด 7 วันทำการ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSupportModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        {!selectedTicket && (
          <div className="flex border-b border-zinc-100 px-6 bg-white text-xs font-semibold">
            <button
              onClick={() => setActiveTab('new')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'new'
                  ? 'border-zinc-950 text-zinc-950'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>แจ้งปัญหาใหม่</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'list'
                  ? 'border-zinc-950 text-zinc-950'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>รายการของฉัน {myTickets.length > 0 && `(${myTickets.length})`}</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* View 1: Ticket Detail / Chat Thread */}
          {selectedTicket ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedTicket(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>กลับไปหน้ารายการปัญหา</span>
              </button>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    STATUS_BADGES[selectedTicket.status]?.color || 'bg-zinc-100 text-zinc-700'
                  }`}>
                    {STATUS_BADGES[selectedTicket.status]?.label || selectedTicket.status}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    แจ้งเมื่อ {new Date(selectedTicket.created_at).toLocaleDateString('th-TH')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-950">{selectedTicket.title}</h3>
                <p className="text-xs text-zinc-600">{selectedTicket.description}</p>
                <div className="pt-2 text-[11px] text-zinc-400 flex items-center gap-3">
                  <span>หมวดหมู่: {CATEGORY_LABELS[selectedTicket.category] || selectedTicket.category}</span>
                  <span>ความเร่งด่วน: {selectedTicket.priority}</span>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  บทสนทนาและการตอบกลับ
                </h4>
                {messages.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-4">ยังไม่มีข้อความเพิ่มเติม</p>
                ) : (
                  messages.map((msg) => {
                    const isFromStaff = msg.sender_role === 'staff' || msg.sender_role === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                          isFromStaff
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 ml-4'
                            : 'bg-white border-zinc-200 text-zinc-800 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[11px]">
                          <span className={`font-bold flex items-center gap-1.5 ${
                            isFromStaff ? 'text-emerald-700' : 'text-zinc-900'
                          }`}>
                            {isFromStaff ? '👨‍💻 เจ้าหน้าที่ KNOWVA' : msg.sender_name}
                          </span>
                          <span className="text-zinc-400">
                            {new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="whitespace-pre-line">{msg.message}</p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply Input */}
              {selectedTicket.status !== 'closed' && (
                <form onSubmit={handleSendReply} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="พิมพ์ข้อความตอบกลับหรือสอบถามเพิ่มเติม..."
                    className="flex-1 px-3.5 py-2 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  />
                  <button
                    type="submit"
                    disabled={isSendingReply}
                    className="px-4 py-2 rounded-lg bg-zinc-950 text-white font-semibold text-xs hover:bg-black transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ส่ง</span>
                  </button>
                </form>
              )}
            </div>
          ) : activeTab === 'new' ? (
            /* View 2: Create New Ticket Form */
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  หัวข้อเรื่องที่ต้องการแจ้งปัญหา *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น ไม่สามารถเปิดดูวิดีโอ EP.03 ได้, สอบถามสิทธิ์ Mentorship"
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    หมวดหมู่ปัญหา *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  >
                    <option value="technical">ปัญหาทางเทคนิค / วิดีโอเล่นไม่ได้</option>
                    <option value="course_content">เนื้อหาบทเรียน / ซอร์สโค้ด</option>
                    <option value="billing">การชำระเงิน / แพ็กเกจ</option>
                    <option value="mentorship">Mentorship / โค้ชชิ่ง</option>
                    <option value="general">ทั่วไป / อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    ระดับความเร่งด่วน
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  >
                    <option value="low">ปกติ (ทั่วไป)</option>
                    <option value="medium">ปานกลาง (มีผลกับการเรียน)</option>
                    <option value="high">สูง (ไม่สามารถเข้าเรียนได้)</option>
                    <option value="urgent">เร่งด่วนที่สุด</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  รายละเอียดปัญหาอย่างชัดเจน *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ระบุรายละเอียด เช่น อุปกรณ์ที่ใช้ (Mac/Windows), Browser, ขั้นตอนที่ทำให้เกิดปัญหา หรือข้อความ Error ที่ปรากฏ..."
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950 leading-relaxed"
                />
              </div>

              {!currentUser && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>คุณยังไม่ได้เข้าสู่ระบบ ระบบจะขอให้เข้าสู่ระบบก่อนทำการบันทึกข้อมูลครับ</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 text-white font-bold text-xs hover:bg-black transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>กำลังบันทึกข้อมูลเข้าระบบหลังบ้าน...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>ส่งเรื่องแจ้งปัญหาถึงเจ้าหน้าที่</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* View 3: List of My Tickets */
            <div className="space-y-3">
              {isLoadingTickets ? (
                <div className="text-center py-12 text-xs text-zinc-400">
                  <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-2"></div>
                  กำลังดึงข้อมูลปัญหาของคุณจาก Supabase...
                </div>
              ) : myTickets.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-zinc-300 mx-auto" />
                  <p className="text-xs">ยังไม่มีรายการแจ้งปัญหาในบัญชีของคุณ</p>
                  <button
                    onClick={() => setActiveTab('new')}
                    className="text-xs text-emerald-600 font-semibold hover:underline"
                  >
                    คลิกที่นี่เพื่อแจ้งเรื่องปัญหาใหม่
                  </button>
                </div>
              ) : (
                myTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-400 bg-white transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 text-left min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          STATUS_BADGES[ticket.status]?.color || 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {STATUS_BADGES[ticket.status]?.label || ticket.status}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {CATEGORY_LABELS[ticket.category] || ticket.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-emerald-700 transition-colors">
                        {ticket.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">
                        {ticket.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400 group-hover:text-zinc-700">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

