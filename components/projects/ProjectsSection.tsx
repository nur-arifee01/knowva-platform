'use client';

import React from 'react';
import { PROJECTS } from '@/lib/data';
import { Brain, ShoppingBag, Layers, Sparkles, Users, Rocket, CheckCircle2 } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="w-6 h-6 text-zinc-900" />;
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-zinc-900" />;
      case 'Layers': return <Layers className="w-6 h-6 text-zinc-900" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-emerald-600" />;
      case 'Users': return <Users className="w-6 h-6 text-zinc-900" />;
      default: return <Rocket className="w-6 h-6 text-zinc-900" />;
    }
  };

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            PRACTICAL HANDS-ON PROJECTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mt-2">
            สร้าง 6 โปรเจกต์ระดับโปรดักชันลง Portfolio
          </h2>
          <p className="mt-4 text-zinc-600 text-base leading-relaxed">
            ไม่มีการทำโปรเจกต์ของเล่น ทุกชิ้นงานคือแอปพลิเคชันที่แก้ปัญหาธุรกิจจริง พร้อมนำไปใช้รับงานหรือแสดงในพอร์ตสมัครงาน
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map(project => (
            <div key={project.id} className="card-clean flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                    {getIcon(project.icon)}
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400 font-mono">
                    PROJ #{project.id}
                  </span>
                </div>

                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold text-zinc-950 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-mono font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-start gap-2 text-xs text-zinc-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>ผลลัพธ์: {project.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

