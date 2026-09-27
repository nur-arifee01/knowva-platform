'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { SubscriptionTier, CourseItem, CourseLesson } from '@/types';
import { COURSES_DATA, COURSE_CATEGORIES, TIER_BENEFITS } from '@/lib/coursesData';
import { canAccessCourse } from '@/lib/auth/entitlements';
import { formatYouTubeEmbedUrl } from '@/lib/utils';
import {
  Search,
  Lock,
  Unlock,
  Play,
  CheckCircle2,
  Sparkles,
  Crown,
  Layers,
  Gift,
  Shield,
  Clock,
  BookOpen,
  Star,
  Users,
  ChevronRight,
  X,
  ExternalLink,
  Flame,
  ArrowRight,
  Check,
  AlertCircle,
  FolderDown,
  FileText,
  Download,
  Copy,
  Trash2,
  FileCode
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, userRole, isAdmin, isStaff, setUserTier, openEnrollModal, showToast, supabase } = useApp();

  const userTier: SubscriptionTier = currentUser?.tier || 'free';
  const tierConfig = TIER_BENEFITS[userTier] || TIER_BENEFITS.free;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [activeCoursePlayer, setActiveCoursePlayer] = useState<CourseItem | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  const [activeUpsellCourse, setActiveUpsellCourse] = useState<CourseItem | null>(null);
  const [coursesList, setCoursesList] = useState<CourseItem[]>(COURSES_DATA);

  // Player Tabs & Personal Notes State
  const [playerActiveTab, setPlayerActiveTab] = useState<'overview' | 'resources' | 'notes'>('overview');
  const [studentNote, setStudentNote] = useState<string>('');
  const [noteSaveStatus, setNoteSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Load course notes when activeCoursePlayer changes
  useEffect(() => {
    if (activeCoursePlayer) {
      setPlayerActiveTab('overview');
      if (typeof window !== 'undefined') {
        const noteKey = `knowva_notes_${currentUser?.id || 'guest'}_${activeCoursePlayer.id}`;
        const saved = localStorage.getItem(noteKey) || '';
        setStudentNote(saved);
        setNoteSaveStatus('saved');
      }
    }
  }, [activeCoursePlayer, currentUser?.id]);

  const handleNoteChange = (text: string) => {
    setStudentNote(text);
    setNoteSaveStatus('saving');
    if (typeof window !== 'undefined' && activeCoursePlayer) {
      const noteKey = `knowva_notes_${currentUser?.id || 'guest'}_${activeCoursePlayer.id}`;
      localStorage.setItem(noteKey, text);
      setTimeout(() => {
        setNoteSaveStatus('saved');
      }, 350);
    }
  };

  const handleCopyNote = () => {
    if (!studentNote) return;
    navigator.clipboard.writeText(studentNote);
    showToast('📋 คัดลอกเนื้อหาโน้ตเรียบร้อยแล้ว');
  };

  const handleDownloadNote = () => {
    if (!studentNote || !activeCoursePlayer) return;
    const element = document.createElement('a');
    const file = new Blob([studentNote], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `knowva-notes-${activeCoursePlayer.slug || activeCoursePlayer.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('💾 ดาวน์โหลดไฟล์โน้ตเรียบร้อยแล้ว');
  };

  const handleClearNote = () => {
    if (!studentNote) return;
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างโน้ตของคอร์สนี้ทั้งหมด?')) {
      setStudentNote('');
      if (typeof window !== 'undefined' && activeCoursePlayer) {
        const noteKey = `knowva_notes_${currentUser?.id || 'guest'}_${activeCoursePlayer.id}`;
        localStorage.removeItem(noteKey);
      }
      showToast('🗑️ ล้างโน้ตเรียบร้อยแล้ว');
    }
  };

  const handleDownloadResource = (type: 'slides' | 'cheatsheet' | 'assets') => {
    if (!activeCoursePlayer) return;

    if (type === 'slides' || type === 'cheatsheet') {
      const isSlides = type === 'slides';
      const content = `# 📚 ${activeCoursePlayer.title}
## 📑 ${isSlides ? 'เอกสารสรุปเนื้อหาหลักสูตร (Study & Architecture Guide)' : 'Cheat Sheet & สรุปคำสั่งสำคัญ (Quick Reference)'}
สถาบัน: KNOWVA Academy
ระดับหลักสูตร: ${activeCoursePlayer.categoryLabel || activeCoursePlayer.category} (${activeCoursePlayer.level})
ความยาว: ${activeCoursePlayer.totalDuration} (${activeCoursePlayer.totalLessons} บทเรียน)

==================================================
🎯 สิ่งที่คุณจะได้เรียนรู้และผลลัพธ์ (Learning Outcomes):
${activeCoursePlayer.learningOutcomes.map((o, idx) => `${idx + 1}. ${o}`).join('\n')}

==================================================
📋 รายละเอียดบทเรียนทั้งหมด:
${activeCoursePlayer.lessons.map((l, idx) => `บทที่ ${idx + 1}: ${l.title} (${l.duration})`).join('\n')}

==================================================
🔗 แหล่งข้อมูลอ้างอิงและ Official Documentation:
- GitHub Starter: ${activeCoursePlayer.githubUrl || `https://github.com/knowva-academy/${activeCoursePlayer.slug || activeCoursePlayer.id}`}
- KNOWVA Community: https://knowva.ac
- วันที่สร้างเอกสาร: ${new Date().toLocaleDateString('th-TH')}
`;
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const element = document.createElement('a');
      element.href = URL.createObjectURL(blob);
      element.download = `${activeCoursePlayer.slug || activeCoursePlayer.id}-${isSlides ? 'summary-guide' : 'cheat-sheet'}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      showToast(`📥 ดาวน์โหลด ${isSlides ? 'เอกสารสรุปเนื้อหา' : 'Cheat Sheet'} เรียบร้อยแล้ว`);
    } else {
      const targetUrl = activeCoursePlayer.githubUrl || `https://github.com/knowva-academy/${activeCoursePlayer.slug || activeCoursePlayer.id}`;
      window.open(targetUrl, '_blank');
      showToast('📦 กำลังเปิดหน้า GitHub Starter Assets & Template...');
    }
  };

  // Sync courses with Supabase in real-time
  useEffect(() => {
    const fetchDBCourses = async () => {
      try {
        const { data } = await supabase.from('courses').select('*');
        const dbMap = new Map((data || []).map((d: any) => [d.id, d]));

        // Merge default COURSES_DATA with Supabase records
        const merged: CourseItem[] = COURSES_DATA.map((defCourse) => {
          const dbRecord = dbMap.get(defCourse.id);
          if (dbRecord) {
            dbMap.delete(defCourse.id);
            return {
              ...defCourse,
              title: dbRecord.title || defCourse.title,
              subtitle: dbRecord.subtitle || defCourse.subtitle,
              description: dbRecord.description || defCourse.description,
              minTier: (dbRecord.min_tier as any) || defCourse.minTier,
              category: (dbRecord.category as any) || defCourse.category,
              categoryLabel: (dbRecord.category || defCourse.category).toUpperCase(),
              totalLessons: dbRecord.lesson_count || defCourse.totalLessons,
              totalDuration: dbRecord.hours_total ? `${dbRecord.hours_total} ชั่วโมง` : defCourse.totalDuration,
              status: dbRecord.status || 'published',
              thumbnail: dbRecord.thumbnail_url || defCourse.thumbnail,
            };
          }
          return { ...defCourse, status: 'published' };
        });

        // Append any brand new courses created in DB
        dbMap.forEach((dbRecord: any) => {
          merged.push({
            id: dbRecord.id,
            title: dbRecord.title,
            slug: dbRecord.id,
            subtitle: dbRecord.subtitle || '',
            category: (dbRecord.category as any) || 'fullstack',
            categoryLabel: (dbRecord.category || 'fullstack').toUpperCase(),
            minTier: (dbRecord.min_tier as any) || 'basic',
            level: 'Intermediate',
            totalLessons: dbRecord.lesson_count || 10,
            totalDuration: `${dbRecord.hours_total || 8} ชั่วโมง`,
            rating: 5.0,
            studentsCount: 100,
            thumbnail: dbRecord.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
            description: dbRecord.description || '',
            learningOutcomes: ['เข้าใจโครงสร้างสถาปัตยกรรมระดับองค์กร'],
            lessons: [
              { id: '1', title: 'บทนำและภาพรวมระบบ', duration: '15:00', videoUrl: 'https://www.youtube-nocookie.com/embed/zJSY8tbf_ys?autoplay=1&rel=0' },
            ],
            status: dbRecord.status || 'published',
          });
        });

        setCoursesList(merged);
      } catch {
        // Fallback to COURSES_DATA
      }
    };
    fetchDBCourses();
  }, [supabase]);

  // Load completed lessons from Supabase if logged in
  useEffect(() => {
    if (!currentUser?.id) return;
    const loadProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('lesson_id, is_completed')
          .eq('user_id', currentUser.id);
        if (data && !error) {
          const map: Record<string, boolean> = {};
          data.forEach((row: any) => {
            map[row.lesson_id] = row.is_completed;
          });
          setCompletedLessons(map);
        }
      } catch {
        // graceful fallback if table not yet created
      }
    };
    loadProgress();
  }, [currentUser?.id, supabase]);

  // Check if course is accessible for current tier and role
  const isCourseUnlocked = (course: CourseItem) => {
    return canAccessCourse(userTier, course.minTier, userRole);
  };

  // Filtered courses (Hides draft/archived courses from user view!)
  const filteredCourses = useMemo(() => {
    return coursesList.filter((course) => {
      // Exclude courses that are hidden or in draft status by Admin
      if (course.status === 'draft' || course.status === 'archived') {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && course.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = course.title.toLowerCase().includes(query);
        const matchDesc = course.description.toLowerCase().includes(query);
        const matchSubtitle = course.subtitle.toLowerCase().includes(query);
        return matchTitle || matchDesc || matchSubtitle;
      }
      return true;
    });
  }, [coursesList, selectedCategory, searchQuery]);

  // Unlocked courses count for current user tier (excluding hidden/drafts)
  const unlockedCount = useMemo(() => {
    return coursesList.filter(
      (c) => c.status !== 'draft' && c.status !== 'archived' && canAccessCourse(userTier, c.minTier, userRole)
    ).length;
  }, [coursesList, userTier, userRole]);

  // Handle click on a course card (resolves custom lessons if edited by Admin)
  const handleCourseClick = (course: CourseItem) => {
    let resolvedCourse = course;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`knowva_lessons_${course.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            resolvedCourse = { ...course, lessons: parsed };
          }
        } catch {}
      }
    }

    if (isCourseUnlocked(resolvedCourse)) {
      setActiveCoursePlayer(resolvedCourse);
      setActiveLessonIndex(0);
    } else {
      setActiveUpsellCourse(resolvedCourse);
    }
  };

  // Toggle lesson complete with Supabase synchronization
  const toggleLessonComplete = async (lessonId: string) => {
    const nextState = !completedLessons[lessonId];
    setCompletedLessons((prev) => {
      const updated = { ...prev, [lessonId]: nextState };
      if (nextState) {
        showToast('🎉 บันทึกการเรียนจบบทเรียนนี้แล้ว!');
      }
      return updated;
    });

    if (currentUser?.id) {
      try {
        await supabase
          .from('lesson_progress')
          .upsert(
            {
              user_id: currentUser.id,
              lesson_id: lessonId,
              is_completed: nextState,
              completed_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,lesson_id' }
          );
      } catch (err) {
        console.error('Save lesson progress error:', err);
      }
    }
  };

  // Switch tier simulator
  const handleSimulateTier = (tier: SubscriptionTier) => {
    setUserTier(tier);
    showToast(`⚡ ปรับระดับสิทธิ์จำลองเป็น: ${tier.toUpperCase()}`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* ========================================================================= */}
      {/* 1. TIER SIMULATOR TOOLBAR (Staff/Admin Dev Preview Only)                  */}
      {/* ========================================================================= */}
      {(isAdmin || isStaff) && (
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-900">
                  Tier Simulator (โหมดทดสอบระดับสิทธิ์เฉพาะแอดมิน)
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono font-bold">
                  Admin Preview
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                คลิกสลับระดับสมาชิกเพื่อทดสอบการล็อก/ปลดล็อกคอร์สในมุมมองผู้เรียนระดับต่างๆ
              </p>
            </div>
          </div>

          {/* Tier Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { tier: 'free', label: '1. ทั่วไป (Free)', hint: '5 คอร์สฟรี' },
                { tier: 'basic', label: '2. Basic', hint: '10 คอร์ส' },
                { tier: 'pro', label: '3. Pro Cohort', hint: '15 คอร์ส (แนะนำ)' },
                { tier: 'vip', label: '4. VIP Mentorship', hint: '20 คอร์ส (ทั้งหมด)' },
              ] as const
            ).map((item) => {
              const isActive = userTier === item.tier;
              return (
                <button
                  key={item.tier}
                  onClick={() => handleSimulateTier(item.tier)}
                  className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-zinc-950 text-white shadow-md ring-2 ring-zinc-950 ring-offset-2'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
                  }`}
                >
                  {item.tier === 'vip' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                  {item.tier === 'pro' && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                  {item.tier === 'basic' && <Layers className="w-3.5 h-3.5 text-blue-400" />}
                  {item.tier === 'free' && <Shield className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{item.label}</span>
                  <span className={`text-[10px] ml-1 font-normal opacity-75`}>
                    ({item.hint})
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. WELCOME BANNER & LEARNING STATS                                       */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-6 sm:p-8 border border-zinc-800 shadow-xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>KNOWVA Learning Management System</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              ยินดีต้อนรับ,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                {currentUser?.name || 'Developer'}
              </span>
            </h1>

            <p className="text-sm text-zinc-300 leading-relaxed">
              {tierConfig.description}. คุณกำลังเข้าถึงคลังหลักสูตรระดับโปรดักชัน เพื่อยกระดับสู่ Full-Stack AI Engineer
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-medium text-zinc-400">ระดับสิทธิ์ปัจจุบัน:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold uppercase border ${tierConfig.badgeColor}`}
              >
                {userTier === 'vip' && <Crown className="w-3.5 h-3.5" />}
                {userTier === 'pro' && <Sparkles className="w-3.5 h-3.5" />}
                {userTier === 'basic' && <Layers className="w-3.5 h-3.5" />}
                {userTier === 'free' && <Shield className="w-3.5 h-3.5" />}
                <span>{tierConfig.label}</span>
              </span>

              {userTier !== 'vip' && (
                <button
                  onClick={() => openEnrollModal(userTier === 'basic' ? 'pro' : 'vip')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition underline underline-offset-4"
                >
                  <span>ต้องการปลดล็อกทุกคอร์ส? อัปเกรดแพ็กเกจ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4 flex-shrink-0">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-medium">คอร์สที่เข้าเรียนได้</span>
              </div>
              <div className="text-2xl font-black text-white">
                {unlockedCount}{' '}
                <span className="text-sm font-normal text-zinc-400">/ {coursesList.length}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">เนื้อหาทั้งหมด</span>
              </div>
              <div className="text-2xl font-black text-white">
                120+ <span className="text-sm font-normal text-zinc-400">ชั่วโมง</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-xs font-medium">สถานะผู้เรียน</span>
              </div>
              <div className="text-lg font-bold text-white capitalize">
                {userTier === 'vip' ? 'VIP All-Access' : userTier === 'pro' ? 'Pro Member' : userTier === 'basic' ? 'Basic Member' : 'Free Member'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEARCH & CATEGORY FILTER TABS                                         */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <span>คลังหลักสูตรทั้งหมด</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                {filteredCourses.length} คอร์ส
              </span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              เลือกดูตามหมวดหมู่ หรือพิมพ์ค้นหาเนื้อหาที่คุณสนใจ
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อคอร์ส, เทคโนโลยี..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {COURSE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? COURSES_DATA.length
                : COURSES_DATA.filter((c) => c.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COURSE CARDS GRID                                                     */}
      {/* ========================================================================= */}
      <section>
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center max-w-md mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-zinc-300 mx-auto" />
            <h3 className="text-base font-bold text-zinc-900">ไม่พบคอร์สที่ตรงกับการค้นหา</h3>
            <p className="text-xs text-zinc-500">
              ลองพิมพ์คำค้นหาอื่น หรือคลิกหมวดหมู่ &quot;ทั้งหมด&quot; เพื่อดูหลักสูตรทั้งหมดที่มี
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn btn-secondary text-xs py-2 px-4"
            >
              ล้างตัวกรอง
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const unlocked = isCourseUnlocked(course);

              return (
                <div
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative ${
                    unlocked
                      ? 'border-zinc-200 hover:border-zinc-400 hover:shadow-xl'
                      : 'border-zinc-200/80 bg-zinc-50/50 hover:border-amber-300/80'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        !unlocked ? 'opacity-50 grayscale-[40%]' : ''
                      }`}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      {/* Tier requirement badge */}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 ${
                          course.minTier === 'vip'
                            ? 'bg-amber-500 text-white'
                            : course.minTier === 'pro'
                            ? 'bg-emerald-600 text-white'
                            : course.minTier === 'basic'
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-800 text-zinc-100'
                        }`}
                      >
                        {course.minTier === 'vip' && <Crown className="w-3 h-3" />}
                        {course.minTier === 'pro' && <Sparkles className="w-3 h-3" />}
                        {course.minTier === 'basic' && <Layers className="w-3 h-3" />}
                        {course.minTier === 'free' && <Gift className="w-3 h-3 text-emerald-400" />}
                        <span>{course.minTier === 'free' ? 'FREE COURSE' : `${course.minTier.toUpperCase()} TIER`}</span>
                      </span>

                      {/* Course badge (e.g., Bestseller, ยอดนิยม) */}
                      {course.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-zinc-900 backdrop-blur-sm">
                          {course.badge}
                        </span>
                      )}
                    </div>

                    {/* Play/Lock Center Icon Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {unlocked ? (
                        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg transform transition group-hover:scale-110">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-zinc-900/90 text-amber-400 border border-amber-400/30 flex items-center justify-center shadow-lg">
                          <Lock className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Metadata in Thumbnail */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <Clock className="w-3.5 h-3.5" />
                        {course.totalDuration}
                      </span>
                      <span className="flex items-center gap-1 text-zinc-300">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.totalLessons} บทเรียน
                      </span>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {course.categoryLabel}
                        </span>
                        <span className="text-zinc-500 font-medium">
                          ระดับ: {course.level}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-zinc-950 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {course.subtitle}
                      </p>
                    </div>

                    {/* Rating & Action Footer */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-zinc-900">{course.rating}</span>
                        <span className="text-zinc-400">({course.studentsCount})</span>
                      </div>

                      {/* State Button */}
                      {unlocked ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                          <span>เข้าเรียน</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          <Lock className="w-3 h-3" />
                          <span>ต้องใช้แพ็กเกจ {course.minTier.toUpperCase()}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. COURSE VIDEO PLAYER MODAL (For Unlocked Courses)                       */}
      {/* ========================================================================= */}
      {activeCoursePlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/80 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveCoursePlayer(null);
          }}
        >
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
            
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 line-clamp-1">
                    {activeCoursePlayer.title}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    บทที่ {activeLessonIndex + 1} จาก {activeCoursePlayer.lessons.length}:{' '}
                    {activeCoursePlayer.lessons[activeLessonIndex]?.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveCoursePlayer(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns on desktop (Video left, Playlist right) */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
              
              {/* Left Column: Video Player & Description (2 cols) */}
              <div className="lg:col-span-2 p-5 sm:p-6 space-y-4 border-b lg:border-b-0 lg:border-r border-zinc-200">
                {/* 16:9 Video Frame with Entitlement Guard */}
                {!canAccessCourse(userTier, activeCoursePlayer.minTier, userRole) ? (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center shadow-lg border border-zinc-800">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                      <Lock className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                      {activeCoursePlayer.minTier.toUpperCase()} Required
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                      เนื้อหานี้ถูกล็อกสำหรับสมาชิก {activeCoursePlayer.minTier.toUpperCase()}
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-md mb-4 leading-relaxed">
                      คุณต้องมีแพ็กเกจระดับ {activeCoursePlayer.minTier.toUpperCase()} ขึ้นไปที่ผ่านการชำระเงินเรียบร้อยแล้วจึงจะสามารถรับชมวิดีโอนี้ได้
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const targetCourse = activeCoursePlayer;
                        setActiveCoursePlayer(null);
                        setActiveUpsellCourse(targetCourse);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-md flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>อัปเกรดเพื่อปลดล็อกบทเรียนทันที</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                    <iframe
                      src={formatYouTubeEmbedUrl(activeCoursePlayer.lessons[activeLessonIndex]?.videoUrl)}
                      title={activeCoursePlayer.lessons[activeLessonIndex]?.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Lesson Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div>
                    <h4 className="text-base font-bold text-zinc-900">
                      {activeCoursePlayer.lessons[activeLessonIndex]?.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                      <span>ความยาว: {activeCoursePlayer.lessons[activeLessonIndex]?.duration}</span>
                      <span>•</span>
                      <span>หมวด: {activeCoursePlayer.categoryLabel}</span>
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      toggleLessonComplete(
                        activeCoursePlayer.lessons[activeLessonIndex]?.id || ''
                      )
                    }
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      completedLessons[activeCoursePlayer.lessons[activeLessonIndex]?.id || '']
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-zinc-900 hover:bg-black text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {completedLessons[activeCoursePlayer.lessons[activeLessonIndex]?.id || '']
                        ? 'เรียนจบแล้ว (เสร็จสิ้น)'
                        : 'ทำเครื่องหมายว่าเรียนแล้ว'}
                    </span>
                  </button>
                </div>

                {/* 3 Player Tabs: Overview | Resources & Downloads | Personal Notes */}
                <div className="pt-4 border-t border-zinc-100 space-y-4">
                  <div className="flex items-center gap-1.5 p-1 bg-zinc-100/90 rounded-2xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setPlayerActiveTab('overview')}
                      className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                        playerActiveTab === 'overview'
                          ? 'bg-white text-zinc-950 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>ภาพรวมบทเรียน</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlayerActiveTab('resources')}
                      className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                        playerActiveTab === 'resources'
                          ? 'bg-white text-zinc-950 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span>เอกสาร & Code</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlayerActiveTab('notes')}
                      className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                        playerActiveTab === 'notes'
                          ? 'bg-white text-zinc-950 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>สมุดโน้ตส่วนตัว</span>
                      {studentNote.trim().length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </button>
                  </div>

                  {/* TAB 1: OVERVIEW */}
                  {playerActiveTab === 'overview' && (
                    <div className="space-y-3 animate-fade-in">
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        {activeCoursePlayer.description}
                      </p>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 pt-1">
                        สิ่งที่คุณจะได้เรียนรู้จากคอร์สนี้
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCoursePlayer.learningOutcomes.map((outcome, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-700"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: RESOURCES & CODE DOWNLOADS */}
                  {playerActiveTab === 'resources' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-800">
                          ไฟล์ประกอบการเรียนและ Source Code ประจำคอร์ส
                        </span>
                        <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          พร้อมดาวน์โหลด
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* GitHub Repo */}
                        <a
                          href={activeCoursePlayer.githubUrl || `https://github.com/knowva-academy/${activeCoursePlayer.slug || activeCoursePlayer.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition flex items-start justify-between gap-3 group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0">
                              <FileCode className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-zinc-900 text-xs group-hover:text-emerald-700 transition">
                                  GitHub Repository
                                </span>
                                <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700" />
                              </div>
                              <p className="text-[11px] text-zinc-500 mt-0.5">
                                Starter code และเฉลย Workshop ประจำบทเรียน
                              </p>
                            </div>
                          </div>
                        </a>

                        {/* Slides PDF / Study Guide */}
                        <button
                          type="button"
                          onClick={() => handleDownloadResource('slides')}
                          className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition flex items-start justify-between gap-3 group text-left w-full cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                              <Download className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-zinc-900 text-xs group-hover:text-red-700 transition">
                                  เอกสารสรุปเนื้อหาหลักสูตร
                                </span>
                                <span className="text-[10px] text-zinc-400 bg-zinc-200/60 px-1.5 py-0.2 rounded font-mono">MD/PDF</span>
                              </div>
                              <p className="text-[11px] text-zinc-500 mt-0.5">
                                ไดอะแกรม สถาปัตยกรรม และหัวข้อสำคัญ
                              </p>
                            </div>
                          </div>
                        </button>

                        {/* Cheat Sheet */}
                        <button
                          type="button"
                          onClick={() => handleDownloadResource('cheatsheet')}
                          className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition flex items-start justify-between gap-3 group text-left w-full cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-zinc-900 text-xs group-hover:text-blue-700 transition">
                                  Cheat Sheet & คำสั่งสำคัญ
                                </span>
                                <span className="text-[10px] text-zinc-400 bg-zinc-200/60 px-1.5 py-0.2 rounded font-mono">QuickRef</span>
                              </div>
                              <p className="text-[11px] text-zinc-500 mt-0.5">
                                สรุป Syntax คำสั่งลัดและ Snippets สำหรับใช้งานจริง
                              </p>
                            </div>
                          </div>
                        </button>

                        {/* Starter Assets Pack */}
                        <button
                          type="button"
                          onClick={() => handleDownloadResource('assets')}
                          className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition flex items-start justify-between gap-3 group text-left w-full cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                              <FolderDown className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-zinc-900 text-xs group-hover:text-emerald-800 transition">
                                  Starter Assets & Repo Template
                                </span>
                                <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700" />
                              </div>
                              <p className="text-[11px] text-zinc-500 mt-0.5">
                                โค้ดตั้งต้น เทมเพลต และ Mock data สำหรับเริ่มโปรเจกต์
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PERSONAL NOTES (AUTO-SAVED) */}
                  {playerActiveTab === 'notes' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900">
                            สมุดจดบันทึกส่วนตัวประจำคอร์สนี้
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 flex items-center gap-1">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                noteSaveStatus === 'saving'
                                  ? 'bg-amber-500 animate-pulse'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            <span>{noteSaveStatus === 'saving' ? 'กำลังบันทึก...' : 'บันทึกอัตโนมัติแล้ว'}</span>
                          </span>
                        </div>

                        {/* Note Toolbar buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleCopyNote}
                            disabled={!studentNote}
                            title="คัดลอกข้อความในโน้ต"
                            className="py-1 px-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[11px] font-semibold text-zinc-700 transition flex items-center gap-1 disabled:opacity-40"
                          >
                            <Copy className="w-3 h-3" />
                            <span>คัดลอก</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDownloadNote}
                            disabled={!studentNote}
                            title="ดาวน์โหลดเก็บเป็นไฟล์ .txt"
                            className="py-1 px-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[11px] font-semibold text-zinc-700 transition flex items-center gap-1 disabled:opacity-40"
                          >
                            <Download className="w-3 h-3" />
                            <span>ดาวน์โหลด .txt</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleClearNote}
                            disabled={!studentNote}
                            title="ล้างโน้ตทั้งหมด"
                            className="p-1 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          rows={6}
                          value={studentNote}
                          onChange={(e) => handleNoteChange(e.target.value)}
                          placeholder="พิมพ์จดบันทึกเนื้อหาสำคัญ สูตรโค้ด ไดอะแกรม หรือสิ่งที่ต้องจำระหว่างเรียนที่นี่... (ระบบจะบันทึกอัตโนมัติ ไม่ต้องกลัวข้อความหาย)"
                          className="w-full p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 leading-relaxed font-sans"
                        />
                        <div className="flex justify-between items-center px-1 text-[10px] text-zinc-400">
                          <span>โน้ตจะถูกผูกกับคอร์สนี้โดยเฉพาะ เปิดดูได้ตลอดเวลา</span>
                          <span>{studentNote.length} ตัวอักษร</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Playlist */}
              <div className="p-5 sm:p-6 bg-zinc-50/60 flex flex-col space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                    รายการบทเรียน ({activeCoursePlayer.lessons.length} ตอน)
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    รวม {activeCoursePlayer.totalDuration}
                  </span>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[480px] pr-1">
                  {activeCoursePlayer.lessons.map((lesson, idx) => {
                    const isSelected = activeLessonIndex === idx;
                    const isDone = completedLessons[lesson.id];

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLessonIndex(idx)}
                        className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 text-xs ${
                          isSelected
                            ? 'bg-zinc-950 text-white shadow-sm'
                            : 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : isSelected
                                ? 'bg-zinc-800 text-white'
                                : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </span>
                          <span className="font-medium line-clamp-2 text-left">
                            {lesson.title}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-mono flex-shrink-0 ${
                            isSelected ? 'text-zinc-300' : 'text-zinc-400'
                          }`}
                        >
                          {lesson.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. UPSELL MODAL (When clicking locked courses)                            */}
      {/* ========================================================================= */}
      {activeUpsellCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/80 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveUpsellCourse(null);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden p-6 sm:p-8 text-center space-y-6 animate-scale-up">
            
            <button
              onClick={() => setActiveUpsellCourse(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lock Icon Header */}
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                สิทธิ์เฉพาะแพ็กเกจ {activeUpsellCourse.minTier.toUpperCase()} ขึ้นไป
              </span>
              <h3 className="text-xl font-bold text-zinc-950 pt-1">
                ปลดล็อกหลักสูตร &quot;{activeUpsellCourse.title}&quot;
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-md mx-auto">
                คอร์สนี้ถูกสงวนไว้สำหรับสมาชิกในระดับ{' '}
                <strong className="text-zinc-900 capitalize font-bold">
                  {activeUpsellCourse.minTier === 'vip' ? 'VIP Mentorship' : 'Pro Cohort'}
                </strong>{' '}
                เนื่องจากเป็นเนื้อหาขั้นสูงและระบบโปรดักชันจริง
              </p>
            </div>

            {/* Benefit Preview Box */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-left space-y-2.5 text-xs text-zinc-700">
              <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>สิ่งที่คุณจะได้รับเมื่ออัปเกรดเป็น {activeUpsellCourse.minTier.toUpperCase()}:</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>เข้าถึงคอร์สนี้เต็มรูปแบบ {activeUpsellCourse.totalDuration} ({activeUpsellCourse.totalLessons} บทเรียน)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>ดาวน์โหลด Source Code และ Production Boilerplate ครบชุด</span>
                </li>
                {activeUpsellCourse.minTier === 'vip' ? (
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>นัดหมาย 1-on-1 Code Review และ Career Advisory กับผู้สอน</span>
                  </li>
                ) : (
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>เข้าห้องเรียนสดประจำสัปดาห์ (Live Cohort Q&A)</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  const targetTier = activeUpsellCourse.minTier === 'free' ? 'basic' : activeUpsellCourse.minTier;
                  setActiveUpsellCourse(null);
                  openEnrollModal(targetTier);
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-zinc-950 hover:bg-black text-white font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                <span>อัปเกรดเป็นแพ็กเกจ {activeUpsellCourse.minTier.toUpperCase()} ตอนนี้</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {(isAdmin || isStaff) && (
                <button
                  type="button"
                  onClick={() => {
                    // Direct simulation upgrade option for demonstration (Admin/Staff only)
                    handleSimulateTier(activeUpsellCourse.minTier);
                    setActiveUpsellCourse(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-amber-700 hover:text-amber-800 bg-amber-50 border border-amber-200 transition"
                >
                  ⚡ [Admin Only] ทดสอบปลดล็อกทันทีด้วยสิทธิ์จำลอง ({activeUpsellCourse.minTier.toUpperCase()})
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

