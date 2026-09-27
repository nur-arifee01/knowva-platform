'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { COURSES_DATA } from '@/lib/coursesData';
import { CourseItem, CourseLesson } from '@/types';
import { formatYouTubeEmbedUrl } from '@/lib/utils';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Layers,
  Sparkles,
  Crown,
  CheckCircle2,
  X,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  Search,
  Filter,
  Video,
  PlayCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function AdminCoursesPage() {
  const { userRole, isAdmin, showToast, supabase } = useApp();
  const [courses, setCourses] = useState<CourseItem[]>(COURSES_DATA);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  // Confirmation modal for Delete / Hide
  const [courseToAction, setCourseToAction] = useState<CourseItem | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<'free-starter' | 'foundations' | 'fullstack' | 'ai-agents' | 'enterprise'>('fullstack');
  const [formMinTier, setFormMinTier] = useState<'free' | 'basic' | 'pro' | 'vip'>('pro');
  const [formDuration, setFormDuration] = useState('8 ชั่วโมง');
  const [formLessonsCount, setFormLessonsCount] = useState(10);
  const [formDesc, setFormDesc] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formLessons, setFormLessons] = useState<CourseLesson[]>([]);

  // Fetch and merge courses from Supabase
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from('courses').select('*');
      const dbMap = new Map((data || []).map((d: any) => [d.id, d]));

      // 1. Merge default COURSES_DATA with Supabase records
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

      // 2. Append any brand new courses created only in DB
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

      setCourses(merged);
    } catch (err) {
      console.warn('Fetch courses error:', err);
    }
  };

  // Open modal for Adding new course
  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('fullstack');
    setFormMinTier('pro');
    setFormDuration('8 ชั่วโมง');
    setFormLessonsCount(10);
    setFormDesc('');
    setFormThumbnail('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');
    setFormStatus('published');
    setFormLessons([
      { id: '1', title: 'บทนำและภาพรวมระบบ', duration: '15:00', videoUrl: 'https://www.youtube-nocookie.com/embed/zJSY8tbf_ys?autoplay=1&rel=0' },
      { id: '2', title: 'ลงมือพัฒนาโปรเจกต์', duration: '30:00', videoUrl: 'https://www.youtube-nocookie.com/embed/kUMe1FH4CHE?autoplay=1&rel=0' },
    ]);
    setIsModalOpen(true);
  };

  // Open modal for Editing existing course
  const handleOpenEditModal = (course: CourseItem) => {
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormSubtitle(course.subtitle);
    setFormCategory(course.category);
    setFormMinTier(course.minTier);
    setFormDuration(course.totalDuration);
    setFormLessonsCount(course.totalLessons);
    setFormDesc(course.description);
    setFormThumbnail(course.thumbnail);
    setFormStatus((course.status as any) || 'published');

    // Load lessons from localStorage if available, or fallback to course.lessons
    let loadedLessons = course.lessons || [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`knowva_lessons_${course.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) loadedLessons = parsed;
        } catch {}
      }
    }
    setFormLessons(loadedLessons.length > 0 ? loadedLessons : [
      { id: '1', title: 'บทนำและภาพรวมระบบ', duration: '15:00', videoUrl: 'https://www.youtube-nocookie.com/embed/zJSY8tbf_ys?autoplay=1&rel=0' },
    ]);

    setIsModalOpen(true);
  };

  // 1-Click Toggle Visibility: Published <-> Draft
  const handleToggleStatus = async (course: CourseItem) => {
    if (!isAdmin) {
      showToast('🔒 เฉพาะ Admin เท่านั้นที่มีสิทธิ์เปลี่ยนสถานะคอร์สเรียน');
      return;
    }

    const nextStatus = course.status === 'draft' ? 'published' : 'draft';

    // 1. Update local state immediately
    setCourses((prev) =>
      prev.map((c) => (c.id === course.id ? { ...c, status: nextStatus } : c))
    );

    // 2. Persist to Supabase
    try {
      await supabase.from('courses').upsert({
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        min_tier: course.minTier,
        category: course.category,
        hours_total: parseInt(course.totalDuration) || 8,
        lesson_count: course.totalLessons,
        status: nextStatus,
        thumbnail_url: course.thumbnail,
        updated_at: new Date().toISOString(),
      });

      if (nextStatus === 'draft') {
        showToast(`🔒 ซ่อนคอร์ส "${course.title}" จากหน้าผู้เรียนแล้ว (ยังอยู่ในแดชบอร์ดหลังบ้านเพื่อให้คุณแก้ไข)`);
      } else {
        showToast(`👁️ เผยแพร่คอร์ส "${course.title}" ให้นักเรียนเข้าเรียนได้ตามปกติแล้ว`);
      }
    } catch (err) {
      console.error('Update status error:', err);
      showToast('⚠️ ไม่สามารถอัปเดตสถานะลง Supabase ได้');
    }
  };

  // Soft Delete (Hide from users, keep in admin dashboard)
  const handleHideFromStudents = async () => {
    if (!courseToAction) return;
    await handleToggleStatus({ ...courseToAction, status: 'published' }); // toggles to draft
    setCourseToAction(null);
  };

  // Permanent Delete
  const handlePermanentDelete = async () => {
    if (!courseToAction) return;
    try {
      await supabase.from('courses').delete().eq('id', courseToAction.id);
    } catch (err) {
      console.error('Delete course error:', err);
    }

    setCourses((prev) => prev.filter((c) => c.id !== courseToAction.id));
    showToast(`🗑️ ลบคอร์ส "${courseToAction.title}" ออกจากระบบถาวรแล้ว`);
    setCourseToAction(null);
  };

  // Save (Create or Update)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const courseId = editingCourse ? editingCourse.id : `course-${Date.now()}`;
    const payload = {
      id: courseId,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || 'หลักสูตรเข้มข้นมาตรฐานระดับ Production',
      description: formDesc.trim() || 'เรียนรู้ผ่านการลงมือทำจริง',
      min_tier: formMinTier,
      category: formCategory,
      hours_total: parseInt(formDuration) || 8,
      lesson_count: Number(formLessonsCount) || formLessons.length || 10,
      status: formStatus,
      thumbnail_url: formThumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      updated_at: new Date().toISOString(),
    };

    try {
      await supabase.from('courses').upsert(payload);
    } catch (err) {
      console.warn('Save course error:', err);
    }

    // Sanitize and format all lesson video URLs (auto-convert regular YouTube links to embed format)
    const sanitizedLessons = formLessons.map((lesson) => ({
      ...lesson,
      videoUrl: formatYouTubeEmbedUrl(lesson.videoUrl),
    }));

    // Persist custom lessons if modified
    if (sanitizedLessons.length > 0 && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`knowva_lessons_${courseId}`, JSON.stringify(sanitizedLessons));
      } catch (e) {
        // ignore
      }
    }

    const updatedCourseItem: CourseItem = {
      id: courseId,
      title: payload.title,
      slug: courseId,
      subtitle: payload.subtitle,
      category: formCategory,
      categoryLabel: formCategory.toUpperCase(),
      minTier: formMinTier,
      level: editingCourse?.level || 'Intermediate',
      totalLessons: payload.lesson_count,
      totalDuration: formDuration || `${payload.hours_total} ชั่วโมง`,
      rating: editingCourse?.rating || 5.0,
      studentsCount: editingCourse?.studentsCount || 0,
      thumbnail: payload.thumbnail_url,
      description: payload.description,
      learningOutcomes: editingCourse?.learningOutcomes || ['เข้าใจโครงสร้างสถาปัตยกรรมระดับองค์กร'],
      lessons: sanitizedLessons.length > 0 ? sanitizedLessons : (editingCourse?.lessons || [
        { id: '1', title: 'บทนำและภาพรวมระบบ', duration: '15:00', videoUrl: 'https://www.youtube-nocookie.com/embed/zJSY8tbf_ys?autoplay=1&rel=0' },
      ]),
      status: formStatus,
    };

    if (editingCourse) {
      setCourses((prev) => prev.map((c) => (c.id === courseId ? updatedCourseItem : c)));
      showToast(`🎉 อัปเดตข้อมูลคอร์ส "${payload.title}" เรียบร้อยแล้ว`);
    } else {
      setCourses((prev) => [updatedCourseItem, ...prev]);
      showToast(`🎉 สร้างคอร์สใหม่ "${payload.title}" เรียบร้อยแล้ว`);
    }

    setIsModalOpen(false);
  };

  // Lesson Management within Form
  const handleUpdateLesson = (index: number, field: 'title' | 'videoUrl' | 'duration', value: string) => {
    setFormLessons((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddLesson = () => {
    const nextIdx = formLessons.length + 1;
    setFormLessons((prev) => [
      ...prev,
      {
        id: `lesson-${Date.now()}-${nextIdx}`,
        title: `บทเรียนที่ ${nextIdx}: หัวข้อใหม่`,
        duration: '15:00',
        videoUrl: 'https://www.youtube-nocookie.com/embed/zJSY8tbf_ys?autoplay=1&rel=0',
      },
    ]);
    setFormLessonsCount((prev) => prev + 1);
  };

  const handleRemoveLesson = (index: number) => {
    setFormLessons((prev) => prev.filter((_, i) => i !== index));
    setFormLessonsCount((prev) => Math.max(1, prev - 1));
  };

  // Filtered List
  const filteredCourses = courses.filter((c) => {
    // Status filter
    if (filterStatus === 'published' && c.status === 'draft') return false;
    if (filterStatus === 'draft' && c.status !== 'draft') return false;

    // Category filter
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const publishedCount = courses.filter((c) => c.status !== 'draft').length;
  const draftCount = courses.filter((c) => c.status === 'draft').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-zinc-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
              {isAdmin ? 'Super Admin' : 'Staff'}
            </span>
            <span className="text-xs text-zinc-500 font-medium">ระบบบริหารจัดการหลักสูตร</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            จัดการคอร์สเรียน & หลักสูตร
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            ปรับปรุงเนื้อหา ซ่อนคอร์สเพื่อแก้ไขข้อผิดพลาด หรือเผยแพร่บทเรียนให้นักเรียนเข้าเรียนได้ทันที
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm self-start shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>เพิ่มคอร์สเรียนใหม่</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filterStatus === 'all'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            ทั้งหมด ({courses.length})
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterStatus === 'published'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>กำลังเผยแพร่ ({publishedCount})</span>
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterStatus === 'draft'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span>ซ่อนอยู่ / รอแก้ไข ({draftCount})</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อคอร์ส..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 focus:outline-none focus:bg-white focus:border-zinc-400 font-medium"
          >
            <option value="all">ทุกหมวดหมู่</option>
            <option value="foundations">Foundations</option>
            <option value="fullstack">Full-Stack</option>
            <option value="ai-agents">AI & Agents</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Course List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course, idx) => {
          const isDraft = course.status === 'draft';

          return (
            <div
              key={course.id}
              className={`p-6 rounded-3xl border transition flex flex-col justify-between space-y-4 shadow-sm relative ${
                isDraft
                  ? 'bg-amber-50/20 border-amber-300 ring-1 ring-amber-400/20 hover:border-amber-400'
                  : 'bg-white border-zinc-200/80 hover:border-zinc-300 hover:shadow-md'
              }`}
            >
              {/* Header Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-zinc-100 text-zinc-600">
                      {course.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        course.minTier === 'vip'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : course.minTier === 'pro'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : course.minTier === 'basic'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {course.minTier} tier
                    </span>
                  </div>

                  {/* Status Indicator Badge */}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${
                      isDraft
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isDraft ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                    <span>{isDraft ? 'ซ่อนอยู่ (Draft)' : 'เผยแพร่แล้ว'}</span>
                  </span>
                </div>

                {/* Notice banner if course is hidden */}
                {isDraft && (
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[10px] flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>คอร์สนี้ถูกซ่อนจากหน้าผู้เรียน (สามารถแก้ไขให้ถูกต้องแล้วเปิดแสดงใหม่ได้)</span>
                  </div>
                )}

                <h3 className="font-bold text-zinc-950 text-base leading-snug">{course.title}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2">{course.subtitle}</p>
              </div>

              {/* Course Meta Info */}
              <div className="space-y-3 pt-3 border-t border-zinc-100 text-xs">
                <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.totalDuration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.totalLessons} บทเรียน
                  </span>
                </div>

                {/* Actions Row: Toggle Visibility | Edit | Delete */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100">
                  {/* Quick Toggle Publish / Hide Button */}
                  {isAdmin ? (
                    <button
                      onClick={() => handleToggleStatus(course)}
                      title={
                        isDraft
                          ? 'คลิกเพื่อเผยแพร่ให้นักเรียนเห็นบนหน้าเว็บ'
                          : 'คลิกเพื่อซ่อนคอร์สนี้จากผู้เรียนชั่วคราวเพื่อแก้ไข'
                      }
                      className={`py-1.5 px-2.5 rounded-xl font-semibold text-[11px] transition flex items-center gap-1.5 border shadow-xs ${
                        isDraft
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {isDraft ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>เผยแพร่</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                          <span>ซ่อนจากผู้เรียน</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[11px] text-zinc-400">ลำดับที่ #{idx + 1}</span>
                  )}

                  {/* Edit and Delete Actions */}
                  <div className="flex items-center gap-1.5">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleOpenEditModal(course)}
                          title="แก้ไขรายละเอียดคอร์ส / เนื้อหา / ลิงก์วิดีโอ"
                          className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 transition font-semibold text-[11px] flex items-center gap-1 shadow-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-zinc-600" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          onClick={() => setCourseToAction(course)}
                          title="จัดการคอร์สเรียน / ลบ"
                          className="p-1.5 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal when clicking Delete: Offers Hide (Recommended) vs Permanent Delete */}
      {courseToAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 space-y-4 text-xs text-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>จัดการคอร์สเรียน</span>
              </h3>
              <button
                onClick={() => setCourseToAction(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm text-zinc-900">{courseToAction.title}</h4>
              <p className="text-zinc-500 leading-relaxed">
                คุณต้องการจัดการกับคอร์สนี้อย่างไร?
              </p>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <span className="font-bold block">💡 คำแนะนำ:</span>
                <p className="leading-relaxed">
                  หากเนื้อหาในคอร์สมีข้อผิดพลาดหรือต้องการแก้ไข แนะนำให้เลือก <strong>"ซ่อนจากผู้เรียน"</strong> — คอร์สจะหายไปจากหน้านักเรียนทันที แต่จะยังคงอยู่ในแดชบอร์ดหลังบ้าน เพื่อให้คุณเข้ามาตรวจสอบและแก้ไขข้อมูลให้ถูกต้องได้
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleHideFromStudents}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
              >
                <EyeOff className="w-4 h-4" />
                <span>ซ่อนจากผู้เรียน (ปิดการแสดงผลชั่วคราว เพื่อแก้ไข)</span>
              </button>

              <button
                type="button"
                onClick={handlePermanentDelete}
                className="w-full py-2 px-4 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>ลบคอร์สนี้ออกจากระบบถาวร</span>
              </button>

              <button
                type="button"
                onClick={() => setCourseToAction(null)}
                className="w-full py-2 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs transition"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 sm:p-7 space-y-5 text-xs text-zinc-900 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-800" />
                <span>{editingCourse ? `แก้ไขคอร์สเรียน: ${editingCourse.title}` : 'สร้างคอร์สเรียนใหม่ (สิทธิ์ Admin)'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              {/* PUBLISH STATUS SELECTOR */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <label className="block text-zinc-800 font-bold text-xs">
                  สถานะการแสดงผลของคอร์ส (Publishing Status) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormStatus('published')}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      formStatus === 'published'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      {formStatus === 'published' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 block">🟢 เผยแพร่ทันที (Published)</span>
                      <span className="text-[10px] text-zinc-500">นักเรียนสามารถเห็นและเข้าเรียนคอร์สนี้ได้ตามแพ็กเกจ</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormStatus('draft')}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      formStatus === 'draft'
                        ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      {formStatus === 'draft' && <div className="w-2 h-2 rounded-full bg-amber-600" />}
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 block">🟡 ซ่อนไว้ก่อน / ฉบับร่าง (Draft)</span>
                      <span className="text-[10px] text-zinc-500">ซ่อนจากหน้าผู้เรียน เพื่อให้คุณแก้ไขข้อผิดพลาดให้ถูกต้องก่อน</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* TITLE & SUBTITLE */}
              <div>
                <label className="block text-zinc-700 mb-1 font-semibold">ชื่อคอร์สเรียน *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="เช่น Building Multi-Agent Workflows with LangChain"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-zinc-700 mb-1 font-semibold">คำบรรยายสั้น *</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="เช่น ออกแบบและพัฒนา AI Agents ที่ทำงานร่วมกันแบบอัตโนมัติ"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-400"
                />
              </div>

              {/* CATEGORY & TIER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 mb-1 font-semibold">หมวดหมู่</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 focus:outline-none focus:bg-white focus:border-zinc-400 font-medium"
                  >
                    <option value="free-starter">Free Starter & Open Curriculum</option>
                    <option value="foundations">Foundations & Core Web</option>
                    <option value="fullstack">Next.js & Full-Stack</option>
                    <option value="ai-agents">Generative AI & Agents</option>
                    <option value="enterprise">Enterprise Architecture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 mb-1 font-semibold">ระดับแพ็กเกจขั้นต่ำ</label>
                  <select
                    value={formMinTier}
                    onChange={(e) => setFormMinTier(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 focus:outline-none focus:bg-white focus:border-zinc-400 font-medium"
                  >
                    <option value="free">Free (ฟรีสำหรับทุกคน)</option>
                    <option value="basic">Basic (Self-Paced)</option>
                    <option value="pro">Pro Cohort</option>
                    <option value="vip">VIP Mentorship</option>
                  </select>
                </div>
              </div>

              {/* DURATION & LESSONS COUNT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 mb-1 font-semibold">ความยาวรวม</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="เช่น 12 ชั่วโมง 30 นาที"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 mb-1 font-semibold">จำนวนบทเรียน</label>
                  <input
                    type="number"
                    value={formLessonsCount}
                    onChange={(e) => setFormLessonsCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-zinc-700 mb-1 font-semibold">รายละเอียดหลักสูตร</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="เขียนสรุปสิ่งที่จะได้เรียนในคอร์สนี้..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:bg-white"
                />
              </div>

              {/* LESSONS MANAGER: Edit video URLs and lesson titles */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-zinc-900 block">จัดการบทเรียน & ลิงก์วิดีโอ (Lessons & Video Links)</span>
                    <span className="text-[11px] text-zinc-500">
                      💡 วางลิงก์ YouTube ได้ทุกรูปแบบ (เช่น <code className="bg-zinc-200/60 px-1 py-0.5 rounded text-zinc-700">youtube.com/watch?v=...</code> หรือ <code className="bg-zinc-200/60 px-1 py-0.5 rounded text-zinc-700">youtu.be/...</code>) ระบบจะแปลงให้อัตโนมัติ
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLesson}
                    className="py-1 px-2.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 font-semibold text-[11px] text-zinc-800 transition shadow-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มบทเรียน</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formLessons.map((lesson, idx) => (
                    <div
                      key={lesson.id || idx}
                      className="p-3 rounded-xl bg-white border border-zinc-200/80 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-zinc-700 text-[11px]">บทที่ #{idx + 1}</span>
                        {formLessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(idx)}
                            className="text-zinc-400 hover:text-red-600 transition"
                            title="ลบบทนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => handleUpdateLesson(idx, 'title', e.target.value)}
                          placeholder="ชื่อบทเรียน"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:bg-white"
                        />
                        <input
                          type="text"
                          value={lesson.videoUrl}
                          onChange={(e) => handleUpdateLesson(idx, 'videoUrl', e.target.value)}
                          placeholder="ลิงก์วิดีโอ (YouTube URL)"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:bg-white font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingCourse ? 'บันทึกการแก้ไขคอร์ส' : 'บันทึกคอร์สเรียน'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
