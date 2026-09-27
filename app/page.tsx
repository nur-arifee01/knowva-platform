'use client';

import React from 'react';
import { TopBanner } from '@/components/navigation/TopBanner';
import { Navbar } from '@/components/navigation/Navbar';
import { HeroSection } from '@/components/hero/HeroSection';
import { WhyUsSection } from '@/components/why-us/WhyUsSection';
import { VideoPreviewSection } from '@/components/preview/VideoPreviewSection';
import { CurriculumSection } from '@/components/curriculum/CurriculumSection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { InstructorSection } from '@/components/instructor/InstructorSection';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { PricingSection } from '@/components/pricing/PricingSection';
import { FaqSection } from '@/components/faq/FaqSection';
import { Footer } from '@/components/footer/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { PreviewVideoModal } from '@/components/preview/PreviewVideoModal';
import { EnrollModal } from '@/components/enroll/EnrollModal';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Sticky Top Urgency Countdown Banner */}
      <TopBanner />

      {/* Single-line Fixed Navbar with Scrollspy & Auth Button */}
      <Navbar />

      {/* Hero Section with Live Terminal/Code Showcase */}
      <HeroSection />

      {/* Why Us Section */}
      <WhyUsSection />

      {/* 3 Free Real Video Preview Lessons (YouTube Full HD) */}
      <VideoPreviewSection />

      {/* 8-Week Deep Curriculum */}
      <CurriculumSection />

      {/* 6 Real-World Capstone Projects */}
      <ProjectsSection />

      {/* Lead Instructor Profile */}
      <InstructorSection />

      {/* Student Testimonials */}
      <ReviewsSection />

      {/* Transparent Pricing Cards */}
      <PricingSection />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Footer with Urgency CTA */}
      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <PreviewVideoModal />
      <EnrollModal />
    </main>
  );
}

