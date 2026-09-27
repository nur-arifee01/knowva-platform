import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { ToastContainer } from '@/components/ui/Toast';
import { SupportModal } from '@/components/support/SupportModal';

export const metadata: Metadata = {
  title: 'Full-Stack Web & AI Engineering Cohort | KNOWVA Academy',
  description: 'คอร์สเรียนระดับโปรดักชันที่จะเปลี่ยนคุณเป็น Full-Stack Developer ยุคใหม่ที่ผสานพลัง AI และ Modern Next.js สู่ระดับมืออาชีพ',
  keywords: ['Next.js', 'React', 'TypeScript', 'AI Engineering', 'Full-Stack', 'Web Development', 'KNOWVA'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white min-h-screen">
        <AppProvider>
          {children}
          <SupportModal />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

