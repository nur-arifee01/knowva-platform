'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Search,
  RefreshCw,
  Shield,
  ShieldCheck,
  Crown,
  Sparkles,
  Layers,
  Edit2,
  CheckCircle2,
  UserCheck,
  X,
  Save,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface ProfileItem {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  tier: 'free' | 'basic' | 'pro' | 'vip';
  role: 'user' | 'staff' | 'admin';
  created_at: string;
}

export default function AdminUsersPage() {
  const { supabase, isAdmin, isStaff, showToast, currentUser } = useApp();

  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Edit Modal State
  const [selectedUser, setSelectedUser] = useState<ProfileItem | null>(null);
  const [editTier, setEditTier] = useState<'free' | 'basic' | 'pro' | 'vip'>('free');
  const [editRole, setEditRole] = useState<'user' | 'staff' | 'admin'>('user');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles((data as ProfileItem[]) || []);
    } catch (err: any) {
      console.error('Fetch profiles error:', err);
      showToast('❌ ไม่สามารถโหลดข้อมูลผู้เรียนได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditModal = (user: ProfileItem) => {
    setSelectedUser(user);
    setEditTier(user.tier || 'free');
    setEditRole(user.role || 'user');
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      const updatePayload: any = {
        tier: editTier,
        updated_at: new Date().toISOString(),
      };

      // Only super admin can change roles
      if (isAdmin) {
        updatePayload.role = editRole;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Update local state
      setProfiles((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, tier: editTier, role: isAdmin ? editRole : u.role }
            : u
        )
      );

      showToast(`🎉 อัปเดตสิทธิ์และแพ็กเกจของ ${selectedUser.full_name || selectedUser.email} สำเร็จ`);
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Update profile error:', err);
      showToast('❌ ไม่สามารถบันทึกการเปลี่ยนแปลงได้');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered Users
  const filteredUsers = profiles.filter((u) => {
    if (tierFilter !== 'all' && u.tier !== tierFilter) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (u.full_name || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchPhone = (u.phone || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  const totalUsers = profiles.length;
  const proUsers = profiles.filter((u) => u.tier === 'pro').length;
  const vipUsers = profiles.filter((u) => u.tier === 'vip').length;
  const staffUsers = profiles.filter((u) => u.role === 'admin' || u.role === 'staff').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-zinc-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              User Management
            </span>
            <span className="text-xs text-zinc-500 font-medium">ระบบบริหารจัดการบัญชีผู้เรียน</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            จัดการข้อมูลผู้เรียน & ปรับระดับสิทธิ์ (Users)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            ตรวจสอบรายชื่อผู้เรียน ปรับระดับแพ็กเกจ (Tier) เพื่อปลดล็อกคอร์สเรียน และกำหนดสิทธิ์ผู้ดูแล
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="py-2.5 px-4 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-xs transition flex items-center gap-1.5 shadow-sm self-start shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>รีเฟรชข้อมูล</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">ผู้ใช้งานทั้งหมด</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950">
            {isLoading ? '...' : totalUsers.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">บัญชีผู้เรียนที่ลงทะเบียนในระบบ</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">สมาชิก Pro Cohort</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {isLoading ? '...' : proUsers.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">เข้าถึงคอร์ส Full-Stack & AI ทั้งหมด</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">สมาชิก VIP Mentorship</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {isLoading ? '...' : vipUsers.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">ระดับสูงสุด พร้อมการโค้ชชิ่งแบบ 1-on-1</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">เจ้าหน้าที่ & Admin</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600">
            {isLoading ? '...' : staffUsers.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400">ผู้มีสิทธิ์เข้าถึงระบบหลังบ้าน</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อ, อีเมล หรือเบอร์โทร..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 font-medium focus:outline-none focus:bg-white"
          >
            <option value="all">ทุกแพ็กเกจ (All Tiers)</option>
            <option value="free">Free Tier</option>
            <option value="basic">Basic (Self-Paced)</option>
            <option value="pro">Pro Cohort</option>
            <option value="vip">VIP Mentorship</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 font-medium focus:outline-none focus:bg-white"
          >
            <option value="all">ทุกสิทธิ์ (All Roles)</option>
            <option value="user">ผู้เรียน (User)</option>
            <option value="staff">เจ้าหน้าที่ (Staff)</option>
            <option value="admin">ผู้ดูแลระบบ (Admin)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-zinc-400">
            <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin mx-auto mb-2" />
            กำลังโหลดรายชื่อผู้เรียนจากระบบ...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 space-y-2">
            <Users className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-xs">ไม่พบบัญชีผู้เรียนตามเงื่อนไขที่ค้นหา</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">ผู้ใช้งาน</th>
                  <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                  <th className="py-3 px-3">ระดับแพ็กเกจ (Tier)</th>
                  <th className="py-3 px-3">สิทธิ์ในระบบ (Role)</th>
                  <th className="py-3 px-3">วันที่ลงทะเบียน</th>
                  <th className="py-3 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredUsers.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-zinc-50/80 transition">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-zinc-900">
                          {user.full_name || 'ไม่ระบุชื่อ'}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-zinc-400" />
                          <span>{user.email || '-'}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-zinc-600 whitespace-nowrap">
                        {user.phone ? (
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-zinc-400" />
                            {user.phone}
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                            user.tier === 'vip'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : user.tier === 'pro'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : user.tier === 'basic'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                          }`}
                        >
                          {user.tier || 'free'}
                        </span>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                            user.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : user.role === 'staff'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                          }`}
                        >
                          {user.role || 'user'}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-3 text-zinc-400 whitespace-nowrap text-[11px]">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString('th-TH')
                          : '-'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="py-1.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-[11px] transition shadow-xs flex items-center gap-1.5 ml-auto"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>ปรับสิทธิ์ / แพ็กเกจ</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Tier & Role Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSaving) setSelectedUser(null);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 sm:p-7 space-y-4 text-xs text-zinc-900 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">
                    ปรับระดับแพ็กเกจ & สิทธิ์ผู้เรียน
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">{selectedUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              {/* User Info Overview */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">ชื่อผู้เรียน:</span>
                  <span className="font-bold text-zinc-900">{selectedUser.full_name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">อีเมล:</span>
                  <span className="font-mono text-zinc-800">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">สถานะปัจจุบัน:</span>
                  <span className="font-bold text-emerald-700 uppercase">
                    [{selectedUser.tier || 'free'}] • [{selectedUser.role || 'user'}]
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <label className="block text-zinc-700 font-semibold">
                  ปุ่มลัดอัปเกรดแพ็กเกจทันที:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditTier('basic')}
                    className={`p-2 rounded-xl border font-semibold text-[11px] transition text-center ${
                      editTier === 'basic'
                        ? 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-400/20'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    Basic (Self-Paced)
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditTier('pro')}
                    className={`p-2 rounded-xl border font-semibold text-[11px] transition text-center ${
                      editTier === 'pro'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400/20'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    ⚡ Pro Cohort
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditTier('vip')}
                    className={`p-2 rounded-xl border font-semibold text-[11px] transition text-center ${
                      editTier === 'vip'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-400/20'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    👑 VIP Mentorship
                  </button>
                </div>
              </div>

              {/* TIER DROPDOWN */}
              <div>
                <label className="block text-zinc-700 mb-1 font-semibold">
                  เลือกระดับแพ็กเกจ (Subscription Tier)
                </label>
                <select
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-semibold focus:outline-none focus:bg-white focus:border-zinc-400"
                >
                  <option value="free">Free (ยังไม่ได้สมัครแพ็กเกจ / ทดลองเรียน)</option>
                  <option value="basic">Basic (Self-Paced เข้าถึง Foundations)</option>
                  <option value="pro">Pro Cohort (เข้าถึง Full-Stack & AI ทั้งหมด)</option>
                  <option value="vip">VIP Mentorship (เข้าถึงทุกคอร์ส พร้อม 1-on-1)</option>
                </select>
                <p className="text-[10px] text-zinc-400 mt-1">
                  เมื่อปรับแพ็กเกจ ผู้เรียนจะสามารถเข้าเรียนในคอร์สที่เกี่ยวข้องได้ทันที
                </p>
              </div>

              {/* ROLE DROPDOWN: ADMIN ONLY */}
              <div>
                <label className="block text-zinc-700 mb-1 font-semibold flex items-center justify-between">
                  <span>สิทธิ์การใช้งานในระบบ (System Role)</span>
                  {!isAdmin && (
                    <span className="text-[10px] text-amber-600 font-normal">
                      🔒 เฉพาะ Super Admin เท่านั้นที่เปลี่ยนได้
                    </span>
                  )}
                </label>
                <select
                  disabled={!isAdmin}
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-semibold focus:outline-none focus:bg-white focus:border-zinc-400 disabled:opacity-50"
                >
                  <option value="user">User (ผู้เรียนทั่วไป)</option>
                  <option value="staff">Staff (เจ้าหน้าที่หลังบ้าน ตรวจสอบปัญหา)</option>
                  <option value="admin">Admin (ผู้ดูแลระบบสูงสุด จัดการทุกฟังก์ชัน)</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="py-2 px-3.5 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-2 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

