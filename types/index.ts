export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'vip';
export type UserRole = 'user' | 'staff' | 'admin';

export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  tier?: SubscriptionTier;
  role?: UserRole;
  enrolledAt?: string;
}

export type TicketStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'general' | 'course_content' | 'technical' | 'billing' | 'mentorship';

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  user_email?: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to?: string;
  admin_note?: string;
  created_at: string;
  updated_at?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id?: string;
  sender_name: string;
  sender_role: UserRole;
  message: string;
  created_at: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'rejected';

export interface EnrollmentOrder {
  id: string;
  user_id: string;
  plan: 'basic' | 'pro' | 'vip';
  amount_paid: number;
  payment_method: string;
  payment_status: PaymentStatus;
  slip_url?: string;
  admin_note?: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  current_tier?: SubscriptionTier;
}

export interface PlanDetail {
  id: 'basic' | 'pro' | 'vip';
  name: string;
  badge?: string;
  subtitle: string;
  originalPrice: number;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface PreviewEpisode {
  ep: number;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  youtubeId?: string;
  thumbnail?: string;
  topic?: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  category: string;
  icon: string;
  outcome: string;
}

export interface CurriculumWeek {
  week: number;
  title: string;
  subtitle: string;
  topics: string[];
  projectTag?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StudentReview {
  id?: string;
  name: string;
  role: string;
  company?: string;
  avatarText?: string;
  review: string;
  rating: number;
  batch?: string;
  course_tier?: string;
  created_at?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isFreePreview?: boolean;
}

export interface CourseResource {
  id: string;
  title: string;
  url: string;
  type: 'github' | 'pdf' | 'zip' | 'link';
  description?: string;
  fileSize?: string;
}

export interface CourseItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: 'free-starter' | 'foundations' | 'fullstack' | 'ai-agents' | 'enterprise';
  categoryLabel: string;
  minTier: 'free' | 'basic' | 'pro' | 'vip';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  totalLessons: number;
  totalDuration: string;
  rating: number;
  studentsCount: number;
  thumbnail: string;
  badge?: string;
  description: string;
  learningOutcomes: string[];
  lessons: CourseLesson[];
  status?: 'published' | 'draft' | 'archived';
  githubUrl?: string;
  resources?: CourseResource[];
}
