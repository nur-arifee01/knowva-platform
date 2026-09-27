-- =========================================================================
-- KNOWVA Academy: Supabase Database Schema & RLS Setup
-- Includes: Profiles (RBAC: user/staff/admin), Enrollments, Lesson Progress,
-- Reviews, Support Tickets & Messages, Courses, and Instructors Management.
-- Project URL: https://supabase.com/dashboard/project/iewdobuvoauyajpsgsoh/sql/new
-- =========================================================================

-- 1. Create Profiles table linked with Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'pro', 'vip')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'staff', 'admin', 'student', 'instructor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upgrade existing constraint if table already exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'staff', 'admin', 'student', 'instructor'));
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

-- 2. Trigger function to auto-create profile when a user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, tier, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'free',
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Helper Functions for RBAC verification
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('staff', 'admin', 'instructor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create Enrollments history table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  amount_paid NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'promptpay',
  payment_status TEXT DEFAULT 'completed',
  slip_url TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Lesson Progress table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 6. Create Support Tickets table (แจ้งปัญหา / ติดต่อประสานงาน)
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'course_content', 'technical', 'billing', 'mentorship')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Support Ticket Messages table (ข้อความพูดคุย/ตอบกลับในแต่ละ Ticket)
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT DEFAULT 'user' CHECK (sender_role IN ('user', 'staff', 'admin', 'student', 'instructor')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Courses table (สำหรับระบบจัดการคอร์สเรียนหลังบ้าน)
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  min_tier TEXT DEFAULT 'basic' CHECK (min_tier IN ('free', 'basic', 'pro', 'vip')),
  category TEXT DEFAULT 'foundations',
  week_number INTEGER DEFAULT 1,
  hours_total NUMERIC DEFAULT 10,
  lesson_count INTEGER DEFAULT 12,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Instructors table (จัดการข้อมูลผู้สอน)
CREATE TABLE IF NOT EXISTS public.instructors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  badge TEXT DEFAULT 'Instructor',
  badge_color TEXT DEFAULT 'bg-emerald-100 text-emerald-800',
  highlights TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_role TEXT DEFAULT 'ผู้เรียน KNOWVA',
  company TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  batch TEXT DEFAULT 'รุ่นที่ 8',
  course_tier TEXT DEFAULT 'pro',
  avatar_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- Enable Row Level Security (RLS) on all tables
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- RLS Policies
-- =========================================================================

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Enrollments Policies (User sees own, Staff/Admin sees all)
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.enrollments;
CREATE POLICY "Users can view own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Users can insert own enrollment" ON public.enrollments;
CREATE POLICY "Users can insert own enrollment" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Staff or Admin can update enrollments" ON public.enrollments;
CREATE POLICY "Staff or Admin can update enrollments" ON public.enrollments
  FOR UPDATE USING (public.is_staff_or_admin());

-- Lesson Progress Policies
DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Users can manage own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Support Tickets Policies
-- User: views own tickets; Staff & Admin: views all tickets
DROP POLICY IF EXISTS "View support tickets" ON public.support_tickets;
CREATE POLICY "View support tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id OR public.is_staff_or_admin());

-- Any logged-in user can submit a ticket
DROP POLICY IF EXISTS "Insert support tickets" ON public.support_tickets;
CREATE POLICY "Insert support tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_staff_or_admin());

-- Staff & Admin can update any ticket (change status, assign, note); User can update own (close ticket)
DROP POLICY IF EXISTS "Update support tickets" ON public.support_tickets;
CREATE POLICY "Update support tickets" ON public.support_tickets
  FOR UPDATE USING (auth.uid() = user_id OR public.is_staff_or_admin());

-- Admin ONLY can delete tickets
DROP POLICY IF EXISTS "Admin can delete support tickets" ON public.support_tickets;
CREATE POLICY "Admin can delete support tickets" ON public.support_tickets
  FOR DELETE USING (public.is_admin());

-- Ticket Messages Policies
-- Can view messages if owner of the ticket OR staff/admin
DROP POLICY IF EXISTS "View ticket messages" ON public.ticket_messages;
CREATE POLICY "View ticket messages" ON public.ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE public.support_tickets.id = ticket_id
      AND (public.support_tickets.user_id = auth.uid() OR public.is_staff_or_admin())
    )
  );

-- Can insert messages if owner of ticket OR staff/admin
DROP POLICY IF EXISTS "Insert ticket messages" ON public.ticket_messages;
CREATE POLICY "Insert ticket messages" ON public.ticket_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.support_tickets
      WHERE public.support_tickets.id = ticket_id
      AND (public.support_tickets.user_id = auth.uid() OR public.is_staff_or_admin())
    )
  );

-- Courses Policies (Everyone can view published, Staff/Admin can manage)
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff and Admin can manage courses" ON public.courses;
CREATE POLICY "Staff and Admin can manage courses" ON public.courses
  FOR ALL USING (public.is_staff_or_admin());

-- Instructors Policies (Everyone can view, Admin can manage)
DROP POLICY IF EXISTS "Anyone can view instructors" ON public.instructors;
CREATE POLICY "Anyone can view instructors" ON public.instructors
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage instructors" ON public.instructors;
CREATE POLICY "Admin can manage instructors" ON public.instructors
  FOR ALL USING (public.is_admin());

-- Reviews Policies
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can submit review" ON public.reviews;
CREATE POLICY "Anyone can submit review" ON public.reviews
  FOR INSERT WITH CHECK (true);
