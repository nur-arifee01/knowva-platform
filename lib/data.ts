import { PlanDetail, PreviewEpisode, ProjectItem, CurriculumWeek, FaqItem, StudentReview } from '@/types';

export const PREVIEW_VIDEOS: PreviewEpisode[] = [
  {
    ep: 1,
    title: 'EP.01: Full-Stack Web Development & AI Overview',
    description: 'ปูพื้นฐานการพัฒนา Full-Stack Web Application ผสานเทคโนโลยี AI และ Generative Tools ยุคใหม่เพื่อการทำงานอย่างมีประสิทธิภาพ',
    duration: 'บทเรียนฟรี (28 นาที)',
    videoUrl: 'https://www.youtube-nocookie.com/embed/LzMnsfqjzkA?autoplay=1&rel=0',
    youtubeId: 'LzMnsfqjzkA',
    thumbnail: 'https://img.youtube.com/vi/LzMnsfqjzkA/hqdefault.jpg',
    topic: 'Full-Stack & AI Foundations'
  },
  {
    ep: 2,
    title: 'EP.02: Next.js E-Commerce App & Admin Panel UI Design',
    description: 'เจาะลึกการออกแบบและพัฒนา Modern E-Commerce Platform พร้อมระบบ Admin Dashboard จัดการข้อมูลแบบ Real-time',
    duration: 'บทเรียนฟรี (42 นาที)',
    videoUrl: 'https://www.youtube-nocookie.com/embed/6dvYioHX328?autoplay=1&rel=0',
    youtubeId: '6dvYioHX328',
    thumbnail: 'https://img.youtube.com/vi/6dvYioHX328/hqdefault.jpg',
    topic: 'Next.js 15 & Admin Dashboard'
  },
  {
    ep: 3,
    title: 'EP.03: RESTful API & Backend Integration Guide',
    description: 'พื้นฐานและการออกแบบ API การรับส่งข้อมูล Request/Response และการเชื่อมต่อ Backend เข้ากับ Frontend อย่างมืออาชีพ',
    duration: 'บทเรียนฟรี (35 นาที)',
    videoUrl: 'https://www.youtube-nocookie.com/embed/tpS0clmE9HY?autoplay=1&rel=0',
    youtubeId: 'tpS0clmE9HY',
    thumbnail: 'https://img.youtube.com/vi/tpS0clmE9HY/hqdefault.jpg',
    topic: 'RESTful API & Architecture'
  }
];

export const PRICING_PLANS: Record<string, PlanDetail> = {
  basic: {
    id: 'basic',
    name: 'Self-Paced (เรียนรู้ด้วยตนเอง)',
    subtitle: 'เหมาะสำหรับผู้ที่ต้องการเรียนตามเวลาที่สะดวก เข้าถึงเนื้อหาตลอดชีพ',
    originalPrice: 6900,
    price: 3990,
    features: [
      'เข้าถึงวิดีโอบทเรียน 120+ ตอน ความยาว 45+ ชั่วโมง',
      'อัปเดตเนื้อหาตามเทคโนโลยีใหม่ตลอดชีพ',
      'เข้าถึง Source Code และโปรเจกต์ตัวอย่าง 6 โปรเจกต์',
      'สิทธิ์เข้ากลุ่ม Community สอบถามข้อสงสัยทั่วไป',
      'ใบประกาศนียบัตรรับรองการสำเร็จหลักสูตร (Certificate)'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro Cohort (ยอดนิยม • พร้อมโค้ชชิ่ง)',
    badge: 'แนะนำ • คุ้มค่าที่สุด',
    subtitle: 'เรียนแบบมีโครงสร้าง มีการตรวจการบ้านและโค้ชชิ่งสดทุกสัปดาห์',
    originalPrice: 12900,
    price: 6990,
    popular: true,
    features: [
      'ทุกอย่างที่อยู่ในแพ็กเกจ Self-Paced',
      'Live Coaching ทุกวันเสาร์ 8 สัปดาห์เต็ม (ถาม-ตอบสด)',
      'ตรวจ Code Review ส่วนตัวทุกโปรเจกต์ พร้อมคำแนะนำปรับปรุง',
      'สิทธิ์เข้า Discord VIP Channel แลกเปลี่ยนกับเพื่อนร่วมรุ่น',
      'สิทธิ์ร่วม Hackathon ประจำรุ่น ลุ้นรับทุนสนับสนุนโปรเจกต์',
      'ตรวจ Resume และ Portfolio เตรียมสัมภาษณ์งาน'
    ]
  },
  vip: {
    id: 'vip',
    name: 'VIP Mentorship (โค้ชชิ่งตัวต่อตัว)',
    badge: 'จำกัด 10 ท่าน/รุ่น',
    subtitle: 'ดูแลใกล้ชิดแบบ 1-on-1 สำหรับผู้ที่ต้องการเร่งความก้าวหน้าอย่างรวดเร็ว',
    originalPrice: 25000,
    price: 14900,
    features: [
      'ทุกอย่างที่อยู่ในแพ็กเกจ Pro Cohort',
      '1-on-1 Private Mentoring ผ่าน Zoom 4 ครั้ง (ครั้งละ 60 นาที)',
      'ให้คำปรึกษาและวางสถาปัตยกรรมสำหรับโปรเจกต์ส่วนตัวหรือ Startup ของคุณ',
      'Mock Interview สัมภาษณ์งานจำลองแบบเสมือนจริง 1 ครั้ง',
      'การันตีช่วยตรวจและขัดเกลา Portfolio ระดับ Production',
      'ช่องทางแชตส่วนตัวกับผู้สอนตลอด 8 สัปดาห์'
    ]
  }
};

export const CURRICULUM_WEEKS: CurriculumWeek[] = [
  {
    week: 1,
    title: 'Modern Web Architecture & TypeScript Mastery',
    subtitle: 'ปูพื้นฐานการพัฒนาเว็บยุคใหม่ TypeScript และสถาปัตยกรรม Component',
    projectTag: 'Project 0: Dev Environment Setup',
    topics: [
      'สถาปัตยกรรม Client-Side vs Server-Side Rendering (SSR/SSG/ISR)',
      'TypeScript สำหรับโปรดักชัน: Generics, Utility Types และ Type-Safe Patterns',
      'Tailwind CSS ขั้นสูง: Design System, Tokens, Container Queries และ Responsive Layouts',
      'การจัดโครงสร้างโค้ดแบบ Clean Architecture ในโปรเจกต์ขนาดใหญ่'
    ]
  },
  {
    week: 2,
    title: 'Next.js 15 App Router & Server Components',
    subtitle: 'เจาะลึก React Server Components, Server Actions และระบบ Routing',
    projectTag: 'Project 1: SaaS Marketing Engine',
    topics: [
      'ความเข้าใจลึกซึ้งเกี่ยวกับ Server vs Client Component Boundary',
      'Server Actions: จัดการ Mutation ข้อมูลโดยไม่ต้องเขียน API Endpoints แยก',
      'Streaming HTML, Suspense และ Progressive Loading',
      'Data Fetching, Parallel Routes และ Intercepting Routes'
    ]
  },
  {
    week: 3,
    title: 'Database Architecture with Supabase & PostgreSQL',
    subtitle: 'ออกแบบฐานข้อมูล จัดการ Relations, Auth และ Row-Level Security',
    projectTag: 'Project 2: Multi-tenant Management Platform',
    topics: [
      'การออกแบบ Schema เชิงสัมพันธ์และการทำ Indexing เพื่อประสิทธิภาพสูงสุด',
      'PostgreSQL Functions, Triggers และ Real-time Change Subscriptions',
      'Row Level Security (RLS): กำหนดสิทธิ์ความปลอดภัยในระดับ Database Layer',
      'Prisma ORM vs Drizzle ORM: Type-Safe Database Access'
    ]
  },
  {
    week: 4,
    title: 'Generative AI Integration & LLM APIs',
    subtitle: 'เชื่อมต่อ OpenAI, Claude และ Gemini เข้ากับ Web Application',
    projectTag: 'Project 3: AI Document Analyst',
    topics: [
      'พื้นฐาน LLM Architecture: Tokens, Context Windows, และ Temperature',
      'Vercel AI SDK: สร้างแอปพลิเคชัน AI ด้วย Hook useChat และ useCompletion',
      'Streaming Text Responses และการจัดการ Token Flow แบบ Real-time',
      'Function Calling / Tool Use: สั่งให้โมเดล AI เรียกใช้ฟังก์ชันในโค้ดของเรา'
    ]
  },
  {
    week: 5,
    title: 'RAG Architecture & Vector Search',
    subtitle: 'สร้างระบบค้นหาอัจฉริยะ (Retrieval-Augmented Generation) และ Embeddings',
    projectTag: 'Project 4: Enterprise Knowledge Chatbot',
    topics: [
      'Vector Embeddings: การแปลงข้อความเป็นเวกเตอร์ตัวเลขเพื่อคำนวณความเหมือน',
      'การจัดเก็บและค้นหาความคล้ายคลึงด้วย pgvector ใน PostgreSQL',
      'Chunking Strategies: เทคนิคการตัดแบ่งเอกสาร PDF/Text อย่างมีประสิทธิภาพ',
      'Hybrid Search: ผสาน Full-Text Search กับ Vector Similarity Search'
    ]
  },
  {
    week: 6,
    title: 'Autonomous AI Agents & Workflows',
    subtitle: 'สร้าง AI Agent ที่สามารถคิด วางแผน และดำเนินงานหลายขั้นตอนอัตโนมัติ',
    projectTag: 'Project 5: Autonomous Market Research Agent',
    topics: [
      'สถาปัตยกรรม ReAct (Reasoning + Acting) และ Agentic Design Patterns',
      'Multi-Agent Coordination: ให้โมเดล AI หลายตัวทำงานร่วมกันเพื่อแก้ปัญหาใหญ่',
      'การจัดการ Long-term Memory และ State Persistence ใน Agent',
      'Human-in-the-loop: ระบบให้มนุษย์อนุมัติการทำงานก่อน Agent ดำเนินการจริง'
    ]
  },
  {
    week: 7,
    title: 'Authentication, Payments & Security',
    subtitle: 'สร้างระบบสมาชิก ระบบสิทธิ์ RBAC และระบบรับชำระเงินที่พร้อมใช้งานเชิงพาณิชย์',
    projectTag: 'Full Commercial Security Flow',
    topics: [
      'Modern Authentication: NextAuth / Auth.js, OAuth (Google/GitHub/LINE)',
      'Role-Based Access Control (RBAC) และ Session Management',
      'Payment Gateway Integration: Stripe & QR พร้อมเพย์แบบ Webhook Verification',
      'Security Hardening: CSRF, XSS, Rate Limiting และ Data Encryption'
    ]
  },
  {
    week: 8,
    title: 'Production Deployment, CI/CD & Scaling',
    subtitle: 'Deploy สู่ Vercel, Docker, การทำ Caching และมอนิเตอร์ประสิทธิภาพ',
    projectTag: 'Capstone Project: Full-Stack AI Enterprise App',
    topics: [
      'Automated CI/CD Pipeline ด้วย GitHub Actions',
      'Edge Functions, Global CDN และ Advanced Caching Strategies',
      'Core Web Vitals Optimization: LCP, INP, CLS ให้คะแนนเขียว 95+',
      'Error Monitoring, Logging (Sentry) และ Analytics เพื่อตรวจจับบั๊กในโปรดักชัน'
    ]
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: 'AI Smart Chatbot & Document Q&A',
    description: 'ระบบแชตบอตที่สามารถอัปโหลดไฟล์ PDF/Docs ขนาดใหญ่ แล้วตอบคำถามพร้อมอ้างอิงหน้าเอกสารด้วยเทคนิค RAG',
    tags: ['Next.js 15', 'OpenAI API', 'pgvector', 'Supabase'],
    category: 'RAG & Document Intelligence',
    icon: 'Brain',
    outcome: 'เข้าใจการทำ Embeddings และการเชื่อมต่อฐานข้อมูลเวกเตอร์'
  },
  {
    id: 2,
    title: 'Modern E-Commerce with Stripe & PromptPay',
    description: 'ระบบร้านค้าออนไลน์เต็มรูปแบบ มีตระกร้าสินค้า ระบบสต็อกสินค้า และเชื่อมต่อระบบชำระเงินครบวงจร',
    tags: ['Next.js 15', 'Tailwind', 'Stripe', 'Webhooks'],
    category: 'Full-Stack E-Commerce',
    icon: 'ShoppingBag',
    outcome: 'เขียน Webhook รับยอดเงินและจัดการ Transaction ระดับโปรดักชัน'
  },
  {
    id: 3,
    title: 'Multi-Tenant SaaS Workspace',
    description: 'แพลตฟอร์มจัดการงานสไตล์ Notion/Slack รองรับการแยกข้อมูลแต่ละบริษัท (Multi-Tenant) และกำหนดสิทธิ์ RBAC',
    tags: ['PostgreSQL', 'RLS', 'Prisma', 'NextAuth'],
    category: 'Enterprise Architecture',
    icon: 'Layers',
    outcome: 'สถาปัตยกรรมความปลอดภัยระดับสูง แยกข้อมูลผู้ใช้อย่างรัดกุม'
  },
  {
    id: 4,
    title: 'AI Market Research & Scraping Agent',
    description: 'เอเจนต์อัจฉริยะที่สามารถค้นหาข้อมูลคู่แข่งจากอินเทอร์เน็ต สรุปแนวโน้ม และเขียนรายงานให้อัตโนมัติใน 3 นาที',
    tags: ['Claude 3.5', 'Tool Calling', 'Puppeteer', 'Streaming'],
    category: 'Autonomous Agents',
    icon: 'Sparkles',
    outcome: 'สร้าง AI Agent ที่คิดและตัดสินใจทำงานหลายขั้นตอนได้เอง'
  },
  {
    id: 5,
    title: 'Real-Time Collaborative Canvas',
    description: 'กระดานไวท์บอร์ดที่ทำงานร่วมกันแบบ Real-time หลายคนพร้อมกัน พร้อมฟีเจอร์ AI ช่วยต่อยอดไอเดีย',
    tags: ['WebSockets', 'Supabase Realtime', 'Canvas API'],
    category: 'Real-Time Collaboration',
    icon: 'Users',
    outcome: 'จัดการ Concurrency, State Conflict และ Real-time Sync'
  },
  {
    id: 6,
    title: 'Capstone: Full-Scale Production AI Platform',
    description: 'โปรเจกต์จบหลักสูตรที่คุณจะได้เลือกทำโซลูชันเพื่อแก้ปัญหาจริง พร้อม Deploy และนำไปแสดงใน Portfolio ได้ทันที',
    tags: ['Docker', 'Vercel', 'CI/CD', 'Sentry'],
    category: 'Production Capstone',
    icon: 'Rocket',
    outcome: 'มีผลงานจริงบนโลกออนไลน์ไว้โชว์นายจ้างหรือใช้สร้างธุรกิจ'
  }
];

export const FAQS: FaqItem[] = [
  {
    question: 'ไม่มีพื้นฐานการเขียนโปรแกรมมาก่อน สามารถเรียนคอร์สนี้ได้หรือไม่?',
    answer: 'คอร์สนี้ออกแบบให้เรียนรู้ตั้งแต่รากฐานของ Web Development และ JavaScript/TypeScript สมัยใหม่ แต่หากคุณมีพื้นฐาน Logic เบื้องต้นจะช่วยให้ไปได้เร็วยิ่งขึ้น เรามีโมดูลปูพื้นฐานสัปดาห์แรกแบบ Step-by-Step พร้อมผู้ช่วยตอบคำถามใน Discord ครับ'
  },
  {
    question: 'สามารถดูย้อนหลังได้หรือไม่ และเข้าถึงเนื้อหาได้นานแค่ไหน?',
    answer: 'สามารถดูย้อนหลังได้ตลอด 24 ชั่วโมงแบบไม่มีวันหมดอายุ (Lifetime Access) และคุณจะได้รับสิทธิ์เข้าถึงเนื้อหาที่อัปเดตเพิ่มเติมในอนาคตฟรีโดยไม่มีค่าใช้จ่ายเพิ่มเติมครับ'
  },
  {
    question: 'หากติดปัญหาหรือเกิดข้อสงสัยระหว่างทำโปรเจกต์ มีผู้ช่วยตอบคำถามหรือไม่?',
    answer: 'มีทีมผู้ช่วยสอน (Teaching Assistant) และผู้สอนคอยตอบคำถามในกลุ่ม Discord VIP ทุกวันทำการ สำหรับผู้เรียนแพ็กเกจ Pro Cohort และ VIP จะมีการตรวจโค้ดส่วนตัวและ Live Coaching ทุกสัปดาห์'
  },
  {
    question: 'มีใบประกาศนียบัตร (Certificate) หลังเรียนจบหรือไม่?',
    answer: 'มีครับ เมื่อคุณส่งโปรเจกต์ครบตามเกณฑ์ที่กำหนด จะได้รับ Verified Digital Certificate ที่สามารถนำไปแนบใน LinkedIn หรือ Portfolio สมัครงานได้ทันที'
  },
  {
    question: 'สามารถขอใบกำกับภาษี หรือเบิกค่าใช้จ่ายกับบริษัทได้หรือไม่?',
    answer: 'สามารถออกใบกำกับภาษีและใบเสร็จรับเงินในนามบุคคลหรือนิติบุคคลได้เต็มรูปแบบครับ หลังจากสมัครเรียนแล้วสามารถแจ้งทีมงานผ่านอีเมลหรือช่องทาง LINE ได้ทันทีครับ'
  }
];

export const REVIEWS: StudentReview[] = [
  {
    name: 'กิตติพงษ์ ว.',
    role: 'Frontend Developer & AI Enthusiast',
    company: 'Fintech Startup',
    avatarText: 'ก',
    review: 'เนื้อหาอัปเดตมากครับ ปกติหาคอร์สที่สอน Next.js 15 คู่กับ Generative AI แบบลึกๆ ได้ยากมาก คอร์สนี้สอนตั้งแต่ RAG, Vector Search จนถึง Agent ทำให้ผมนำไปต่อยอดในงานประจำได้ทันที คุ้มค่าที่สุดครับ',
    rating: 5,
    batch: 'รุ่นที่ 6'
  },
  {
    name: 'สิรินธร ม.',
    role: 'Product Manager',
    company: 'Tech Enterprise',
    avatarText: 'ส',
    review: 'ชอบการสอนที่เน้น Practical Architecture มากค่ะ ไม่ได้แค่สอนก๊อปปี้โค้ด แต่สอนให้เข้าใจว่าทำไมถึงต้องออกแบบระบบแบบนี้ ปัจจุบันสามารถคุยกับทีม Engineer รู้เรื่องและเข้าใจกระบวนการสร้าง AI App ชัดเจนขึ้นมาก',
    rating: 5,
    batch: 'รุ่นที่ 7'
  },
  {
    name: 'ธนภัทร ร.',
    role: 'Full-Stack Developer (Career Switcher)',
    company: 'Software House',
    avatarText: 'ธ',
    review: 'จากคนที่ไม่มีผลงานเด่นๆ หลังเรียนจบและทำตาม 6 โปรเจกต์จนครบ ผมมีพอร์ตที่นำไปสัมภาษณ์งานแล้วได้ Offer ทันที ระบบตรวจโค้ดและคำแนะนำของผู้สอนตรงจุดและมีประโยชน์มากครับ',
    rating: 5,
    batch: 'รุ่นที่ 7'
  }
];

