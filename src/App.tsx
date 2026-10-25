import React, { useState, useEffect } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { FrontPageHero } from './components/FrontPageHero';
import { GrievanceFilingWizard } from './components/GrievanceFilingWizard';
import { PipelineVerificationDashboard } from './components/PipelineVerificationDashboard';
import { HigherOfficialDashboard } from './components/HigherOfficialDashboard';
import { CitizenWalletView } from './components/CitizenWalletView';
import { FSSAIDatabaseView } from './components/FSSAIDatabaseView';
import { CitizenRegistrationModal } from './components/CitizenRegistrationModal';
import { GrievanceDossierModal } from './components/GrievanceDossierModal';
import { 
  INITIAL_CITIZEN, 
  INITIAL_GRIEVANCES, 
  INITIAL_TRANSACTIONS 
} from './data/mockDatabase';
import { CitizenUser, Grievance, WalletTransaction } from './types';
import { ShieldCheck, CheckCircle2, Award, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [userRole, setUserRole] = useState<'citizen' | 'officer'>('citizen');
  
  // Data State
  const [citizen, setCitizen] = useState<CitizenUser>(INITIAL_CITIZEN);
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  
  // Modals
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);
  const [selectedGrievanceForDossier, setSelectedGrievanceForDossier] = useState<Grievance | null>(null);
  
  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Autostart parameter check
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['home', 'file_grievance', 'verification_pipeline', 'officer_command', 'wallet', 'fssai_registry'].includes(tabParam)) {
      setActiveTab(tabParam as AppTab);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleCreateGrievance = (newGrievance: Grievance) => {
    setGrievances(prev => [newGrievance, ...prev]);
    showToast(`Grievance ${newGrievance.id} successfully lodged into verification pipeline! FSSA 2006 Statutory Assessment complete.`);
    setActiveTab('verification_pipeline');
  };

  const handleUpdateGrievance = (updated: Grievance) => {
    setGrievances(prev => prev.map(g => g.id === updated.id ? updated : g));
    if (updated.status === 'settled') {
      showToast(`Grievance ${updated.id} settled! Bounty of ₹${updated.rewardAmountINR} credited to citizen wallet.`);
    } else if (updated.status === 'proof_submitted_pending_audit') {
      showToast(`Official inspection proof submitted for ${updated.id}. Dual human verification queued.`);
    }
  };

  const handleCreditCitizenWallet = (amountINR: number, grievanceId: string, description: string) => {
    setCitizen(prev => ({
      ...prev,
      walletBalanceINR: prev.walletBalanceINR + amountINR
    }));

    const newTxn: WalletTransaction = {
      id: `TXN-SIH-${Math.floor(1000 + Math.random() * 9000)}`,
      grievanceId,
      timestamp: new Date().toISOString(),
      type: 'CREDIT_REWARD',
      amountINR,
      description,
      referenceNumber: `FSSAI-BOUNTY-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'COMPLETED'
    };

    setTransactions(prev => [newTxn, ...prev]);
  };

  const handleWithdrawFunds = (amountINR: number, bankDetails: { account: string; ifsc: string; holder: string }) => {
    setCitizen(prev => ({
      ...prev,
      walletBalanceINR: prev.walletBalanceINR - amountINR
    }));

    const newTxn: WalletTransaction = {
      id: `TXN-WD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      type: 'DEBIT_WITHDRAWAL',
      amountINR,
      description: `INR Bank Payout to ${bankDetails.holder} (A/c ...${bankDetails.account.slice(-4)}) IFSC: ${bankDetails.ifsc}`,
      referenceNumber: `NEFT-FSSAI-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'COMPLETED'
    };

    setTransactions(prev => [newTxn, ...prev]);
    showToast(`Withdrawal of ₹${amountINR.toLocaleString('en-IN')} successfully initiated via RBI NEFT gateway!`);
  };

  return (
    <div className="min-h-screen bg-[#2C2016] text-[#FBF6EE] flex flex-col font-sans selection:bg-[#F4D9A0] selection:text-[#2C2016]">
      {/* Navbar with 60-30-10 styling & SIH banner */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        citizen={citizen}
        onOpenCitizenModal={() => setIsCitizenModalOpen(true)}
        userRole={userRole}
        setUserRole={role => {
          setUserRole(role);
          if (role === 'officer') {
            setActiveTab('officer_command');
          } else {
            setActiveTab('file_grievance');
          }
        }}
        activeGrievanceCount={grievances.length}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#36281C] border-2 border-[#F4D9A0] text-[#FBF6EE] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs max-w-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#F4D9A0] shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-8">
        {activeTab === 'home' && (
          <FrontPageHero
            onNavigateToTab={setActiveTab}
            citizen={citizen}
            grievances={grievances}
            onOpenCitizenModal={() => setIsCitizenModalOpen(true)}
          />
        )}

        {activeTab === 'file_grievance' && (
          <GrievanceFilingWizard
            citizen={citizen}
            onOpenCitizenModal={() => setIsCitizenModalOpen(true)}
            onSubmitGrievance={handleCreateGrievance}
            existingGrievances={grievances}
          />
        )}

        {activeTab === 'verification_pipeline' && (
          <PipelineVerificationDashboard
            grievances={grievances}
            onSelectGrievanceForAudit={setSelectedGrievanceForDossier}
            onNavigateToOfficerCommand={() => setActiveTab('officer_command')}
          />
        )}

        {activeTab === 'officer_command' && (
          <HigherOfficialDashboard
            grievances={grievances}
            onUpdateGrievance={handleUpdateGrievance}
            onCreditCitizenWallet={handleCreditCitizenWallet}
            onNavigateToWallet={() => setActiveTab('wallet')}
          />
        )}

        {activeTab === 'wallet' && (
          <CitizenWalletView
            citizen={citizen}
            transactions={transactions}
            onWithdrawFunds={handleWithdrawFunds}
          />
        )}

        {activeTab === 'fssai_registry' && (
          <FSSAIDatabaseView />
        )}
      </main>

      {/* Footer following 60-30-10 palette */}
      <footer className="bg-[#231911] border-t border-[#F4D9A0]/20 text-[#FBF6EE]/70 text-xs py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#FBF6EE] text-sm">
              SIH <span className="text-[#F4D9A0]">Food Safety</span> Sentinel
            </span>
            <span>·</span>
            <span className="text-[#FBF6EE]/50">
              Smart India Hackathon Controlled Public-to-Official Pipeline
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-[#FBF6EE]/75">
            <span>Food Safety and Standards Act 2006</span>
            <span>·</span>
            <a
              href="/food-safety-pipeline.zip"
              download="food-safety-pipeline.zip"
              className="text-[#F4D9A0] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Download Project .ZIP</span>
            </a>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('fssai_registry')}
              className="hover:text-[#F4D9A0] transition-colors cursor-pointer"
            >
              FoSCoS Registry
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsCitizenModalOpen(true)}
              className="hover:text-[#F4D9A0] transition-colors cursor-pointer"
            >
              Citizen KYC (Age ≥ 18)
            </button>
          </div>
        </div>
      </footer>

      {/* Citizen Registration & Mobile OTP Modal */}
      <CitizenRegistrationModal
        isOpen={isCitizenModalOpen}
        onClose={() => setIsCitizenModalOpen(false)}
        citizen={citizen}
        onUpdateCitizen={updated => {
          setCitizen(updated);
          showToast('Citizen KYC & Mobile OTP authentication successfully verified!');
        }}
      />

      {/* Dossier Detail Inspection Modal */}
      <GrievanceDossierModal
        grievance={selectedGrievanceForDossier}
        onClose={() => setSelectedGrievanceForDossier(null)}
      />
    </div>
  );
}
