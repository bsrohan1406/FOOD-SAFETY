import React from 'react';
import { 
  ShieldCheck, 
  Camera, 
  Scale, 
  FileCheck2, 
  Wallet, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Building, 
  Search,
  Lock,
  Sparkles
} from 'lucide-react';

interface FrontPageHeroProps {
  onNavigate: (tab: string) => void;
  totalGrievances: number;
  criticalCount: number;
  walletBalance: number;
}

export const FrontPageHero: React.FC<FrontPageHeroProps> = ({
  onNavigate,
  totalGrievances,
  criticalCount,
  walletBalance
}) => {
  return (
    <div className="space-y-16 py-6 pb-20">
      
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#36281C] to-[#2C2016] border border-[#F4D9A0]/30 shadow-2xl p-8 sm:p-12 lg:p-16">
        
        {/* Subtle decorative gold filigree lines */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4D9A0]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C86D24]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Statutory Seal Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F160E] border border-[#F4D9A0]/40 text-[#F4D9A0] text-xs font-mono tracking-widest uppercase shadow-inner">
            <Scale className="w-4 h-4 text-[#C86D24]" />
            <span>FSS ACT 2006 &bull; SECTION 31 TO 69 GOVERNANCE</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FBF6EE] leading-[1.15]">
            Controlled Public-to-Official <br />
            <span className="text-[#F4D9A0] italic">Food Safety Verification</span> Pipeline
          </h1>

          <p className="text-base sm:text-lg text-[#CDBFAC] max-w-2xl mx-auto leading-relaxed font-sans">
            A dual-ended constitutional grievance framework bridging vigilance from conscious citizens 
            with mandatory on-site enforcement by Designated Food Safety Officers (FSO), real-time 
            FoSCoS licensing audits, on-device CV photo quality gating, and direct statutory bounty escrow.
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('filing')}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#F4D9A0] to-[#D4B776] text-[#2C2016] font-bold text-base shadow-lg hover:shadow-[#F4D9A0]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Camera className="w-5 h-5 text-[#C86D24]" />
              <span>File Grievance (Live Camera)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('pipeline')}
              className="px-6 py-3.5 rounded-xl bg-[#36281C] border border-[#F4D9A0]/40 text-[#FBF6EE] font-semibold text-base hover:bg-[#453424] hover:border-[#F4D9A0] transition-all flex items-center gap-2"
            >
              <Scale className="w-5 h-5 text-[#F4D9A0]" />
              <span>View Statutory Pipeline</span>
            </button>

            <button
              onClick={() => onNavigate('officer')}
              className="px-6 py-3.5 rounded-xl bg-[#1F160E] border border-[#C86D24]/40 text-[#FBF6EE] font-semibold text-base hover:border-[#C86D24] transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-[#C86D24]" />
              <span>FSO Enforcement Desk</span>
            </button>
          </div>

          {/* Real-time Telemetry Metrics */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-[#F4D9A0]/15">
            <div className="bg-[#1F160E]/70 p-3.5 rounded-xl border border-[#F4D9A0]/10">
              <span className="block text-xs font-mono text-[#CDBFAC] uppercase">Active Cases</span>
              <span className="text-2xl font-bold font-mono text-[#FBF6EE]">{totalGrievances}</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Under Audit
              </span>
            </div>

            <div className="bg-[#1F160E]/70 p-3.5 rounded-xl border border-[#F4D9A0]/10">
              <span className="block text-xs font-mono text-[#CDBFAC] uppercase">Critical Incidents</span>
              <span className="text-2xl font-bold font-mono text-[#C86D24]">{criticalCount}</span>
              <span className="text-[11px] text-[#F4D9A0] flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3 h-3" /> Priority Raid
              </span>
            </div>

            <div className="bg-[#1F160E]/70 p-3.5 rounded-xl border border-[#F4D9A0]/10">
              <span className="block text-xs font-mono text-[#CDBFAC] uppercase">Citizen Wallet</span>
              <span className="text-2xl font-bold font-mono text-[#F4D9A0]">₹{walletBalance.toLocaleString()}</span>
              <span className="text-[11px] text-stone-400 mt-0.5 block">Sec 69 DBT Escrow</span>
            </div>

            <div className="bg-[#1F160E]/70 p-3.5 rounded-xl border border-[#F4D9A0]/10">
              <span className="block text-xs font-mono text-[#CDBFAC] uppercase">FoSCoS Cross-check</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">100%</span>
              <span className="text-[11px] text-stone-400 mt-0.5 block">14-Digit Registry</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4-Pillar Pipeline Flow Diagram */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#F4D9A0]">Pipeline Architecture</span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#FBF6EE]">
            The 4-Pillar Verification Safeguard
          </h2>
          <p className="text-sm text-[#CDBFAC]">
            How citizen complaints transform into legally binding statutory enforcement without frivolous backlog.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-[#36281C] border border-[#F4D9A0]/20 rounded-2xl p-6 space-y-4 hover:border-[#F4D9A0]/50 transition-all shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#2C2016] border border-[#F4D9A0]/30 flex items-center justify-center text-[#F4D9A0]">
                <Camera className="w-6 h-6 text-[#C86D24]" />
              </div>
              <span className="text-xs font-mono text-[#F4D9A0] uppercase tracking-wider block">Pillar 01</span>
              <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
                Live CV Capture Only
              </h3>
              <p className="text-xs text-[#CDBFAC] leading-relaxed">
                Prevents stock images, duplicate internet photos, and gallery uploads. Enforces real-time luminance check, Laplacian blur variance filter, and food texture confidence.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F4D9A0]/10 text-[11px] font-mono text-[#F4D9A0]">
              &bull; 2 to 15 Multi-Angle Shots
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#36281C] border border-[#F4D9A0]/20 rounded-2xl p-6 space-y-4 hover:border-[#F4D9A0]/50 transition-all shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#2C2016] border border-[#F4D9A0]/30 flex items-center justify-center text-[#F4D9A0]">
                <Scale className="w-6 h-6 text-[#F4D9A0]" />
              </div>
              <span className="text-xs font-mono text-[#F4D9A0] uppercase tracking-wider block">Pillar 02</span>
              <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
                Statutory Law Scanner
              </h3>
              <p className="text-xs text-[#CDBFAC] leading-relaxed">
                Automatically scans complaints against FSSA 2006 Sections 50, 51, 52, 54, and 59. Filters out non-jurisdiction customer service disputes (late delivery, cold tea) early.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F4D9A0]/10 text-[11px] font-mono text-[#F4D9A0]">
              &bull; Auto-Cluster Repeat FBO Violations
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#36281C] border border-[#F4D9A0]/20 rounded-2xl p-6 space-y-4 hover:border-[#F4D9A0]/50 transition-all shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#2C2016] border border-[#F4D9A0]/30 flex items-center justify-center text-[#F4D9A0]">
                <ShieldCheck className="w-6 h-6 text-[#C86D24]" />
              </div>
              <span className="text-xs font-mono text-[#F4D9A0] uppercase tracking-wider block">Pillar 03</span>
              <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
                FSO Physical On-Site Raid
              </h3>
              <p className="text-xs text-[#CDBFAC] leading-relaxed">
                Designated Food Safety Officers physically visit the premise. Requires live on-site seizure photos, NABL lab sample seal IDs, and secondary Joint Commissioner audit sign-off.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F4D9A0]/10 text-[11px] font-mono text-[#F4D9A0]">
              &bull; Dual-Ended Independent Sign-off
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-[#36281C] border border-[#F4D9A0]/20 rounded-2xl p-6 space-y-4 hover:border-[#F4D9A0]/50 transition-all shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#2C2016] border border-[#F4D9A0]/30 flex items-center justify-center text-[#F4D9A0]">
                <Wallet className="w-6 h-6 text-[#F4D9A0]" />
              </div>
              <span className="text-xs font-mono text-[#F4D9A0] uppercase tracking-wider block">Pillar 04</span>
              <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
                Statutory Reward Wallet
              </h3>
              <p className="text-xs text-[#CDBFAC] leading-relaxed">
                Citizens are incentivized for vigilance. Upon enforcement, 10% of Section 69 compounding fines (₹1,000 to ₹15,000) is deposited into their escrow wallet, withdrawable via IFSC.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F4D9A0]/10 text-[11px] font-mono text-[#F4D9A0]">
              &bull; Direct Benefit Transfer to Bank
            </div>
          </div>

        </div>
      </section>

      {/* Legal Jurisdiction Primer Box */}
      <section className="bg-[#1F160E] border border-[#F4D9A0]/30 rounded-2xl p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F4D9A0]/15 pb-6">
          <div>
            <span className="text-xs font-mono text-[#C86D24] uppercase tracking-wider block">Statutory Reference</span>
            <h3 className="font-editorial text-2xl font-bold text-[#FBF6EE]">
              Food Safety &amp; Standards Act, 2006 Jurisdictions
            </h3>
          </div>
          <button
            onClick={() => onNavigate('pipeline')}
            className="text-xs font-mono text-[#F4D9A0] hover:underline flex items-center gap-1"
          >
            <span>Inspect statutory engine rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-[#2C2016] p-4 rounded-xl border border-[#F4D9A0]/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#F4D9A0] font-mono">Section 31 &bull; Licensing</span>
              <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-[10px]">Strict Liability</span>
            </div>
            <p className="text-[#CDBFAC]">
              Mandatory license for all Food Business Operators (FBOs). Unlicensed or expired operations trigger immediate inspection and seizure.
            </p>
          </div>

          <div className="bg-[#2C2016] p-4 rounded-xl border border-[#F4D9A0]/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#F4D9A0] font-mono">Section 54 &bull; Extraneous Matter</span>
              <span className="bg-amber-500/20 text-[#F4D9A0] px-2 py-0.5 rounded text-[10px]">Up to ₹1 Lakh Fine</span>
            </div>
            <p className="text-[#CDBFAC]">
              Prohibits presence of hair strands, insects, plastic shards, stone grit, or physical contaminants in food served or packaged.
            </p>
          </div>

          <div className="bg-[#2C2016] p-4 rounded-xl border border-[#F4D9A0]/15 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#F4D9A0] font-mono">Section 59 &bull; Unsafe Food</span>
              <span className="bg-rose-600/30 text-rose-300 px-2 py-0.5 rounded text-[10px]">Severe Adulteration</span>
            </div>
            <p className="text-[#CDBFAC]">
              Rigorous penalties and imprisonment for toxic chemical adulteration, glass fragments, or pathogen hazards causing bodily harm.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
