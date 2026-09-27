'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Award, Briefcase, GraduationCap, CheckCircle, Code2, Brain, Database, Palette, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Instructor {
  id?: string;
  image: string;
  name: string;
  role: string;
  bio: string;
  badge: string;
  badgeColor: string;
  icon?: React.ReactNode;
  highlights: string[];
}

const DEFAULT_INSTRUCTORS: Instructor[] = [
  {
    image: '/images/instructors/instructor-ek.jpg',
    name: 'เอกภพ นพคุณ (พี่เอก)',
    role: 'Lead Instructor • Senior Full-Stack & AI Architect',
    bio: 'วิศวกรซอฟต์แวร์ประสบการณ์กว่า 10 ปี ออกแบบ Web Architecture ขนาดใหญ่และระบบ AI Production ให้บริษัทเทคโนโลยีชั้นนำทั้งในไทยและต่างประเทศ',
    badge: 'Lead Instructor',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    icon: <Code2 className="w-4 h-4" />,
    highlights: [
      'ออกแบบระบบรองรับผู้ใช้ 1M+ Active Users',
      'โค้ชชิ่งนักพัฒนากว่า 2,500+ คนทั่วประเทศ',
    ],
  },
  {
    image: '/images/instructors/instructor-nat.jpg',
    name: 'ณัฐวุฒิ ศรีสุวรรณ (พี่นัท)',
    role: 'AI & Machine Learning Specialist',
    bio: 'ผู้เชี่ยวชาญด้าน Generative AI, LLM Integration และ AI Agents จากประสบการณ์จริงในอุตสาหกรรม FinTech และ Healthcare Tech',
    badge: 'AI Specialist',
    badgeColor: 'bg-violet-100 text-violet-800',
    icon: <Brain className="w-4 h-4" />,
    highlights: [
      'พัฒนา AI Chatbot ให้ธนาคารชั้นนำ',
      'วิทยากร Google Developer Expert (GDE)',
    ],
  },
  {
    image: '/images/instructors/instructor-es.jpg',
    name: 'สิรภัทร วงศ์อมรรัตน์ (พี่เอส)',
    role: 'Backend & Cloud Infrastructure Engineer',
    bio: 'ผู้เชี่ยวชาญด้าน Cloud Architecture, DevOps และ Database Optimization กับประสบการณ์ทำงานร่วมกับทีมพัฒนาระดับ Enterprise ทั้งในไทยและสิงคโปร์',
    badge: 'Cloud Engineer',
    badgeColor: 'bg-sky-100 text-sky-800',
    icon: <Database className="w-4 h-4" />,
    highlights: [
      'AWS & GCP Certified Solutions Architect',
      'ออกแบบระบบ Microservices ให้ E-Commerce ระดับประเทศ',
    ],
  },
  {
    image: '/images/instructors/instructor-por.jpg',
    name: 'ปาริชาติ ธนกิจโกศล (พี่ปอ)',
    role: 'UX/UI Designer & Frontend Architect',
    bio: 'นักออกแบบ UX/UI และ Frontend Developer ที่เชี่ยวชาญด้าน Design System, Accessibility และ Modern CSS Framework ประสบการณ์กว่า 8 ปี',
    badge: 'UX/UI Lead',
    badgeColor: 'bg-amber-100 text-amber-800',
    icon: <Palette className="w-4 h-4" />,
    highlights: [
      'ออกแบบ Design System ให้องค์กรระดับ Fortune 500',
      'ผู้ก่อตั้ง Community นักออกแบบ UI ที่ใหญ่ที่สุดในไทย',
    ],
  },
];

export const InstructorSection: React.FC = () => {
  const { supabase } = useApp();
  const [instructors, setInstructors] = useState<Instructor[]>(DEFAULT_INSTRUCTORS);

  // Fetch real-time instructors from Supabase so admin additions appear live!
  useEffect(() => {
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
              image: d.image_url || DEFAULT_INSTRUCTORS[idx % DEFAULT_INSTRUCTORS.length]?.image || '/images/instructors/instructor-ek.jpg',
              name: d.name,
              role: d.role_title,
              bio: d.bio,
              badge: d.badge || 'Instructor',
              badgeColor: d.badge_color || 'bg-emerald-100 text-emerald-800',
              highlights: Array.isArray(d.highlights) && d.highlights.length > 0 ? d.highlights : ['ผู้เชี่ยวชาญด้านเทคโนโลยี'],
              icon: <Code2 className="w-4 h-4" />,
            }))
          );
        }
      } catch (err) {
        // Fallback to default instructors gracefully
      }
    };

    fetchInstructors();
  }, [supabase]);

  if (instructors.length === 0) return null;

  const leadInstructor = instructors[0];
  const otherInstructors = instructors.slice(1);

  return (
    <section id="instructor" className="py-20 bg-zinc-50 border-y border-zinc-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            MEET OUR INSTRUCTORS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 mt-2">
            ทีมผู้สอนผู้เชี่ยวชาญตัวจริง ({instructors.length} ท่าน)
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 mt-3 max-w-2xl mx-auto">
            เรียนรู้จากทีมผู้สอนที่มีประสบการณ์จริงในอุตสาหกรรมเทคโนโลยี ครอบคลุมทุกด้านตั้งแต่ Frontend, Backend, AI ไปจนถึง UX/UI Design
          </p>
        </div>

        {/* Lead Instructor - Full Width Card */}
        {leadInstructor && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-shrink-0 text-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-xl mx-auto mb-3 border-4 border-white">
                  <Image
                    src={leadInstructor.image}
                    alt={leadInstructor.name}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${leadInstructor.badgeColor}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {leadInstructor.badge}
                </span>
              </div>
              <div className="space-y-3 text-center md:text-left">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-950">
                    {leadInstructor.name}
                  </h3>
                  <p className="text-sm font-medium text-zinc-500 mt-0.5">
                    {leadInstructor.role}
                  </p>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed max-w-xl">
                  {leadInstructor.bio}
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  {leadInstructor.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Instructors - Grid */}
        {otherInstructors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherInstructors.map((instructor, idx) => (
              <div
                key={instructor.id || idx}
                className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                {/* Avatar Photo */}
                <div className="w-28 h-28 rounded-xl overflow-hidden shadow-lg mx-auto mb-4 border-4 border-white group-hover:scale-105 transition-transform">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${instructor.badgeColor} mb-3`}>
                  {instructor.badge}
                </span>

                {/* Name & Role */}
                <h3 className="text-base font-bold text-zinc-950 mt-1">
                  {instructor.name}
                </h3>
                <p className="text-xs font-medium text-zinc-500 mt-0.5">
                  {instructor.role}
                </p>

                {/* Bio */}
                <p className="text-xs text-zinc-600 leading-relaxed mt-3 line-clamp-3">
                  {instructor.bio}
                </p>

                {/* Highlights */}
                <div className="mt-4 space-y-1.5 text-left">
                  {instructor.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-zinc-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Tagline */}
        <div className="mt-10 text-center">
          <p className="text-xs text-zinc-400 font-medium">
            ทีมผู้สอนทุกท่านผ่านการคัดเลือกและมีประสบการณ์ทำงานจริงกับบริษัทเทคโนโลยีชั้นนำ เพื่อมอบคุณภาพสูงสุดให้แก่ผู้เรียน
          </p>
        </div>
      </div>
    </section>
  );
};
