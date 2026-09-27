/**
 * MINIMAL WHITE COURSE LANDING PAGE
 * Interactive Script: Countdown, Dialogs with light-dismiss fallback,
 * Dynamic coupon calculator, and Smooth UX.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initHeaderScroll();
  initMobileMenu();
  initScrollSpy();
  initAuth();
  initModals();
  initPreviewVideos();
  initPricingAndCheckout();
  initCurriculumControls();
  initFaqSearchFallback();
  initHeroTabs();
});

/* ==========================================================================
   1. COUNTDOWN TIMER (Top Banner & Urgency)
   ========================================================================== */
function initCountdown() {
  // Set target date 2 days from now (or midnight tomorrow)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);
  targetDate.setHours(23, 59, 59, 999);

  function update() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      document.querySelectorAll('.countdown-text').forEach(el => el.textContent = 'โปรโมชั่นสิ้นสุดแล้ว');
      return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');
    const timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    document.querySelectorAll('.countdown-display').forEach(el => {
      el.textContent = timeString;
    });

    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(minutes);
    if (secsEl) secsEl.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. HEADER SCROLL & MOBILE MENU
   ========================================================================== */
function initHeaderScroll() {
  // ปิดการทำงานของ scroll listener เพื่อให้ขนาดและรูปแบบของแถบ Navbar คงที่ตลอดเวลา ไม่หดเล็กลงเมื่อเลื่อนหน้าจอ
  const header = document.querySelector('.glass-header');
  if (!header) return;
  header.classList.remove('scrolled');
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
    }
  });

  // Close menu when clicking nav links
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   2.1 SCROLLSPY / ACTIVE TABBAR SECTION INDICATOR
   ========================================================================== */
function initScrollSpy() {
  const desktopLinks = document.querySelectorAll('header nav a.nav-link');
  const mobileLinks = document.querySelectorAll('#mobileMenu a.nav-link-mobile');
  const sectionIds = ['why-us', 'curriculum', 'projects', 'instructor', 'reviews', 'pricing', 'faq'];

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const offset = 140; // 41px urgency banner + 72px navbar + buffer

    let activeId = '';

    // If near the bottom of the page, activate the last section (faq)
    if (scrollY + windowHeight >= documentHeight - 60) {
      activeId = sectionIds[sectionIds.length - 1];
    } else if (scrollY > 280) {
      // Traverse sections backwards to find which one is currently in view
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop - offset;
          if (scrollY >= sectionTop) {
            activeId = id;
            break;
          }
        }
      }
    }

    // Update Desktop Nav Links
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Mobile Nav Links
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ==========================================================================
   3. AUTHENTICATION & LOGIN MANAGEMENT
   ========================================================================== */
const AUTH_STORAGE_KEY = 'knowva_current_user';
let currentUser = null;
let pendingEnrollPlan = null;

function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      currentUser = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading auth from storage:', e);
    currentUser = null;
  }
}

function saveUserToStorage(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  updateAuthUI();
}

function updateAuthUI() {
  const authLoginBtn = document.getElementById('authLoginBtn');
  const userProfileNav = document.getElementById('userProfileNav');
  const userNameNav = document.getElementById('userNameNav');
  const userAvatarText = document.getElementById('userAvatarText');
  const dropdownUserFullName = document.getElementById('dropdownUserFullName');
  const dropdownUserEmail = document.getElementById('dropdownUserEmail');

  const mobileAuthGuest = document.getElementById('mobileAuthGuest');
  const mobileAuthUser = document.getElementById('mobileAuthUser');
  const mobileUserName = document.getElementById('mobileUserName');
  const mobileUserEmail = document.getElementById('mobileUserEmail');
  const mobileUserAvatar = document.getElementById('mobileUserAvatar');

  if (currentUser) {
    // Desktop UI
    if (authLoginBtn) authLoginBtn.classList.add('hidden');
    if (userProfileNav) userProfileNav.classList.remove('hidden');
    if (userNameNav) userNameNav.textContent = currentUser.name;
    if (userAvatarText) userAvatarText.textContent = (currentUser.name || 'U').charAt(0).toUpperCase();
    if (dropdownUserFullName) dropdownUserFullName.textContent = currentUser.name;
    if (dropdownUserEmail) dropdownUserEmail.textContent = currentUser.email;

    // Mobile UI
    if (mobileAuthGuest) mobileAuthGuest.classList.add('hidden');
    if (mobileAuthUser) mobileAuthUser.classList.remove('hidden');
    if (mobileUserName) mobileUserName.textContent = currentUser.name;
    if (mobileUserEmail) mobileUserEmail.textContent = currentUser.email;
    if (mobileUserAvatar) mobileUserAvatar.textContent = (currentUser.name || 'U').charAt(0).toUpperCase();
  } else {
    // Desktop UI
    if (authLoginBtn) authLoginBtn.classList.remove('hidden');
    if (userProfileNav) userProfileNav.classList.add('hidden');

    // Mobile UI
    if (mobileAuthGuest) mobileAuthGuest.classList.remove('hidden');
    if (mobileAuthUser) mobileAuthUser.classList.add('hidden');
  }
}

function openAuthModal(reason = null) {
  const authModal = document.getElementById('authModal');
  if (!authModal) return;

  const banner = document.getElementById('authNoticeBanner');
  if (banner) {
    if (reason === 'enroll') {
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  // Set to Sign In tab by default
  const tabSignInBtn = document.getElementById('tabSignInBtn');
  if (tabSignInBtn) tabSignInBtn.click();

  authModal.showModal();
}

function handleLoginSuccess(userData) {
  saveUserToStorage(userData);
  const authModal = document.getElementById('authModal');
  if (authModal) authModal.close();

  showToast(`🎉 ยินดีต้อนรับ ${userData.name} เข้าสู่ระบบเรียบร้อย`);

  // If user previously attempted to enroll, automatically continue to enrollment modal
  if (pendingEnrollPlan) {
    const planToOpen = pendingEnrollPlan;
    pendingEnrollPlan = null;
    setTimeout(() => {
      openEnrollModal(planToOpen);
    }, 250);
  }
}

function initAuth() {
  loadUserFromStorage();
  updateAuthUI();

  // Open Auth Modal triggers
  document.querySelectorAll('[data-open-login]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal();
    });
  });

  // User Profile Dropdown Toggle
  const trigger = document.getElementById('userDropdownTrigger');
  const menu = document.getElementById('userDropdownMenu');
  const chevron = document.getElementById('userDropdownChevron');
  if (trigger && menu) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden', isOpen);
      if (chevron) {
        chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });

    document.addEventListener('click', () => {
      menu.classList.add('hidden');
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    });
  }

  // Logout Buttons
  const logoutBtn = document.getElementById('logoutBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
  [logoutBtn, mobileLogoutBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        saveUserToStorage(null);
        if (menu) menu.classList.add('hidden');
        showToast('👋 ออกจากระบบเรียบร้อยแล้ว');
      });
    }
  });

  // Tab switching inside Auth Modal
  const tabSignInBtn = document.getElementById('tabSignInBtn');
  const tabSignUpBtn = document.getElementById('tabSignUpBtn');
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const authModalTitle = document.getElementById('authModalTitle');
  const authModalSubtitle = document.getElementById('authModalSubtitle');

  function switchTab(tab) {
    if (tab === 'signin') {
      tabSignInBtn.classList.add('font-bold', 'text-zinc-950', 'border-zinc-950');
      tabSignInBtn.classList.remove('font-medium', 'text-zinc-400', 'border-transparent');
      tabSignUpBtn.classList.remove('font-bold', 'text-zinc-950', 'border-zinc-950');
      tabSignUpBtn.classList.add('font-medium', 'text-zinc-400', 'border-transparent');
      signInForm.classList.remove('hidden');
      signUpForm.classList.add('hidden');
      if (authModalTitle) authModalTitle.textContent = 'เข้าสู่ระบบบัญชีผู้เรียน';
      if (authModalSubtitle) authModalSubtitle.textContent = 'เข้าถึงเนื้อหาคอร์สและสิทธิประโยชน์ของคุณ';
    } else {
      tabSignUpBtn.classList.add('font-bold', 'text-zinc-950', 'border-zinc-950');
      tabSignUpBtn.classList.remove('font-medium', 'text-zinc-400', 'border-transparent');
      tabSignInBtn.classList.remove('font-bold', 'text-zinc-950', 'border-zinc-950');
      tabSignInBtn.classList.add('font-medium', 'text-zinc-400', 'border-transparent');
      signUpForm.classList.remove('hidden');
      signInForm.classList.add('hidden');
      if (authModalTitle) authModalTitle.textContent = 'สมัครสมาชิกใหม่';
      if (authModalSubtitle) authModalSubtitle.textContent = 'สร้างบัญชีผู้เรียนเพื่อเริ่มต้นเส้นทาง Full-Stack & AI';
    }
  }

  if (tabSignInBtn && tabSignUpBtn) {
    tabSignInBtn.addEventListener('click', () => switchTab('signin'));
    tabSignUpBtn.addEventListener('click', () => switchTab('signup'));
  }

  const switchToSignUp = document.getElementById('switchToSignUp');
  const switchToSignIn = document.getElementById('switchToSignIn');
  if (switchToSignUp) switchToSignUp.addEventListener('click', () => switchTab('signup'));
  if (switchToSignIn) switchToSignIn.addEventListener('click', () => switchTab('signin'));

  // Password Visibility Toggle
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');
      if (input.type === 'password') {
        input.type = 'text';
        if (eyeOpen) eyeOpen.classList.add('hidden');
        if (eyeClosed) eyeClosed.classList.remove('hidden');
      } else {
        input.type = 'password';
        if (eyeOpen) eyeOpen.classList.remove('hidden');
        if (eyeClosed) eyeClosed.classList.add('hidden');
      }
    });
  });

  // Fast Demo Login Button
  const demoLoginBtn = document.getElementById('demoLoginBtn');
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
      handleLoginSuccess({
        name: 'คุณเอกภพ นพคุณ',
        email: 'ekkapob.dev@knowva.ac',
        phone: '089-123-4567'
      });
    });
  }

  // Social Login Options
  document.querySelectorAll('[data-social-login]').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-social-login');
      handleLoginSuccess({
        name: provider === 'LINE' ? 'คุณวิภาดา (LINE)' : 'คุณกิตติชัย (Google)',
        email: provider === 'LINE' ? 'wiphada.line@example.com' : 'kittichai.google@gmail.com',
        phone: '086-555-4321'
      });
    });
  });

  // Sign In Form Submission
  if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = document.getElementById('signInIdentifier')?.value.trim();
      const submitBtn = document.getElementById('signInSubmitBtn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-4 w-4 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg> กำลังเข้าสู่ระบบ...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        let displayName = identifier;
        let email = identifier;
        if (identifier.includes('@')) {
          displayName = identifier.split('@')[0];
        } else {
          email = `${identifier}@knowva.ac`;
        }
        displayName = `คุณ${displayName.charAt(0).toUpperCase() + displayName.slice(1)}`;

        handleLoginSuccess({
          name: displayName,
          email: email,
          phone: '081-888-9999'
        });
      }, 500);
    });
  }

  // Sign Up Form Submission
  if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signUpName')?.value.trim();
      const email = document.getElementById('signUpEmail')?.value.trim();
      const phone = document.getElementById('signUpPhone')?.value.trim();
      const password = document.getElementById('signUpPassword')?.value;
      const confirmPassword = document.getElementById('signUpConfirmPassword')?.value;

      if (password !== confirmPassword) {
        showToast('❌ รหัสผ่านทั้งสองช่องไม่ตรงกัน');
        return;
      }

      const submitBtn = document.getElementById('signUpSubmitBtn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-4 w-4 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg> กำลังสร้างบัญชี...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        handleLoginSuccess({
          name: name,
          email: email,
          phone: phone
        });
      }, 600);
    });
  }

  // Forgot Password Link
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      const idInput = document.getElementById('signInIdentifier');
      const email = idInput?.value.trim() || 'อีเมลของคุณ';
      showToast(`✉️ ระบบส่งคำแนะนำการรีเซ็ตรหัสผ่านไปยัง ${email} แล้วครับ`);
    });
  }
}

/* ==========================================================================
   4. MODERN <dialog> MODAL HANDLING (With Light-Dismiss Fallback)
   Complies with modern-web-guidance guidelines
   ========================================================================== */
function initModals() {
  const modals = document.querySelectorAll('dialog.custom-modal');

  modals.forEach(dialog => {
    // Implement fallback for browsers not supporting declarative light-dismiss (closedby)
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        // Only trigger if click is directly on the dialog backdrop
        if (event.target !== dialog) return;

        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );

        if (!isDialogContent) {
          dialog.close();
        }
      });
    }

    // Attach close button listener inside dialog
    const closeButtons = dialog.querySelectorAll('[data-dialog-close]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => dialog.close());
    });
  });

  // Global triggers for opening enrollment modal
  document.querySelectorAll('[data-open-enroll]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || 'pro';
      openEnrollModal(plan);
    });
  });
}

/* ==========================================================================
   4.1 FREE SAMPLE PREVIEW VIDEO PLAYER & PLAYLIST (3 EPISODES)
   ========================================================================== */
/**
 * วิดีโอตัวอย่าง 3 ตอนฟรี (สามารถแก้ไขลิงก์ YouTube Embed หรือ .mp4 ได้ที่นี่)
 * รูปแบบ YouTube Embed: https://www.youtube-nocookie.com/embed/VIDEO_ID?autoplay=1&rel=0
 */
const PREVIEW_VIDEOS = [
  {
    ep: 1,
    title: 'EP.01: Full-Stack Web Development & AI Overview',
    description: 'ปูพื้นฐานการพัฒนา Full-Stack Web Application ผสานเทคโนโลยี AI และ Generative Tools ยุคใหม่เพื่อการทำงานอย่างมีประสิทธิภาพ',
    duration: 'บทเรียนฟรี',
    videoUrl: 'https://www.youtube-nocookie.com/embed/LzMnsfqjzkA?autoplay=1&rel=0'
  },
  {
    ep: 2,
    title: 'EP.02: Next.js E-Commerce App & Admin Panel UI Design',
    description: 'เจาะลึกการออกแบบและพัฒนา Modern E-Commerce Platform พร้อมระบบ Admin Dashboard จัดการข้อมูลแบบ Real-time',
    duration: 'บทเรียนฟรี',
    videoUrl: 'https://www.youtube-nocookie.com/embed/6dvYioHX328?autoplay=1&rel=0'
  },
  {
    ep: 3,
    title: 'EP.03: RESTful API & Backend Integration Guide',
    description: 'พื้นฐานและการออกแบบ API การรับส่งข้อมูล Request/Response และการเชื่อมต่อ Backend เข้ากับ Frontend อย่างมืออาชีพ',
    duration: 'บทเรียนฟรี',
    videoUrl: 'https://www.youtube-nocookie.com/embed/tpS0clmE9HY?autoplay=1&rel=0'
  }
];

let currentPreviewEpisode = 1;

function selectPreviewEpisode(epNum) {
  currentPreviewEpisode = epNum;
  const epData = PREVIEW_VIDEOS.find(v => v.ep === epNum) || PREVIEW_VIDEOS[0];

  const iframe = document.getElementById('previewVideoIframe');
  const titleEl = document.getElementById('previewVideoCurrentTitle');
  const descEl = document.getElementById('previewVideoCurrentDesc');
  const durationEl = document.getElementById('previewVideoCurrentDuration');
  const badgeEl = document.getElementById('previewEpisodeBadge');

  if (iframe) {
    iframe.src = epData.videoUrl;
  }
  if (titleEl) titleEl.textContent = epData.title;
  if (descEl) descEl.textContent = epData.description;
  if (durationEl) durationEl.textContent = `ความยาว: ${epData.duration}`;
  if (badgeEl) badgeEl.textContent = `กำลังเล่น EP.0${epData.ep}`;

  // Update Episode Selector buttons in modal
  document.querySelectorAll('#previewEpisodeSelector .episode-btn').forEach(btn => {
    const btnEp = parseInt(btn.getAttribute('data-episode'), 10);
    const badgeSpan = btn.querySelector('span:first-child');
    if (btnEp === epNum) {
      btn.classList.add('active');
      if (badgeSpan) {
        badgeSpan.className = 'text-[11px] font-bold text-emerald-600 flex items-center gap-1';
        badgeSpan.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> EP.0${btnEp} (กำลังเล่น)`;
      }
    } else {
      btn.classList.remove('active');
      if (badgeSpan) {
        badgeSpan.className = 'text-[11px] font-semibold text-zinc-500';
        badgeSpan.textContent = `EP.0${btnEp} (ฟรี)`;
      }
    }
  });
}

function initPreviewVideos() {
  const previewModal = document.getElementById('previewModal');
  const iframe = document.getElementById('previewVideoIframe');

  // Trigger buttons that open preview modal
  document.querySelectorAll('[data-open-preview]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (previewModal) {
        selectPreviewEpisode(1); // Default to Episode 1
        previewModal.showModal();
      }
    });
  });

  // Episode buttons click listeners
  document.querySelectorAll('#previewEpisodeSelector .episode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ep = parseInt(btn.getAttribute('data-episode'), 10);
      selectPreviewEpisode(ep);
    });
  });

  // When modal closes, stop video playback so sound doesn't continue
  if (previewModal) {
    previewModal.addEventListener('close', () => {
      if (iframe) {
        iframe.src = '';
      }
    });
  }
}

/* ==========================================================================
   5. ENROLLMENT & CHECKOUT LOGIC
   ========================================================================== */
const PLAN_DETAILS = {
  basic: {
    name: 'Self-Paced (เรียนรู้ด้วยตนเอง)',
    originalPrice: 6900,
    price: 3990
  },
  pro: {
    name: 'Pro Cohort (ยอดนิยม • พร้อมโค้ชชิ่ง)',
    originalPrice: 12900,
    price: 6990
  },
  vip: {
    name: 'VIP Mentorship (โค้ชชิ่งตัวต่อตัว)',
    originalPrice: 25000,
    price: 14900
  }
};

let currentSelectedPlan = 'pro';
let activeDiscount = 0;
let appliedCouponCode = '';

function openEnrollModal(planKey = 'pro') {
  // 1. Mandatory Auth Guard: Check if user is logged in
  if (!currentUser) {
    pendingEnrollPlan = planKey;
    openAuthModal('enroll');
    return;
  }

  const modal = document.getElementById('enrollModal');
  if (!modal) return;

  currentSelectedPlan = planKey;
  
  // Set radio checked
  const radio = modal.querySelector(`input[name="packageSelect"][value="${planKey}"]`);
  if (radio) radio.checked = true;

  // Pre-fill user data into checkout form
  const nameInput = document.getElementById('studentNameInput');
  const emailInput = document.getElementById('studentEmailInput');
  const phoneInput = document.getElementById('studentPhoneInput');
  if (nameInput) nameInput.value = currentUser.name || '';
  if (emailInput) emailInput.value = currentUser.email || '';
  if (phoneInput && currentUser.phone) phoneInput.value = currentUser.phone;

  // Reset form status
  const successView = document.getElementById('checkoutSuccessView');
  const formView = document.getElementById('checkoutFormView');
  if (successView) successView.classList.add('hidden');
  if (formView) formView.classList.remove('hidden');

  updateCheckoutSummary();
  modal.showModal();
}

function updateCheckoutSummary() {
  const plan = PLAN_DETAILS[currentSelectedPlan] || PLAN_DETAILS.pro;
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const discountRow = document.getElementById('checkoutDiscountRow');
  const discountEl = document.getElementById('checkoutDiscount');
  const totalEl = document.getElementById('checkoutTotal');
  const planNameEl = document.getElementById('checkoutPlanName');

  if (planNameEl) planNameEl.textContent = plan.name;
  if (subtotalEl) subtotalEl.textContent = `฿${plan.price.toLocaleString()}`;

  let finalPrice = plan.price - activeDiscount;
  if (finalPrice < 0) finalPrice = 0;

  if (activeDiscount > 0) {
    if (discountRow) discountRow.classList.remove('hidden');
    if (discountEl) discountEl.textContent = `- ฿${activeDiscount.toLocaleString()}`;
  } else {
    if (discountRow) discountRow.classList.add('hidden');
  }

  if (totalEl) totalEl.textContent = `฿${finalPrice.toLocaleString()}`;
}

function initPricingAndCheckout() {
  // Plan radio buttons listener
  document.querySelectorAll('input[name="packageSelect"]').forEach(input => {
    input.addEventListener('change', (e) => {
      currentSelectedPlan = e.target.value;
      updateCheckoutSummary();
    });
  });

  // Apply Coupon Code
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponInput = document.getElementById('couponCodeInput');

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (!code) {
        showToast('กรุณากรอกโค้ดส่วนลด');
        return;
      }

      if (code === 'EARLYBIRD') {
        activeDiscount = 500;
        appliedCouponCode = code;
        updateCheckoutSummary();
        showToast('✅ ใช้โค้ด EARLYBIRD สำเร็จ! ลดเพิ่ม ฿500');
        couponInput.disabled = true;
        applyCouponBtn.textContent = 'ใช้แล้ว';
        applyCouponBtn.classList.add('bg-emerald-600', 'text-white');
      } else if (code === 'DEV1000') {
        activeDiscount = 1000;
        appliedCouponCode = code;
        updateCheckoutSummary();
        showToast('🎉 ใช้โค้ด DEV1000 สำเร็จ! ลดเพิ่ม ฿1,000');
        couponInput.disabled = true;
        applyCouponBtn.textContent = 'ใช้แล้ว';
        applyCouponBtn.classList.add('bg-emerald-600', 'text-white');
      } else {
        showToast('❌ โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุ');
      }
    });
  }

  // Payment method selection tabs
  const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
  paymentOptions.forEach(opt => {
    opt.addEventListener('change', (e) => {
      const val = e.target.value;
      const promptPayBox = document.getElementById('promptPayBox');
      const creditCardBox = document.getElementById('creditCardBox');
      
      if (val === 'promptpay') {
        if (promptPayBox) promptPayBox.classList.remove('hidden');
        if (creditCardBox) creditCardBox.classList.add('hidden');
      } else {
        if (promptPayBox) promptPayBox.classList.add('hidden');
        if (creditCardBox) creditCardBox.classList.remove('hidden');
      }
    });
  });

  // Handle Enrollment Form Submit
  const enrollForm = document.getElementById('enrollForm');
  if (enrollForm) {
    enrollForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = enrollForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg> กำลังประมวลผลคำสั่งซื้อ...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        const formView = document.getElementById('checkoutFormView');
        const successView = document.getElementById('checkoutSuccessView');
        
        if (formView) formView.classList.add('hidden');
        if (successView) successView.classList.remove('hidden');

        // Populate order details
        const orderName = document.getElementById('studentNameInput')?.value || 'คุณผู้เรียน';
        const orderEmail = document.getElementById('studentEmailInput')?.value || '-';
        const confirmName = document.getElementById('confirmStudentName');
        const confirmEmail = document.getElementById('confirmStudentEmail');
        const confirmPlan = document.getElementById('confirmPlanName');

        if (confirmName) confirmName.textContent = orderName;
        if (confirmEmail) confirmEmail.textContent = orderEmail;
        if (confirmPlan) confirmPlan.textContent = PLAN_DETAILS[currentSelectedPlan]?.name || 'Pro Cohort';

        showToast('🎉 สมัครเรียนเรียบร้อยแล้ว! ระบบส่งลิงก์เข้าเรียนไปยังอีเมลของคุณ');
      }, 1200);
    });
  }
}

/* ==========================================================================
   5. CURRICULUM EXPAND / COLLAPSE ALL
   ========================================================================== */
function initCurriculumControls() {
  const expandAllBtn = document.getElementById('expandAllCurriculum');
  if (!expandAllBtn) return;

  let allExpanded = false;
  expandAllBtn.addEventListener('click', () => {
    const items = document.querySelectorAll('details[name="curriculum"]');
    allExpanded = !allExpanded;
    items.forEach(item => {
      item.open = allExpanded;
    });
    expandAllBtn.textContent = allExpanded ? 'ย่อทั้งหมด' : 'ขยายเนื้อหาทั้งหมด';
  });
}

/* ==========================================================================
   6. HERO SECTION INTERACTIVE PREVIEW TABS
   ========================================================================== */
function initHeroTabs() {
  const tabs = document.querySelectorAll('[data-hero-tab]');
  const screens = document.querySelectorAll('[data-hero-screen]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-hero-tab');

      tabs.forEach(t => {
        t.classList.remove('bg-white', 'text-zinc-900', 'shadow-sm', 'font-semibold');
        t.classList.add('text-zinc-500', 'hover:text-zinc-800');
      });

      tab.classList.add('bg-white', 'text-zinc-900', 'shadow-sm', 'font-semibold');
      tab.classList.remove('text-zinc-500', 'hover:text-zinc-800');

      screens.forEach(screen => {
        if (screen.getAttribute('data-hero-screen') === targetId) {
          screen.classList.remove('hidden');
        } else {
          screen.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   7. ACCESSIBILITY & SEARCH FALLBACK
   ========================================================================== */
function initFaqSearchFallback() {
  if (!('onbeforematch' in HTMLElement.prototype)) {
    document.querySelectorAll('[hidden="until-found"]').forEach(el => {
      el.removeAttribute('hidden');
    });
  }
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="text-sm font-medium">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
