'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound
} from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { supabase, showToast } = useApp();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRecoverySessionReady, setIsRecoverySessionReady] = useState(false);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event from Supabase URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setIsRecoverySessionReady(true);
      }
    });

    // Also check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsRecoverySessionReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      showToast('❌ รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      showToast('❌ รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMessage(error.message);
        showToast(`❌ ${error.message}`);
      } else {
        setIsSuccess(true);
        showToast('🎉 ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว!');
      }
    } catch (err: any) {
      console.error('Update password error:', err);
      setErrorMessage('เกิดข้อผิดพลาดในการตั้งรหัสผ่านใหม่ กรุณาลองใหม่อีกครั้ง');
      showToast('❌ เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            K
          </div>
          <span className="font-bold text-2xl tracking-tight text-zinc-950 font-en">
            KNOWVA<span className="text-emerald-500">.</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-zinc-950">
          ตั้งรหัสผ่านใหม่ (Reset Password)
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          กำหนดรหัสผ่านใหม่เพื่อความปลอดภัยของบัญชีผู้เรียนของคุณ
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl border border-zinc-200 rounded-3xl">
          
          {isSuccess ? (
            <div className="text-center space-y-5 animate-scaleUp py-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-zinc-950">
                  เปลี่ยนรหัสผ่านสำเร็จแล้ว!
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mx-auto">
                  รหัสผ่านใหม่ของคุณได้รับการอัปเดตลงระบบ Supabase เรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบและเริ่มเรียนต่อได้ทันที
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="btn btn-primary w-full justify-center py-3 text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  <span>เข้าสู่หน้าหลักของเว็บไซต์</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  กรุณากำหนดรหัสผ่านใหม่ที่มีความยาวอย่างน้อย 6 ตัวอักษรขึ้นไป
                </span>
              </div>

              {/* New Password Input */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  รหัสผ่านใหม่ (New Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    className="input-field text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  ยืนยันรหัสผ่านใหม่อีกครั้ง <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  className="input-field text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full justify-center py-3 text-sm font-bold shadow-md hover:shadow-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? 'กำลังบันทึกรหัสผ่านใหม่...' : 'บันทึกรหัสผ่านใหม่ \u2192'}
                </button>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="text-xs text-zinc-500 hover:text-zinc-950 hover:underline transition"
                >
                  ← กลับสู่หน้าหลัก
                </Link>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}

