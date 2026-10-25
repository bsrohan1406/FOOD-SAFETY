import { ShieldAlert, UserCheck, ShieldCheck, Wallet, Database, ArrowRightLeft, Home, Sparkles, Download } from 'lucide-react';
import { CitizenUser } from '../types';

export type AppTab = 'home' | 'file_grievance' | 'verification_pipeline' | 'officer_command' | 'wallet' | 'fssai_registry';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  citizen: CitizenUser;
  onOpenCitizenModal: () => void;
  userRole: 'citizen' | 'officer';
  setUserRole: (role: 'citizen' | 'officer') => void;
  activeGrievanceCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  citizen,
  onOpenCitizenModal,
  userRole,
  setUserRole,
  activeGrievanceCount
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#36281C] border-b border-[#F4D9A0]/30 text-[#FBF6EE] shadow-lg">
      {/* SIH Official Banner in Middle (60% Mocha Brown, 30% Champagne Gold, 10% Burnt Amber) */}
      <div className="bg-gradient-to-r from-[#2C2016] via-[#5B4632] to-[#2C2016] px-4 py-1.5 text-center text-xs font-semibold text-[#FBF6EE] tracking-wide shadow-inner flex items-center justify-center gap-2 border-b border-[#F4D9A0]/20">
        <span className="bg-[#2C2016] text-[#C86D24] font-mono px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-[#C86D24]/50">
          SIH National Initiative
        </span>
        <span className="truncate text-[#FBF6EE] text-[11px] sm:text-xs">
          Smart India Hackathon (SIH) · Controlled Public-to-Official Food Safety Pipeline with Dual-Ended Citizen & Official Rights
        </span>
      </div>

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            type="button"
            onClick={() => setActiveTab('home')} 
            className="w-10 h-10 rounded-xl bg-[#5B4632] flex items-center justify-center text-[#F4D9A0] font-black shadow-md border border-[#F4D9A0]/40 hover:scale-105 transition-transform cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5 text-[#F4D9A0]" />
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('home')} 
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="text-base sm:text-lg font-extrabold tracking-tight text-[#FBF6EE] group-hover:text-[#F4D9A0] transition-colors whitespace-nowrap">
              SIH <span className="text-[#F4D9A0]">Food Safety</span> Sentinel
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#F4D9A0]/70 font-medium">
              Dual-Ended Citizen & Official Rights Pipeline
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs lg:text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 cursor-pointer ${
              activeTab === 'home'
                ? 'border-[#F4D9A0] text-[#F4D9A0] font-bold'
                : 'border-transparent text-[#FBF6EE]/75 hover:text-[#F4D9A0]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'home' ? 'bg-[#F4D9A0]' : 'bg-transparent'}`} />
            Home
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file_grievance')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 cursor-pointer ${
              activeTab === 'file_grievance'
                ? 'border-[#F4D9A0] text-[#F4D9A0] font-bold'
                : 'border-transparent text-[#FBF6EE]/75 hover:text-[#F4D9A0]'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-[#F4D9A0]" />
            File Grievance
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verification_pipeline')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 cursor-pointer ${
              activeTab === 'verification_pipeline'
                ? 'border-[#F4D9A0] text-[#F4D9A0] font-bold'
                : 'border-transparent text-[#FBF6EE]/75 hover:text-[#F4D9A0]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#F4D9A0]" />
            Verification State
            <span className="ml-1 text-[10px] bg-[#C86D24] text-white font-mono px-1.5 py-0.2 rounded-full font-bold">
              {activeGrievanceCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('officer_command')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 cursor-pointer ${
              activeTab === 'officer_command'
                ? 'border-[#F4D9A0] text-[#F4D9A0] font-bold'
                : 'border-transparent text-[#FBF6EE]/75 hover:text-[#F4D9A0]'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#F4D9A0]" />
            Higher Officials
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 cursor-pointer ${
              activeTab === 'wallet'
                ? 'border-[#F4D9A0] text-[#F4D9A0] font-bold'
                : 'border-transparent text-[#FBF6EE]/75 hover:text-[#F4D9A0]'
            }`}
          >
            <Wallet className="w-4 h-4 text-[#F4D9A0]" />
            Wallet (₹{citizen.walletBalanceINR.toLocaleString('en-IN')})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fssai_registry')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1.5 border-b-2 cursor-pointer ${
              activeTab === 'fssai_registry'
                ? 'border-[#F4D9A0] text-[#F4D9A0] font-bold'
                : 'border-transparent text-[#FBF6EE]/75 hover:text-[#F4D9A0]'
            }`}
          >
            <Database className="w-4 h-4 text-[#F4D9A0]" />
            FSSAI Registry
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Mode Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <a
            href="/food-safety-pipeline.zip"
            download="food-safety-pipeline.zip"
            title="Download Shareable ZIP Bundle (All source code, assets & docs)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-[#5B4632] hover:bg-[#F4D9A0] hover:text-[#2C2016] border border-[#F4D9A0]/60 text-[#F4D9A0] transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0 group"
          >
            <Download className="w-3.5 h-3.5 text-[#F4D9A0] group-hover:text-[#2C2016] transition-colors" />
            <span className="hidden sm:inline">Project</span> <span>.ZIP</span>
          </a>

          <button
            type="button"
            onClick={() => setUserRole(userRole === 'citizen' ? 'officer' : 'citizen')}
            title="Toggle between Citizen reporting and Official Raid Command mode"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2C2016] border border-[#F4D9A0]/40 text-[#F4D9A0] hover:bg-[#5B4632] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#F4D9A0]" />
            <span className="hidden sm:inline">Role:</span>
            <span className="uppercase text-[#FBF6EE] font-bold">{userRole}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCitizenModal}
            className="px-3.5 py-1.5 text-xs font-bold text-[#2C2016] bg-[#F4D9A0] hover:bg-[#F9E6BD] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-md flex items-center gap-1.5 border border-[#F4D9A0] cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#C86D24] animate-pulse" />
            {citizen.isVerified ? `${citizen.firstName} · Verified` : 'Citizen Login'}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Fixed for Mobile Screens) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#36281C]/95 backdrop-blur-md border-t border-[#F4D9A0]/30 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] cursor-pointer ${
            activeTab === 'home' ? 'text-[#F4D9A0] font-bold' : 'text-[#FBF6EE]/60'
          }`}
        >
          <Home className="w-4 h-4 text-[#F4D9A0]" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('file_grievance')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] cursor-pointer ${
            activeTab === 'file_grievance' ? 'text-[#F4D9A0] font-bold' : 'text-[#FBF6EE]/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-[#C86D24]" />
          <span>Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verification_pipeline')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] cursor-pointer ${
            activeTab === 'verification_pipeline' ? 'text-[#F4D9A0] font-bold' : 'text-[#FBF6EE]/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#F4D9A0]" />
          <span>Verify ({activeGrievanceCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('officer_command')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] cursor-pointer ${
            activeTab === 'officer_command' ? 'text-[#F4D9A0] font-bold' : 'text-[#FBF6EE]/60'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#F4D9A0]" />
          <span>Officials</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] cursor-pointer ${
            activeTab === 'wallet' ? 'text-[#F4D9A0] font-bold' : 'text-[#FBF6EE]/60'
          }`}
        >
          <Wallet className="w-4 h-4 text-[#F4D9A0]" />
          <span>Wallet</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fssai_registry')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] cursor-pointer ${
            activeTab === 'fssai_registry' ? 'text-[#F4D9A0] font-bold' : 'text-[#FBF6EE]/60'
          }`}
        >
          <Database className="w-4 h-4 text-[#F4D9A0]" />
          <span>FSSAI</span>
        </button>
      </div>
    </header>
  );
};
