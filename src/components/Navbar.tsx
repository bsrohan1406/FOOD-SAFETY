import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Search, 
  Wallet, 
  BadgeAlert, 
  Building2, 
  UserCheck, 
  Scale
} from 'lucide-react';
import { CitizenProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: 'citizen' | 'officer';
  setActiveRole: (role: 'citizen' | 'officer') => void;
  citizen: CitizenProfile;
  totalGrievancesCount: number;
  criticalCasesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  setActiveRole,
  citizen,
  criticalCasesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#2C2016]/95 backdrop-blur-md border-b border-[#F4D9A0]/20 shadow-xl">
      {/* Statutory Header Ribbon */}
      <div className="bg-[#1F160E] px-4 py-1.5 text-xs text-[#CDBFAC] border-b border-[#F4D9A0]/10 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center gap-1 font-semibold text-[#F4D9A0]">
            <Scale className="w-3.5 h-3.5 text-[#C86D24]" />
            GOVERNMENT OF INDIA &bull; FSS ACT 2006
          </span>
          <span className="hidden md:inline text-stone-400">|</span>
          <span className="hidden md:inline text-stone-300">
            Public-to-Official Verification Pipeline &bull; Dual-Ended Citizen &amp; FSO Enforcement
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[#FBF6EE] font-mono">FoSCoS Sync: Online</span>
          </div>
          {criticalCasesCount > 0 && (
            <div className="flex items-center gap-1 text-[#C86D24] font-medium bg-[#C86D24]/10 px-2 py-0.5 rounded border border-[#C86D24]/30">
              <BadgeAlert className="w-3.5 h-3.5" />
              <span>{criticalCasesCount} Critical Flags</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & National Seal Title */}
          <div 
            onClick={() => setActiveTab('hero')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F4D9A0] via-[#C86D24] to-[#36281C] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#2C2016] rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-[#F4D9A0] group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-editorial text-xl font-bold tracking-wide text-[#FBF6EE]">
                  SENTINEL
                </span>
                <span className="bg-[#F4D9A0]/15 text-[#F4D9A0] text-[10px] tracking-wider px-2 py-0.5 rounded border border-[#F4D9A0]/30 font-mono uppercase">
                  FSSAI Pipeline
                </span>
              </div>
              <p className="text-xs text-[#CDBFAC] tracking-tight">
                Dual-Ended Food Safety Governance
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'hero'
                  ? 'bg-[#F4D9A0] text-[#2C2016] font-semibold shadow'
                  : 'text-[#FBF6EE]/80 hover:text-[#F4D9A0] hover:bg-[#36281C]'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('filing')}
              className={`px-3.5 py-2 text-sm font-medium rounded-md flex items-center space-x-1.5 transition-all ${
                activeTab === 'filing'
                  ? 'bg-[#F4D9A0] text-[#2C2016] font-semibold shadow'
                  : 'text-[#FBF6EE]/80 hover:text-[#F4D9A0] hover:bg-[#36281C]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>File Grievance</span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center space-x-1.5 transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-[#F4D9A0] text-[#2C2016] font-semibold shadow'
                  : 'text-[#FBF6EE]/80 hover:text-[#F4D9A0] hover:bg-[#36281C]'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Pipeline &amp; Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab('officer')}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center space-x-1.5 transition-all ${
                activeTab === 'officer'
                  ? 'bg-[#F4D9A0] text-[#2C2016] font-semibold shadow'
                  : 'text-[#FBF6EE]/80 hover:text-[#F4D9A0] hover:bg-[#36281C]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>FSO Command</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center space-x-1.5 transition-all ${
                activeTab === 'wallet'
                  ? 'bg-[#F4D9A0] text-[#2C2016] font-semibold shadow'
                  : 'text-[#FBF6EE]/80 hover:text-[#F4D9A0] hover:bg-[#36281C]'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Statutory Wallet</span>
            </button>

            <button
              onClick={() => setActiveTab('registry')}
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center space-x-1.5 transition-all ${
                activeTab === 'registry'
                  ? 'bg-[#F4D9A0] text-[#2C2016] font-semibold shadow'
                  : 'text-[#FBF6EE]/80 hover:text-[#F4D9A0] hover:bg-[#36281C]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>FoSCoS Registry</span>
            </button>
          </nav>

          {/* Right Controls: Role Switcher & Citizen Balance */}
          <div className="flex items-center space-x-3">
            {/* Wallet quick badge */}
            <div 
              onClick={() => setActiveTab('wallet')}
              className="cursor-pointer bg-[#36281C] hover:bg-[#453424] transition-colors border border-[#F4D9A0]/30 rounded-lg px-3 py-1.5 flex items-center space-x-2"
              title="Click to view Citizen Reward Wallet"
            >
              <Wallet className="w-4 h-4 text-[#F4D9A0]" />
              <div className="text-right">
                <span className="block text-[10px] text-[#CDBFAC] uppercase tracking-wider font-mono">Bounty</span>
                <span className="font-mono text-sm font-bold text-[#F4D9A0]">₹{citizen.walletBalanceINR.toLocaleString()}</span>
              </div>
            </div>

            {/* Role switch toggle */}
            <div className="bg-[#1F160E] p-1 rounded-lg border border-[#F4D9A0]/20 flex items-center text-xs">
              <button
                onClick={() => {
                  setActiveRole('citizen');
                  if (activeTab === 'officer') setActiveTab('filing');
                }}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
                  activeRole === 'citizen'
                    ? 'bg-[#C86D24] text-white font-semibold'
                    : 'text-[#CDBFAC] hover:text-[#FBF6EE]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </button>
              <button
                onClick={() => {
                  setActiveRole('officer');
                  setActiveTab('officer');
                }}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
                  activeRole === 'officer'
                    ? 'bg-[#F4D9A0] text-[#2C2016] font-bold'
                    : 'text-[#CDBFAC] hover:text-[#FBF6EE]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>FSO Officer</span>
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center space-x-2 overflow-x-auto py-2.5 border-t border-[#F4D9A0]/10 text-xs">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-3 py-1.5 whitespace-nowrap rounded ${
              activeTab === 'hero' ? 'bg-[#F4D9A0] text-[#2C2016] font-bold' : 'text-[#FBF6EE]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('filing')}
            className={`px-3 py-1.5 whitespace-nowrap rounded ${
              activeTab === 'filing' ? 'bg-[#F4D9A0] text-[#2C2016] font-bold' : 'text-[#FBF6EE]'
            }`}
          >
            File Grievance
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 whitespace-nowrap rounded ${
              activeTab === 'pipeline' ? 'bg-[#F4D9A0] text-[#2C2016] font-bold' : 'text-[#FBF6EE]'
            }`}
          >
            Pipeline
          </button>
          <button
            onClick={() => setActiveTab('officer')}
            className={`px-3 py-1.5 whitespace-nowrap rounded ${
              activeTab === 'officer' ? 'bg-[#F4D9A0] text-[#2C2016] font-bold' : 'text-[#FBF6EE]'
            }`}
          >
            FSO Desk
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-1.5 whitespace-nowrap rounded ${
              activeTab === 'wallet' ? 'bg-[#F4D9A0] text-[#2C2016] font-bold' : 'text-[#FBF6EE]'
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3 py-1.5 whitespace-nowrap rounded ${
              activeTab === 'registry' ? 'bg-[#F4D9A0] text-[#2C2016] font-bold' : 'text-[#FBF6EE]'
            }`}
          >
            FoSCoS Registry
          </button>
        </div>
      </div>
    </header>
  );
};
