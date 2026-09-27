'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Play, LogIn, LogOut, ChevronDown, Menu, X, CheckCircle2, BookOpen, Sparkles, ShieldAlert, Headphones } from 'lucide-react';

const NAV_LINKS = [
  { href: '#why-us', label: 'ทำไมต้องคอร์สนี้' },
  { href: '#free-preview', label: 'ตัวอย่าง 3 ตอนฟรี' },
  { href: '#curriculum', label: 'เนื้อหาหลักสูตร' },
  { href: '#projects', label: 'โปรเจกต์จริง' },
  { href: '#instructor', label: 'ผู้สอน' },
  { href: '#reviews', label: 'รีวิวผู้เรียน' },
  { href: '#pricing', label: 'แพ็กเกจราคา' },
  { href: '#faq', label: 'คำถามที่พบบ่อย' },
];

export const Navbar: React.FC = () => {
  const { currentUser, isStaff, login, logout, openAuthModal, openPreviewModal, openEnrollModal, openSupportModal } = useApp();
  const [activeSection, setActiveSection] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scrollspy to track which section is currently active
  useEffect(() => {
    const sectionIds = ['why-us', 'free-preview', 'curriculum', 'projects', 'instructor', 'reviews', 'pricing', 'faq'];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const offset = 140;

      let currentId = '';

      if (scrollY + windowHeight >= docHeight - 80) {
        currentId = sectionIds[sectionIds.length - 1];
      } else if (scrollY > 280) {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const id = sectionIds[i];
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop - offset;
            if (scrollY >= top) {
              currentId = id;
              break;
            }
          }
        }
      }

      setActiveSection(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="glass-header sticky top-[41px] z-40">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-[72px] min-h-[72px] flex items-center justify-between gap-2 lg:gap-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-black text-lg tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-zinc-950 font-en leading-none">
              KNOWVA<span className="text-emerald-500">.</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase leading-none mt-1">
              Academy
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links (Single-line guaranteed, Responsive Gap) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-2.5 text-xs xl:text-sm font-medium text-zinc-600">
          {NAV_LINKS.map(link => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2 xl:gap-3 flex-shrink-0">

          {/* Guest State: Login Button */}
          {!currentUser ? (
            <button
              onClick={() => openAuthModal()}
              className="btn btn-secondary text-xs sm:text-sm py-2 px-3.5 xl:px-4 hover:border-zinc-400 whitespace-nowrap"
            >
              <LogIn className="w-4 h-4 text-zinc-600 flex-shrink-0" />
              <span>เข้าสู่ระบบ</span>
            </button>
          ) : (
            /* Logged-in State: User Profile Dropdown & Dashboard Button */
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="btn btn-secondary text-xs sm:text-sm py-1.5 px-3 hover:border-zinc-400 whitespace-nowrap flex items-center gap-1.5 font-semibold text-zinc-800"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>คลังคอร์สเรียน</span>
                {currentUser.tier && currentUser.tier !== 'free' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                    {currentUser.tier}
                  </span>
                )}
              </Link>

              <div className="relative flex-shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserDropdownOpen(prev => !prev);
                  }}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 transition-all text-xs font-semibold text-zinc-800 whitespace-nowrap"
                >
                  <span className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                    {(currentUser.name || 'U').charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-200 py-1.5 z-50 text-xs animate-scaleUp">
                    <div className="px-3.5 py-2.5 border-b border-zinc-100">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">
                            เข้าสู่ระบบแล้ว
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase">
                          Tier: {currentUser.tier || 'free'}
                        </span>
                      </div>
                      <p className="font-bold text-zinc-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate font-mono">{currentUser.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2.5 text-emerald-700 hover:bg-emerald-50 font-semibold border-b border-zinc-100"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>เข้าสู่คลังคอร์สเรียน (Dashboard)</span>
                    </Link>

                    {isStaff && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2.5 text-purple-700 bg-purple-50/70 hover:bg-purple-100 font-semibold border-b border-zinc-100"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-600" />
                        <span>ระบบหลังบ้าน (Admin Portal)</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        openSupportModal();
                      }}
                      className="w-full text-left px-3.5 py-2 text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 transition-colors"
                    >
                      <Headphones className="w-3.5 h-3.5 text-zinc-500" />
                      <span>แจ้งปัญหาการใช้งาน (Support)</span>
                    </button>

                    <a
                      href="#pricing"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-zinc-700 hover:bg-zinc-50"
                    >
                      ดูแพ็กเกจคอร์สเรียน
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Primary CTA Enroll Button */}
          <button
            onClick={() => openEnrollModal('pro')}
            className="btn btn-primary text-xs sm:text-sm py-2 px-4 xl:px-5 shadow-sm whitespace-nowrap"
          >
            สมัครเรียน
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          aria-label="Toggle Menu"
          className="lg:hidden p-2 text-zinc-700 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2">
          {NAV_LINKS.map(link => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link-mobile block text-zinc-700 py-2 px-3 rounded-lg font-medium hover:text-zinc-950 hover:bg-zinc-100 transition-colors ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </a>
            );
          })}

          <div className="pt-3 flex flex-col gap-2">
            <a
              href="#free-preview"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                const el = document.getElementById('free-preview');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  openPreviewModal(1);
                }
              }}
              className="btn btn-secondary w-full justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-zinc-500 fill-zinc-500" />
              <span>ตัวอย่าง 3 ตอนฟรี</span>
            </a>

            {!currentUser ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="btn btn-secondary w-full justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-zinc-600" />
                <span>เข้าสู่ระบบ</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                      {(currentUser.name || 'U').charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{currentUser.name}</p>
                      <p className="text-[10px] text-zinc-400">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-xs text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50"
                  >
                    ออกจากระบบ
                  </button>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>เข้าสู่คลังคอร์สเรียน (Dashboard)</span>
                </Link>
              </div>
            )}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openEnrollModal('pro');
              }}
              className="btn btn-primary w-full justify-center"
            >
              สมัครเรียนทันที
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

