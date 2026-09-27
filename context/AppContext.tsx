'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PlanDetail, SubscriptionTier, UserRole } from '@/types';
import { PRICING_PLANS } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';
import { getVerifiedUserTier } from '@/lib/auth/entitlements';
import type { SupabaseClient } from '@supabase/supabase-js';

interface AppContextType {
  currentUser: User | null;
  userRole: UserRole;
  isStaff: boolean;
  isAdmin: boolean;
  supabase: SupabaseClient;
  login: (user: User) => void;
  logout: () => void;
  setUserTier: (tier: SubscriptionTier) => void;
  upgradeUserPlan: (plan: 'basic' | 'pro' | 'vip', amountPaid?: number) => void;
  
  // Auth Modal
  isAuthModalOpen: boolean;
  authReason: 'enroll' | null;
  pendingPromoCode: string | null;
  openAuthModal: (reason?: 'enroll' | null) => void;
  closeAuthModal: () => void;

  // Support Ticket Modal
  isSupportModalOpen: boolean;
  openSupportModal: () => void;
  closeSupportModal: () => void;

  // Preview Modal (3 Real Videos)
  isPreviewModalOpen: boolean;
  activeEpisode: number;
  openPreviewModal: (ep?: number) => void;
  closePreviewModal: () => void;
  setActiveEpisode: (ep: number) => void;

  // Enrollment Modal (Auth Guard Protected)
  isEnrollModalOpen: boolean;
  selectedPlan: 'basic' | 'pro' | 'vip';
  appliedPromoCode: string | null;
  setAppliedPromoCode: (code: string | null) => void;
  openEnrollModal: (plan?: 'basic' | 'pro' | 'vip', promoCode?: string) => void;
  closeEnrollModal: () => void;

  // Toasts
  toasts: Array<{ id: string; message: string }>;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'knowva_next_user';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase] = useState(() => createClient());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState<'enroll' | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState(1);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'vip'>('pro');
  const [pendingEnrollPlan, setPendingEnrollPlan] = useState<'basic' | 'pro' | 'vip' | null>(null);
  const [pendingPromoCode, setPendingPromoCode] = useState<string | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  const [toasts, setToasts] = useState<Array<{ id: string; message: string }>>([]);

  // Sync session with Supabase and fallback to localStorage
  useEffect(() => {
    // 1. Initial LocalStorage load for fast render
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.tier) parsed.tier = 'free';
        if (!parsed.role) parsed.role = 'user';
        setCurrentUser(parsed);
      }
    } catch (e) {
      console.error('Failed to load user from localStorage:', e);
    }

    // 2. Fetch active Supabase session
    const syncSupabaseUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { tier: verifiedTier, role: verifiedRole } = await getVerifiedUserTier(supabase, session.user.id);
          let userName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'ผู้เรียน';
          let userPhone = session.user.user_metadata?.phone || '';

          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, phone')
              .eq('id', session.user.id)
              .single();
            if (profile) {
              if (profile.full_name) userName = profile.full_name;
              if (profile.phone) userPhone = profile.phone;
            }
          } catch {
            // profiles table might not be created yet, fallback to metadata
          }

          const userObj: User = {
            id: session.user.id,
            name: userName,
            email: session.user.email || '',
            phone: userPhone,
            tier: verifiedTier,
            role: verifiedRole,
            enrolledAt: session.user.created_at,
          };
          setCurrentUser(userObj);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userObj));
        }
      } catch (err) {
        console.warn('Supabase session sync error:', err);
      }
    };

    syncSupabaseUser();

    // 3. Listen to Supabase Auth State changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { tier: verifiedTier, role: verifiedRole } = await getVerifiedUserTier(supabase, session.user.id);
        let userName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'ผู้เรียน';
        let userPhone = session.user.user_metadata?.phone || '';

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', session.user.id)
            .single();
          if (profile) {
            if (profile.full_name) userName = profile.full_name;
            if (profile.phone) userPhone = profile.phone;
          }
        } catch {
          // profiles table might not be created yet
        }

        const userObj: User = {
          id: session.user.id,
          name: userName,
          email: session.user.email || '',
          phone: userPhone,
          tier: verifiedTier,
          role: verifiedRole,
          enrolledAt: session.user.created_at,
        };
        setCurrentUser(userObj);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userObj));
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const showToast = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const login = (user: User) => {
    const updatedUser: User = {
      ...user,
      tier: user.tier || 'free',
      role: user.role || 'user',
      enrolledAt: user.enrolledAt || new Date().toISOString(),
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Failed to save user:', e);
    }
    setIsAuthModalOpen(false);
    showToast(`🎉 ยินดีต้อนรับ ${updatedUser.name} เข้าสู่ระบบเรียบร้อย`);

    // If user previously attempted to enroll, continue to enrollment modal immediately!
    if (pendingEnrollPlan) {
      const targetPlan = pendingEnrollPlan;
      const targetPromo = pendingPromoCode;
      setPendingEnrollPlan(null);
      setPendingPromoCode(null);
      setTimeout(() => {
        setSelectedPlan(targetPlan);
        setAppliedPromoCode(targetPromo);
        setIsEnrollModalOpen(true);
        if (targetPromo === 'EARLYBIRD') {
          showToast('🎉 ใช้สิทธิ์ Early Bird ส่วนลด 40% ให้คุณเรียบร้อยแล้ว!');
        }
      }, 250);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase signOut error:', e);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove user:', e);
    }
    showToast('👋 ออกจากระบบเรียบร้อยแล้ว');
  };

  const setUserTier = async (tier: SubscriptionTier) => {
    const isStaffOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'staff';
    if (!isStaffOrAdmin) {
      showToast('❌ สิทธิ์นี้สามารถปรับได้เฉพาะแอดมินหรือเจ้าหน้าที่เท่านั้น');
      return;
    }

    if (!currentUser) return;

    const updated = { ...currentUser, tier };
    setCurrentUser(updated);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      if (currentUser.id) {
        await supabase
          .from('profiles')
          .update({ tier })
          .eq('id', currentUser.id);
      }
    } catch (e) {
      console.error('Failed to update tier:', e);
    }
    showToast(`⚡ [Admin Mode] ปรับระดับสิทธิ์เป็น: ${tier.toUpperCase()}`);
  };

  const upgradeUserPlan = async (newPlan: 'basic' | 'pro' | 'vip', amountPaid?: number) => {
    if (!currentUser) {
      openAuthModal('enroll');
      return;
    }
    const updated: User = {
      ...currentUser,
      tier: newPlan,
      enrolledAt: new Date().toISOString(),
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      // Save to Supabase DB if user is logged in
      if (currentUser.id) {
        await supabase
          .from('profiles')
          .update({ tier: newPlan })
          .eq('id', currentUser.id);

        const planPrice = PRICING_PLANS[newPlan]?.price || 0;
        const finalAmount = typeof amountPaid === 'number' ? amountPaid : planPrice;
        await supabase
          .from('enrollments')
          .insert({
            user_id: currentUser.id,
            plan: newPlan,
            amount_paid: finalAmount,
            payment_method: 'promptpay',
            payment_status: 'completed',
          });
      }
    } catch (e) {
      console.error('Failed to save upgraded user to Supabase:', e);
    }
    showToast(`🎉 อัปเกรดเป็นแพ็กเกจ ${newPlan.toUpperCase()} สำเร็จ! ปลดล็อกคอร์สใหม่ทันที`);
  };

  const openAuthModal = (reason: 'enroll' | null = null) => {
    setAuthReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthReason(null);
  };

  const openSupportModal = () => {
    setIsSupportModalOpen(true);
  };

  const closeSupportModal = () => {
    setIsSupportModalOpen(false);
  };

  const openPreviewModal = (ep: number = 1) => {
    setActiveEpisode(ep);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  // Auth Guard: Force user to login before opening Enroll Modal
  const openEnrollModal = (plan: 'basic' | 'pro' | 'vip' = 'pro', promoCode?: string) => {
    if (!currentUser) {
      setPendingEnrollPlan(plan);
      setPendingPromoCode(promoCode || null);
      openAuthModal('enroll');
      if (promoCode === 'EARLYBIRD') {
        showToast('🎁 กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อน เพื่อรับสิทธิ์ Early Bird ส่วนลด 40%');
      } else {
        showToast('🔒 กรุณาเข้าสู่ระบบก่อนดำเนินการสมัครเรียน');
      }
      return;
    }
    setSelectedPlan(plan);
    setAppliedPromoCode(promoCode || null);
    setIsEnrollModalOpen(true);
  };

  const closeEnrollModal = () => {
    setIsEnrollModalOpen(false);
  };

  const userRole: UserRole = currentUser?.role || 'user';
  const isStaff = userRole === 'staff' || userRole === 'admin';
  const isAdmin = userRole === 'admin';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        isStaff,
        isAdmin,
        supabase,
        login,
        logout,
        setUserTier,
        upgradeUserPlan,
        isAuthModalOpen,
        authReason,
        pendingPromoCode,
        openAuthModal,
        closeAuthModal,
        isSupportModalOpen,
        openSupportModal,
        closeSupportModal,
        isPreviewModalOpen,
        activeEpisode,
        openPreviewModal,
        closePreviewModal,
        setActiveEpisode,
        isEnrollModalOpen,
        selectedPlan,
        appliedPromoCode,
        setAppliedPromoCode,
        openEnrollModal,
        closeEnrollModal,
        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
