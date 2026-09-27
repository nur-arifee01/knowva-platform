'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SupportTicket, TicketMessage, TicketCategory, TicketPriority, TicketStatus } from '@/types';
import {
  LifeBuoy,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Trash2,
  Send,
  X,
  User,
  Shield,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  general: 'ทั่วไป / สอบถาม',
  course_content: 'เนื้อหา / โค้ด',
  technical: 'ระบบ / เทคนิค',
  billing: 'การชำระเงิน',
  mentorship: 'Mentorship',
};

const STATUS_OPTIONS: Array<{ value: TicketStatus; label: string; color: string }> = [
  { value: 'pending', label: 'รอดำเนินการ', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'in_progress', label: 'กำลังตรวจสอบ', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'resolved', label: 'แก้ไขแล้ว', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'closed', label: 'ปิดงานแล้ว', color: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
];

const PRIORITY_BADGES: Record<TicketPriority, { label: string; color: string }> = {
  low: { label: 'ปกติ', color: 'text-zinc-600 bg-zinc-100 border-zinc-200' },
  medium: { label: 'ปานกลาง', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  high: { label: 'สูง', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  urgent: { label: 'เร่งด่วน', color: 'text-red-700 bg-red-50 border-red-200 font-bold animate-pulse' },
};

export default function AdminTicketsPage() {
  const { supabase, userRole, isAdmin, currentUser, showToast } = useApp();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | TicketCategory>('all');

  // Active Ticket Modal (Thread & Reply)
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [ticketStatusUpdate, setTicketStatusUpdate] = useState<TicketStatus>('in_progress');

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (activeTicket) {
      fetchMessages(activeTicket.id);
      setTicketStatusUpdate(activeTicket.status);
    }
  }, [activeTicket]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Fetch tickets error:', err);
      showToast('❌ ไม่สามารถโหลดรายการ Tickets ได้');
    } finally {
      setIsLoading(false);
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

  const handleUpdateStatus = async (ticketId: string, nextStatus: TicketStatus) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId);

      if (error) throw error;

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
      );
      if (activeTicket && activeTicket.id === ticketId) {
        setActiveTicket((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }
      showToast(`⚡ ปรับสถานะเป็น ${nextStatus.toUpperCase()} สำเร็จ`);
    } catch (err: any) {
      console.error('Update status error:', err);
      showToast('❌ ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket || !currentUser) return;

    setIsSendingReply(true);
    try {
      // 1. Insert reply message with Staff/Admin role
      const { error: msgErr } = await supabase.from('ticket_messages').insert({
        ticket_id: activeTicket.id,
        sender_id: currentUser.id,
        sender_name: currentUser.name || (isAdmin ? 'Admin' : 'Staff'),
        sender_role: userRole,
        message: replyText.trim(),
      });

      if (msgErr) throw msgErr;

      // 2. Update status and timestamp
      await supabase
        .from('support_tickets')
        .update({
          status: ticketStatusUpdate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activeTicket.id);

      setReplyText('');
      fetchMessages(activeTicket.id);
      fetchTickets();
      showToast('💬 ส่งคำตอบกลับและอัปเดตสถานะเรียบร้อยแล้ว');
    } catch (err: any) {
      console.error('Send reply error:', err);
      showToast('❌ ไม่สามารถส่งข้อความได้');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteTicket = async (ticketId: string, title: string) => {
    if (!isAdmin) {
      showToast('🔒 สงวนสิทธิ์การลบเฉพาะผู้ดูแลระบบ (Admin) เท่านั้น');
      return;
    }

    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ Ticket: "${title}" อย่างถาวร?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', ticketId);

      if (error) throw error;

      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      if (activeTicket?.id === ticketId) setActiveTicket(null);
      showToast('🗑️ ลบ Ticket ออกจากระบบเรียบร้อยแล้ว');
    } catch (err: any) {
      console.error('Delete ticket error:', err);
      showToast('❌ เกิดข้อผิดพลาดในการลบ');
    }
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.user_name.toLowerCase().includes(q) ||
        (t.user_email && t.user_email.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
              จัดการรายการแจ้งปัญหา (Support Tickets)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
              {filteredTickets.length} รายการ
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {isAdmin
              ? '👑 สิทธิ์ Admin: สามารถดู ตอบกลับ อัปเดตสถานะ และลบ Tickets ได้ทั้งหมด'
              : '🛡️ สิทธิ์ Staff: สามารถดู ตอบกลับ และอัปเดตสถานะปัญหาเพื่อช่วยเหลือผู้เรียน'}
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200/80 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition flex items-center gap-1.5 shadow-sm self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>รีเฟรชข้อมูล</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              statusFilter === 'all'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            ทั้งหมด ({tickets.length})
          </button>
          {STATUS_OPTIONS.map((opt) => {
            const count = tickets.filter((t) => t.status === opt.value).length;
            const isSelected = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <span>{opt.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อผู้เรียน, หัวข้อ..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 focus:outline-none focus:bg-white focus:border-zinc-400 font-medium"
          >
            <option value="all">ทุกหมวดหมู่</option>
            <option value="technical">ปัญหาทางเทคนิค</option>
            <option value="course_content">เนื้อหาบทเรียน</option>
            <option value="billing">การชำระเงิน</option>
            <option value="mentorship">Mentorship</option>
            <option value="general">ทั่วไป</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-zinc-400">
            <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin mx-auto mb-2" />
            กำลังโหลดข้อมูล Tickets จาก Supabase...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-xs">ไม่พบรายการ Tickets ตามเงื่อนไขที่ค้นหา</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">ผู้แจ้งปัญหา</th>
                  <th className="py-3 px-4">หัวข้อเรื่อง & รายละเอียด</th>
                  <th className="py-3 px-3">หมวดหมู่</th>
                  <th className="py-3 px-3">ความเร่งด่วน</th>
                  <th className="py-3 px-3">สถานะ</th>
                  <th className="py-3 px-3">วันที่แจ้ง</th>
                  <th className="py-3 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredTickets.map((t) => {
                  const statusObj = STATUS_OPTIONS.find((s) => s.value === t.status);
                  const prioObj = PRIORITY_BADGES[t.priority] || PRIORITY_BADGES.medium;
                  return (
                    <tr key={t.id} className="hover:bg-zinc-50/80 transition">
                      {/* User */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-zinc-900">{t.user_name}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">{t.user_email || '-'}</div>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-zinc-900 truncate">{t.title}</div>
                        <div className="text-[11px] text-zinc-500 truncate">{t.description}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-[11px] text-zinc-600 font-medium">
                          {CATEGORY_LABELS[t.category] || t.category}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${prioObj.color}`}>
                          {prioObj.label}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateStatus(t.id, e.target.value as TicketStatus)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            statusObj?.color || 'text-zinc-600 border-zinc-200'
                          }`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-white text-zinc-900">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-zinc-400 whitespace-nowrap text-[11px]">
                        {new Date(t.created_at).toLocaleDateString('th-TH')}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveTicket(t)}
                            className="py-1.5 px-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-[11px] transition flex items-center gap-1 shadow-xs"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>ดู & ตอบกลับ</span>
                          </button>

                          {/* Delete Button: Admin ONLY */}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteTicket(t.id, t.title)}
                              title="ลบ Ticket นี้ (สิทธิ์ Admin)"
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details & Reply Modal */}
      {activeTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSendingReply) setActiveTicket(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up text-zinc-900">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center border border-zinc-200">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                    <span>จัดการคำร้องแจ้งปัญหา</span>
                    <span className="text-[10px] font-mono text-zinc-400">#{activeTicket.id.substring(0, 8)}</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    ผู้แจ้ง: <strong className="text-zinc-800">{activeTicket.user_name}</strong> ({activeTicket.user_email})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTicket(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Ticket Details Box */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-zinc-700">
                    หมวดหมู่: {CATEGORY_LABELS[activeTicket.category] || activeTicket.category}
                  </span>
                  <span className="text-zinc-400">
                    {new Date(activeTicket.created_at).toLocaleString('th-TH')}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-950">{activeTicket.title}</h4>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-xl border border-zinc-200/70">
                  {activeTicket.description}
                </p>
              </div>

              {/* Thread Messages */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    ประวัติการสนทนา & ตอบกลับ (Thread History)
                  </h5>
                  <span className="text-[10px] text-zinc-400">{messages.length} ข้อความ</span>
                </div>

                {messages.length === 0 ? (
                  <p className="text-zinc-400 text-center py-4">ยังไม่มีข้อความตอบกลับใน Ticket นี้</p>
                ) : (
                  messages.map((m) => {
                    const isStaffSender = m.sender_role === 'staff' || m.sender_role === 'admin';
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                          isStaffSender
                            ? 'bg-emerald-50/60 border-emerald-200 text-zinc-800 ml-4'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-800 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[10px]">
                          <span className={`font-bold flex items-center gap-1 ${
                            isStaffSender ? 'text-emerald-800' : 'text-zinc-600'
                          }`}>
                            {isStaffSender ? `🛡️ ${m.sender_name} (${m.sender_role.toUpperCase()})` : `👤 ${m.sender_name}`}
                          </span>
                          <span className="text-zinc-400">
                            {new Date(m.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="whitespace-pre-line">{m.message}</p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-zinc-100 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-[11px] font-bold text-zinc-700">
                    พิมพ์ข้อความตอบกลับผู้เรียน:
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500">อัปเดตสถานะเป็น:</span>
                    <select
                      value={ticketStatusUpdate}
                      onChange={(e) => setTicketStatusUpdate(e.target.value as TicketStatus)}
                      className="px-2 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:bg-white"
                    >
                      <option value="in_progress">กำลังตรวจสอบ (In Progress)</option>
                      <option value="resolved">แก้ไขแล้ว (Resolved)</option>
                      <option value="closed">ปิดงานแล้ว (Closed)</option>
                      <option value="pending">รอดำเนินการ (Pending)</option>
                    </select>
                  </div>
                </div>

                <textarea
                  required
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="พิมพ์ข้อความตอบกลับ ให้คำแนะนำ หรือแจ้งความคืบหน้าถึงผู้เรียน..."
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTicket(null)}
                    className="py-2 px-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition"
                  >
                    ปิดหน้าต่าง
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReply}
                    className="py-2 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingReply ? 'กำลังส่ง...' : 'ส่งข้อความตอบกลับ'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
