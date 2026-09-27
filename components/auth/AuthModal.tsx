'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Lock, Eye, EyeOff, Sparkles, AlertCircle, KeyRound, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';
import { getVerifiedUserTier } from '@/lib/auth/entitlements';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authReason, pendingPromoCode, login, showToast, supabase } = useApp();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Sign In state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Forgot Password state
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = resetEmail.trim();
    if (!cleanEmail) {
      showToast('กรุณากรอกอีเมลที่ใช้ลงทะเบียน');
      return;
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        showToast(`❌ ${error.message}`);
      } else {
        setIsResetSent(true);
        showToast('✉️ ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว');
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      showToast('❌ ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsLoading(true);
    try {
      let userEmail = identifier.trim();
      if (!userEmail.includes('@')) {
        userEmail = `${userEmail}@knowva.ac`;
      }

      // Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          showToast('❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือยังไม่ได้สมัครสมาชิก');
        } else if (error.message.includes('Email not confirmed')) {
          showToast('⚠️ กรุณากดยืนยันในอีเมลของคุณก่อนเข้าสู่ระบบ หรือใช้ปุ่ม Demo ด้านล่าง');
        } else {
          showToast(`❌ ${error.message}`);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        let displayName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'ผู้เรียน';
        displayName = `คุณ${displayName.charAt(0).toUpperCase() + displayName.slice(1)}`;

        // Strictly verify entitlement from database (enrollments & profiles)
        const { tier: verifiedTier, role: verifiedRole } = await getVerifiedUserTier(supabase, data.user.id);

        login({
          id: data.user.id,
          name: displayName,
          email: data.user.email || userEmail,
          phone: data.user.user_metadata?.phone || '',
          tier: verifiedTier,
          role: verifiedRole,
        });
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      showToast('❌ ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !signupPassword) {
      showToast('กรุณากรอกชื่อ อีเมล และรหัสผ่านให้ครบถ้วน');
      return;
    }
    if (signupPassword.length < 6) {
      showToast('❌ รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (signupPassword !== confirmPassword) {
      showToast('❌ รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      return;
    }
    if (!termsAccepted) {
      showToast('กรุณายอมรับข้อกำหนดและนโยบายความเป็นส่วนตัว');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: signupPassword,
        options: {
          data: {
            full_name: name.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          showToast('❌ อีเมลนี้เคยลงทะเบียนแล้ว กรุณาสลับไปหน้า "เข้าสู่ระบบ"');
        } else {
          showToast(`❌ ${error.message}`);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // If session was created right away (email auto-confirm is enabled)
        if (data.session) {
          login({
            id: data.user.id,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            tier: 'free',
          });
          showToast('🎉 สมัครสมาชิกบน Supabase สำเร็จ!');
        } else {
          // If Supabase project requires email confirmation
          showToast('✉️ ระบบได้ส่งอีเมลยืนยันไปที่กล่องจดหมายของคุณแล้ว กรุณากดยืนยันเพื่อเข้าสู่ระบบ');
          closeAuthModal();
        }
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      showToast('❌ เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    login({
      name: 'คุณผู้เรียนทั่วไป (Demo User)',
      email: 'student.demo@knowva.ac',
      phone: '089-123-4567',
      tier: 'free',
      role: 'user',
    });
  };

  const handleSocialLogin = (provider: 'Google' | 'LINE') => {
    login({
      name: provider === 'LINE' ? 'คุณวิภาดา (LINE)' : 'คุณกิตติชัย (Google)',
      email: provider === 'LINE' ? 'wiphada.line@example.com' : 'kittichai.google@gmail.com',
      phone: '086-555-4321',
      tier: 'free',
      role: 'user',
    });
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div
        className="modal-container max-w-md p-0 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-950">
              {activeTab === 'signin'
                ? 'เข้าสู่ระบบบัญชีผู้เรียน'
                : activeTab === 'signup'
                ? 'สมัครสมาชิกใหม่'
                : 'รีเซ็ตรหัสผ่าน (Forgot Password)'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {activeTab === 'signin'
                ? 'เข้าถึงเนื้อหาคอร์สและสิทธิประโยชน์ของคุณ'
                : activeTab === 'signup'
                ? 'สร้างบัญชีผู้เรียนเพื่อเริ่มต้นเส้นทาง Full-Stack & AI'
                : 'ระบุอีเมลที่ลงทะเบียนไว้เพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่'}
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contextual Alert: When user was prompted to login because of clicking "สมัครเรียน" or Early Bird */}
        {authReason === 'enroll' && activeTab !== 'forgot' && (
          pendingPromoCode === 'EARLYBIRD' ? (
            <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-start gap-2.5 animate-fadeIn">
              <div className="p-1 rounded-full bg-emerald-200 text-emerald-800 flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-emerald-950">สิทธิ์พิเศษ Early Bird รุ่นที่ 8 (ลดทันที 40%)</p>
                <p className="text-emerald-800 mt-0.5 leading-relaxed">
                  กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อรับสิทธิ์ ระบบจะเปิดหน้าชำระเงินพร้อมแนบส่วนลด 40% ให้อัตโนมัติทันทีหลังเข้าสู่ระบบครับ
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-6 mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-fadeIn">
              <div className="p-1 rounded-full bg-amber-200/60 text-amber-800 flex-shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-amber-950">ต้องเข้าสู่ระบบก่อนสมัครเรียน</p>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  กรุณาเข้าสู่ระบบ (หรือสมัครสมาชิกใหม่) เพื่อเชื่อมโยงบัญชีและสิทธิการเข้าเรียนคอร์สนี้ครับ
                </p>
              </div>
            </div>
          )
        )}

        {/* Tabs */}
        {activeTab !== 'forgot' ? (
          <div className="px-6 pt-4 border-b border-zinc-100 flex gap-6 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`pb-2.5 transition-colors cursor-pointer ${activeTab === 'signin' ? 'font-bold text-zinc-950 border-b-2 border-zinc-950' : 'font-medium text-zinc-400 hover:text-zinc-700'}`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`pb-2.5 transition-colors cursor-pointer ${activeTab === 'signup' ? 'font-bold text-zinc-950 border-b-2 border-zinc-950' : 'font-medium text-zinc-400 hover:text-zinc-700'}`}
            >
              สมัครสมาชิกใหม่
            </button>
          </div>
        ) : (
          <div className="px-6 pt-3.5 pb-2.5 border-b border-zinc-100 flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับไปหน้าเข้าสู่ระบบ</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {activeTab === 'forgot' ? (
            /* 3. FORGOT PASSWORD FORM */
            <div className="space-y-4">
              {isResetSent ? (
                <div className="text-center py-4 space-y-4 animate-scaleUp">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-zinc-950">
                      ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว!
                    </h4>
                    <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mx-auto">
                      ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยัง{' '}
                      <strong className="text-zinc-950 font-semibold">{resetEmail}</strong> เรียบร้อยแล้ว กรุณาเปิดกล่องจดหมายของคุณและคลิกลิงก์เพื่อเปลี่ยนรหัสผ่าน
                    </p>
                    <p className="text-[11px] text-zinc-400 pt-1">
                      (หากไม่พบใน Inbox กรุณาลองตรวจสอบในโฟลเดอร์ Junk/Spam)
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetSent(false);
                        setActiveTab('signin');
                      }}
                      className="btn btn-secondary w-full justify-center py-2.5 text-xs font-bold"
                    >
                      กลับไปหน้าเข้าสู่ระบบ
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1">
                    <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      <span>ขั้นตอนการตั้งรหัสผ่านใหม่</span>
                    </p>
                    <p className="leading-relaxed">
                      กรอกอีเมลที่คุณใช้ลงทะเบียน ระบบจะส่งลิงก์ความปลอดภัย (Magic Recovery Link) ไปยังอีเมลของคุณเพื่อเปิดหน้าตั้งรหัสผ่านใหม่ทันที
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      อีเมลของคุณ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        placeholder="เช่น student@example.com"
                        className="input-field text-sm pl-9"
                      />
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full justify-center py-2.5 text-sm cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'กำลังส่งลิงก์...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน \u2192'}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      className="text-xs text-zinc-500 hover:text-zinc-950 hover:underline cursor-pointer"
                    >
                      จำรหัสผ่านได้แล้ว? เข้าสู่ระบบ
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : activeTab === 'signin' ? (
            /* 1. SIGN IN FORM */
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  อีเมล หรือ ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="เช่น user@example.com หรือ somchai"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-700">
                    รหัสผ่าน
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(identifier.includes('@') ? identifier : '');
                      setIsResetSent(false);
                      setActiveTab('forgot');
                    }}
                    className="text-[11px] text-zinc-500 hover:text-zinc-950 hover:underline cursor-pointer"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านของคุณ"
                    className="input-field text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                  />
                  <span>จดจำการเข้าสู่ระบบ</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full justify-center py-2.5 text-sm mt-2 cursor-pointer"
              >
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ \u2192'}
              </button>

              {/* Fast Demo Account Button */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>⚡ ทดลองคลิกเข้าสู่ระบบทันที (บัญชี Demo)</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center py-2">
                <div className="border-t border-zinc-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                  หรือเข้าสู่ระบบด้วย
                </span>
                <div className="border-t border-zinc-200 w-full"></div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="social-btn flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('LINE')}
                  className="social-btn flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors"
                >
                  <span className="w-4 h-4 rounded-full bg-[#06C755] text-white flex items-center justify-center font-bold text-[9px]">L</span>
                  <span>LINE</span>
                </button>
              </div>

              <p className="text-center text-xs text-zinc-500 pt-1">
                ยังไม่มีบัญชีใช่หรือไม่?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-zinc-950 font-bold hover:underline cursor-pointer"
                >
                  สมัครสมาชิกใหม่
                </button>
              </p>
            </form>
          ) : (
            /* 2. SIGN UP FORM */
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  ชื่อ - นามสกุล <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="เช่น กิตติพงษ์ สุขใจ"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  อีเมล <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="เช่น kittipong@email.com"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  กำหนดรหัสผ่าน <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    className="input-field text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  ยืนยันรหัสผ่าน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  className="input-field text-sm"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-zinc-600 select-none">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                  />
                  <span>ฉันยอมรับข้อกำหนดการให้บริการ และ นโยบายความเป็นส่วนตัว</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full justify-center py-2.5 text-sm mt-3 cursor-pointer"
              >
                {isLoading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชีและเข้าสู่ระบบ \u2192'}
              </button>

              <p className="text-center text-xs text-zinc-500 pt-1">
                มีบัญชีอยู่แล้วใช่หรือไม่?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-zinc-950 font-bold hover:underline cursor-pointer"
                >
                  เข้าสู่ระบบ
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

