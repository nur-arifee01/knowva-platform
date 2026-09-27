'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Award,
  Sparkles,
  X,
  Save,
  Code2,
  Brain,
  Database,
  Palette,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Camera,
  Check,
  RefreshCw,
} from 'lucide-react';

interface InstructorItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  badge: string;
  badgeColor: string;
  image: string;
  highlights: string[];
}

const INITIAL_INSTRUCTORS: InstructorItem[] = [
  {
    id: '1',
    image: '/images/instructors/instructor-ek.jpg',
    name: 'เอกภพ นพคุณ (พี่เอก)',
    role: 'Lead Instructor • Senior Full-Stack & AI Architect',
    bio: 'วิศวกรซอฟต์แวร์ประสบการณ์กว่า 10 ปี ออกแบบ Web Architecture ขนาดใหญ่และระบบ AI Production ให้บริษัทเทคโนโลยีชั้นนำทั้งในไทยและต่างประเทศ',
    badge: 'Lead Instructor',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    highlights: [
      'ออกแบบระบบรองรับผู้ใช้ 1M+ Active Users',
      'โค้ชชิ่งนักพัฒนากว่า 2,500+ คนทั่วประเทศ',
    ],
  },
  {
    id: '2',
    image: '/images/instructors/instructor-nat.jpg',
    name: 'ณัฐวุฒิ ศรีสุวรรณ (พี่นัท)',
    role: 'AI & Machine Learning Specialist',
    bio: 'ผู้เชี่ยวชาญด้าน Generative AI, LLM Integration และ AI Agents จากประสบการณ์จริงในอุตสาหกรรม FinTech และ Healthcare Tech',
    badge: 'AI Specialist',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    highlights: [
      'พัฒนา AI Chatbot ให้ธนาคารชั้นนำ',
      'วิทยากร Google Developer Expert (GDE)',
    ],
  },
  {
    id: '3',
    image: '/images/instructors/instructor-es.jpg',
    name: 'สิรภัทร วงศ์อมรรัตน์ (พี่เอส)',
    role: 'Backend & Cloud Infrastructure Engineer',
    bio: 'ผู้เชี่ยวชาญด้าน Cloud Architecture, DevOps และ Database Optimization กับประสบการณ์ทำงานร่วมกับทีมพัฒนาระดับ Enterprise ทั้งในไทยและสิงคโปร์',
    badge: 'Cloud Engineer',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    highlights: [
      'AWS & GCP Certified Solutions Architect',
      'ออกแบบระบบ Microservices ให้ E-Commerce ระดับประเทศ',
    ],
  },
  {
    id: '4',
    image: '/images/instructors/instructor-por.jpg',
    name: 'ปาริชาติ ธนกิจโกศล (พี่ปอ)',
    role: 'UX/UI Designer & Frontend Architect',
    bio: 'นักออกแบบ UX/UI และ Frontend Developer ที่เชี่ยวชาญด้าน Design System, Accessibility และ Modern CSS Framework ประสบการณ์กว่า 8 ปี',
    badge: 'UX/UI Lead',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    highlights: [
      'ออกแบบ Design System ให้องค์กรระดับ Fortune 500',
      'ผู้ก่อตั้ง Community นักออกแบบ UI ที่ใหญ่ที่สุดในไทย',
    ],
  },
];

// Presets for quick avatar selection
const PRESET_AVATARS = [
  { label: 'พี่เอก (Full-Stack)', url: '/images/instructors/instructor-ek.jpg' },
  { label: 'พี่นัท (AI Specialist)', url: '/images/instructors/instructor-nat.jpg' },
  { label: 'พี่เอส (Cloud Engineer)', url: '/images/instructors/instructor-es.jpg' },
  { label: 'พี่ปอ (UX/UI Lead)', url: '/images/instructors/instructor-por.jpg' },
  { label: 'Avatar ผู้หญิง 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { label: 'Avatar ผู้ชาย 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Avatar ผู้ชาย 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Avatar ผู้หญิง 2', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
];

const BADGE_PRESETS = [
  { label: 'Lead Instructor', badge: 'Lead Instructor', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: 'AI Specialist', badge: 'AI Specialist', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  { label: 'Cloud Engineer', badge: 'Cloud Engineer', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { label: 'UX/UI Lead', badge: 'UX/UI Lead', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { label: 'Senior Specialist', badge: 'Specialist', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
];

export default function AdminInstructorsPage() {
  const { userRole, isAdmin, showToast, supabase } = useApp();
  const [instructors, setInstructors] = useState<InstructorItem[]>(INITIAL_INSTRUCTORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<InstructorItem | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newBadge, setNewBadge] = useState('Specialist');
  const [newBadgeColor, setNewBadgeColor] = useState('bg-emerald-50 text-emerald-700 border-emerald-200');
  const [newHighlight, setNewHighlight] = useState('');

  // Image Upload & Source State
  const [newImage, setNewImage] = useState<string>('/images/instructors/instructor-ek.jpg');
  const [imageSourceTab, setImageSourceTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch real-time instructors from Supabase
  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('sort_order', { ascending: true });

      if (data && data.length > 0) {
        setInstructors(
          data.map((d: any, idx: number) => ({
            id: d.id,
            name: d.name,
            role: d.role_title,
            bio: d.bio,
            badge: d.badge || 'Instructor',
            badgeColor: d.badge_color || 'bg-emerald-50 text-emerald-700 border-emerald-200',
            image: d.image_url || INITIAL_INSTRUCTORS[idx % INITIAL_INSTRUCTORS.length]?.image || '/images/instructors/instructor-ek.jpg',
            highlights: Array.isArray(d.highlights) && d.highlights.length > 0 ? d.highlights : ['ผู้เชี่ยวชาญด้านเทคโนโลยี'],
          }))
        );
      }
    } catch (err) {
      console.warn('Fetch instructors error:', err);
    }
  };

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingInstructor(null);
    setNewName('');
    setNewRole('');
    setNewBio('');
    setNewBadge('Specialist');
    setNewBadgeColor('bg-emerald-50 text-emerald-700 border-emerald-200');
    setNewHighlight('');
    setNewImage('/images/instructors/instructor-ek.jpg');
    setCustomImageUrl('');
    setImageSourceTab('upload');
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (item: InstructorItem) => {
    setEditingInstructor(item);
    setNewName(item.name);
    setNewRole(item.role);
    setNewBio(item.bio);
    setNewBadge(item.badge);
    setNewBadgeColor(item.badgeColor || 'bg-emerald-50 text-emerald-700 border-emerald-200');
    setNewHighlight(item.highlights?.[0] || '');
    setNewImage(item.image);
    setCustomImageUrl(item.image.startsWith('http') ? item.image : '');
    setImageSourceTab('upload');
    setIsModalOpen(true);
  };

  // Handle Local File Upload with Auto-Compression via Canvas
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('⚠️ กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }

    setIsProcessingImage(true);
    try {
      const compressedDataUrl = await compressImage(file);
      setNewImage(compressedDataUrl);
      showToast('✅ โหลดและปรับขนาดรูปภาพสำเร็จพร้อมใช้งาน');
    } catch (err) {
      console.error('Compress image error:', err);
      showToast('❌ ไม่สามารถอ่านรูปภาพได้');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Client-side image compression helper
  const compressImage = (file: File, maxWidth = 480, maxHeight = 480, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle URL change
  const handleApplyUrl = () => {
    if (customImageUrl.trim()) {
      setNewImage(customImageUrl.trim());
      showToast('🔗 นำลิงก์รูปภาพมาใช้แล้ว');
    }
  };

  const handleDeleteInstructor = async (id: string, name: string) => {
    if (!isAdmin) {
      showToast('🔒 เฉพาะ Admin เท่านั้นที่มีสิทธิ์ลบข้อมูลผู้สอน');
      return;
    }
    if (!window.confirm(`ยืนยันการลบผู้สอน "${name}" ออกจากระบบ?`)) return;

    try {
      await supabase.from('instructors').delete().eq('id', id);
    } catch (err) {
      console.error('Delete instructor from DB error:', err);
    }

    setInstructors((prev) => prev.filter((item) => item.id !== id));
    showToast(`🗑️ ลบข้อมูลผู้สอน "${name}" แล้ว`);
  };

  // Save (Insert or Update)
  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const payload = {
      name: newName.trim(),
      role_title: newRole.trim() || 'Senior Instructor',
      bio: newBio.trim() || 'ผู้เชี่ยวชาญที่มีประสบการณ์ตรงในอุตสาหกรรมเทคโนโลยี',
      badge: newBadge.trim() || 'Instructor',
      badge_color: newBadgeColor,
      image_url: newImage || '/images/instructors/instructor-ek.jpg',
      highlights: newHighlight.trim() ? [newHighlight.trim()] : ['ผู้เชี่ยวชาญและวิทยากรด้านเทคโนโลยี'],
    };

    if (editingInstructor) {
      // UPDATE existing instructor
      try {
        await supabase
          .from('instructors')
          .update(payload)
          .eq('id', editingInstructor.id);

        setInstructors((prev) =>
          prev.map((item) =>
            item.id === editingInstructor.id
              ? {
                  ...item,
                  name: payload.name,
                  role: payload.role_title,
                  bio: payload.bio,
                  badge: payload.badge,
                  badgeColor: payload.badge_color,
                  image: payload.image_url,
                  highlights: payload.highlights,
                }
              : item
          )
        );
        showToast(`🎉 อัปเดตข้อมูลและรูปภาพของ "${payload.name}" เรียบร้อยแล้ว`);
      } catch (err: any) {
        console.error('Update instructor error:', err);
        showToast('❌ ไม่สามารถอัปเดตข้อมูลได้');
      }
    } else {
      // INSERT new instructor
      try {
        const insertData = {
          ...payload,
          sort_order: instructors.length + 1,
        };

        const { data, error } = await supabase
          .from('instructors')
          .insert(insertData)
          .select()
          .single();

        if (data) {
          setInstructors((prev) => [
            ...prev,
            {
              id: data.id,
              name: data.name,
              role: data.role_title,
              bio: data.bio,
              badge: data.badge,
              badgeColor: data.badge_color,
              image: data.image_url,
              highlights: data.highlights,
            },
          ]);
          showToast('🎉 บันทึกข้อมูลและรูปภาพผู้สอนเข้า Supabase สำเร็จ! (หน้าแรกจะแสดงผลสดทันที)');
        } else {
          setInstructors((prev) => [
            ...prev,
            {
              id: `inst-${Date.now()}`,
              name: payload.name,
              role: payload.role_title,
              bio: payload.bio,
              badge: payload.badge,
              badgeColor: payload.badge_color,
              image: payload.image_url,
              highlights: payload.highlights,
            },
          ]);
          showToast('🎉 เพิ่มข้อมูลผู้สอนเรียบร้อย');
        }
      } catch (err: any) {
        console.error('Insert instructor error:', err);
        showToast('❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
              จัดการข้อมูลบุคลากร & ผู้สอน (Instructors)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
              {instructors.length} ท่าน
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {isAdmin
              ? '👑 สิทธิ์ Admin: สามารถเพิ่ม แก้ไขข้อมูล เปลี่ยนรูปภาพ และลบรายชื่อผู้สอนที่แสดงบนหน้าแรกได้'
              : '🛡️ สิทธิ์ Staff: สามารถเรียกดูข้อมูลและประวัติผู้สอน'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm self-start"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>เพิ่มรายชื่อผู้สอนใหม่</span>
          </button>
        )}
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {instructors.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-sm flex items-start gap-4 hover:border-zinc-300 hover:shadow-md transition group"
          >
            {/* Instructor Photo */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-zinc-200 shadow-xs relative bg-zinc-100">
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      title="แก้ไขข้อมูล / เปลี่ยนรูปภาพ"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteInstructor(item.id, item.name)}
                      title="ลบข้อมูลผู้สอน"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-zinc-950 text-sm truncate">{item.name}</h3>
              <p className="text-[11px] text-emerald-700 font-semibold">{item.role}</p>
              <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{item.bio}</p>

              <div className="pt-1.5 space-y-1">
                {item.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 sm:p-7 space-y-5 text-xs text-zinc-900 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-800" />
                <span>
                  {editingInstructor
                    ? `แก้ไขข้อมูลผู้สอน: ${editingInstructor.name}`
                    : 'เพิ่มรายชื่อผู้สอนใหม่ (สิทธิ์ Admin)'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInstructor} className="space-y-4">
              {/* IMAGE UPLOADER & PREVIEW SECTION */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                <label className="block text-zinc-800 font-bold text-xs flex items-center justify-between">
                  <span>รูปภาพประจำตัวผู้สอน (Instructor Photo) *</span>
                  <span className="text-[10px] text-zinc-400 font-normal">
                    รองรับ JPG, PNG, WebP หรือ URL ออนไลน์
                  </span>
                </label>

                {/* Preview & Controls */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Live Avatar Preview */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-zinc-200 shadow-sm bg-white relative">
                      <Image
                        src={newImage}
                        alt="Preview"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                      {isProcessingImage && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </div>
                    <span className="block text-center text-[10px] text-zinc-500 mt-1 font-medium">
                      ภาพตัวอย่างสด
                    </span>
                  </div>

                  {/* Tabs for Image Selection Mode */}
                  <div className="flex-1 w-full space-y-2.5">
                    <div className="flex items-center gap-1.5 p-1 bg-zinc-200/60 rounded-xl text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setImageSourceTab('upload')}
                        className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                          imageSourceTab === 'upload'
                            ? 'bg-white text-zinc-950 shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>อัปโหลดจากเครื่อง</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceTab('url')}
                        className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                          imageSourceTab === 'url'
                            ? 'bg-white text-zinc-950 shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>ลิงก์ URL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceTab('presets')}
                        className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                          imageSourceTab === 'presets'
                            ? 'bg-white text-zinc-950 shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>เลือกรูปจำลอง</span>
                      </button>
                    </div>

                    {/* Tab 1: Upload from Device */}
                    {imageSourceTab === 'upload' && (
                      <div className="space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2.5 px-3 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold transition flex items-center justify-center gap-2 text-xs"
                        >
                          <Camera className="w-4 h-4 text-emerald-600" />
                          <span>คลิกเลือกรูปภาพจากคอมพิวเตอร์ของคุณ</span>
                        </button>
                        <p className="text-[10px] text-zinc-400 text-center">
                          ระบบจะปรับสเกลขนาดและบีบอัดรูปภาพให้อัตโนมัติ เพื่อให้หน้าเว็บโหลดได้เร็วที่สุด
                        </p>
                      </div>
                    )}

                    {/* Tab 2: Direct Image URL */}
                    {imageSourceTab === 'url' && (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="วางลิงก์รูปภาพ เช่น https://images.unsplash.com/..."
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-zinc-400"
                        />
                        <button
                          type="button"
                          onClick={handleApplyUrl}
                          className="py-2 px-3 rounded-xl bg-zinc-950 text-white font-semibold hover:bg-zinc-800 transition"
                        >
                          ใช้งาน
                        </button>
                      </div>
                    )}

                    {/* Tab 3: Presets */}
                    {imageSourceTab === 'presets' && (
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {PRESET_AVATARS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewImage(preset.url)}
                            className={`p-1 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                              newImage === preset.url
                                ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/40'
                                : 'border-zinc-200 bg-white hover:border-zinc-300'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 relative">
                              <Image
                                src={preset.url}
                                alt={preset.label}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[9px] text-zinc-600 truncate w-full px-0.5">
                              {preset.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* NAME & ROLE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-zinc-700 mb-1 font-semibold">ชื่อ - นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="เช่น ดร. กิตติศักดิ์ เจริญกิจ"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 mb-1 font-semibold">ตำแหน่ง / ความเชี่ยวชาญ *</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="เช่น Principal AI Researcher • Ex-Google"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-400 font-medium"
                  />
                </div>
              </div>

              {/* BADGE PRESETS */}
              <div>
                <label className="block text-zinc-700 mb-1.5 font-semibold">
                  ป้ายตำแหน่ง / ความชำนาญ (Badge)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {BADGE_PRESETS.map((bp) => (
                    <button
                      key={bp.badge}
                      type="button"
                      onClick={() => {
                        setNewBadge(bp.badge);
                        setNewBadgeColor(bp.color);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                        newBadge === bp.badge
                          ? `${bp.color} ring-2 ring-zinc-900/10 shadow-xs font-bold`
                          : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {bp.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder="หรือพิมพ์ชื่อป้ายตำแหน่งเอง เช่น Tech Lead"
                  className="w-full px-3.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:bg-white text-xs"
                />
              </div>

              {/* BIO */}
              <div>
                <label className="block text-zinc-700 mb-1 font-semibold">ประวัติโดยย่อ</label>
                <textarea
                  rows={2}
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="ระบุประสบการณ์ทำงานหรือผลงานที่โดดเด่นในสายงาน..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:bg-white leading-relaxed"
                />
              </div>

              {/* HIGHLIGHT */}
              <div>
                <label className="block text-zinc-700 mb-1 font-semibold">
                  ไฮไลท์ผลงานเด่น (แสดงเครื่องหมายถูกสีเขียว)
                </label>
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="เช่น ออกแบบระบบรองรับ 1M+ Active Users หรือ วิทยากร GDE"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:bg-white"
                />
              </div>

              {/* MODAL FOOTER */}
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
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
                  <span>{editingInstructor ? 'บันทึกการแก้ไข' : 'บันทึกผู้สอน'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
