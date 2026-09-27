# 🚀 KNOWVA Academy - Full-Stack Web & AI Engineering Platform

แพลตฟอร์มการเรียนรู้และระบบ Landing Page ระดับโปรดักชันสำหรับหลักสูตร **Full-Stack Web & AI Engineering Cohort** พัฒนาขึ้นด้วย **Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS + Supabase (PostgreSQL & Auth)** 

ครบวงจรทั้งหน้ารับสมัครผู้เรียน (Conversion-Optimized Landing Page), แดชบอร์ดห้องเรียนออนไลน์ (Student LMS Dashboard), ระบบจัดการสิทธิ์การเข้าถึงเนื้อหาตามแพ็กเกจ (Subscription Tier Entitlements), และระบบบริหารจัดการหลังบ้านสำหรับผู้ดูแลระบบและเจ้าหน้าที่ (Admin & Operations Portal)

---

## 📑 สารบัญ (Table of Contents)
- [✨ จุดเด่นและฟีเจอร์สำคัญ (Key Features)](#-จุดเด่นและฟีเจอร์สำคัญ-key-features)
- [🏛️ สถาปัตยกรรมระบบและจุดสำคัญ (Core Architecture & Key Highlights)](#️-สถาปัตยกรรมระบบและจุดสำคัญ-core-architecture--key-highlights)
- [📁 โครงสร้างโปรเจกต์ (Project Structure)](#-โครงสร้างโปรเจกต์-project-structure)
- [🗄️ โครงสร้างฐานข้อมูล (Database Schema & RLS)](#️-โครงสร้างฐานข้อมูล-database-schema--rls)
- [🛠️ เทคโนโลยีที่ใช้ (Tech Stack)](#️-เทคโนโลยีที่ใช้-tech-stack)
- [🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)](#-วิธีการติดตั้งและรันโปรเจกต์-getting-started)
- [📦 วิธีนำโปรเจกต์ขึ้น GitHub (Git & GitHub Step-by-Step)](#-วิธีนำโปรเจกต์ขึ้น-github-git--github-step-by-step)
- [🔐 การตั้งค่าสิทธิ์ Admin สำหรับทดสอบ (Admin Setup)](#-การตั้งค่าสิทธิ์-admin-สำหรับทดสอบ-admin-setup)

---

## ✨ จุดเด่นและฟีเจอร์สำคัญ (Key Features)

### 1. 🌐 Landing Page คุณภาพระดับโปรดักชัน (Public Landing Page)
- **Top Urgency Countdown Banner**: แถบแจ้งเตือนนับเวลาถอยหลังส่วนลดรอบ Early-bird
- **Single-Line Sticky Navbar & Scrollspy**: เมนูนำทางแบบบรรทัดเดียวไม่ตกบรรทัด พร้อมระบบ Scrollspy ไฮไลต์ตาม Section ที่กำลังดูอยู่แบบ Real-time
- **Interactive Terminal Hero Showcase**: หน้าจอจำลอง Terminal โค้ด Next.js และ AI Agent
- **Why Us Comparison**: เปรียบเทียบความแตกต่างระหว่าง Old Way vs KNOWVA แบบ Bento Grid
- **Real YouTube Preview Lessons**: วิดีโอทดลองเรียนจริง 3 ตอน (Embed YouTube คมชัดระดับ Full HD) สลับตอนได้ในตัว พร้อมระบบตัดเสียงอัตโนมัติเมื่อปิดหน้าต่าง
- **8-Week Detailed Curriculum**: รายละเอียดหลักสูตรแบบสัปดาห์ต่อสัปดาห์ พร้อมฟังก์ชันขยาย/ย่อเนื้อหา
- **6 Production Capstone Projects**: แสดงผลงานโปรเจกต์จริงพร้อม Tech Stack Tags
- **Transparent Pricing & Smart Checkout**: 3 แพ็กเกจราคา (Basic, Pro, VIP) พร้อมรองรับคูปองส่วนลด (`EARLYBIRD`, `DEV1000`), การเลือกวิธีชำระเงิน (PromptPay QR Code / บัตรเครดิต)

### 2. 🎓 ระบบห้องเรียนสำหรับผู้เรียน (Student LMS Dashboard - `/dashboard`)
- **Tier-based Access Control**: ล็อกหรือปลดล็อกคอร์สเรียนตามระดับสมาชิกของผู้เรียน (`free` < `basic` < `pro` < `vip`)
- **In-App Video Player**: เครื่องเล่นวิดีโอ YouTube ในตัว พร้อมปุ่มเล่นตอนถัดไป/ย้อนกลับ และแสดงรายชื่อบทเรียน
- **Lesson Progress Tracking**: บันทึกความคืบหน้าการเรียน (Checkmark) ลงฐานข้อมูล Supabase อัตโนมัติ
- **Course Resources & GitHub Links**: แหล่งดาวน์โหลดโค้ดตัวอย่าง, สไลด์บรรยาย (PDF), ไฟล์โปรเจกต์ (ZIP)
- **Personal Notes Engine**: กล่องจดบันทึกส่วนตัวของผู้เรียนในแต่ละคอร์ส พร้อมระบบบันทึกลง Local Cache
- **Interactive Search & Category Filters**: ค้นหาคอร์สเรียนตามชื่อ หรือคัดกรองตามหมวดหมู่ (Foundations, Full-Stack, AI Agents, Enterprise)
- **Direct Upsell Modal**: หากผู้เรียนคลิกคอร์สที่เกินระดับ Tier ของตนเอง ระบบจะแสดงหน้าต่างแนะนำอัปเกรดแพ็กเกจพร้อมสิทธิประโยชน์ทันที

### 3. 🛡️ ระบบบริหารจัดการหลังบ้านครบวงจร (Admin & Operations Portal - `/admin`)
- **ภาพรวมระบบ (Overview Dashboard - `/admin`)**: แสดงสถิติผู้เรียนทั้งหมด, ยอดสั่งซื้อ, รายรับรวม (Total Revenue), จำนวน Ticket ปัญหาที่รอดำเนินการ, รายการสั่งซื้อล่าสุด และคำร้องช่วยเหลือล่าสุด
- **จัดการผู้เรียน (Users Management - `/admin/users`)**: ค้นหารายชื่อผู้เรียน, ดูประวัติ, ปรับเปลี่ยนสิทธิ์บทบาท (`user`, `staff`, `admin`, `instructor`) และปรับเปลี่ยนระดับสมาชิก (`free`, `basic`, `pro`, `vip`) ได้โดยตรง
- **ตรวจสอบการชำระเงิน (Orders & Payments - `/admin/orders`)**: ตรวจสอบรายการสั่งซื้อและสลิปการโอนเงิน (PromptPay / Slip Verification), อนุมัติ (`completed`) หรือปฏิเสธ (`rejected`) พร้อมระบบ **Auto-grant Tier** อัปเกรดระดับผู้เรียนให้อัตโนมัติเมื่ออนุมัติ
- **ระบบช่วยเหลือผู้เรียน (Support Ticket Helpdesk - `/admin/tickets`)**: ระบบ Helpdesk จัดการ Ticket ตามหมวดหมู่ (เนื้อหา, เทคนิค, การเงิน, เมนเทอร์), ระดับความสำคัญ (Low, Medium, High, Urgent), และระบบแชตสนทนาโต้ตอบระหว่างทีมงานกับผู้เรียน
- **จัดการคอร์สเรียน (Course Management - `/admin/courses`)**: เพิ่ม แก้ไข อัปเดตสถานะคอร์ส (Draft / Published / Archived), กำหนดระดับ Tier ขั้นต่ำ, จำนวนชั่วโมง และจำนวนบทเรียน
- **จัดการข้อมูลผู้สอน (Instructors Management - `/admin/instructors`)**: บริหารข้อมูลทีมผู้สอน, รูปโปรไฟล์, ความเชี่ยวชาญ และลำดับการแสดงผล
- **สถิติและการวิเคราะห์ (Analytics - `/admin/analytics`)**: รายงานสถิติผู้เข้าเรียน, อัตราส่วนยอดขายแต่ละแพ็กเกจ, และพฤติกรรมการเรียน

---

## 🏛️ สถาปัตยกรรมระบบและจุดสำคัญ (Core Architecture & Key Highlights)

### 1. การรักษาความปลอดภัยและการแบ่งสิทธิ์ (Authentication & RBAC)
- **Role-Based Access Control (RBAC)**: แบ่งผู้ใช้ออกเป็น 4 บทบาท:
  - `user`: ผู้เรียนทั่วไป
  - `instructor`: ผู้สอน
  - `staff`: เจ้าหน้าที่ผู้ช่วยสอนและสนับสนุน
  - `admin`: ผู้ดูแลระบบสูงสุด
- **Subscription Tier Hierarchy**:
  - `free` (Level 0) → `basic` (Level 1) → `pro` (Level 2) → `vip` (Level 3)
- **Entitlement Verification Engine ([lib/auth/entitlements.ts](file:///lib/auth/entitlements.ts))**:
  - ตรวจสอบสิทธิ์การเข้าถึงคอร์สตามเงื่อนไขอย่างเข้มงวด
  - ระบบตรวจสอบคำสั่งซื้อที่ชำระเงินสำเร็จจริงจากตาราง `enrollments` เพื่อยืนยันว่าผู้เรียนจ่ายเงินจริงก่อนปลดล็อกเนื้อหา

### 2. Edge Middleware Route Guard ([middleware.ts](file:///middleware.ts))
- ป้องกันเส้นทาง `/admin` และเส้นทางย่อยทั้งหมดที่ระดับ Next.js Edge Middleware
- ดึง Session จาก Supabase Auth ผ่าน `@supabase/ssr`
- หากยังไม่ได้เข้าสู่ระบบ จะ Redirect ไปยังหน้าแรกพร้อม Query Parameter เพื่อเปิด Modal เข้าสู่ระบบ
- หากเข้าสู่ระบบแล้วแต่บทบาทไม่ใช่ `staff`, `admin`, หรือ `instructor` จะ Redirect ไปยัง `/dashboard` พร้อมแจ้งเตือนว่าไม่มีสิทธิ์เข้าถึง

### 3. Global State & Supabase Session Sync ([context/AppContext.tsx](file:///context/AppContext.tsx))
- บริหารจัดการ State ส่วนกลางด้วย React Context API
- ซิงค์สถานะการล็อกอินกับ Supabase Auth แบบ Real-time
- จัดการการเปิด-ปิด Modals ทั้งหมด (AuthModal, EnrollModal, PreviewVideoModal, SupportModal)
- จัดการ Toast Notifications แจ้งเตือนทั่วทั้งระบบ

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
course-landing-page/
├── app/
│   ├── admin/                         # 🛡️ ส่วนระบบบริหารจัดการหลังบ้าน (Admin Portal)
│   │   ├── analytics/page.tsx         # สถิติผู้เรียนและยอดขาย
│   │   ├── courses/page.tsx           # จัดการหลักสูตรและบทเรียน
│   │   ├── instructors/page.tsx       # จัดการข้อมูลผู้สอน
│   │   ├── orders/page.tsx            # ตรวจสอบรายการสั่งซื้อและสลิปชำระเงิน
│   │   ├── tickets/page.tsx           # ระบบแจ้งปัญหาและ Helpdesk แชต
│   │   ├── users/page.tsx             # จัดการผู้ใช้งาน สิทธิ์ และระดับสมาชิก
│   │   ├── layout.tsx                 # Admin Layout (Sidebar & Staff Guard)
│   │   └── page.tsx                   # ภาพรวมระบบหลังบ้าน (Overview Metrics)
│   ├── dashboard/                     # 🎓 ห้องเรียนออนไลน์สำหรับผู้เรียน (Student LMS)
│   │   ├── layout.tsx                 # Dashboard Layout & User Header
│   │   └── page.tsx                   # คลังคอร์ส, Video Player, โน้ตย่อ, เช็กบทเรียน
│   ├── reset-password/
│   │   └── page.tsx                   # หน้ารีเซ็ตรหัสผ่านผ่าน Supabase Auth
│   ├── globals.css                    # Tailwind CSS Directives & Custom Design System
│   ├── layout.tsx                     # Root Layout, Google Fonts (Prompt & Plus Jakarta Sans)
│   └── page.tsx                       # หน้าแรก Landing Page รวบรวมทุก Section
│
├── components/                        # 🧩 UI Components แบบแยกตามหน้าที่ (Modular)
│   ├── auth/
│   │   └── AuthModal.tsx              # Modal เข้าสู่ระบบ / สมัครสมาชิก / ลืมรหัสผ่าน
│   ├── curriculum/
│   │   └── CurriculumSection.tsx      # ส่วนแสดงเนื้อหาหลักสูตร 8 สัปดาห์
│   ├── enroll/
│   │   └── EnrollModal.tsx            # Modal ชำระเงิน (คูปองส่วนลด, PromptPay QR)
│   ├── faq/
│   │   └── FaqSection.tsx             # คำถามที่พบบ่อย (Accordion)
│   ├── footer/
│   │   └── Footer.tsx                 # ส่วนท้ายเว็บไซต์ พร้อม Call-to-Action
│   ├── hero/
│   │   └── HeroSection.tsx            # ส่วน Hero Header พร้อม Interactive Code Terminal
│   ├── instructor/
│   │   └── InstructorSection.tsx      # ส่วนแนะนำทีมผู้สอน
│   ├── navigation/
│   │   ├── Navbar.tsx                 # Single-line Navbar พร้อม Scrollspy & โปรไฟล์
│   │   └── TopBanner.tsx              # แถบแจ้งเตือนโปรโมชันนับถอยหลัง (Countdown)
│   ├── preview/
│   │   ├── PreviewVideoModal.tsx      # Modal วิดีโอทดลองเรียนจริง 3 ตอน (YouTube)
│   │   └── VideoPreviewSection.tsx    # Section แสดงคลิปทดลองเรียนบนหน้า Landing Page
│   ├── pricing/
│   │   └── PricingSection.tsx         # ตาราง 3 แพ็กเกจราคา พร้อมระบบ Auth Guard
│   ├── projects/
│   │   └── ProjectsSection.tsx        # แสดง 6 โครงงานจริงระดับ Enterprise
│   ├── reviews/
│   │   └── ReviewsSection.tsx         # รีวิวจากผู้เรียนจริง
│   ├── support/
│   │   └── SupportModal.tsx           # Modal ส่งคำร้องแจ้งปัญหา (Support Ticket)
│   ├── ui/
│   │   └── Toast.tsx                  # Floating Toast Notification
│   └── why-us/
│       └── WhyUsSection.tsx           # ส่วนเปรียบเทียบจุดเด่น Old Way vs KNOWVA
│
├── context/
│   └── AppContext.tsx                 # Global State Management (Supabase Auth, Modals, Toasts)
│
├── lib/                               # ⚙️ Business Logic, Helpers & Data
│   ├── auth/
│   │   └── entitlements.ts            # ระบบคำนวณและตรวจสอบสิทธิ์ Tier & Role
│   ├── supabase/
│   │   ├── client.ts                  # Supabase Browser Client (@supabase/ssr)
│   │   └── server.ts                  # Supabase Server Client
│   ├── coursesData.ts                 # ฐานข้อมูลคอร์สเรียน บทเรียน ลิงก์ดาวน์โหลด และสิทธิประโยชน์
│   ├── data.ts                        # ข้อมูลหลักสูตรเดิม, ราคา, FAQs, โปรเจกต์
│   └── utils.ts                       # ฟังก์ชันตัวช่วย (formatCurrency, classNames, YouTube Embed URL)
│
├── public/                            # 🖼️ Static Assets และรูปภาพผู้สอน
├── types/
│   └── index.ts                       # TypeScript Interfaces และ Type Definitions
├── middleware.ts                      # 🛡️ Next.js Route Guard สำหรับป้องกันเส้นทาง /admin
├── supabase_schema.sql                # 🗄️ ไฟล์คำสั่ง SQL สร้างตาราง, RLS Policies, และ Triggers
├── tailwind.config.ts                 # การตั้งค่า Tailwind CSS
├── tsconfig.json                      # การตั้งค่า TypeScript
├── .env.example                       # ตัวอย่างไฟล์ Environment Variables
└── package.json                       # สคริปต์และรายการ Dependencies
```

---

## 🗄️ โครงสร้างฐานข้อมูล (Database Schema & RLS)

โปรเจกต์นี้มาพร้อมไฟล์ `supabase_schema.sql` ซึ่งมีโครงสร้างตารางและนโยบายความปลอดภัย Row Level Security (RLS) ครบถ้วน:

| ตาราง (Table) | หน้าที่และความสำคัญ | RLS Security Policy |
| :--- | :--- | :--- |
| `profiles` | จัดเก็บข้อมูลผู้ใช้, สิทธิ์ (`role`: user, staff, admin, instructor) และระดับ (`tier`: free, basic, pro, vip) มี Trigger สร้างให้อัตโนมัติเมื่อ Sign Up | ทุกคนอ่านได้, เจ้าของแก้ไขได้, Admin จัดการได้ทั้งหมด |
| `enrollments` | ประวัติการสมัครเรียน, จำนวนเงิน, ช่องทางชำระเงิน, ลิงก์สลิป, สถานะ (`pending`, `completed`, `rejected`) | ผู้เรียนดูของตัวเองได้, Staff/Admin ดูและอัปเดตได้ทุกคน |
| `lesson_progress` | บันทึกการเรียนจบในแต่ละบทเรียนของผู้เรียนแต่ละคน (`lesson_id`, `is_completed`) | ผู้เรียนดูและแก้ไขของตนเองได้ |
| `support_tickets` | รายการแจ้งปัญหาจากผู้เรียน (หมวดหมู่, ความสำคัญ, สถานะ, ผู้รับผิดชอบ, บันทึกเจ้าหน้าที่) | ผู้เรียนดูและส่งของตนเองได้, Staff/Admin ดูและจัดการได้ทุกเคส |
| `ticket_messages` | ข้อความสนทนาตอบกลับในแต่ละ Ticket ระหว่างทีมงานกับผู้เรียน | เฉพาะเจ้าของ Ticket และ Staff/Admin ที่สามารถดูและส่งข้อความได้ |
| `courses` | รายการคอร์สเรียน, ระดับ Tier ขั้นต่ำ, หมวดหมู่, จำนวนชั่วโมง, วิดีโอ | ทุกคนอ่านคอร์สที่ Published ได้, Staff/Admin สร้าง/แก้ไขได้ |
| `instructors` | ข้อมูลทีมผู้สอน, ประสบการณ์, ป้ายกำกับ (Badge), การจัดเรียง | ทุกคนดูได้, Admin จัดการได้ |
| `reviews` | ข้อคิดเห็นและคะแนนรีวิวจากผู้เรียน | ทุกคนอ่านและส่งรีวิวได้ |

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend Core**: [Next.js 14 (App Router)](https://nextjs.org/) + [React 18](https://react.dev/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL Database, Auth SSR, Row Level Security)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Prompt & Plus Jakarta Sans via Google Fonts

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. ความต้องการของระบบ (Prerequisites)
- [Node.js](https://nodejs.org/) เวอร์ชั่น 18.17.0 ขึ้นไป
- บัญชี [Supabase](https://supabase.com/) สำหรับจัดการฐานข้อมูลและระบบยืนยันตัวตน

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env.local`:
```bash
cp .env.example .env.local
```
จากนั้นเปิดไฟล์ `.env.local` และระบุค่า URL และ Anon Key ของ Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. รัน Database Schema บน Supabase
1. ไปที่ Supabase Dashboard เลือกโปรเจกต์ของคุณ
2. เข้าไปที่เมนู **SQL Editor**
3. คัดลอกเนื้อหาทั้งหมดจากไฟล์ [supabase_schema.sql](file:///supabase_schema.sql) ไปวางแล้วกด **Run**
4. ระบบจะสร้างตารางทั้งหมด 8 ตาราง พร้อม RLS Policies และ Functions ให้อัตโนมัติ

### 5. เริ่มรัน Development Server
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 6. ทดสอบและ Build สำหรับ Production
```bash
npm run build
npm run start
```

---

## 📦 วิธีนำโปรเจกต์ขึ้น GitHub (Git & GitHub Step-by-Step)

> [!IMPORTANT]
> แนะนำให้รันคำสั่ง Git ภายในโฟลเดอร์ `course-landing-page` โดยตรง เพื่อให้ Root ของ GitHub Repository ตรงกับตัวโปรเจกต์ Next.js ซึ่งจะช่วยให้การเชื่อมต่อและ Deploy บน **Vercel** หรือผู้ให้บริการอื่นๆ เป็นไปอย่างราบรื่นทันทีโดยไม่ต้องตั้งค่า Root Directory เพิ่มเติม

### ขั้นตอนการ Push ขึ้น GitHub:

1. **สร้าง Repository เปล่าบน GitHub**:
   - ไปที่ [GitHub -> New Repository](https://github.com/new)
   - ตั้งชื่อ Repository (เช่น `knowva-cohort-platform`)
   - เลือกเป็น **Public** หรือ **Private** ตามต้องการ
   - **ไม่ต้อง** ติ๊กเลือก "Add a README file" หรือ ".gitignore" (เพราะโปรเจกต์มีเตรียมไว้แล้ว)
   - กดปุ่ม **Create repository**

2. **เปิด Terminal เข้าสู่โฟลเดอร์โปรเจกต์**:
   ```bash
   cd e:\knowva_Page\course-landing-page
   ```

3. **เตรียม Git และ Commit ไฟล์ทั้งหมด**:
   ```bash
   # เริ่มต้น Git
   git init

   # ตรวจสอบสถานะไฟล์ (ไฟล์ .env.local และ node_modules จะถูกละเว้นโดยอัตโนมัติ)
   git status

   # เพิ่มไฟล์ทั้งหมดเข้า Stage
   git add .

   # Commit ไฟล์ครั้งแรก
   git commit -m "feat: initial release of KNOWVA Academy Landing Page and LMS Platform"
   ```

4. **เชื่อมต่อกับ GitHub และ Push โค้ด**:
   ```bash
   # เปลี่ยนชื่อ branch หลักเป็น main
   git branch -M main

   # เชื่อมต่อกับ Remote Repository (นำ URL จาก GitHub ที่สร้างไว้มาแทนที่)
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

   # Push โค้ดขึ้น GitHub
   git push -u origin main
   ```

> [!TIP]
> ไฟล์ `.env.local` ถูกกำหนดไว้ใน `.gitignore` เรียบร้อยแล้ว ข้อมูล Secret ต่างๆ จะไม่ถูกอัปโหลดขึ้น GitHub อย่างแน่นอน

---

## 🔐 การตั้งค่าสิทธิ์ Admin สำหรับทดสอบ (Admin Setup)

หลังจากสมัครสมาชิกหรือเข้าสู่ระบบผ่านหน้าเว็บแล้ว ต้องการตั้งค่าให้บัญชีของตนเองเป็น **Admin** หรือ **Staff** เพื่อเข้าใช้งานระบบ `/admin`:

### วิธีที่ 1: ผ่าน Supabase Dashboard Table Editor
1. เข้าไปที่ [Supabase Dashboard](https://supabase.com/dashboard) -> เลือกโปรเจกต์ -> ไปที่ **Table Editor**
2. เลือกตาราง `profiles`
3. ค้นหาแถวของบัญชีอีเมลของคุณ
4. ดับเบิ้ลคลิกแก้ไขคอลัมน์ `role` จาก `user` ให้เป็น `'admin'` หรือ `'staff'`
5. ดับเบิ้ลคลิกแก้ไขคอลัมน์ `tier` ให้เป็น `'vip'`
6. บันทึก จากนั้นรีเฟรชหน้าเว็บ คุณจะสามารถเข้าใช้งานเมนู `/admin` ได้ทันที

### วิธีที่ 2: ผ่าน Supabase SQL Editor
รันคำสั่ง SQL สั้นๆ นี้ในหน้า SQL Editor:
```sql
UPDATE public.profiles 
SET role = 'admin', tier = 'vip' 
WHERE email = 'your-email@example.com';
```

---

## 📄 ใบอนุญาต (License)
ลิขสิทธิ์ © 2026 KNOWVA Academy. สงวนลิขสิทธิ์ทุกประการ
