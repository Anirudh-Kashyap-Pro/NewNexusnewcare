# 🏥 NexusCare — National Hospital Network & Ergonomic Multi-Generational Portal

NexusCare is an ergonomic, accessible healthcare platform connecting hospitals and patients. Built for all generations—from kids to seniors—it optimizes hospital footfall, provides BookMyShow-style department vacancy seat booking, defers minor illnesses to AI home remedies, arranges on-call doctor consults, tracks personalized anatomy with recorded vitals, and schedules hospital staff around peak arrival surges.

---

## 🌟 Key Features & Architecture

### 1. 👁️ Ergonomic Accessibility Bar (Topmost)
- **Dynamic Font Scaler (`A-`, `A+`):** Instant scaling for comfortable reading.
- **👴 Senior Mode:** Activates extra-large typography, high-contrast borders, and simplified touch targets.
- **🎈 Kid Friendly Mode:** Playful, colorful icons, cheerful badges, and simplified terms.
- **Contrast Mode:** Pure high-contrast visibility.
- **Bilingual English & हिन्दी (Hindi) Switcher:** Instant UI and speech translation.
- **Emergency 108 Hotline:** 1-click call from anywhere.

---

### 2. 🏠 Home Page: Preventive Wellness, Challenges & Articles
- **Personalized Auth Snapshot:** Displays logged-in patient vitals (Blood Group `B+`, Fasting Sugar `98 mg/dL`, BP `118/78 mmHg`, Checkup `18 Sep 2026`).
- **Interactive Daily Health Habits & Streaks:**
  - `💧 Drink 8 Glasses of Water`: Interactive tap logger with progress bar.
  - `🚶‍♂️ 15-Min Post-Meal Walk`: Interactive habit completion button.
  - `🥗 Zero White Sugar Day`: Streak indicator (🔥 6-Day Family Wellness Streak).
- **Hygiene & Healthcare Articles:**
  - Dengue & Monsoon prevention rules.
  - Pediatric nutrition & immunity boosters for growing kids.
  - Senior mobility & daily knee cartilage protection exercises.
  - WHO 6-step handwash song routine for kids.
- **60-Second Family Health & Hygiene Survey:** Interactive screening questionnaire.

---

### 3. 🎟️ Department Vacancies — BookMyShow Movie Theater Style
- **Visual Department Vacancy Matrix:**
  - Choose between Cardiology, Orthopedics, Pediatrics, General Medicine, Neurology, and Dermatology.
  - Real-time vacancy badges (e.g. 14 / 36 Vacant).
- **Movie Theater Screen Layout:**
  - The "Theater Screen" represents the Doctor's Consultation Desk: `CONSULTATION DESK: DR. PRIYA NAIR (ROOM 204)`.
  - Seat rows modeled like a cinema hall:
    - **Row A:** VIP & Divyangjan/Senior Reserved (`A1`–`A8`)
    - **Row B:** Morning Slots 09:00–11:00 (`B1`–`B10`)
    - **Row C:** Afternoon Slots 11:30–01:30 (`C1`–`C10`)
    - **Row D:** Walk-in & Follow-up Reserve (`D1`–`D8`)
- **Color-Coded Legend:**
  - 🟩 Available / Vacant (Green)
  - 🟨 Selected by You (Orange)
  - 🟥 Booked / Occupied (Grayed out)
  - ♿ Senior / Divyangjan Reserved (Blue)
- **Booking Drawer:**
  - Select an open seat $\rightarrow$ see real-time fee (`₹0 PMJAY / ₹150 Regular`) $\rightarrow$ confirm booking to generate a digital appointment token with barcode!

---

### 4. 🫀 Personalized Patient Health Record & Organ Anatomy
- **Health Vitals Card:**
  - Blood Group: `B+`
  - Blood Sugar: Fasting `98 mg/dL`, Post-meal `136 mg/dL` (Borderline monitored)
  - Blood Pressure: `118/78 mmHg`
  - Last Full Checkup: `18 September 2026`
  - Allergies: `Penicillin (Flagged)`
- **Personalized Organ Health Anatomy Diagram:**
  - Visual human body model with color-coded nodes reflecting actual recorded health:
    - **Brain:** Normal (Green) — Sleep score 8/10
    - **Heart:** Normal (Green) — BP 118/78, HR 72 bpm
    - **Lungs:** Normal (Green) — SpO2 99%
    - **Pancreas:** Monitored (Yellow) — Post-meal glucose 136 mg/dL
    - **Knees:** Monitored (Yellow) — Mild age-related stiffness
  - Tap any organ to view detailed telemetry, clinical advice, and log new symptoms.

---

### 5. 🏥 Hospital Partner Operations & Staff Scheduler
- **Connecting Hospitals to NexusCare:**
  - Real-time patient arrival & footfall tracking (1,420 patients today).
  - Peak hours prediction (`10:00 AM - 12:30 PM`).
  - **Minor Illnesses Deflected to AI:** 38% (540 home consultations), drastically cutting down hospital waiting room congestion!
- **Dynamic Department Vacancy Management:**
  - Administrators can increase or decrease bookable slots based on doctor attendance.
- **Staff Scheduling with Footfall-Adjusted Shift Breaks:**
  - Job-specific logins: `DOC-204` (Dr. Priya Nair), `NURSE-102` (Sister Sunita Devi), `TECH-08` (Rahul Sharma).
  - Dynamic shift timeline: Rest and meal breaks are **automatically moved into low-footfall windows (12:30–1:15 PM)** to ensure full doctor availability during peak patient surges!

---

### 6. 💬 Comprehensive Floating AI Health Chatbot
- Always floating at the bottom-right corner.
- **Minor Inconvenience Guidance:** Home remedies and validated OTC advice for mild colds, heartburn, small scrapes, preventing unnecessary hospital visits.
- **Severe/Moderate Triage:** Flags clinical red alerts (e.g. crushing chest pain) and recommends the top nearest hospital providing that specific treatment (e.g., AIIMS New Delhi Cardiac Cath Lab).
- **On-Call Doctor Conversation:** Connects patients to an interactive on-call audio/video consultation with an on-duty doctor.
- **Appointment Booking:** Helps reserve seats directly in BookMyShow-style slots.

---

### 7. 🚑 Emergency Ambulance & 108 Dispatch
- **1-Click Call 108 Ambulance:** Immediate dispatch with simulated live GPS ETA tracking (`DL-1C-4921`, Driver Rajesh Kumar, 7 mins away).
- **Nearest Partner Hospitals Directory:** Real-time vacant ICU bed counts at AIIMS, Safdarjung, and Max Healthcare.

---

## 🚀 How to Run & Deploy
- **Direct Run:** Open [index.html](file:///C:/Users/amirc/.gemini/antigravity/scratch/nexuscare/index.html) in any web browser.
- **Local Server:** Run `powershell -ExecutionPolicy Bypass -File .\serve.ps1` for `http://localhost:8080/`.
- **Public 10-Second Deploy:** Upload [nexuscare.zip](file:///C:/Users/amirc/.gemini/antigravity/scratch/nexuscare.zip) to [Netlify Drop](https://app.netlify.com/drop).
