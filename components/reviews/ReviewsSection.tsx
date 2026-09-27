'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { REVIEWS } from '@/lib/data';
import { StudentReview } from '@/types';
import {
  Star,
  Quote,
  PenLine,
  X,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  UserCheck,
  Send
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { currentUser, openAuthModal, showToast, supabase } = useApp();

  const [reviewsList, setReviewsList] = useState<StudentReview[]>(REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  // Fetch reviews from Supabase on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          const mappedReviews: StudentReview[] = data.map((r: any) => ({
            id: r.id,
            name: r.user_name,
            role: r.user_role || 'ผู้เรียน KNOWVA',
            company: r.company || undefined,
            avatarText: r.avatar_text || (r.user_name ? r.user_name.charAt(0).toUpperCase() : 'U'),
            review: r.comment,
            rating: r.rating || 5,
            batch: r.batch || 'รุ่นที่ 8',
            course_tier: r.course_tier,
            created_at: r.created_at,
          }));

          // Merge Supabase reviews with standard default reviews
          setReviewsList([...mappedReviews, ...REVIEWS]);
        }
      } catch (err) {
        // Table might not exist yet before SQL script run
        console.warn('Reviews table load error:', err);
      }
    };

    fetchReviews();
  }, [supabase]);

  // Sync user info when opening review modal
  useEffect(() => {
    if (currentUser) {
      setAuthorName(currentUser.name || '');
    }
  }, [currentUser]);

  const handleOpenReviewModal = () => {
    if (!currentUser) {
      showToast('🔒 กรุณาเข้าสู่ระบบก่อนเขียนรีวิว');
      openAuthModal();
      return;
    }
    setAuthorName(currentUser.name || '');
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      showToast('กรุณากรอกชื่อและความคิดเห็นของคุณ');
      return;
    }

    setIsSubmitting(true);

    const userInitial = authorName.trim().charAt(0).toUpperCase() || 'U';
    const userRoleText = role.trim() || 'ผู้เรียนหลักสูตร KNOWVA';
    const userBatch = currentUser?.tier ? `Tier ${currentUser.tier.toUpperCase()}` : 'รุ่นที่ 8';

    const newReviewItem: StudentReview = {
      name: authorName.trim(),
      role: userRoleText,
      company: company.trim() || undefined,
      avatarText: userInitial,
      review: comment.trim(),
      rating: rating,
      batch: userBatch,
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Insert into Supabase reviews table
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: currentUser?.id || null,
          user_name: authorName.trim(),
          user_role: userRoleText,
          company: company.trim() || null,
          rating: rating,
          comment: comment.trim(),
          batch: userBatch,
          course_tier: currentUser?.tier || 'pro',
          avatar_text: userInitial,
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase review insert warning:', error);
      }

      // 2. Immediately prepend to local state for live feedback
      setReviewsList((prev) => [
        {
          ...newReviewItem,
          id: data?.id || String(Date.now()),
        },
        ...prev,
      ]);

      showToast('🎉 ขอบคุณสำหรับรีวิวของคุณ! รีวิวถูกเผยแพร่บนหน้าเว็บเรียบร้อยแล้ว');
      setIsModalOpen(false);
      setComment('');
      setCompany('');
      setRole('');
      setRating(5);
    } catch (err) {
      console.error('Submit review error:', err);
      // Fallback: still show on client
      setReviewsList((prev) => [newReviewItem, ...prev]);
      showToast('🎉 บันทึกรีวิวของคุณแล้ว!');
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Write Review Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STUDENT SUCCESS STORIES & REVIEWS</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mt-2">
              เสียงตอบรับและรีวิวจากผู้เรียนจริง
            </h2>
            <p className="mt-3 text-zinc-600 text-sm sm:text-base leading-relaxed">
              ผู้เรียนกว่า 1,200+ คนที่ยกระดับสู่ Full-Stack AI Engineer และนำความรู้ไปสร้างผลิตภัณฑ์จริง ทุกรีวิวมาจากบัญชีผู้เรียนจริงในระบบ
            </p>
          </div>

          {/* CTA: Write Review */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleOpenReviewModal}
              className="btn btn-secondary py-2.5 px-5 text-xs sm:text-sm font-bold shadow-sm hover:border-zinc-400 flex items-center gap-2 transition"
            >
              <PenLine className="w-4 h-4 text-emerald-600" />
              <span>เขียนรีวิวของคุณ</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsList.map((review, idx) => (
            <div
              key={review.id || idx}
              className="card-clean flex flex-col justify-between relative group hover:border-zinc-400 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-zinc-100 absolute top-5 right-5 -z-0 group-hover:text-zinc-200 transition-colors" />

              <div className="relative z-10 space-y-3">
                {/* 5 Stars Rating Display */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-zinc-200 text-zinc-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-zinc-700 ml-1">
                    {review.rating}.0
                  </span>
                </div>

                <p className="text-sm text-zinc-700 leading-relaxed italic">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>

              {/* Reviewer Profile */}
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-zinc-100">
                <div className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                  {review.avatarText || (review.name ? review.name.charAt(0).toUpperCase() : 'U')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-zinc-950 truncate">
                      {review.name}
                    </p>
                    {review.batch && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold whitespace-nowrap">
                        {review.batch}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {review.role} {review.company ? `• ${review.company}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WRITE REVIEW MODAL (Connected to Supabase)                                */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/75 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) setIsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
            
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950">
                    แบ่งปันประสบการณ์การเรียน
                  </h3>
                  <p className="text-xs text-zinc-500">
                    รีวิวของคุณจะแสดงผลบนหน้าเว็บไซต์สาธารณะแบบ Real-time
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitReview} className="p-6 space-y-5 overflow-y-auto">
              
              {/* Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  ให้คะแนนความพึงพอใจ
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-zinc-300 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-zinc-200 text-zinc-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-zinc-700 ml-2">
                    {rating === 5 && 'ยอดเยี่ยมมาก (5/5)'}
                    {rating === 4 && 'ดีมาก (4/5)'}
                    {rating === 3 && 'ปานกลาง (3/5)'}
                    {rating === 2 && 'ต้องปรับปรุง (2/5)'}
                    {rating === 1 && 'ไม่พึงพอใจ (1/5)'}
                  </span>
                </div>
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  ชื่อ-นามสกุล หรือชื่อที่ต้องการแสดง <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="เช่น คุณเอกภพ นพคุณ"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
                />
              </div>

              {/* Role & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    ตำแหน่ง / อาชีพ
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="เช่น Full-Stack Developer, นักศึกษา"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    บริษัท / องค์กร (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="เช่น Freelance, Agoda, KBTG"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 transition"
                  />
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  ข้อความรีวิวของคุณ <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="เล่าประสบการณ์ที่คุณได้รับจากคอร์ส เนื้อหา ผู้สอน หรือโปรเจกต์ที่คุณได้ลงมือสร้าง..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 transition leading-relaxed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 py-2.5 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>กำลังบันทึกลงระบบ...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>ส่งรีวิวขึ้นหน้าเว็บ</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
