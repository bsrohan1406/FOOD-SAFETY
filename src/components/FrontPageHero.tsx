import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Scale, 
  Wallet, 
  Building2, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Search,
  Eye,
  Award,
  Download
} from 'lucide-react';
import { CitizenUser, Grievance } from '../types';

interface FrontPageHeroProps {
  onNavigateToTab: (tab: 'file_grievance' | 'verification_pipeline' | 'officer_command' | 'wallet' | 'fssai_registry') => void;
  citizen: CitizenUser;
  grievances: Grievance[];
  onOpenCitizenModal: () => void;
}

export const FrontPageHero: React.FC<FrontPageHeroProps> = ({
  onNavigateToTab,
  citizen,
  grievances,
  onOpenCitizenModal
}) => {
  const [activeSlide, setActiveSlide] = useState<'01' | '02' | '03'>('01');
  const [showPracticeModal, setShowPracticeModal] = useState<string | null>(null);

  // Compute live statistics for pipeline indicators
  const activeCount = grievances.filter(g => g.status !== 'settled' && g.status !== 'rejected_statutory').length;
  const settledCount = grievances.filter(g => g.status === 'settled').length;
  const criticalCount = grievances.filter(g => g.priority === 'critical').length;

  return (
    <div className="w-full bg-[#2C2016] text-[#FBF6EE] relative overflow-hidden">
      {/* Background radial atmosphere with Mocha Brown and Champagne Gold glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#F4D9A0]/15 via-[#5B4632]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-[#5B4632]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#C86D24]/10 rounded-full blur-3xl" />
      </div>

      {/* Top Reference Nav Bar (Matches uploaded photo: HOME, ABOUT, PRACTICES, RESOURCES, CONTACT) */}
      <div className="relative z-20 border-b border-[#F4D9A0]/20 bg-[#36281C]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs tracking-widest uppercase">
          {/* Left: Nav links from photo */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <span className="flex items-center gap-1.5 text-[#F4D9A0] font-bold cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F4D9A0] animate-pulse" />
              HOME
            </span>
            <button 
              type="button"
              onClick={() => setShowPracticeModal('ABOUT')}
              className="text-[#FBF6EE]/75 hover:text-[#F4D9A0] transition-colors cursor-pointer hidden sm:inline-block"
            >
              ABOUT
            </button>
            <button 
              type="button"
              onClick={() => setShowPracticeModal('PRACTICES')}
              className="text-[#FBF6EE]/75 hover:text-[#F4D9A0] transition-colors cursor-pointer hidden md:inline-block"
            >
              PRACTICES
            </button>
            <button 
              type="button"
              onClick={() => setShowPracticeModal('RESOURCES')}
              className="text-[#FBF6EE]/75 hover:text-[#F4D9A0] transition-colors cursor-pointer hidden md:inline-block"
            >
              RESOURCES
            </button>
            <button 
              type="button"
              onClick={() => setShowPracticeModal('CONTACT')}
              className="text-[#FBF6EE]/75 hover:text-[#F4D9A0] transition-colors cursor-pointer hidden sm:inline-block"
            >
              CONTACT
            </button>
          </div>

          {/* Center SIH Banner text */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#5B4632] border border-[#F4D9A0]/40 rounded-full text-[11px] text-[#F4D9A0]">
            <span className="font-mono font-bold text-[#C86D24] uppercase">SIH Problem Statement</span>
            <span className="text-[#FBF6EE]/40">·</span>
            <span className="text-[#FBF6EE]/90">Controlled Public-to-Official Pipeline</span>
          </div>

          {/* Right: Action Buttons and Pipeline Direct Launcher */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateToTab('fssai_registry')}
              className="p-1.5 rounded-lg text-[#FBF6EE]/80 hover:text-[#F4D9A0] hover:bg-[#5B4632]/50 transition-colors cursor-pointer"
              title="Search FoSCoS Registry"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('wallet')}
              className="p-1.5 rounded-lg text-[#FBF6EE]/80 hover:text-[#F4D9A0] hover:bg-[#5B4632]/50 transition-colors cursor-pointer relative"
              title="Citizen Vigilance Wallet"
            >
              <Wallet className="w-4 h-4 text-[#F4D9A0]" />
              {citizen.walletBalanceINR > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C86D24]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('file_grievance')}
              className="px-3.5 py-1.5 bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] text-[11px] font-extrabold rounded-full tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>LODGE GRIEVANCE</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Stage - Strict recreation of user's uploaded reference design */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column (3.5 cols): "SAFE FOOD HEALTHY YOU" + "FOOD SAFETY" + "EXPLORE →" */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8 z-10">
            {/* Top Tagline from Photo */}
            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#F4D9A0] uppercase leading-relaxed">
                SAFE<br />
                FOOD<br />
                HEALTHY<br />
                YOU
              </div>
              <div className="w-10 h-0.5 bg-[#F4D9A0]/70 mt-2" />
            </div>

            {/* Giant Editorial Heading: FOOD SAFETY with swash and sparkle */}
            <div className="relative">
              <h1 className="font-editorial text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#FBF6EE] leading-[0.9] font-normal select-none">
                <span className="block drop-shadow-md">FOOD</span>
                <span className="block text-[#F4D9A0] relative italic font-normal">
                  SAFETY
                  {/* Decorative Sparkle ✦ */}
                  <span className="inline-block text-[#F4D9A0] text-3xl sm:text-4xl ml-2 not-italic align-middle animate-pulse">
                    ✦
                  </span>
                </span>
              </h1>
              {/* Decorative Swash curve underneath */}
              <div className="text-[11px] tracking-[0.3em] uppercase text-[#FBF6EE]/60 font-medium mt-2">
                Under Food Safety and Standards Act 2006
              </div>
            </div>

            {/* Sub-text from Photo */}
            <div className="space-y-1 pt-2">
              <div className="text-sm sm:text-base font-semibold tracking-[0.2em] text-[#FBF6EE]/90 uppercase leading-snug">
                SAFER FOOD<br />
                BRIGHTER<br />
                TOMORROWS.
              </div>
              <p className="text-xs text-[#FBF6EE]/70 max-w-sm pt-2 leading-relaxed">
                India's dual-ended vigilance network: empowering adult citizens with tamper-proof camera evidence and automated FSSAI statutory verification.
              </p>
            </div>

            {/* Explore Button (Matches photo: Pill border button with arrow) */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigateToTab('file_grievance')}
                className="group px-7 py-3 rounded-full border border-[#F4D9A0] hover:bg-[#F4D9A0] text-[#F4D9A0] hover:text-[#2C2016] text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-[#F4D9A0]/20"
              >
                <span>EXPLORE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab('verification_pipeline')}
                className="px-5 py-3 rounded-full bg-[#5B4632] hover:bg-[#4A392A] border border-[#F4D9A0]/30 text-[#FBF6EE] text-xs font-semibold tracking-wider transition-colors cursor-pointer flex items-center gap-2"
              >
                <Scale className="w-3.5 h-3.5 text-[#F4D9A0]" />
                <span>Statutory Pipeline ({activeCount})</span>
              </button>

              <a
                href="/food-safety-pipeline.zip"
                download="food-safety-pipeline.zip"
                className="px-5 py-3 rounded-full bg-[#36281C] hover:bg-[#F4D9A0] hover:text-[#2C2016] border border-[#F4D9A0]/50 text-[#F4D9A0] text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow group"
                title="Download complete shareable ZIP package"
              >
                <Download className="w-3.5 h-3.5 text-[#F4D9A0] group-hover:text-[#2C2016] transition-colors" />
                <span>Shareable ZIP</span>
              </a>
            </div>

            {/* Whistleblower Credential Badge */}
            <div className="pt-2">
              <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#5B4632] border border-[#F4D9A0]/40 flex items-center justify-center text-[#F4D9A0] font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <span className="text-[#FBF6EE] font-bold block">{citizen.firstName} {citizen.lastName}</span>
                    <span className="text-[#F4D9A0] text-[10px] font-mono">Age {citizen.age} · KYC & OTP Verified</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenCitizenModal}
                  className="text-[11px] text-[#F4D9A0] hover:underline cursor-pointer font-medium"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Center Column (5 cols): The Geometric Glass Greenhouse Centerpiece from Photo */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Backlight Halo */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#5B4632]/80 via-transparent to-[#F4D9A0]/20 rounded-3xl blur-2xl pointer-events-none" />

            {/* The Actual Reference Image Frame */}
            <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#F4D9A0]/40 shadow-2xl bg-[#1D150E] group">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-25_at_8.04.10_PM_075a1f51.jpeg"
                alt="Food Safety Greenhouse Produce Reference"
                className="w-full h-auto object-cover max-h-[580px] transition-transform duration-700 group-hover:scale-105"
              />

              {/* Subtle overlay vignette for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2016] via-transparent to-black/30 pointer-events-none" />

              {/* Floating Live Pipeline Overlay Card on bottom of image */}
              <div className="absolute bottom-4 inset-x-4 bg-[#36281C]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#F4D9A0]/40 text-xs shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C86D24] animate-ping" />
                    <span className="font-bold text-[#F4D9A0] uppercase tracking-wider text-[11px]">
                      SIH Public-to-Official Sentinel
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#FBF6EE]/70">
                    Dual-Ended FSSAI Loop
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-[#2C2016] p-1.5 rounded border border-[#F4D9A0]/20">
                    <span className="text-[#F4D9A0] font-mono font-bold block text-sm">{activeCount}</span>
                    <span className="text-[#FBF6EE]/70">Active Cases</span>
                  </div>
                  <div className="bg-[#2C2016] p-1.5 rounded border border-[#C86D24]/40">
                    <span className="text-[#C86D24] font-mono font-bold block text-sm">{criticalCount}</span>
                    <span className="text-[#FBF6EE]/70">Critical Violations</span>
                  </div>
                  <div className="bg-[#2C2016] p-1.5 rounded border border-[#F4D9A0]/20">
                    <span className="text-[#F4D9A0] font-mono font-bold block text-sm">₹{citizen.walletBalanceINR}</span>
                    <span className="text-[#FBF6EE]/70">Your Bounty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (3 cols): "01 02 03", "CLEAN FOOD HABITS HEALTHIER LIVES", Dew Drop Thumbnail */}
          <div className="lg:col-span-3 space-y-8 flex flex-col justify-between h-full pl-0 lg:pl-4 z-10">
            {/* Top Right Counter (01, 02, 03 from Photo) */}
            <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 text-sm font-mono tracking-widest text-[#FBF6EE]/50">
              <span 
                onClick={() => setActiveSlide('01')}
                className={`cursor-pointer transition-colors ${activeSlide === '01' ? 'text-[#F4D9A0] font-bold text-base' : 'hover:text-[#F4D9A0]'}`}
              >
                01
              </span>
              <span 
                onClick={() => setActiveSlide('02')}
                className={`cursor-pointer transition-colors ${activeSlide === '02' ? 'text-[#F4D9A0] font-bold text-base' : 'hover:text-[#F4D9A0]'}`}
              >
                02
              </span>
              <span 
                onClick={() => setActiveSlide('03')}
                className={`cursor-pointer transition-colors ${activeSlide === '03' ? 'text-[#F4D9A0] font-bold text-base' : 'hover:text-[#F4D9A0]'}`}
              >
                03
              </span>
            </div>

            {/* Right Tagline from Photo: CLEAN FOOD HABITS HEALTHIER LIVES */}
            <div className="space-y-1 text-right">
              <div className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#F4D9A0] uppercase leading-relaxed">
                CLEAN<br />
                FOOD HABITS<br />
                HEALTHIER<br />
                LIVES
              </div>
              <p className="text-[11px] text-[#FBF6EE]/70 max-w-[220px] ml-auto pt-1 leading-normal">
                Strict adherence to Food Safety & Standards (Hygiene and Sanitary Practices) Regulations.
              </p>
            </div>

            {/* Framed Thumbnail from Photo: Fresh Dewdrop leaf + "FOOD SAFETY EVERYDAY." */}
            <div className="space-y-3 pt-2">
              <div className="relative rounded-xl overflow-hidden border border-[#F4D9A0]/50 shadow-lg aspect-square max-w-[200px] ml-auto bg-[#1D150E] group cursor-pointer"
                onClick={() => onNavigateToTab('fssai_registry')}
              >
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80"
                  alt="Fresh organic produce dewdrop"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2016]/90 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-right">
                  <span className="text-[9px] font-mono text-[#F4D9A0] uppercase tracking-wider block font-bold">
                    FoSCoS Verified
                  </span>
                </div>
              </div>

              {/* Bottom Caption from Photo with Gold line */}
              <div className="text-right space-y-1">
                <div className="text-xs font-semibold tracking-[0.25em] text-[#FBF6EE] uppercase">
                  FOOD<br />
                  SAFETY<br />
                  EVERYDAY.
                </div>
                <div className="w-12 h-0.5 bg-[#F4D9A0]/70 ml-auto" />
              </div>
            </div>

            {/* Quick Action Button for Higher Official Command */}
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => onNavigateToTab('officer_command')}
                className="inline-flex items-center gap-1.5 text-xs text-[#F4D9A0] hover:text-[#F9E6BD] font-bold tracking-wider uppercase cursor-pointer"
              >
                <span>Officer Command Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5-Stage Interactive SIH Food Safety Pipeline Strip */}
      <section className="relative z-10 border-t border-[#F4D9A0]/20 bg-[#36281C]/95 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#5B4632] text-[#F4D9A0] font-mono text-xs px-2.5 py-0.5 rounded font-bold uppercase mb-2 border border-[#F4D9A0]/30">
                SIH End-to-End Workflow Architecture
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#FBF6EE]">
                Controlled Public to Official Food Safety Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-[#FBF6EE]/75 max-w-2xl mt-1">
                Dual-ended statutory verification safeguarding both citizen complaints and food business rights under FSSA 2006.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab('file_grievance')}
              className="px-5 py-2.5 bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] text-xs font-bold rounded-xl transition-all shadow-md self-start sm:self-auto cursor-pointer flex items-center gap-2"
            >
              <span>Begin Citizen Filing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5 Architectural Steps Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Step 1: Citizen KYC & Live Camera */}
            <div 
              onClick={() => onNavigateToTab('file_grievance')}
              className="bg-[#2C2016] p-4 rounded-2xl border border-[#F4D9A0]/30 hover:border-[#F4D9A0] transition-all cursor-pointer group space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] font-mono text-xs font-bold flex items-center justify-center border border-[#F4D9A0]/40">
                  01
                </span>
                <Camera className="w-4 h-4 text-[#F4D9A0] group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#FBF6EE] group-hover:text-[#F4D9A0] transition-colors">
                  Citizen Live Evidence
                </h3>
                <p className="text-[11px] text-[#FBF6EE]/70 mt-1 leading-snug">
                  Age ≥ 18 KYC, mobile OTP, 2-15 camera photos (gallery disabled), and computer vision food validation.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#F4D9A0] font-semibold block pt-1">
                Phase 1: Ingestion →
              </span>
            </div>

            {/* Step 2: FSSAI Legal Jurisdiction */}
            <div 
              onClick={() => onNavigateToTab('verification_pipeline')}
              className="bg-[#2C2016] p-4 rounded-2xl border border-[#F4D9A0]/30 hover:border-[#F4D9A0] transition-all cursor-pointer group space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] font-mono text-xs font-bold flex items-center justify-center border border-[#F4D9A0]/40">
                  02
                </span>
                <Scale className="w-4 h-4 text-[#F4D9A0] group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#FBF6EE] group-hover:text-[#F4D9A0] transition-colors">
                  FSSA 2006 Jurisdiction
                </h3>
                <p className="text-[11px] text-[#FBF6EE]/70 mt-1 leading-snug">
                  Automated statutory scanner filtering delivery disputes vs food offenses, and license expiry checks.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#F4D9A0] font-semibold block pt-1">
                Phase 2: Legal Filter →
              </span>
            </div>

            {/* Step 3: Anti-Clustering & Dispatch */}
            <div 
              onClick={() => onNavigateToTab('verification_pipeline')}
              className="bg-[#2C2016] p-4 rounded-2xl border border-[#F4D9A0]/30 hover:border-[#F4D9A0] transition-all cursor-pointer group space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] font-mono text-xs font-bold flex items-center justify-center border border-[#F4D9A0]/40">
                  03
                </span>
                <ShieldCheck className="w-4 h-4 text-[#C86D24] group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#FBF6EE] group-hover:text-[#F4D9A0] transition-colors">
                  Hash Clustering
                </h3>
                <p className="text-[11px] text-[#FBF6EE]/70 mt-1 leading-snug">
                  Detects repeat reports on same restaurant, escalates priority to Critical, and assigns higher officials.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#C86D24] font-semibold block pt-1">
                Phase 3: Escalation →
              </span>
            </div>

            {/* Step 4: Physical Raid & Proof Audit */}
            <div 
              onClick={() => onNavigateToTab('officer_command')}
              className="bg-[#2C2016] p-4 rounded-2xl border border-[#F4D9A0]/30 hover:border-[#F4D9A0] transition-all cursor-pointer group space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] font-mono text-xs font-bold flex items-center justify-center border border-[#F4D9A0]/40">
                  04
                </span>
                <Building2 className="w-4 h-4 text-[#F4D9A0] group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#FBF6EE] group-hover:text-[#F4D9A0] transition-colors">
                  Physical Raid Audit
                </h3>
                <p className="text-[11px] text-[#FBF6EE]/70 mt-1 leading-snug">
                  Officers visit on-site, upload tamper-proof camera proofs, fine receipts, with independent human check.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#F4D9A0] font-semibold block pt-1">
                Phase 4: Enforcement →
              </span>
            </div>

            {/* Step 5: Citizen Bounty INR Wallet */}
            <div 
              onClick={() => onNavigateToTab('wallet')}
              className="bg-[#2C2016] p-4 rounded-2xl border border-[#F4D9A0]/30 hover:border-[#F4D9A0] transition-all cursor-pointer group space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] font-mono text-xs font-bold flex items-center justify-center border border-[#F4D9A0]/40">
                  05
                </span>
                <Award className="w-4 h-4 text-[#F4D9A0] group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#FBF6EE] group-hover:text-[#F4D9A0] transition-colors">
                  Citizen INR Bounty
                </h3>
                <p className="text-[11px] text-[#FBF6EE]/70 mt-1 leading-snug">
                  Upon verified settlement, cash reward (up to ₹3,500) credits instantly and converts to bank INR.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#F4D9A0] font-semibold block pt-1">
                Phase 5: Settlement →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Info Modals for ABOUT, PRACTICES, RESOURCES, CONTACT from Nav */}
      {showPracticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#36281C] border border-[#F4D9A0]/50 rounded-2xl w-full max-w-2xl text-[#FBF6EE] p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#F4D9A0]/30 pb-3">
              <h3 className="text-lg font-editorial font-bold text-[#F4D9A0]">
                {showPracticeModal === 'ABOUT' && 'About SIH Food Safety Sentinel'}
                {showPracticeModal === 'PRACTICES' && 'Safe Food Handling & Hygiene Practices'}
                {showPracticeModal === 'RESOURCES' && 'Statutory FSSAI Legal Resources & Gazettes'}
                {showPracticeModal === 'CONTACT' && 'Emergency Food Safety Commission Contacts'}
              </h3>
              <button
                type="button"
                onClick={() => setShowPracticeModal(null)}
                className="text-[#FBF6EE]/70 hover:text-[#F4D9A0] text-sm font-bold px-2 py-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 leading-relaxed text-[#FBF6EE]/85">
              {showPracticeModal === 'ABOUT' && (
                <>
                  <p>
                    <strong>SIH Smart India Hackathon Initiative:</strong> The Controlled Public-to-Official Food Safety Pipeline bridges the critical gap between citizen consumers and district Food Safety Officers (FSO).
                  </p>
                  <p>
                    By deploying lightweight on-device structural image filters, legal jurisdiction scanners, and physical verification checks, the system eliminates bogus complaints while ensuring legitimate health threats receive immediate on-site enforcement.
                  </p>
                </>
              )}

              {showPracticeModal === 'PRACTICES' && (
                <>
                  <p>
                    <strong>Schedule 4 Hygiene Standard:</strong> All food business operators (FBO) must adhere to Schedule 4 of the Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-[#FBF6EE]/80">
                    <li>Segregation of raw and cooked food items to prevent cross-contamination.</li>
                    <li>Potable water certification tested in NABL-accredited laboratories.</li>
                    <li>Pest control records maintained with quarterly physical audit logs.</li>
                    <li>Personal hygiene uniforms, hair nets, and annual medical fitness tests for food handlers.</li>
                  </ul>
                </>
              )}

              {showPracticeModal === 'RESOURCES' && (
                <>
                  <p>
                    Access official government gazettes, penalty schedules, and consumer statutory portals:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                    <a
                      href="https://fssai.gov.in/cms/food-safety-and-standards-act-2006.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded bg-[#2C2016] border border-[#F4D9A0]/30 hover:border-[#F4D9A0] text-[#F4D9A0] flex items-center justify-between"
                    >
                      <span>FSS Act 2006 Gazette</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://foscos.fssai.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded bg-[#2C2016] border border-[#F4D9A0]/30 hover:border-[#F4D9A0] text-[#F4D9A0] flex items-center justify-between"
                    >
                      <span>FoSCoS Central Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </>
              )}

              {showPracticeModal === 'CONTACT' && (
                <>
                  <p>
                    For life-threatening food adulteration or mass outbreak emergencies:
                  </p>
                  <div className="p-3 bg-[#2C2016] rounded-xl border border-[#C86D24]/40 font-mono text-[11px] space-y-1">
                    <div><strong>National Toll-Free Helpline:</strong> 1800-112-100</div>
                    <div><strong>FSSAI Vigilance HQ:</strong> FDA Bhawan, Kotla Road, New Delhi 110002</div>
                    <div><strong>State Rapid Response Cell:</strong> emergency-vigilance@fssai.gov.in</div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#F4D9A0]/20">
              <button
                type="button"
                onClick={() => setShowPracticeModal(null)}
                className="px-4 py-2 bg-[#F4D9A0] text-[#2C2016] text-xs font-bold rounded-lg hover:bg-[#F9E6BD] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
