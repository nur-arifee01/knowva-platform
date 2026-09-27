import { CourseItem } from '@/types';

export const COURSE_CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด (All Courses)' },
  { id: 'free-starter', label: '0. ฟรีสำหรับทุกคน (Free Starter)' },
  { id: 'foundations', label: '1. Foundations & Core Web (Basic)' },
  { id: 'fullstack', label: '2. Next.js 15 & Full-Stack (Pro)' },
  { id: 'ai-agents', label: '3. Generative AI & Agents (Pro)' },
  { id: 'enterprise', label: '4. Enterprise & 1-on-1 (VIP)' },
] as const;

export const COURSES_DATA: CourseItem[] = [
  // =========================================================================
  // LEVEL 0: FREE TIER (5 Courses - Accessible by Everyone including Free accounts)
  // =========================================================================
  {
    id: 'web-dev-kickstart',
    title: 'Web Development 101: เริ่มต้นเขียนเว็บฉบับก้าวกระโดด',
    slug: 'web-development-101',
    subtitle: 'ปูพื้นฐาน HTML5 Semantic, Modern CSS และ JavaScript ES6+ ตั้งแต่ศูนย์จนสร้างหน้า Landing Page แรกได้',
    category: 'free-starter',
    categoryLabel: 'Free Starter',
    minTier: 'free',
    level: 'Beginner',
    totalLessons: 12,
    totalDuration: '4 ชั่วโมง 30 นาที',
    rating: 4.90,
    studentsCount: 2840,
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80',
    badge: 'คอร์สฟรี แนะนำ',
    description: 'คอร์สเรียนฟรีสำหรับผู้เริ่มต้นที่อยากก้าวเข้าสู่วงการพัฒนาเว็บไซต์ เรียนรู้โครงสร้าง HTML5 ที่ถูกต้องตามหลัก SEO, การตกแต่งหน้าตาด้วย CSS Flexbox & Grid, และการเขียนคำสั่ง JavaScript ควบคุมเว็บให้มีชีวิตชีวา พร้อม Deploy ขึ้นสู่อินเทอร์เน็ตจริง',
    learningOutcomes: [
      'เข้าใจโครงสร้าง HTML5 Semantic Elements เพื่อ SEO และ Accessibility',
      'ออกแบบหน้าตาเว็บไซต์แบบ Responsive รองรับมือถือและคอมพิวเตอร์',
      'เขียนคำสั่ง JavaScript ES6+ จัดการ Event, DOM และ API เบื้องต้น',
      'นำเว็บไซต์ขึ้น Vercel / GitHub Pages ให้ทุกคนเข้าชมได้ฟรี'
    ],
    githubUrl: 'https://github.com/knowva-academy/web-dev-101-starter',
    resources: [
      { id: 'res-w1', title: 'HTML5 & CSS3 Cheat Sheet (PDF)', url: 'https://example.com/html5-cheatsheet.pdf', type: 'pdf', fileSize: '2.4 MB' },
      { id: 'res-w2', title: 'Starter Project Assets & Templates', url: 'https://example.com/starter-assets.zip', type: 'zip', fileSize: '5.1 MB' },
      { id: 'res-w3', title: 'GitHub Repository Template', url: 'https://github.com/knowva-academy/web-dev-101-starter', type: 'github' },
    ],
    lessons: [
      { id: 'w1-1', title: 'บทนำ: แผนที่การเป็น Web Developer ในยุค Modern Web', duration: '20:00', videoUrl: 'https://www.youtube-nocookie.com/embed/zJSY8tbf_ys?autoplay=1&rel=0', isFreePreview: true },
      { id: 'w1-2', title: 'HTML5 Semantic Tags และการจัดโครงสร้างหน้าเว็บ', duration: '35:10', videoUrl: 'https://www.youtube-nocookie.com/embed/kUMe1FH4CHE?autoplay=1&rel=0', isFreePreview: true },
      { id: 'w1-3', title: 'Modern CSS Box Model, Flexbox & Responsive Layout', duration: '45:20', videoUrl: 'https://www.youtube-nocookie.com/embed/1Rs2ND1ryYc?autoplay=1&rel=0', isFreePreview: true },
      { id: 'w1-4', title: 'JavaScript ES6+ Syntax, Event Listeners และ DOM Interaction', duration: '42:30', videoUrl: 'https://www.youtube-nocookie.com/embed/hdI2bqOjy3c?autoplay=1&rel=0', isFreePreview: true },
      { id: 'w1-5', title: 'Workshop: สร้าง Landing Page และ Deploy บน Vercel ฟรี', duration: '48:00', videoUrl: 'https://www.youtube-nocookie.com/embed/22R_mB3q_vY?autoplay=1&rel=0', isFreePreview: true }
    ]
  },
  {
    id: 'git-github-flow',
    title: 'Git & GitHub Professional Workflow สำหรับนักพัฒนาทีม',
    slug: 'git-github-flow',
    subtitle: 'จัดการเวอร์ชันโค้ดอย่างมืออาชีพ เข้าใจ Branching Strategy, Pull Requests, Merge Conflict และ Conventional Commits',
    category: 'free-starter',
    categoryLabel: 'Free Starter',
    minTier: 'free',
    level: 'Beginner',
    totalLessons: 10,
    totalDuration: '3 ชั่วโมง 45 นาที',
    rating: 4.92,
    studentsCount: 2310,
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80',
    badge: 'ทักษะจำเป็น',
    description: 'ทักษะการใช้ Git ที่โปรแกรมเมอร์ทุกคนต้องมี ไม่ใช่แค่ git add, git commit, git push แต่รวมถึงการจัดการ Branch สำหรับงานระดับโปรดักชัน การแก้ Merge Conflict อย่างมั่นใจ และการทำ PR Review ตามมาตรฐานสากล',
    learningOutcomes: [
      'เข้าใจกลไกภายในของ Git (Working Dir, Staging Area, Local/Remote Repo)',
      'ใช้งาน Git Branching และ Trunk-Based Development ในทีม',
      'แก้ปัญหา Merge Conflicts และฝึกใช้ Git Rebase อย่างถูกต้อง',
      'เขียน Conventional Commits และใช้งาน GitHub Actions รัน Automated Tests'
    ],
    githubUrl: 'https://github.com/knowva-academy/git-workflow-guide',
    resources: [
      { id: 'res-g1', title: 'Git Essential Command Cheat Sheet (PDF)', url: 'https://example.com/git-cheat-sheet.pdf', type: 'pdf', fileSize: '1.8 MB' },
      { id: 'res-g2', title: 'Sample Git Conflict Playground Repo', url: 'https://github.com/knowva-academy/git-workflow-guide', type: 'github' },
    ],
    lessons: [
      { id: 'git-1', title: 'ทำความเข้าใจ Git Architecture และ Lifecycle ของไฟล์', duration: '25:00', videoUrl: 'https://www.youtube-nocookie.com/embed/RGOj5yH7evk?autoplay=1&rel=0', isFreePreview: true },
      { id: 'git-2', title: 'Branching Strategy: Feature Branch, Hotfix และ Mainline', duration: '30:15', videoUrl: 'https://www.youtube-nocookie.com/embed/8JJ101D3knE?autoplay=1&rel=0', isFreePreview: true },
      { id: 'git-3', title: 'เทคนิคแก้ Merge Conflict แบบ Step-by-Step ด้วย VS Code', duration: '35:40', videoUrl: 'https://www.youtube-nocookie.com/embed/FyAAIHHClqI?autoplay=1&rel=0', isFreePreview: true },
      { id: 'git-4', title: 'GitHub PR Flow, Code Review Checklist และ Protected Branches', duration: '40:00', videoUrl: 'https://www.youtube-nocookie.com/embed/3R-u30w-sQ0?autoplay=1&rel=0', isFreePreview: true }
    ]
  },
  {
    id: 'cursor-ai-intro',
    title: 'AI-Assisted Coding ด้วย Cursor IDE & GitHub Copilot',
    slug: 'cursor-ai-coding',
    subtitle: 'เร่งความเร็วการเขียนโค้ด 5x ด้วยเทคนิค Prompting โค้ด, Refactoring, Composer Mode และ Bug Hunting ด้วย AI',
    category: 'free-starter',
    categoryLabel: 'Free Starter',
    minTier: 'free',
    level: 'Beginner',
    totalLessons: 8,
    totalDuration: '3 ชั่วโมง 15 นาที',
    rating: 4.95,
    studentsCount: 3450,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    badge: 'ยอดนิยมสูงสุด',
    description: 'เรียนรู้วิธีการเขียนโค้ดร่วมกับ AI ที่มีประสิทธิภาพสูงสุด เจาะลึกการใช้ Cursor IDE และ GitHub Copilot ตั้งแต่การป้อน Context ที่แม่นยำ การสั่งให้ AI ปรับปรุงโค้ดเดิม ไปจนถึงการใช้ Composer Mode สั่งสร้างฟีเจอร์ระดับระบบ',
    learningOutcomes: [
      'ตั้งค่า Rules for AI (.cursorrules) เพื่อให้ AI เขียนโค้ดตามมาตรฐานทีม',
      'ใช้คำสั่ง @Codebase, @Files, @Docs เพื่อดึง Context เข้าโมเดล AI',
      'ใช้ Cursor Composer และ Agent Mode ในการเขียน Multi-File Feature',
      'ป้องกันโค้ดรั่วไหลและเลือกใช้ Model (Claude 3.5 Sonnet vs GPT-4o) ให้คุ้มค่า'
    ],
    githubUrl: 'https://github.com/knowva-academy/cursor-ai-rules',
    resources: [
      { id: 'res-c1', title: 'Best Practice .cursorrules Template Collection', url: 'https://example.com/cursorrules-pack.zip', type: 'zip', fileSize: '1.2 MB' },
      { id: 'res-c2', title: 'AI Prompting Formulas for Developers (PDF)', url: 'https://example.com/ai-prompting-devs.pdf', type: 'pdf', fileSize: '3.1 MB' },
    ],
    lessons: [
      { id: 'cur-1', title: 'ติดตั้ง ปรับแต่ง และตั้งค่า Model ใน Cursor IDE', duration: '20:10', videoUrl: 'https://www.youtube-nocookie.com/embed/vPY7WUH_FJc?autoplay=1&rel=0', isFreePreview: true },
      { id: 'cur-2', title: 'Prompting Codebase: การใช้ @Symbols อ้างอิงไฟล์และ Docs', duration: '28:30', videoUrl: 'https://www.youtube-nocookie.com/embed/YwG_rYwY7gU?autoplay=1&rel=0', isFreePreview: true },
      { id: 'cur-3', title: 'Cursor Composer: สั่งสร้างฟีเจอร์ Full-Stack จบใน Prompt เดียว', duration: '35:00', videoUrl: 'https://www.youtube-nocookie.com/embed/jM_z_3ZzBcA?autoplay=1&rel=0', isFreePreview: true },
      { id: 'cur-4', title: 'AI Code Review, Debugging และการเขียน Unit Test อัตโนมัติ', duration: '30:00', videoUrl: 'https://www.youtube-nocookie.com/embed/vVj4481_G_w?autoplay=1&rel=0', isFreePreview: true }
    ]
  },
  {
    id: 'docker-basics',
    title: 'Docker for Beginners: คอนเทนเนอร์เบื้องต้นสำหรับนักพัฒนาเว็บ',
    slug: 'docker-for-beginners',
    subtitle: 'ทำความเข้าใจ Docker, Dockerfile, Image, Container และการรันฐานข้อมูลในเครื่องแบบง่ายๆ ไม่รกเครื่อง',
    category: 'free-starter',
    categoryLabel: 'Free Starter',
    minTier: 'free',
    level: 'Beginner',
    totalLessons: 10,
    totalDuration: '4 ชั่วโมง 00 นาที',
    rating: 4.88,
    studentsCount: 1980,
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop&q=80',
    badge: 'พื้นฐาน DevOps',
    description: 'บอกลาปัญหา "ในเครื่องฉันรันผ่าน แต่ทำไมบนเซิร์ฟเวอร์รันไม่ขึ้น" ด้วย Docker ปูพื้นฐานการรันแอปพลิเคชันใน Container, การเขียน Dockerfile ที่มีประสิทธิภาพ และการใช้ Docker Compose เปิดเซิร์ฟเวอร์ฐานข้อมูลในไม่กี่วินาที',
    learningOutcomes: [
      'เข้าใจความแตกต่างระหว่าง Containers กับ Virtual Machines อย่างชัดเจน',
      'เขียน Dockerfile สำหรับ Node.js / Next.js ที่ขนาดเล็กและปลอดภัย',
      'ใช้ Docker Compose จัดการ PostgreSQL, Redis, PgAdmin รันพร้อมกัน',
      'เข้าใจเรื่อง Volumes สำหรับเก็บข้อมูลไม่ให้หายเมื่อปิด Container'
    ],
    githubUrl: 'https://github.com/knowva-academy/docker-starter-kit',
    resources: [
      { id: 'res-d1', title: 'Docker Essential Commands & Cheat Sheet (PDF)', url: 'https://example.com/docker-cheatsheet.pdf', type: 'pdf', fileSize: '2.0 MB' },
      { id: 'res-d2', title: 'Production-Ready Docker Compose Templates', url: 'https://example.com/compose-templates.zip', type: 'zip', fileSize: '1.5 MB' },
    ],
    lessons: [
      { id: 'doc-1', title: 'ทำไมต้อง Container? เปรียบเทียบ Docker กับ Local Environment', duration: '22:00', videoUrl: 'https://www.youtube-nocookie.com/embed/pTFFAOT1Z7c?autoplay=1&rel=0', isFreePreview: true },
      { id: 'doc-2', title: 'โครงสร้าง Dockerfile: FROM, RUN, COPY, CMD และ Multi-Stage Build', duration: '32:15', videoUrl: 'https://www.youtube-nocookie.com/embed/fqMOX6JJhGo?autoplay=1&rel=0', isFreePreview: true },
      { id: 'doc-3', title: 'Docker Compose: รัน Postgres + Redis ด้วยคำสั่งเดียว', duration: '38:00', videoUrl: 'https://www.youtube-nocookie.com/embed/0qZWRIEs16w?autoplay=1&rel=0', isFreePreview: true },
      { id: 'doc-4', title: 'Volume Mounts, Network Isolation และการทำ Clean up', duration: '35:00', videoUrl: 'https://www.youtube-nocookie.com/embed/gT5s8VwP12g?autoplay=1&rel=0', isFreePreview: true }
    ]
  },
  {
    id: 'figma-to-code',
    title: 'Figma to Clean Code: แปลงงานดีไซน์เป็นเว็บจริงแบบ Responsive',
    slug: 'figma-to-clean-code',
    subtitle: 'เทคนิคการอ่านดีไซน์จาก Figma การจัด Spacing, Flexbox, Auto-Layout, Grid และการ Export Assets คุณภาพสูง',
    category: 'free-starter',
    categoryLabel: 'Free Starter',
    minTier: 'free',
    level: 'Beginner',
    totalLessons: 9,
    totalDuration: '3 ชั่วโมง 30 นาที',
    rating: 4.86,
    studentsCount: 1720,
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    badge: 'ฟรีพิเศษ',
    description: 'เชื่อมช่องว่างระหว่างดีไซเนอร์กับโปรแกรมเมอร์ เรียนรู้วิธีการแกะ Auto Layout, Spacing Tokens, Color Styles จาก Figma สู่โค้ด HTML/Tailwind CSS ที่คลีน สวยงาม และตรงปก 100%',
    learningOutcomes: [
      'แกะโครงสร้าง Auto Layout ใน Figma แปลงเป็น Flexbox และ Grid ได้ทันที',
      'ดึง Color Tokens, Typography, Shadow และ Spacing มาสร้าง Design System',
      'เทคนิคการ Export ภาพ SVG / WebP คุณภาพสูงไม่แตกบนหน้าจอ Retina',
      'สร้าง Micro-interactions และ Hover States เพิ่มความน่าสนใจให้เว็บ'
    ],
    githubUrl: 'https://github.com/knowva-academy/figma-to-tailwind-starter',
    resources: [
      { id: 'res-f1', title: 'Figma Design Tokens to CSS Variable Guide (PDF)', url: 'https://example.com/tokens-guide.pdf', type: 'pdf', fileSize: '2.8 MB' },
      { id: 'res-f2', title: 'Free Figma Practice Community File Link', url: 'https://figma.com/@knowva-landing', type: 'link' },
    ],
    lessons: [
      { id: 'fig-1', title: 'วิธีอ่าน Dev Mode และโครงสร้าง Auto Layout ใน Figma', duration: '25:00', videoUrl: 'https://www.youtube-nocookie.com/embed/h24noHYsuGc?autoplay=1&rel=0', isFreePreview: true },
      { id: 'fig-2', title: 'แปลง Figma Components สู่ Reusable Tailwind Components', duration: '35:20', videoUrl: 'https://www.youtube-nocookie.com/embed/qpOlG7BYJlQ?autoplay=1&rel=0', isFreePreview: true },
      { id: 'fig-3', title: 'Responsive Breakpoints: ปรับงานดีไซน์จาก Desktop สู่ Mobile', duration: '30:10', videoUrl: 'https://www.youtube-nocookie.com/embed/JFdzm0hS-X4?autoplay=1&rel=0', isFreePreview: true },
      { id: 'fig-4', title: 'Animation & Hover Effects ด้วย Tailwind Transition Curves', duration: '30:00', videoUrl: 'https://www.youtube-nocookie.com/embed/dD2EISVyKn8?autoplay=1&rel=0', isFreePreview: true }
    ]
  },

  // =========================================================================
  // LEVEL 1: BASIC TIER (5 Courses - Accessible by Basic, Pro, VIP)
  // =========================================================================
  {
    id: 'ts-mastery',
    title: 'Modern TypeScript 5 & Enterprise Type Systems',
    slug: 'modern-typescript-5',
    subtitle: 'เจาะลึก TypeScript ตั้งแต่พื้นฐาน Generics, Utility Types จนถึงการทำ Type-Safe API',
    category: 'foundations',
    categoryLabel: 'Foundations & Core Web',
    minTier: 'basic',
    level: 'Beginner',
    totalLessons: 18,
    totalDuration: '8 ชั่วโมง 30 นาที',
    rating: 4.90,
    studentsCount: 1420,
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc141e6e7fb?w=800&auto=format&fit=crop&q=80',
    badge: 'พื้นฐานสำคัญ',
    description: 'คอร์สปูพื้นฐานการเขียน TypeScript สำหรับโปรเจกต์ขนาดใหญ่ ทำความเข้าใจ Union, Intersection, Conditional Types, Generics และการผสานเข้ากับ Next.js 15 อย่างมืออาชีพ',
    learningOutcomes: [
      'เข้าใจและใช้งาน Advanced Generics ได้อย่างแม่นยำ',
      'ออกแบบ Type Definition สำหรับ REST API และ Server Actions',
      'ป้องกัน Type Leakage และตรวจจับ Run-time Error ด้วย Zod',
      'วางสถาปัตยกรรม Type-Safe ในทีมพัฒนาขนาดใหญ่'
    ],
    githubUrl: 'https://github.com/knowva-academy/typescript-mastery',
    resources: [
      { id: 'res-ts1', title: 'TypeScript 5 Cheat Sheet & Types Map (PDF)', url: 'https://example.com/ts-cheatsheet.pdf', type: 'pdf', fileSize: '3.2 MB' },
      { id: 'res-ts2', title: 'Interactive Generics Exercises Repository', url: 'https://github.com/knowva-academy/typescript-mastery', type: 'github' },
    ],
    lessons: [
      { id: 'ts-1', title: 'บทนำ: ทำไม Enterprise Project ถึงต้องใช้ TypeScript', duration: '25:00', videoUrl: 'https://www.youtube-nocookie.com/embed/30LWjhZzg50?autoplay=1&rel=0', isFreePreview: true },
      { id: 'ts-2', title: 'Primitive Types vs Complex Types & Type Inference', duration: '32:15', videoUrl: 'https://www.youtube-nocookie.com/embed/d56mG7DezGs?autoplay=1&rel=0' },
      { id: 'ts-3', title: 'Generics & Utility Types (Pick, Omit, Partial, Record)', duration: '45:10', videoUrl: 'https://www.youtube-nocookie.com/embed/nU6i5NNnXw4?autoplay=1&rel=0' },
      { id: 'ts-4', title: 'Zod Validation Schema & End-to-End Type Safety', duration: '38:40', videoUrl: 'https://www.youtube-nocookie.com/embed/L6BE-U3oykg?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'tailwind-design',
    title: 'Tailwind CSS Architecture & Modern Design Systems',
    slug: 'tailwind-css-architecture',
    subtitle: 'สร้างระบบ UI ระดับโปรดักชันด้วย Tailwind CSS, Design Tokens และ Responsive Layouts',
    category: 'foundations',
    categoryLabel: 'Foundations & Core Web',
    minTier: 'basic',
    level: 'Beginner',
    totalLessons: 14,
    totalDuration: '6 ชั่วโมง 15 นาที',
    rating: 4.85,
    studentsCount: 1180,
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    badge: 'ยอดนิยม',
    description: 'เรียนรู้การวางดีไซน์ซิสเต็ม ปรับแต่ง Tokens, Dark Mode, Micro-interactions, Glassmorphism และ Responsive Container Queries ให้กับ Web Application ยุคใหม่',
    learningOutcomes: [
      'สร้าง Reusable Component Library ด้วย Tailwind และ CVA (Class Variance Authority)',
      'จัดการธีม Dark / Light Mode และ CSS Variables แบบยืดหยุ่น',
      'เทคนิคการทำ Animation นุ่มนวลระดับ 60fps โดยไม่กินทรัพยากร'
    ],
    githubUrl: 'https://github.com/knowva-academy/tailwind-design-system',
    resources: [
      { id: 'res-tw1', title: 'Design System Figma to Tailwind Token Map (PDF)', url: 'https://example.com/design-tokens.pdf', type: 'pdf', fileSize: '2.9 MB' },
      { id: 'res-tw2', title: 'Pre-built Headless UI Components Pack', url: 'https://example.com/ui-components.zip', type: 'zip', fileSize: '4.2 MB' },
    ],
    lessons: [
      { id: 'tw-1', title: 'การตั้งค่า Tailwind Config และ Design Tokens', duration: '20:10', videoUrl: 'https://www.youtube-nocookie.com/embed/k45aZ4_Fh48?autoplay=1&rel=0', isFreePreview: true },
      { id: 'tw-2', title: 'สร้าง Design System Components (Button, Modal, Input)', duration: '40:25', videoUrl: 'https://www.youtube-nocookie.com/embed/dFgzHOX84xQ?autoplay=1&rel=0' },
      { id: 'tw-3', title: 'Micro-interactions และ Transition Curves', duration: '35:00', videoUrl: 'https://www.youtube-nocookie.com/embed/w7eR5P2q1_o?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'react-mastery',
    title: 'React 18 / 19 Deep-Dive & Performance Optimization',
    slug: 'react-deep-dive',
    subtitle: 'ทำความเข้าใจ React Fiber, Hooks ภายใน, Suspense, และเทคนิคตัด Render ที่ไม่จำเป็น',
    category: 'foundations',
    categoryLabel: 'Foundations & Core Web',
    minTier: 'basic',
    level: 'Intermediate',
    totalLessons: 22,
    totalDuration: '10 ชั่วโมง 20 นาที',
    rating: 4.92,
    studentsCount: 1650,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    badge: 'Bestseller',
    description: 'ก้าวข้ามการเขียน React พื้นฐาน เจาะลึกกลไก Reconciliation, Hook Dependency Rules, Custom Hook Patterns, useTransition, useDeferredValue และการ Optimize Web Vitals',
    learningOutcomes: [
      'เข้าใจกลไก State Batching และ Concurrent Features',
      'ออกแบบ Custom Hooks สำหรับจัดการ Complex Business Logic',
      'ตรวจจับและแก้ไขปัญหา Re-render ซ้ำซ้อนด้วย React DevTools Profiler'
    ],
    githubUrl: 'https://github.com/knowva-academy/react-deep-dive',
    resources: [
      { id: 'res-rc1', title: 'React Performance Audit Checklist (PDF)', url: 'https://example.com/react-audit.pdf', type: 'pdf', fileSize: '2.1 MB' },
      { id: 'res-rc2', title: 'Custom Hooks Architecture Template', url: 'https://github.com/knowva-academy/react-deep-dive', type: 'github' },
    ],
    lessons: [
      { id: 'rc-1', title: 'React 18 Concurrent Rendering และ Suspense Boundary', duration: '32:00', videoUrl: 'https://www.youtube-nocookie.com/embed/bMknfKXIFA8?autoplay=1&rel=0', isFreePreview: true },
      { id: 'rc-2', title: 'Deep Dive: useMemo, useCallback และ Referential Equality', duration: '44:15', videoUrl: 'https://www.youtube-nocookie.com/embed/DLX62G4lc44?autoplay=1&rel=0' },
      { id: 'rc-3', title: 'Custom State Managers: Context vs Zustand', duration: '50:30', videoUrl: 'https://www.youtube-nocookie.com/embed/473B0v8W-lM?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'rest-api-architecture',
    title: 'RESTful API Architecture & Backend Integration',
    slug: 'rest-api-architecture',
    subtitle: 'ออกแบบ API ที่ถูกต้องตามมาตรฐาน HTTP, การจัด Status Code, Pagination และ Error Handling',
    category: 'foundations',
    categoryLabel: 'Foundations & Core Web',
    minTier: 'basic',
    level: 'Intermediate',
    totalLessons: 16,
    totalDuration: '7 ชั่วโมง 45 นาที',
    rating: 4.88,
    studentsCount: 920,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    badge: 'เข้มข้น',
    description: 'เรียนรู้หลักการออกแบบ RESTful API ที่อ่านง่าย รองรับการเติบโต การทำ Cursor-based Pagination, Rate Limiting, Idempotency Keys และการทำ API Documentation ด้วย Swagger / OpenAPI',
    learningOutcomes: [
      'เข้าใจ Resource Naming และ HTTP Verbs ที่ถูกต้องตามมาตรฐาน RFC',
      'ออกแบบระบบ Error Response กลางที่สม่ำเสมอทั้งระบบ',
      'ทำ Cursor-based Pagination และ Full-text Filtering มีประสิทธิภาพ'
    ],
    githubUrl: 'https://github.com/knowva-academy/rest-api-guidelines',
    resources: [
      { id: 'res-api1', title: 'RESTful API Design Standards & Guide (PDF)', url: 'https://example.com/rest-standards.pdf', type: 'pdf', fileSize: '2.5 MB' },
      { id: 'res-api2', title: 'Postman Collection & OpenAPI YAML Template', url: 'https://example.com/api-templates.zip', type: 'zip', fileSize: '1.8 MB' },
    ],
    lessons: [
      { id: 'api-1', title: 'HTTP Standards, Status Codes และ Idempotent Requests', duration: '30:00', videoUrl: 'https://www.youtube-nocookie.com/embed/GZvSYJDk-us?autoplay=1&rel=0', isFreePreview: true },
      { id: 'api-2', title: 'Cursor vs Offset Pagination ในฐานข้อมูลขนาดใหญ่', duration: '42:10', videoUrl: 'https://www.youtube-nocookie.com/embed/lsMQRaeKNDk?autoplay=1&rel=0' },
      { id: 'api-3', title: 'การทำ Rate Limiting และ API Key Authentication', duration: '48:00', videoUrl: 'https://www.youtube-nocookie.com/embed/pKd0RAA1508?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'node-express-foundations',
    title: 'Node.js, Express & Database Fundamentals',
    slug: 'node-express-foundations',
    subtitle: 'สร้าง Web Service หลังบ้านด้วย Node.js, Express, Middlewares, Authentication JWT และต่อฐานข้อมูล PostgreSQL',
    category: 'foundations',
    categoryLabel: 'Foundations & Core Web',
    minTier: 'basic',
    level: 'Intermediate',
    totalLessons: 16,
    totalDuration: '7 ชั่วโมง 30 นาที',
    rating: 4.89,
    studentsCount: 1240,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    badge: 'คอร์สใหม่',
    description: 'ก้าวสู่การเป็น Full-Stack Developer ตัวจริง ด้วยการสร้าง RESTful Web Service ด้วย Node.js และ Express เจาะลึก Asynchronous Programming, Middlewares, การทำ Authentication ด้วย JWT และการต่อเชื่อมฐานข้อมูล PostgreSQL ผ่าน Prisma ORM',
    learningOutcomes: [
      'เข้าใจ Event Loop, Streams, และ Non-blocking I/O ภายใน Node.js',
      'สร้าง Modular Express Server ด้วย Controller-Service-Repository Pattern',
      'ทำ Authentication ด้วย JWT Token และ Hash รหัสผ่านด้วย bcrypt',
      'ใช้งาน Prisma ORM จัดการ Schema, Migrations และ Data Relations'
    ],
    githubUrl: 'https://github.com/knowva-academy/node-express-starter',
    resources: [
      { id: 'res-ne1', title: 'Express & Prisma Clean Architecture Guide (PDF)', url: 'https://example.com/express-prisma.pdf', type: 'pdf', fileSize: '2.7 MB' },
      { id: 'res-ne2', title: 'Full-Stack Node.js Starter Repository', url: 'https://github.com/knowva-academy/node-express-starter', type: 'github' },
    ],
    lessons: [
      { id: 'ne-1', title: 'Node.js Architecture & Asynchronous Event Loop', duration: '30:00', videoUrl: 'https://www.youtube-nocookie.com/embed/Oe421EPjeBE?autoplay=1&rel=0', isFreePreview: true },
      { id: 'ne-2', title: 'Express Routing, Middleware และ Custom Error Handler', duration: '40:15', videoUrl: 'https://www.youtube-nocookie.com/embed/f2EqECiTBL8?autoplay=1&rel=0' },
      { id: 'ne-3', title: 'JWT Authentication, Refresh Token และ Security Headers', duration: '38:40', videoUrl: 'https://www.youtube-nocookie.com/embed/mbsmsi7l3r4?autoplay=1&rel=0' },
      { id: 'ne-4', title: 'Prisma ORM กับ PostgreSQL: Migrations & Relational Queries', duration: '45:00', videoUrl: 'https://www.youtube-nocookie.com/embed/RebA5J-rlhU?autoplay=1&rel=0' }
    ]
  },

  // =========================================================================
  // LEVEL 2: PRO TIER (5 Courses - Accessible by Pro & VIP)
  // =========================================================================
  {
    id: 'nextjs-fullstack',
    title: 'Next.js 15 App Router & Server Actions Masterclass',
    slug: 'nextjs-15-masterclass',
    subtitle: 'สร้าง Modern Full-Stack Application ด้วย Server Components, Caching และ Server Actions',
    category: 'fullstack',
    categoryLabel: 'Next.js 15 & Full-Stack',
    minTier: 'pro',
    level: 'Advanced',
    totalLessons: 28,
    totalDuration: '14 ชั่วโมง 00 นาที',
    rating: 4.96,
    studentsCount: 2150,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    badge: 'เรือธงประจำหลักสูตร',
    description: 'หลักสูตรแกนกลางที่เข้มข้นที่สุด เรียนรู้ Next.js 15 App Router แบบลงลึก เข้าใจ Server vs Client Component Boundaries, Streaming SSR, การแคชข้อมูล 4 ระดับ และการใช้ Server Actions ร่วมกับ Optimistic UI',
    learningOutcomes: [
      'ควบคุม Caching Lifecycle และ On-demand Revalidation อย่างแม่นยำ',
      'ออกแบบ Server Actions พร้อม Zod Validation และ Action State Handling',
      'ทำ Parallel Routes, Intercepting Routes (Modal URL Sync)',
      'Deploy สู่ Vercel พร้อมติดตั้ง OpenTelemetry ตรวจสอบ Performance'
    ],
    githubUrl: 'https://github.com/knowva-academy/nextjs-15-enterprise',
    resources: [
      { id: 'res-nx1', title: 'Next.js 15 Complete Architecture Map (PDF)', url: 'https://example.com/next15-arch.pdf', type: 'pdf', fileSize: '4.8 MB' },
      { id: 'res-nx2', title: 'Full-Stack Starter Kit with Turbopack', url: 'https://github.com/knowva-academy/nextjs-15-enterprise', type: 'github' },
    ],
    lessons: [
      { id: 'nx-1', title: 'Next.js 15 มีอะไรใหม่: Async Request APIs และ Caching Defaults', duration: '35:00', videoUrl: 'https://www.youtube-nocookie.com/embed/wm5gMKuwSYk?autoplay=1&rel=0', isFreePreview: true },
      { id: 'nx-2', title: 'Server Components vs Client Components และ Serialization Boundary', duration: '48:30', videoUrl: 'https://www.youtube-nocookie.com/embed/A6v_D_o26nI?autoplay=1&rel=0' },
      { id: 'nx-3', title: 'Server Actions, useActionState และ useOptimistic UI', duration: '55:10', videoUrl: 'https://www.youtube-nocookie.com/embed/ZVnjOPwW_EC?autoplay=1&rel=0' },
      { id: 'nx-4', title: 'Intercepting Routes & Parallel Routes ทำ Instagram Modal View', duration: '50:00', videoUrl: 'https://www.youtube-nocookie.com/embed/1K5c7yS50F0?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'supabase-saas',
    title: 'Production SaaS with Supabase, PostgreSQL & Row-Level Security',
    slug: 'supabase-saas-mastery',
    subtitle: 'สร้างระบบ Multi-Tenant SaaS พร้อม PostgreSQL, RLS Policies, Realtime Sync และ Webhooks',
    category: 'fullstack',
    categoryLabel: 'Next.js 15 & Full-Stack',
    minTier: 'pro',
    level: 'Advanced',
    totalLessons: 24,
    totalDuration: '11 ชั่วโมง 30 นาที',
    rating: 4.94,
    studentsCount: 1890,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    badge: 'ยอดฮิต',
    description: 'พัฒนาแอปพลิเคชัน SaaS พร้อมใช้จริงด้วย Supabase เจาะลึกการเขียน PostgreSQL Functions, Triggers, RLS (Row Level Security) ขั้นสูง, ระบบชำระเงิน Stripe Webhook และการอัปโหลดไฟล์ขนาดใหญ่',
    learningOutcomes: [
      'วางสถาปัตยกรรม Database Multi-tenant ด้วย Row Level Security',
      'เชื่อมต่อ Supabase Auth กับ Next.js Middleware อย่างปลอดภัย',
      'สร้างระบบ Realtime Subscription และ Broadcast สำหรับแชต / การแจ้งเตือน',
      'จัดการ Stripe Webhooks และ Subscription Billing อัตโนมัติ'
    ],
    githubUrl: 'https://github.com/knowva-academy/supabase-saas-kit',
    resources: [
      { id: 'res-sp1', title: 'PostgreSQL RLS Security Playbook (PDF)', url: 'https://example.com/rls-playbook.pdf', type: 'pdf', fileSize: '3.6 MB' },
      { id: 'res-sp2', title: 'Supabase SaaS Starter Boilerplate', url: 'https://github.com/knowva-academy/supabase-saas-kit', type: 'github' },
    ],
    lessons: [
      { id: 'sp-1', title: 'ตั้งค่า Supabase Local Development ด้วย Docker CLI', duration: '28:00', videoUrl: 'https://www.youtube-nocookie.com/embed/65B1HlWdY5c?autoplay=1&rel=0', isFreePreview: true },
      { id: 'sp-2', title: 'Row Level Security (RLS) Deep Dive: เขียน Policies แบบมืออาชีพ', duration: '52:00', videoUrl: 'https://www.youtube-nocookie.com/embed/kYphLGnSz6Q?autoplay=1&rel=0' },
      { id: 'sp-3', title: 'Database Triggers, Stored Procedures และ pg_cron Jobs', duration: '45:30', videoUrl: 'https://www.youtube-nocookie.com/embed/ydz7Dj5SgvY?autoplay=1&rel=0' },
      { id: 'sp-4', title: 'ระบบชำระเงิน Stripe Checkout และ Webhook Event Reconciliation', duration: '58:00', videoUrl: 'https://www.youtube-nocookie.com/embed/7uKQBl9uZW0?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'genai-fullstack',
    title: 'Generative AI Engineering & LLM Integration',
    slug: 'genai-engineering',
    subtitle: 'รวมพลัง Gemini 1.5, OpenAI GPT-4o, Function Calling และ Structured Output ใน Web App',
    category: 'ai-agents',
    categoryLabel: 'Generative AI & Agents',
    minTier: 'pro',
    level: 'Advanced',
    totalLessons: 26,
    totalDuration: '12 ชั่วโมง 45 นาที',
    rating: 4.97,
    studentsCount: 2280,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    badge: 'AI แนะนำ',
    description: 'ก้าวสู่การเป็น AI Engineer ยุคใหม่ ผสานพลัง Large Language Models (LLMs) เข้ากับ Web Application ผ่าน Vercel AI SDK, Function Calling, Structured JSON Outputs และการทำ Token Streaming แบบเรียลไทม์',
    learningOutcomes: [
      'ใช้งาน Vercel AI SDK Core & UI เพื่อทำ Streaming Text / UI Components',
      'ออกแบบ Function Calling เชื่อม LLM เข้ากับฐานข้อมูลและ External APIs',
      'ควบคุม Output ให้ตรง Schema 100% ด้วย Zod และ Structured Outputs',
      'เทคนิคการคำนวณ Token Cost, Rate Limiting และ Semantic Caching'
    ],
    githubUrl: 'https://github.com/knowva-academy/genai-fullstack-starter',
    resources: [
      { id: 'res-ai1', title: 'LLM Prompt Engineering & System Prompt Templates (PDF)', url: 'https://example.com/llm-prompts.pdf', type: 'pdf', fileSize: '3.9 MB' },
      { id: 'res-ai2', title: 'Vercel AI SDK Multi-Provider Boilerplate', url: 'https://github.com/knowva-academy/genai-fullstack-starter', type: 'github' },
    ],
    lessons: [
      { id: 'ai-1', title: 'ภูมิทัศน์ของ LLMs และการเลือกใช้ Model (Gemini vs OpenAI vs Claude)', duration: '30:00', videoUrl: 'https://www.youtube-nocookie.com/embed/5sQQxtu-Gvk?autoplay=1&rel=0', isFreePreview: true },
      { id: 'ai-2', title: 'Vercel AI SDK: useChat, useCompletion และ Text Streaming', duration: '46:20', videoUrl: 'https://www.youtube-nocookie.com/embed/X30P1hZ6p4g?autoplay=1&rel=0' },
      { id: 'ai-3', title: 'Tool Calling / Function Calling: ให้ AI สั่งค้นหาข้อมูลและยิง API', duration: '54:10', videoUrl: 'https://www.youtube-nocookie.com/embed/jKrCjS82P_8?autoplay=1&rel=0' },
      { id: 'ai-4', title: 'Generative UI: ส่ง React Components กลับมาจาก LLM ในสตรีมเดียว', duration: '49:00', videoUrl: 'https://www.youtube-nocookie.com/embed/smSs8_eVgYg?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'rag-langchain',
    title: 'Production RAG Systems with LangChain & Vector Databases',
    slug: 'rag-vector-databases',
    subtitle: 'สร้างระบบถามตอบเอกสารองค์กรด้วย Retrieval-Augmented Generation, Chunking และ pgvector',
    category: 'ai-agents',
    categoryLabel: 'Generative AI & Agents',
    minTier: 'pro',
    level: 'Advanced',
    totalLessons: 22,
    totalDuration: '10 ชั่วโมง 30 นาที',
    rating: 4.93,
    studentsCount: 1750,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    badge: 'Enterprise Demand',
    description: 'เจาะลึกการทำ RAG (Retrieval-Augmented Generation) ระดับโปรดักชัน ตั้งแต่กลยุทธ์การตัดแบ่งเอกสาร (Document Chunking), การสร้าง Embeddings, การเก็บข้อมูลใน pgvector / Pinecone และเทคนิค Re-ranking ค้นหาแม่นยำ',
    learningOutcomes: [
      'เข้าใจ Chunking Strategies (Recursive, Semantic, Markdown Chunking)',
      'ติดตั้งและ Optimize Vector Search ด้วย pgvector บน PostgreSQL',
      'สร้าง Hybrid Search (BM25 Keyword Search + Vector Similarity Search)',
      'ประเมินความแม่นยำของ RAG ด้วย Framework เช่น Ragas'
    ],
    githubUrl: 'https://github.com/knowva-academy/enterprise-rag-pgvector',
    resources: [
      { id: 'res-rag1', title: 'RAG Architecture & Document Chunking Guide (PDF)', url: 'https://example.com/rag-guide.pdf', type: 'pdf', fileSize: '4.2 MB' },
      { id: 'res-rag2', title: 'Production pgvector SQL Scripts & Pipeline', url: 'https://github.com/knowva-academy/enterprise-rag-pgvector', type: 'github' },
    ],
    lessons: [
      { id: 'rag-1', title: 'พื้นฐาน RAG และ Embedding Models (text-embedding-3 vs voyage)', duration: '32:00', videoUrl: 'https://www.youtube-nocookie.com/embed/sV0B2l7_eD0?autoplay=1&rel=0', isFreePreview: true },
      { id: 'rag-2', title: 'Document Ingestion: อ่าน PDF, Word, Markdown และการตัด Chunk', duration: '44:00', videoUrl: 'https://www.youtube-nocookie.com/embed/tcqEUSNCn8I?autoplay=1&rel=0' },
      { id: 'rag-3', title: 'Vector Search ด้วย pgvector: HNSW Index vs IVFFlat Index', duration: '50:15', videoUrl: 'https://www.youtube-nocookie.com/embed/sVcwVQRHIc8?autoplay=1&rel=0' },
      { id: 'rag-4', title: 'Advanced RAG: HyDE, Cohere Re-ranker และ Multi-Query Retrieval', duration: '56:00', videoUrl: 'https://www.youtube-nocookie.com/embed/6858e3B7yG0?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'autonomous-agents',
    title: 'Autonomous AI Agents & Multi-Agent Workflows',
    slug: 'autonomous-ai-agents',
    subtitle: 'สร้างระบบเอเจนต์อัจฉริยะที่วางแผน ทำงานร่วมกัน แก้ไขปัญหาอัตโนมัติด้วย LangGraph & CrewAI',
    category: 'ai-agents',
    categoryLabel: 'Generative AI & Agents',
    minTier: 'pro',
    level: 'Master',
    totalLessons: 25,
    totalDuration: '13 ชั่วโมง 15 นาที',
    rating: 4.98,
    studentsCount: 1540,
    thumbnail: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=80',
    badge: 'เทคโนโลยีล้ำสมัย',
    description: 'อนาคตของ AI คือ Autonomous Agents เรียนรู้วิธีการออกแบบเอเจนต์หลายตัวที่ทำงานร่วมกัน (Multi-Agent Collaboration) โดยใช้ State Machine ของ LangGraph, จัดการ Memory ระยะสั้น-ยาว และรับมือกับ Infinite Loops',
    learningOutcomes: [
      'เข้าใจ Agentic Design Patterns (Reflection, Planning, Multi-Agent, Tool Use)',
      'สร้าง State-Graph Architecture ด้วย LangGraph รองรับ Human-in-the-Loop',
      'ออกแบบระบบ Self-Correction ให้ Agent เขียนโค้ด ทดสอบ และแก้ Bug เอง',
      'Deploy Agentic Systems พร้อมระบบ Guardrails ป้องกัน Hallucination'
    ],
    githubUrl: 'https://github.com/knowva-academy/langgraph-multi-agents',
    resources: [
      { id: 'res-ag1', title: 'Agentic Patterns & LangGraph State Machine Architecture (PDF)', url: 'https://example.com/agentic-patterns.pdf', type: 'pdf', fileSize: '5.2 MB' },
      { id: 'res-ag2', title: 'Multi-Agent Research Crew Repository', url: 'https://github.com/knowva-academy/langgraph-multi-agents', type: 'github' },
    ],
    lessons: [
      { id: 'ag-1', title: 'Agent คืออะไร: ReAct Pattern vs Plan-and-Execute', duration: '34:00', videoUrl: 'https://www.youtube-nocookie.com/embed/vVj4481_G_w?autoplay=1&rel=0', isFreePreview: true },
      { id: 'ag-2', title: 'LangGraph Core: State, Nodes, Edges และ Conditional Routing', duration: '52:30', videoUrl: 'https://www.youtube-nocookie.com/embed/tAUf7a91oKQ?autoplay=1&rel=0' },
      { id: 'ag-3', title: 'Human-in-the-Loop: จุดตรวจสอบให้มนุษย์กดยืนยันก่อน Agent ลงมือทำ', duration: '46:00', videoUrl: 'https://www.youtube-nocookie.com/embed/sal78ACtGTc?autoplay=1&rel=0' },
      { id: 'ag-4', title: 'Workshop: สร้าง AI Software Engineer Agent ที่รับ Bug Ticket ไปแก้เอง', duration: '62:00', videoUrl: 'https://www.youtube-nocookie.com/embed/6Xpe9tW3t-0?autoplay=1&rel=0' }
    ]
  },

  // =========================================================================
  // LEVEL 3: VIP TIER (5 Courses - Accessible by VIP Mentorship)
  // =========================================================================
  {
    id: 'system-design',
    title: 'Enterprise System Design & High-Concurrency Architecture',
    slug: 'system-design-architecture',
    subtitle: 'สถาปัตยกรรมระบบขนาดใหญ่ รองรับ 10M+ DAU, Caching Strategies, Database Sharding',
    category: 'enterprise',
    categoryLabel: 'Enterprise & 1-on-1',
    minTier: 'vip',
    level: 'Master',
    totalLessons: 30,
    totalDuration: '16 ชั่วโมง 00 นาที',
    rating: 4.98,
    studentsCount: 680,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    badge: 'ระดับสถาปนิก',
    description: 'หลักสูตรสำหรับ Lead Developer และ Software Architect เจาะลึกการออกแบบระบบสเกลใหญ่ การจัดการ Load Balancers, Distributed Caching (Redis), Database Partitioning, Message Queues (Kafka) และการออกแบบ High Availability 99.99%',
    learningOutcomes: [
      'วิเคราะห์และประเมิน Capacity Planning (QPS, Storage, Bandwidth)',
      'เลือกใช้ Consistency Models (ACID vs BASE, CAP Theorem)',
      'ออกแบบระบบ Caching หลายชั้น (Browser, CDN, API Gateway, Redis)',
      'ผ่านการสัมภาษณ์ System Design สำหรับตำแหน่ง Senior / Lead ใน Tech Company'
    ],
    githubUrl: 'https://github.com/knowva-academy/system-design-case-studies',
    resources: [
      { id: 'res-sd1', title: 'System Design Interview & Architecture Blueprints (PDF)', url: 'https://example.com/system-design-blueprints.pdf', type: 'pdf', fileSize: '6.5 MB' },
      { id: 'res-sd2', title: 'High-Concurrency Benchmark & Load Testing Scripts', url: 'https://github.com/knowva-academy/system-design-case-studies', type: 'github' },
    ],
    lessons: [
      { id: 'sd-1', title: 'กรอบความคิดการออกแบบระบบ: Scale From Zero to Millions', duration: '38:00', videoUrl: 'https://www.youtube-nocookie.com/embed/5r98t4o56Jg?autoplay=1&rel=0', isFreePreview: true },
      { id: 'sd-2', title: 'Distributed Cache: Cache Aside, Write-Through และ Cache Stampede', duration: '55:00', videoUrl: 'https://www.youtube-nocookie.com/embed/k3Y02V0U_18?autoplay=1&rel=0' },
      { id: 'sd-3', title: 'Database Sharding, Replication Lag และ Consistent Hashing', duration: '58:20', videoUrl: 'https://www.youtube-nocookie.com/embed/M4NfS12-g2o?autoplay=1&rel=0' },
      { id: 'sd-4', title: 'Case Study: ออกแบบระบบ Live Flash Sale และ Ticket Booking', duration: '65:00', videoUrl: 'https://www.youtube-nocookie.com/embed/xpDnVSmNFX0?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'devops-k8s',
    title: 'Production DevOps, CI/CD & Kubernetes Mastery',
    slug: 'devops-kubernetes-mastery',
    subtitle: 'บริหารจัดการ Container บน Kubernetes Cluster, GitOps ด้วย ArgoCD, Helm และ Monitoring',
    category: 'enterprise',
    categoryLabel: 'Enterprise & 1-on-1',
    minTier: 'vip',
    level: 'Master',
    totalLessons: 26,
    totalDuration: '14 ชั่วโมง 15 นาที',
    rating: 4.95,
    studentsCount: 520,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    badge: 'ระดับสากล',
    description: 'ก้าวสู่งาน Infrastructure ระดับ Enterprise เรียนรู้การ Deploy และจัดการ Kubernetes Cluster บน Cloud (AWS EKS / GCP GKE), การทำ GitOps CI/CD ด้วย ArgoCD, การติดตั้ง Ingress Controller, Cert-Manager และการทำ Observability ด้วย Prometheus & Grafana',
    learningOutcomes: [
      'เข้าใจ Pod, Deployment, Service, ConfigMap, Secrets บน Kubernetes อย่างถ่องแท้',
      'เขียน Helm Charts จัดการ Environment Development, Staging และ Production',
      'ติดตั้ง GitOps Pipeline ด้วย ArgoCD ซิงค์โค้ดเข้าคลัสเตอร์อัตโนมัติ',
      'ออกแบบ Zero-Downtime Deployment (Rolling Updates, Canary, Blue-Green)'
    ],
    githubUrl: 'https://github.com/knowva-academy/k8s-gitops-production',
    resources: [
      { id: 'res-k1', title: 'Kubernetes Production Hardening Checklist (PDF)', url: 'https://example.com/k8s-checklist.pdf', type: 'pdf', fileSize: '4.5 MB' },
      { id: 'res-k2', title: 'ArgoCD & Helm Charts Starter Repository', url: 'https://github.com/knowva-academy/k8s-gitops-production', type: 'github' },
    ],
    lessons: [
      { id: 'k8s-1', title: 'ทำไมต้อง Kubernetes: องค์ประกอบของ Control Plane และ Node', duration: '36:00', videoUrl: 'https://www.youtube-nocookie.com/embed/X48VuDVv0do?autoplay=1&rel=0', isFreePreview: true },
      { id: 'k8s-2', title: 'Deployments, ReplicaSets และ Health Probes (Liveness/Readiness)', duration: '50:10', videoUrl: 'https://www.youtube-nocookie.com/embed/jBf7of9JTV8?autoplay=1&rel=0' },
      { id: 'k8s-3', title: 'Kubernetes Networking: ClusterIP, NodePort และ NGINX Ingress', duration: '54:00', videoUrl: 'https://www.youtube-nocookie.com/embed/T564D1M0V4k?autoplay=1&rel=0' },
      { id: 'k8s-4', title: 'GitOps ด้วย ArgoCD: Sync อัตโนมัติจาก GitHub สู่ Production Cluster', duration: '60:00', videoUrl: 'https://www.youtube-nocookie.com/embed/7-qE_Z39W9k?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'mentorship-capstone',
    title: '1-on-1 Mentorship & Enterprise Capstone Project',
    slug: 'vip-mentorship-capstone',
    subtitle: 'ทำโปรเจกต์ระดับ Production โดยมี Senior Software Architect เป็นโค้ชประกบตัวต่อตัว',
    category: 'enterprise',
    categoryLabel: 'Enterprise & 1-on-1',
    minTier: 'vip',
    level: 'Master',
    totalLessons: 10,
    totalDuration: '20 ชั่วโมง 00 นาที',
    rating: 5.00,
    studentsCount: 210,
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    badge: 'เอกสิทธิ์เฉพาะ VIP',
    description: 'สิทธิ์พิเศษเฉพาะผู้เรียนระดับ VIP Mentorship นัดหมายประชุม 1-on-1 ผ่าน Google Meet ตรวจสอบสถาปัตยกรรมโค้ด (Code Review) แบบบรรทัดต่อบรรทัด แนะนำการสัมภาษณ์งานระดับ Senior/Lead และการทำผลงาน Capstone โชว์ใน Portfolio ระดับโลก',
    learningOutcomes: [
      'รับ Code Review สดรายสัปดาห์จาก Senior / Staff Software Engineers',
      'ออกแบบและสร้าง Capstone Project ที่แก้ปัญหาธุรกิจจริงแบบ End-to-End',
      'จำลองการสัมภาษณ์งาน (Mock Technical Interview) พร้อม Feedback ละเอียด',
      'สิทธิ์แนะนำประวัติการทำงานเข้าสู่บริษัท Tech Partners ชั้นนำ'
    ],
    githubUrl: 'https://github.com/knowva-academy/vip-capstone-templates',
    resources: [
      { id: 'res-m1', title: 'VIP Mentorship Onboarding & Milestone Handbook (PDF)', url: 'https://example.com/vip-handbook.pdf', type: 'pdf', fileSize: '5.0 MB' },
      { id: 'res-m2', title: '1-on-1 Booking Calendar Link (Google Meet)', url: 'https://calendar.google.com/knowva-vip', type: 'link' },
    ],
    lessons: [
      { id: 'ment-1', title: 'การเตรียมโครงสร้างโปรเจกต์ Capstone และการเลือก Tech Stack', duration: '40:00', videoUrl: 'https://www.youtube-nocookie.com/embed/F38419g6V9Q?autoplay=1&rel=0', isFreePreview: true },
      { id: 'ment-2', title: 'แนวทางการตรวจโค้ด Code Review Checklist ระดับ Enterprise', duration: '45:00', videoUrl: 'https://www.youtube-nocookie.com/embed/Yp97O_s8v8o?autoplay=1&rel=0' },
      { id: 'ment-3', title: 'เทคนิคการนำเสนอผลงาน และการตอบคำถามเชิงเทคนิคในรอบสัมภาษณ์', duration: '50:00', videoUrl: 'https://www.youtube-nocookie.com/embed/sYwN9u3Pj_M?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'microservices-event-driven',
    title: 'Microservices & Event-Driven Architecture with Kafka',
    slug: 'microservices-event-driven',
    subtitle: 'ออกแบบระบบแบบกระจาย (Distributed Systems) ด้วย Event Sourcing, CQRS, Apache Kafka, gRPC และ Redis Caching',
    category: 'enterprise',
    categoryLabel: 'Enterprise & 1-on-1',
    minTier: 'vip',
    level: 'Master',
    totalLessons: 24,
    totalDuration: '14 ชั่วโมง 30 นาที',
    rating: 4.97,
    studentsCount: 430,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    badge: 'VIP Exclusive',
    description: 'ก้าวสู่การเป็นระดับ Enterprise Architect ด้วยการออกแบบระบบแบบ Microservices อย่างแท้จริง เจาะลึกการใช้ Apache Kafka เป็นกระดูกสันหลังในการรับส่งข้อมูลระหว่างเซอร์วิส, การทำ Event Sourcing & CQRS เพื่อรองรับ Audit Log สมบูรณ์แบบ และการทำ Distributed Transactions ด้วย Saga Pattern',
    learningOutcomes: [
      'เข้าใจ Domain-Driven Design (DDD) ในการตัดแบ่งขอบเขต Bounded Context',
      'ออกแบบ Event-Driven Architecture ด้วย Apache Kafka และ Schema Registry',
      'แก้ไขปัญหา Distributed Transactions ด้วย Saga Pattern (Orchestration vs Choreography)',
      'สื่อสารระหว่างเซอร์วิสความเร็วสูงด้วย gRPC และ Protocol Buffers (protobuf)'
    ],
    githubUrl: 'https://github.com/knowva-academy/kafka-microservices-starter',
    resources: [
      { id: 'res-ms1', title: 'Microservices Design Patterns & Saga Blueprint (PDF)', url: 'https://example.com/microservices-patterns.pdf', type: 'pdf', fileSize: '5.8 MB' },
      { id: 'res-ms2', title: 'Production Kafka Cluster Compose & Go/Node Services', url: 'https://github.com/knowva-academy/kafka-microservices-starter', type: 'github' },
    ],
    lessons: [
      { id: 'ms-1', title: 'Monolith to Microservices: ข้อดี-ข้อเสีย และการตัดสินใจแยกเซอร์วิส', duration: '42:00', videoUrl: 'https://www.youtube-nocookie.com/embed/Ch5bew7dp5k?autoplay=1&rel=0', isFreePreview: true },
      { id: 'ms-2', title: 'Apache Kafka Core: Topics, Partitions, Consumer Groups และ Offsets', duration: '52:10', videoUrl: 'https://www.youtube-nocookie.com/embed/kU_t4313_l4?autoplay=1&rel=0' },
      { id: 'ms-3', title: 'Saga Pattern: รับมือกับความล้มเหลวในธุรกรรมการเงินแบบกระจาย', duration: '56:00', videoUrl: 'https://www.youtube-nocookie.com/embed/q6t8rS6uF7A?autoplay=1&rel=0' },
      { id: 'ms-4', title: 'gRPC vs REST: สร้าง High-Throughput Inter-Service Communication', duration: '48:30', videoUrl: 'https://www.youtube-nocookie.com/embed/J8tV3q3Xh3c?autoplay=1&rel=0' }
    ]
  },
  {
    id: 'ai-infra-scale',
    title: 'Enterprise AI Infrastructure & Fine-Tuning at Scale',
    slug: 'enterprise-ai-infrastructure',
    subtitle: 'สร้าง Private LLM Cluster, Fine-Tuning Open Source Models (Llama 3, Mistral) และการ Deploy บน Kubernetes & GPU Cloud',
    category: 'enterprise',
    categoryLabel: 'Enterprise & 1-on-1',
    minTier: 'vip',
    level: 'Master',
    totalLessons: 22,
    totalDuration: '15 ชั่วโมง 00 นาที',
    rating: 4.99,
    studentsCount: 380,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    badge: 'ระดับองค์กร',
    description: 'หลักสูตรขั้นสูงสุดสำหรับองค์กรที่ต้องการความเป็นส่วนตัวและความปลอดภัยของข้อมูลระดับสูงสุด เรียนรู้วิธีการเทรนและ Fine-Tune Open Source LLM (เช่น Llama 3, Mistral 7B) บนข้อมูลเฉพาะทางของบริษัท การทำ Quantization (AWQ/GGUF) เพื่อลดต้นทุน VRAM และการติดตั้ง vLLM Cluster บน Kubernetes GPU Nodes',
    learningOutcomes: [
      'เข้าใจกระบวนการ Parameter-Efficient Fine-Tuning (PEFT) ด้วย LoRA / QLoRA',
      'เตรียม Dataset และทำ Data Cleansing & Synthetic Data Generation',
      'ทำ Model Quantization และ Benchmark Throughput ด้วย vLLM และ TensorRT-LLM',
      'สร้าง Private OpenAI-Compatible API Gateway ภายในองค์กรที่ปลอดภัย 100%'
    ],
    githubUrl: 'https://github.com/knowva-academy/private-llm-infra',
    resources: [
      { id: 'res-inf1', title: 'Enterprise LLM Fine-Tuning & GPU Sizing Guide (PDF)', url: 'https://example.com/llm-sizing.pdf', type: 'pdf', fileSize: '6.1 MB' },
      { id: 'res-inf2', title: 'vLLM Kubernetes GPU Deployment Manifests', url: 'https://github.com/knowva-academy/private-llm-infra', type: 'github' },
    ],
    lessons: [
      { id: 'inf-1', title: 'ภาพรวม Enterprise Private AI: ทำไมองค์กรใหญ่ถึงเลือกไม่ใช้ Cloud API', duration: '40:00', videoUrl: 'https://www.youtube-nocookie.com/embed/5sQQxtu-Gvk?autoplay=1&rel=0', isFreePreview: true },
      { id: 'inf-2', title: 'Fine-Tuning Llama 3 ด้วย LoRA / QLoRA บน Unsloth & Hugging Face', duration: '58:00', videoUrl: 'https://www.youtube-nocookie.com/embed/e-gwvmhyUHQ?autoplay=1&rel=0' },
      { id: 'inf-3', title: 'vLLM High-Throughput Serving Engine และ PagedAttention', duration: '54:30', videoUrl: 'https://www.youtube-nocookie.com/embed/eC6Hd1hFvos?autoplay=1&rel=0' },
      { id: 'inf-4', title: 'Deploy vLLM บน Kubernetes ด้วย GPU Operator และ Autoscaling', duration: '62:00', videoUrl: 'https://www.youtube-nocookie.com/embed/g68qLoQQnag?autoplay=1&rel=0' }
    ]
  }
];

export const TIER_BENEFITS = {
  free: {
    label: 'ผู้ใช้ทั่วไป (Free)',
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    description: 'เข้าถึงคอร์สฟรี 5 คอร์ส และคลิปตัวอย่างได้ตลอดเวลา',
    unlockedCategories: ['free-starter'] as string[],
    canAccessCourse: (minTier: 'free' | 'basic' | 'pro' | 'vip') => minTier === 'free',
  },
  basic: {
    label: 'Self-Paced (Basic)',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'เข้าถึงคอร์สระดับ Free + Basic (10 คอร์สเต็ม)',
    unlockedCategories: ['free-starter', 'foundations'],
    canAccessCourse: (minTier: 'free' | 'basic' | 'pro' | 'vip') => minTier === 'free' || minTier === 'basic',
  },
  pro: {
    label: 'Pro Cohort (ยอดนิยม)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'เข้าถึงคอร์สระดับ Free + Basic + Pro (15 คอร์สเต็ม)',
    unlockedCategories: ['free-starter', 'foundations', 'fullstack', 'ai-agents'],
    canAccessCourse: (minTier: 'free' | 'basic' | 'pro' | 'vip') => minTier === 'free' || minTier === 'basic' || minTier === 'pro',
  },
  vip: {
    label: 'VIP Mentorship (สูงสุด)',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'ปลดล็อกคลังคอร์สเรียนทั้งหมด 100% (20 คอร์ส) พร้อมสิทธิ์ 1-on-1 Mentorship',
    unlockedCategories: ['free-starter', 'foundations', 'fullstack', 'ai-agents', 'enterprise'],
    canAccessCourse: (minTier: 'free' | 'basic' | 'pro' | 'vip') => true,
  },
};
