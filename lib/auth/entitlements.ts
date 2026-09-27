import { SubscriptionTier, UserRole, CourseItem } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Tier hierarchy levels: free (0) < basic (1) < pro (2) < vip (3)
export const TIER_LEVELS: Record<SubscriptionTier, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  vip: 3,
};

/**
 * Checks if a user has permission to access a course.
 *
 * Rules:
 * 1. Admin and Staff have full master access to all courses for inspection.
 * 2. If a course is 'free' (minTier === 'free'), anyone (including free users and guests) can access.
 * 3. If a course is a premium course (basic, pro, vip):
 *    - A user with 'free' tier CANNOT access.
 *    - A user must have a tier level greater than or equal to the required course level.
 *      (e.g., Basic user can access Basic; Pro user can access Basic & Pro; VIP user can access all).
 */
export function canAccessCourse(
  userTier: SubscriptionTier = 'free',
  courseMinTier: SubscriptionTier = 'free',
  userRole: UserRole = 'user'
): boolean {
  // Staff and Admin bypass
  if (userRole === 'admin' || userRole === 'staff') {
    return true;
  }

  // Course is free -> accessible to everyone
  if (courseMinTier === 'free') {
    return true;
  }

  // If user is 'free' tier, they CANNOT access paid courses
  if (userTier === 'free') {
    return false;
  }

  // Check tier hierarchy level
  const userLevel = TIER_LEVELS[userTier] ?? 0;
  const courseLevel = TIER_LEVELS[courseMinTier] ?? 0;

  return userLevel >= courseLevel;
}

/**
 * Verifies the effective entitlement of a user from Supabase.
 * Strictly verifies whether the user actually paid by checking:
 * 1. public.enrollments for completed orders (payment_status = 'completed')
 * 2. public.profiles for staff/admin roles or manually verified tier
 *
 * If no completed order exists and the user is a normal student, their tier MUST be 'free'.
 */
export async function getVerifiedUserTier(
  supabase: SupabaseClient,
  userId?: string
): Promise<{ tier: SubscriptionTier; role: UserRole }> {
  if (!userId) {
    return { tier: 'free', role: 'user' };
  }

  try {
    // 1. Fetch user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tier, role')
      .eq('id', userId)
      .single();

    let userRole: UserRole = 'user';
    if (!profileError && profile) {
      if (profile.role === 'admin') userRole = 'admin';
      else if (profile.role === 'staff' || profile.role === 'instructor') userRole = 'staff';
      else userRole = 'user';

      // Superadmins and staff always have VIP tier
      if (userRole === 'admin' || userRole === 'staff') {
        return { tier: 'vip', role: userRole };
      }
    }

    // 2. Check public.enrollments for verified completed payment orders
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('plan, payment_status')
      .eq('user_id', userId)
      .eq('payment_status', 'completed');

    if (!enrollError && enrollments && enrollments.length > 0) {
      // Find highest tier paid for
      let highestTier: SubscriptionTier = 'free';
      for (const item of enrollments) {
        const plan = item.plan as SubscriptionTier;
        if (plan && TIER_LEVELS[plan] > TIER_LEVELS[highestTier]) {
          highestTier = plan;
        }
      }

      if (highestTier !== 'free') {
        return { tier: highestTier, role: userRole };
      }
    }

    // 3. If admin manually set profile tier to basic/pro/vip in /admin/users
    if (profile?.tier && profile.tier !== 'free') {
      const pTier = profile.tier as SubscriptionTier;
      if (pTier in TIER_LEVELS) {
        return { tier: pTier, role: userRole };
      }
    }

    // 4. Default: Strictly FREE tier for normal users with no verified payment
    return { tier: 'free', role: userRole };
  } catch (err) {
    console.warn('Could not verify user entitlement from Supabase:', err);
    return { tier: 'free', role: 'user' };
  }
}

