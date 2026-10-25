# Dual-Ended Food Safety Grievance & Enforcement Pipeline 

> **Controlled Public-to-Official Food Safety Pipeline with Dual-Ended Verification of Citizen Complaints and Official Rights**
> 
> Built for the Smart India Hackathon (SIH) Problem Statement on Food Safety Enforcement & Quality Governance.

---

## 🎨 Visual Identity & Color System (60-30-10 Rule)
This application strictly adheres to the requested editorial aesthetic and the 60-30-10 color balance rule:
* **60% Primary Canvas & Structural Cards**: Mocha Brown (`#5B4632`, `#2C2016`, `#36281C`)
* **30% Secondary Framing & Editorial Accents**: Champagne Gold (`#F4D9A0`)
* **10% Accent, Statutory Warnings & High-Contrast Typography**: Burnt Amber (`#C86D24`) & Off-White (`#FBF6EE`)

Typography features luxury editorial serif headers (`Playfair Display`, `Cormorant Garamond`) paired with modern functional body type (`Plus Jakarta Sans`) and cryptographic telemetry monospace (`JetBrains Mono`).

---

## 🚀 Key Functional Modules & Pipeline Architecture

### 1. Citizen Grievance Filing (Dual Input: Online Delivery vs. Offline Dine-in)
* **Age & Identity Verification**: Enforces citizen age $\ge 18$ validation with Aadhaar/Mobile OTP authentication.
* **Live Camera Only**: Disables gallery photo uploads to prevent recycled or stock imagery. Requires 2 to 15 multi-angle physical shots.
* **On-Device Structural Image Quality Filter**:
  * Real-time luminance check (detects pitch-black or washed-out images).
  * Laplacian blur variance analysis (rejects motion-blurred photos).
  * On-device CV food heuristics (detects food, plate, kitchen, or dine-in context).
  * Screenshot & duplicate hash rejection.
* **Order Invoice Review**: Optional invoice OCR parser for online delivery complaints. Does not reject invoices automatically if OCR is imperfect; routes them for human-assisted verification.
* **Keyword Matching & Voice Description**: Citizen provides voice note and mandatory symptom/violation keyword that must align with photographic evidence.
* **FSSAI FoSCoS Auto-Lookup**: Real-time integration check with FSSAI database to pull license validity, renewal dates, and past laboratory checks.

### 2. Verification State & Statutory Law Scanner
* **FSS Act 2006 Statutory Law Jurisdiction Scanner**:
  * Scans complaints against Section 50 (Deficient Quality), Section 51 (Substandard Food), Section 52 (Misbranded Food), Section 54 (Contaminants/Toxic matter), and Section 59 (Unsafe Food / Adulteration).
  * Rejects non-jurisdictional consumer service complaints (e.g. price, wait times) early to prevent wasting the Food Safety Commissioner's time.
* **Incident Clustering & Hash Deduplication**:
  * Detects multiple reports against the same Food Business Operator (FBO) within a short window.
  * Links repeat violations and escalates priority to Critical.
* **Direct Escalation for License Violations**:
  * Food businesses operating without valid FSSAI licenses or with expired renewals are immediately escalated to High/Critical priority.

### 3. Higher Officials & Designated Food Safety Officer Command
* **Physical On-Site Verification**: Officers must physically visit the location.
* **Tamper-Proof Proof Upload**: Gallery uploads blocked; officers capture live camera photos of inspection, seizure, raid, sample collection, warning notices, or compounding fines.
* **Independent Dual Validation**: Prevents weak accountability loops. Blank or generic images are flagged; proof must pass secondary human audit before a grievance can be settled.
* **Penalty Enforcement**: Tracks Section 69 compounding fines and notice numbers.

### 4. Citizen Statutory Reward Wallet
* **Escrow & Direct Benefit Transfer**:
  * Upon verified resolution, statutory rewards (10% of compounding fine or ₹1,000–₹5,000 statutory bounty) are deposited to the citizen's wallet.
  * Direct withdrawal to Indian bank accounts via IFSC and Account Number validation.

---

## 🛠️ Quick Start & Local Development

### Prerequisites
* Node.js 18+ or 20+
* npm or yarn or pnpm

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Access in browser
open http://localhost:3000
```

### Running Unit Tests
All business logic, statutory legal jurisdiction scanners, CV filters, and wallet payout algorithms are decoupled and covered by unit tests:
```bash
npx tsx --test src/utils/foodSafetyRules.test.ts
```

---

## 📁 Project Directory Structure
```
├── public/
│   ├── assets/
│   │   └── aistudio/
│   │       └── WhatsApp_Image_2026-10-25_at_8.04.10_PM_075a1f51.jpeg  # Hero centerpiece visual
│   └── food-safety-pipeline.zip                                        # Shareable zip bundle
├── src/
│   ├── components/
│   │   ├── FrontPageHero.tsx                 # Editorial front page matching reference design
│   │   ├── Navbar.tsx                        # 60-30-10 navigation bar with role toggles & zip download
│   │   ├── GrievanceFilingWizard.tsx         # Citizen filing with camera, OCR, FSSAI lookup
│   │   ├── PipelineVerificationDashboard.tsx # FSSA 2006 statutory scanner & pipeline queue
│   │   ├── HigherOfficialDashboard.tsx       # Food Safety Officer inspection & raid logging
│   │   ├── CitizenWalletView.tsx             # INR reward payout and IFSC withdrawal
│   │   ├── FSSAIDatabaseView.tsx             # FoSCoS national business operator registry
│   │   ├── LiveCameraCaptureModal.tsx        # Camera capture with structural filter feedback
│   │   ├── CitizenRegistrationModal.tsx      # Age >= 18 KYC and OTP verification modal
│   │   └── GrievanceDossierModal.tsx         # Comprehensive case file inspector
│   ├── data/
│   │   └── mockDatabase.ts                   # Pre-seeded FSSAI licensees, officers, grievances
│   ├── types/
│   │   └── index.ts                          # Complete TypeScript interfaces & enums
│   ├── utils/
│   │   ├── foodSafetyRules.ts                # Pure business logic, CV filters, legal parser
│   │   └── foodSafetyRules.test.ts           # Comprehensive unit tests
│   ├── App.tsx                               # Main layout, router & toast system
│   ├── index.css                             # Tailwind CSS v4 & luxury editorial fonts
│   └── main.tsx                              # React 19 root
├── index.html                                # HTML entry point with typography imports
├── package.json                              # Dependencies & scripts
├── tsconfig.json                             # TypeScript bundler configuration
└── vite.config.ts                            # Vite configuration
```

---

## 📜 Legal & Regulatory Grounding
* **Food Safety and Standards Act, 2006** (Govt. of India):
  * Section 31: Mandatory Licensing & Registration of Food Businesses
  * Section 50: Penalty for selling food not of the nature or substance demanded
  * Section 51: Penalty for substandard food
  * Section 52: Penalty for misbranded food
  * Section 54: Penalty for food containing extraneous matter
  * Section 59: Punishment for unsafe food
  * Section 69: Compounding of offences & penalty allocation
