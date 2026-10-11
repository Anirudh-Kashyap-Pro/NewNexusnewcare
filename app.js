/**
 * NexusCare - Multi-Generational Ergonomic Healthcare Portal
 * Full Logic:
 * 1. Accessibility & Ergonomics (Font Scaler, Senior/Kid Modes, Bilingual EN/HI)
 * 2. Navigation & Page Routing (Home, Vacancies BookMyShow, My Health Anatomy, Hospital Partner, Emergency)
 * 3. Daily Health Challenges & Hygiene Surveys
 * 4. BookMyShow-Style Department Vacancy & Seat Matrix
 * 5. Personalized Organ Health Anatomy Diagram (Blood group, Sugar, BP, Checkups)
 * 6. Hospital Partner B2B Operations & Staff Scheduler with Footfall-Adjusted Breaks
 * 7. Comprehensive Floating AI Chatbot (Minor illness advice, Doctor On-Call, Triage, Hospital Referral)
 * 8. Ambulance Call & Live GPS Dispatch
 */

// ==========================================================================
// 1. Global Application State
// ==========================================================================
const appState = {
  currentLang: 'en', // 'en' or 'hi'
  currentPage: 'home', // 'home', 'vacancies', 'health', 'partner', 'emergency'
  fontSizeIndex: 1, // 0: A-, 1: A (default), 2: A+, 3: A++
  isSeniorMode: false,
  isKidMode: false,
  isHighContrast: false,

  // Patient User Profile
  patient: {
    isLoggedIn: true,
    name: 'Ramesh Kumar',
    nameHi: 'रमेश कुमार',
    abhaId: '91-4820-1928-4011',
    phone: '+91 98765-43210',
    bloodGroup: 'B+',
    bloodSugarFasting: '98 mg/dL',
    bloodSugarPost: '136 mg/dL',
    bloodPressure: '118/78 mmHg',
    lastCheckup: '18 September 2026',
    allergies: 'Penicillin',
    pmjayStatus: 'Verified (Cashless Active)',
    // Organ health scores (0: normal, 1: monitored, 2: flagged)
    organs: {
      head: { status: 'normal', desc: 'No neurological flags. Sleep quality: 8/10' },
      heart: { status: 'normal', desc: 'BP: 118/78 mmHg, Resting HR: 72 bpm. Cardiac risk: Low' },
      lungs: { status: 'normal', desc: 'SpO2: 99%, Clear auscultation' },
      pancreas: { status: 'monitored', desc: 'Fasting Glucose 98 mg/dL, Post-meal 136 mg/dL (Borderline)' },
      knees: { status: 'monitored', desc: 'Mild age-related joint stiffness logged' }
    }
  },

  // Daily Habits & Challenges
  challenges: {
    waterGlasses: 5, // out of 8
    walkCompleted: false,
    sugarFreeCompleted: true,
    streakDays: 6
  },

  // BookMyShow-Style Department Vacancies
  selectedDept: 'cardiology',
  selectedSeat: null,
  deptVacancies: {
    cardiology: { name: 'Cardiology (हृदय रोग)', doctor: 'Dr. Priya Nair', room: 'Room 204', total: 36, vacant: 14, fee: '₹0 (PMJAY) / ₹150' },
    orthopedics: { name: 'Orthopedics (हड्डी व जोड़)', doctor: 'Dr. Sandeep Goel', room: 'Room 106', total: 36, vacant: 8, fee: '₹0 (PMJAY) / ₹150' },
    pediatrics: { name: 'Pediatrics (बाल रोग)', doctor: 'Dr. Anita Joshi', room: 'Room 110', total: 36, vacant: 22, fee: '₹0 (PMJAY) / ₹150' },
    genmedicine: { name: 'General Medicine (सामान्य रोग)', doctor: 'Dr. Rajesh Sharma', room: 'Room 102', total: 36, vacant: 6, fee: '₹0 (PMJAY) / ₹100' },
    neurology: { name: 'Neurology (मस्तिष्क एवं तंत्रिका)', doctor: 'Dr. Evelyn Zhang', room: 'Room 304', total: 36, vacant: 11, fee: '₹0 (PMJAY) / ₹200' },
    dermatology: { name: 'Dermatology (त्वचा रोग)', doctor: 'Dr. Kabir Sethi', room: 'Room 108', total: 36, vacant: 19, fee: '₹0 (PMJAY) / ₹150' }
  },

  // Hospital Partner & Staff Scheduling Data
  partner: {
    footfallToday: 1420,
    peakHours: '10:00 AM - 12:30 PM',
    aiDeflectedMinorVisits: '38% (540 home consultations)',
    activeStaffId: 'DOC-204',
    staffMembers: {
      'DOC-204': { name: 'Dr. Priya Nair', role: 'Chief Cardiologist', shift: '08:30 AM - 04:30 PM', lunchBreak: '12:30 PM - 01:15 PM (Scheduled in low footfall dip)' },
      'NURSE-102': { name: 'Sister Sunita Devi', role: 'Senior Triage Nurse', shift: '07:00 AM - 03:00 PM', lunchBreak: '01:15 PM - 02:00 PM (Scheduled after peak surge)' },
      'TECH-08': { name: 'Rahul Sharma', role: 'Radiology & ECG Tech', shift: '09:00 AM - 05:00 PM', lunchBreak: '02:00 PM - 02:45 PM (Optimized)' }
    }
  },

  // Chatbot State
  chatOpen: false,
  chatMessages: [
    { sender: 'ai', text: 'Hello! I am NexusCare AI, your ergonomic health assistant. You can ask me about minor symptoms (cold, acidity, scrapes), book hospital appointment seats, or arrange an on-call doctor conversation. How can I help you today?' }
  ]
};

// ==========================================================================
// 2. Audio Engine (Hospital Chimes & Synthesizer)
// ==========================================================================
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }
  playChime() {
    this.init();
    if (!this.ctx) return;
    try {
      const freqs = [392, 523.25, 659.25]; // G4, C5, E5
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = this.ctx.currentTime + idx * 0.16;
        osc.frequency.setValueAtTime(f, st);
        gain.gain.setValueAtTime(0.08, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + 0.5);
      });
    } catch (e) {}
  }
  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }
  speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = appState.currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  }
}
const sound = new AudioSynthesizer();

// ==========================================================================
// 3. Lifecycle & Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupAccessibilityControls();
  setupNavigation();
  setupHealthChallenges();
  setupBookMyShowSeatMatrix();
  setupPersonalizedAnatomy();
  setupHospitalPartnerConsole();
  setupFloatingChatbot();
  setupAmbulanceDispatch();
  setupAuthModal();

  // Render defaults
  navigateToPage('home');
});

// ==========================================================================
// 4. Ergonomic Accessibility Controls (Kids, Adults & Seniors)
// ==========================================================================
function setupAccessibilityControls() {
  const fontSizes = ['14px', '16px', '18px', '21px'];

  // Font size scaler
  document.getElementById('btn-font-decrease')?.addEventListener('click', () => {
    sound.playClick();
    if (appState.fontSizeIndex > 0) {
      appState.fontSizeIndex--;
      document.documentElement.style.setProperty('--base-font-size', fontSizes[appState.fontSizeIndex]);
      showToast(`Font Size: ${fontSizes[appState.fontSizeIndex]}`);
    }
  });

  document.getElementById('btn-font-increase')?.addEventListener('click', () => {
    sound.playClick();
    if (appState.fontSizeIndex < fontSizes.length - 1) {
      appState.fontSizeIndex++;
      document.documentElement.style.setProperty('--base-font-size', fontSizes[appState.fontSizeIndex]);
      showToast(`Font Size: ${fontSizes[appState.fontSizeIndex]}`);
    }
  });

  // Senior Mode Toggle (Extra large, high contrast, relaxed spacing)
  document.getElementById('btn-senior-mode')?.addEventListener('click', (e) => {
    sound.playClick();
    appState.isSeniorMode = !appState.isSeniorMode;
    document.body.classList.toggle('senior-mode', appState.isSeniorMode);
    e.target.classList.toggle('active', appState.isSeniorMode);
    if (appState.isSeniorMode) {
      document.documentElement.style.setProperty('--base-font-size', '20px');
      showToast('👴 Senior Mode Enabled: Extra Large Text & Simplified Touch Targets');
      sound.speak('Senior accessibility mode activated.');
    } else {
      document.documentElement.style.setProperty('--base-font-size', fontSizes[appState.fontSizeIndex]);
      showToast('Senior Mode Disabled');
    }
  });

  // Kid Mode Toggle (Playful, colorful, simplified terminology)
  document.getElementById('btn-kid-mode')?.addEventListener('click', (e) => {
    sound.playClick();
    appState.isKidMode = !appState.isKidMode;
    document.body.classList.toggle('kid-mode', appState.isKidMode);
    e.target.classList.toggle('active', appState.isKidMode);
    showToast(appState.isKidMode ? '🎈 Kid Mode Active: Friendly Health Icons & Fun Badges!' : 'Kid Mode Disabled');
  });

  // High Contrast Toggle
  document.getElementById('btn-contrast-mode')?.addEventListener('click', (e) => {
    sound.playClick();
    appState.isHighContrast = !appState.isHighContrast;
    document.body.classList.toggle('high-contrast', appState.isHighContrast);
    e.target.classList.toggle('active', appState.isHighContrast);
    showToast(appState.isHighContrast ? '👁️ High Contrast Mode Active' : 'Normal Contrast');
  });

  // Bilingual Language Toggle (English <-> हिन्दी)
  document.getElementById('btn-lang-top')?.addEventListener('click', () => {
    sound.playClick();
    appState.currentLang = appState.currentLang === 'en' ? 'hi' : 'en';
    const langBtn = document.getElementById('btn-lang-top');
    if (langBtn) langBtn.textContent = appState.currentLang === 'en' ? '🌐 हिन्दी' : '🌐 English';
    showToast(appState.currentLang === 'hi' ? 'भाषा बदलकर हिन्दी कर दी गई है' : 'Switched to English');
  });
}

// ==========================================================================
// 5. Navigation & Page Routing
// ==========================================================================
function setupNavigation() {
  document.querySelectorAll('.nav-link-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      sound.playClick();
      const targetPage = btn.dataset.page;
      if (targetPage) navigateToPage(targetPage);
    });
  });

  // Logo click takes to home
  document.querySelector('.nav-brand')?.addEventListener('click', (e) => {
    e.preventDefault();
    sound.playClick();
    navigateToPage('home');
  });

  // Top SOS Ambulance button
  document.getElementById('btn-top-ambulance')?.addEventListener('click', () => {
    sound.playChime();
    navigateToPage('emergency');
  });
}

function navigateToPage(pageId) {
  appState.currentPage = pageId;

  // Update navbar links active state
  document.querySelectorAll('.nav-link-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  // Hide all page containers
  const pages = ['home', 'vacancies', 'health', 'partner', 'emergency'];
  pages.forEach(p => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.classList.add('hidden');
  });

  // Show target page
  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('fade-in');
  }

  // Trigger page-specific renders
  if (pageId === 'vacancies') {
    renderSeatMatrix(appState.selectedDept);
  } else if (pageId === 'health') {
    renderOrganHealthStatus();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// 6. Home: Daily Health Challenges & Hygiene Surveys
// ==========================================================================
function setupHealthChallenges() {
  // Water Glass Habit logger
  const waterBtn = document.getElementById('btn-log-water');
  const waterDisplay = document.getElementById('water-count-display');
  const waterProgress = document.getElementById('water-progress-fill');

  if (waterBtn && waterDisplay && waterProgress) {
    waterBtn.addEventListener('click', () => {
      sound.playClick();
      if (appState.challenges.waterGlasses < 8) {
        appState.challenges.waterGlasses++;
        waterDisplay.textContent = `${appState.challenges.waterGlasses}/8 Glasses (2.0L)`;
        waterProgress.style.width = `${(appState.challenges.waterGlasses / 8) * 100}%`;
        showToast(`💧 Glass Logged! ${appState.challenges.waterGlasses} of 8 glasses drank today.`);
      } else {
        showToast('🎉 Daily 8 Glasses Goal Completed! Excellent hydration.');
      }
    });
  }

  // Walk Challenge
  document.getElementById('btn-complete-walk')?.addEventListener('click', (e) => {
    sound.playClick();
    appState.challenges.walkCompleted = true;
    e.target.textContent = '✓ Completed (15 mins)';
    e.target.style.background = 'var(--emerald-green)';
    e.target.style.color = '#fff';
    showToast('🚶‍♂️ 15-Minute Walk Logged! 120 calories burned.');
  });

  // Interactive 60-Second Hygiene Survey
  document.getElementById('btn-start-survey')?.addEventListener('click', () => {
    sound.playChime();
    const result = prompt("NexusCare Family Health Survey:\nHave you or anyone in your household experienced fever or sore throat in the last 7 days? (yes/no)");
    if (result && result.toLowerCase().includes('yes')) {
      alert("NexusCare Health Advisory: We recommend monitoring temperature twice daily and consulting our AI Chatbot for minor symptom home care before visiting the clinic.");
    } else {
      alert("NexusCare Health Advisory: Nominal! Your household wellness score is 95/100. Keep up daily hand hygiene.");
    }
  });
}

// ==========================================================================
// 7. BookMyShow-Style Department Vacancies & Seat Matrix
// ==========================================================================
function setupBookMyShowSeatMatrix() {
  // Department pill clicks
  document.querySelectorAll('.dept-slot-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      sound.playClick();
      document.querySelectorAll('.dept-slot-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const deptKey = pill.dataset.dept;
      appState.selectedDept = deptKey;
      renderSeatMatrix(deptKey);
    });
  });

  // Confirm booking button
  document.getElementById('btn-confirm-seat-booking')?.addEventListener('click', () => {
    if (!appState.selectedSeat) {
      showToast('⚠️ Please tap on an available green seat first!');
      return;
    }
    sound.playChime();
    const deptInfo = appState.deptVacancies[appState.selectedDept];
    const tokenNumber = `NEX-${appState.selectedDept.toUpperCase().slice(0, 4)}-${Math.floor(Math.random() * 800 + 100)}`;

    alert(`🎟️ APPOINTMENT CONFIRMED!\n\nToken ID: ${tokenNumber}\nDepartment: ${deptInfo.name}\nConsultation Room: ${deptInfo.room}\nSeat Slot: ${appState.selectedSeat}\nFee: ${deptInfo.fee}\nPatient: ${appState.patient.name}\n\nYour digital pass has been added to your dashboard!`);
    
    // Decrement vacancy
    if (deptInfo.vacant > 0) deptInfo.vacant--;
    appState.selectedSeat = null;
    renderSeatMatrix(appState.selectedDept);
  });
}

function renderSeatMatrix(deptKey) {
  const deptInfo = appState.deptVacancies[deptKey] || appState.deptVacancies.cardiology;
  const container = document.getElementById('seat-matrix-container');
  if (!container) return;

  // Update screen desk title
  const screenLabel = document.getElementById('theater-screen-doctor');
  if (screenLabel) {
    screenLabel.textContent = `CONSULTATION DESK: ${deptInfo.doctor} (${deptInfo.room}) • ${deptInfo.vacant} SEATS VACANT`;
  }

  // Generate BookMyShow style layout (Rows A, B, C, D)
  const rows = [
    { label: 'A', name: 'VIP & Senior Citizen Reserved', count: 8, prefix: 'A' },
    { label: 'B', name: 'General Morning Slots (09:00 - 11:00)', count: 10, prefix: 'B' },
    { label: 'C', name: 'General Afternoon Slots (11:30 - 01:30)', count: 10, prefix: 'C' },
    { label: 'D', name: 'Follow-up & Walk-in Reserve', count: 8, prefix: 'D' }
  ];

  let html = '';
  rows.forEach(r => {
    html += `<div class="seat-row"><span class="seat-row-label">${r.label}</span>`;
    for (let i = 1; i <= r.count; i++) {
      const seatId = `${r.prefix}${i}`;
      // Pseudo-random occupancy based on seat index
      const isOccupied = (i % 3 === 0 && r.label !== 'A') || (i === 2 && r.label === 'B');
      const isSelected = appState.selectedSeat === seatId;
      const isSenior = r.label === 'A';

      const statusClass = isSelected ? 'selected' : isOccupied ? 'occupied' : isSenior ? 'vacant priority-senior' : 'vacant';

      html += `
        <div class="seat-tile ${statusClass}" data-seat="${seatId}" data-occupied="${isOccupied}" onclick="onSeatTileClick('${seatId}', ${isOccupied})">
          ${seatId}
        </div>
      `;
    }
    html += `</div>`;
  });

  container.innerHTML = html;
  updateBookingSummaryDrawer();
}

window.onSeatTileClick = function(seatId, isOccupied) {
  if (isOccupied) {
    sound.playClick();
    showToast(`Seat ${seatId} is already BOOKED by another patient.`);
    return;
  }
  sound.playClick();
  appState.selectedSeat = seatId;
  renderSeatMatrix(appState.selectedDept);
  showToast(`Selected Seat: ${seatId}`);
};

function updateBookingSummaryDrawer() {
  const seatDisplay = document.getElementById('selected-seat-badge');
  const feeDisplay = document.getElementById('selected-seat-fee');
  const deptInfo = appState.deptVacancies[appState.selectedDept];

  if (seatDisplay) {
    seatDisplay.textContent = appState.selectedSeat ? `Seat: ${appState.selectedSeat} (${deptInfo.name})` : 'No Seat Selected Yet';
  }
  if (feeDisplay) {
    feeDisplay.textContent = appState.selectedSeat ? `Payable: ${deptInfo.fee}` : 'Fee: Select Seat';
  }
}

// ==========================================================================
// 8. Personalized Patient Health Record & Organ Health Anatomy
// ==========================================================================
function setupPersonalizedAnatomy() {
  document.querySelectorAll('.organ-node').forEach(node => {
    node.addEventListener('click', () => {
      sound.playClick();
      const organKey = node.dataset.organ;
      inspectOrganHealth(organKey);
    });
  });
}

function renderOrganHealthStatus() {
  const p = appState.patient;

  // Update vitals card display
  const bloodEl = document.getElementById('patient-vitals-blood');
  if (bloodEl) bloodEl.textContent = p.bloodGroup;

  const sugarEl = document.getElementById('patient-vitals-sugar');
  if (sugarEl) sugarEl.textContent = `${p.bloodSugarFasting} / ${p.bloodSugarPost}`;

  const bpEl = document.getElementById('patient-vitals-bp');
  if (bpEl) bpEl.textContent = p.bloodPressure;

  const checkupEl = document.getElementById('patient-vitals-checkup');
  if (checkupEl) checkupEl.textContent = p.lastCheckup;
}

function inspectOrganHealth(organKey) {
  const organ = appState.patient.organs[organKey];
  if (!organ) return;

  const titleEl = document.getElementById('organ-inspect-title');
  const descEl = document.getElementById('organ-inspect-desc');
  const statusEl = document.getElementById('organ-inspect-status');

  const names = {
    head: 'Brain & Neurological System',
    heart: 'Heart & Cardiovascular System',
    lungs: 'Lungs & Respiratory Function',
    pancreas: 'Pancreas & Blood Sugar (Metabolism)',
    knees: 'Knees & Joint Cartilage'
  };

  if (titleEl) titleEl.textContent = names[organKey] || organKey;
  if (descEl) descEl.textContent = organ.desc;
  if (statusEl) {
    statusEl.textContent = organ.status.toUpperCase();
    statusEl.className = `badge organ-status-${organ.status}`;
  }

  showToast(`🫀 Organ Telemetry: ${names[organKey]} inspected.`);
}

// ==========================================================================
// 9. Hospital Partner Operations & Footfall-Adjusted Staff Scheduler
// ==========================================================================
function setupHospitalPartnerConsole() {
  // Staff Selector Dropdown
  const staffSelect = document.getElementById('partner-staff-select');
  if (staffSelect) {
    staffSelect.addEventListener('change', (e) => {
      sound.playClick();
      appState.partner.activeStaffId = e.target.value;
      renderStaffSchedule(e.target.value);
    });
  }

  // Capacity adjust buttons (+ / -)
  document.getElementById('btn-add-capacity')?.addEventListener('click', () => {
    sound.playClick();
    appState.deptVacancies[appState.selectedDept].vacant += 2;
    showToast(`Added +2 Vacancies to ${appState.selectedDept}. Updated BookMyShow grid.`);
    renderSeatMatrix(appState.selectedDept);
  });

  renderStaffSchedule('DOC-204');
}

function renderStaffSchedule(staffId) {
  const staff = appState.partner.staffMembers[staffId];
  if (!staff) return;

  const nameEl = document.getElementById('scheduler-staff-name');
  const roleEl = document.getElementById('scheduler-staff-role');
  const shiftEl = document.getElementById('scheduler-staff-shift');
  const breakEl = document.getElementById('scheduler-staff-break');

  if (nameEl) nameEl.textContent = staff.name;
  if (roleEl) roleEl.textContent = staff.role;
  if (shiftEl) shiftEl.textContent = `Shift: ${staff.shift}`;
  if (breakEl) breakEl.textContent = staff.lunchBreak;
}

// ==========================================================================
// 10. Comprehensive Floating AI Chatbot
// ==========================================================================
function setupFloatingChatbot() {
  const triggerBtn = document.getElementById('floating-chatbot-trigger');
  const chatWindow = document.getElementById('chatbot-window-container');
  const closeBtn = document.getElementById('btn-close-chatbot');
  const sendBtn = document.getElementById('btn-chat-send');
  const inputField = document.getElementById('chat-input-text');

  if (triggerBtn && chatWindow) {
    triggerBtn.addEventListener('click', () => {
      sound.playClick();
      appState.chatOpen = !appState.chatOpen;
      chatWindow.classList.toggle('hidden', !appState.chatOpen);
    });
  }

  if (closeBtn && chatWindow) {
    closeBtn.addEventListener('click', () => {
      sound.playClick();
      appState.chatOpen = false;
      chatWindow.classList.add('hidden');
    });
  }

  if (sendBtn && inputField) {
    sendBtn.addEventListener('click', () => handleChatSubmit());
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleChatSubmit();
    });
  }

  // Pre-configured quick prompt buttons
  document.querySelectorAll('.chat-quick-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      sound.playClick();
      const promptText = tag.dataset.prompt;
      if (promptText) {
        addUserChatMessage(promptText);
        generateAIHealthReply(promptText);
      }
    });
  });
}

function handleChatSubmit() {
  const input = document.getElementById('chat-input-text');
  if (!input) return;
  const text = input.value.trim();
  if (text) {
    addUserChatMessage(text);
    input.value = '';
    generateAIHealthReply(text);
  }
}

function addUserChatMessage(text) {
  sound.playClick();
  const container = document.getElementById('chat-messages-box');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user';
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function generateAIHealthReply(userQuery) {
  const container = document.getElementById('chat-messages-box');
  if (!container) return;

  const q = userQuery.toLowerCase();
  let aiText = '';

  // 1. Minor Inconvenience Triage (Home remedies to reduce hospital footfall)
  if (q.includes('acidity') || q.includes('heartburn') || q.includes('gas')) {
    aiText = `
      <strong>💡 Minor Inconvenience Triage: Acid Reflux / Indigestion</strong><br>
      • <em>Home Remedy:</em> Sip cold milk or water with a pinch of fennel (saunf). Avoid lying down for 2 hours.<br>
      • <em>Hospital Visit:</em> Not needed for mild symptoms. If pain radiates to jaw or left arm, seek emergency care.<br>
      <button class="access-btn" style="margin-top:6px; background:var(--primary-teal);" onclick="callDoctorSimulation('Dr. Priya Nair')">📞 Arrange On-Call Doctor Audio Consultation</button>
    `;
  } else if (q.includes('cold') || q.includes('cough') || q.includes('mild fever') || q.includes('runny nose')) {
    aiText = `
      <strong>💡 Minor Inconvenience Triage: Common Cold / Mild Viral</strong><br>
      • <em>Home Care:</em> Steam inhalation twice daily, warm salt-water gargles, stay hydrated.<br>
      • <em>Save Hospital Trip:</em> 80% of mild viral colds resolve in 3-5 days without clinic crowding.<br>
      • <em>Red Flags:</em> If temperature exceeds 102°F or breathlessness occurs, book an OPD slot.
    `;
  } else if (q.includes('chest') || q.includes('severe') || q.includes('breath') || q.includes('emergency')) {
    // 2. Severe Triage & Nearest Hospital Recommender
    aiText = `
      <strong style="color:var(--coral-rose);">🚨 CLINICAL RED ALERT: Seek Immediate Care</strong><br>
      Acute chest discomfort or severe breathing issues require hospital intervention.<br>
      • <strong>Nearest Recommended Facility:</strong> <em>AIIMS New Delhi (Cardiac Emergency - 2.8 km away)</em> with active Cath Lab.<br>
      <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
        <button class="access-btn" style="background:var(--coral-rose); color:#fff;" onclick="dispatchEmergencyAmbulance()">🚑 Dispatch 108 Ambulance Now</button>
        <button class="access-btn" style="background:var(--primary-teal); color:#fff;" onclick="navigateToPage('vacancies')">🎟️ Book Priority Hospital Token</button>
      </div>
    `;
  } else if (q.includes('doctor') || q.includes('call') || q.includes('consult')) {
    // 3. On-Call Doctor Arrangement
    aiText = `
      <strong>👨‍⚕️ On-Call Tele-Consultation Ready:</strong><br>
      Connecting you with on-duty physician <strong>Dr. Priya Nair (MD)</strong> to discuss your symptoms virtually.<br>
      <button class="access-btn" style="margin-top:6px; background:var(--primary-teal); color:#fff;" onclick="callDoctorSimulation('Dr. Priya Nair')">📞 Start Live On-Call Audio/Video Connect</button>
    `;
  } else {
    aiText = `
      <strong>NexusCare AI Clinical Desk:</strong><br>
      I've reviewed your symptoms. You can take home-care suggestions, book a BookMyShow-style hospital appointment seat, or talk directly with a verified doctor on-call.
    `;
  }

  setTimeout(() => {
    sound.playChime();
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';
    aiBubble.innerHTML = aiText;
    container.appendChild(aiBubble);
    container.scrollTop = container.scrollHeight;
  }, 450);
}

window.callDoctorSimulation = function(docName) {
  sound.playChime();
  alert(`📞 CONNECTING ON-CALL CALL...\n\nDoctor: ${docName}\nStatus: Call Answered!\n\n"Hello Ramesh ji, this is ${docName}. I am reviewing your health details on NexusCare. How are you feeling right now?"`);
  showToast(`On-Call audio conversation active with ${docName}`);
};

// ==========================================================================
// 11. Ambulance & Emergency Locator
// ==========================================================================
function setupAmbulanceDispatch() {
  document.getElementById('btn-call-ambulance-108')?.addEventListener('click', () => {
    dispatchEmergencyAmbulance();
  });
}

function dispatchEmergencyAmbulance() {
  sound.playChime();
  const alertCard = document.getElementById('ambulance-tracking-banner');
  if (alertCard) alertCard.classList.remove('hidden');

  alert(`🚨 108 AMBULANCE DISPATCHED!\n\nVehicle Number: DL-1C-4921 (Advanced Cardiac Life Support)\nDriver: Rajesh Kumar (+91 98112-90123)\nLive ETA: 7 Minutes to your GPS location\nDestination: AIIMS Trauma Center (Reserved Bay 01)`);
  showToast('🚑 108 Ambulance en route! GPS live tracking active.');
}

// ==========================================================================
// 12. Login & Authentication Modal
// ==========================================================================
function setupAuthModal() {
  const modal = document.getElementById('auth-modal-dialog');
  const openBtn = document.getElementById('btn-open-auth-modal');
  const closeBtn = document.getElementById('btn-close-auth-modal');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  // Demo account switchers
  document.querySelectorAll('.demo-user-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const role = btn.dataset.user;
      if (role === 'staff') {
        navigateToPage('partner');
        showToast('Logged in as Dr. Priya Nair (Staff ID: DOC-204)');
      } else {
        navigateToPage('health');
        showToast('Logged in as Ramesh Kumar (ABHA: 91-4820)');
      }
      modal?.classList.add('hidden');
    });
  });
}

// ==========================================================================
// 13. Global Toast Notifications
// ==========================================================================
function showToast(msg) {
  const wrapper = document.getElementById('toast-wrapper');
  if (!wrapper) return;

  const t = document.createElement('div');
  t.className = 'toast-item';
  t.innerHTML = `<span style="color:var(--primary-teal);">●</span><span>${msg}</span>`;
  wrapper.appendChild(t);

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(20px)';
    t.style.transition = 'all 0.3s ease';
    setTimeout(() => t.remove(), 300);
  }, 4000);
}
window.showToast = showToast;
