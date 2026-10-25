import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FrontPageHero } from './components/FrontPageHero';
import { GrievanceFilingWizard } from './components/GrievanceFilingWizard';
import { PipelineVerificationDashboard } from './components/PipelineVerificationDashboard';
import { HigherOfficialDashboard } from './components/HigherOfficialDashboard';
import { CitizenWalletView } from './components/CitizenWalletView';
import { FSSAIDatabaseView } from './components/FSSAIDatabaseView';
import { GrievanceDossierModal } from './components/GrievanceDossierModal';
import { CitizenRegistrationModal } from './components/CitizenRegistrationModal';
import { 
  INITIAL_CITIZEN, 
  INITIAL_FSSAI_REGISTRY, 
  INITIAL_GRIEVANCES, 
  INITIAL_WALLET_TRANSACTIONS 
} from './data/mockDatabase';
import { 
  GrievanceDossier, 
  CitizenProfile, 
  FSSAILicensee, 
  WalletTransaction, 
  OfficerActionLog 
} from './types';
import { calculateStatutoryBountyINR } from './utils/foodSafetyRules';
import { CheckCircle2, AlertCircle, X, Scale } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [activeRole, setActiveRole] = useState<'citizen' | 'officer'>('citizen');

  // Application Data States
  const [citizen, setCitizen] = useState<CitizenProfile>(INITIAL_CITIZEN);
  const [fssaiRegistry, setFssaiRegistry] = useState<FSSAILicensee[]>(INITIAL_FSSAI_REGISTRY);
  const [grievances, setGrievances] = useState<GrievanceDossier[]>(INITIAL_GRIEVANCES);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);

  // Modal States
  const [selectedDossier, setSelectedDossier] = useState<GrievanceDossier | null>(null);
  const [isKycModalOpen, setIsKycModalOpen] = useState<boolean>(false);

  // Global Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>({
    message: 'Welcome to Sentinel. National Food Safety verification pipeline active.',
    type: 'info'
  });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Submit new grievance
  const handleSubmitGrievance = (newDossier: GrievanceDossier) => {
    setGrievances((prev) => [newDossier, ...prev]);
    showToast(
      `Grievance ${newDossier.trackingNumber} logged into National Docket. Pre-screened under FSS Act 2006.`,
      'success'
    );
  };

  // Dispatch FSO on-site
  const handleDispatchOfficer = (dossierId: string) => {
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === dossierId ? { ...g, status: 'inspection_in_progress' } : g
      )
    );
    showToast('Designated Food Safety Officer dispatched for physical on-site inspection.', 'info');
  };

  // Enforce officer action and disburse bounty
  const handleEnforceOfficerAction = (dossierId: string, actionLog: OfficerActionLog) => {
    let bountyAmount = 0;

    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === dossierId) {
          bountyAmount = calculateStatutoryBountyINR(
            actionLog.compoundingFineINR,
            g.statutoryReview.severityScore
          );
          return {
            ...g,
            status: 'action_enforced',
            officerAction: actionLog,
            rewardDisbursedINR: bountyAmount
          };
        }
        return g;
      })
    );

    if (bountyAmount > 0) {
      // Credit to citizen wallet
      setCitizen((prev) => ({
        ...prev,
        walletBalanceINR: prev.walletBalanceINR + bountyAmount
      }));

      // Add transaction
      const newTxn: WalletTransaction = {
        id: `TXN-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        type: 'credit_bounty',
        amountINR: bountyAmount,
        dossierTrackingNumber: grievances.find(g => g.id === dossierId)?.trackingNumber,
        description: `Statutory Bounty for Case ${grievances.find(g => g.id === dossierId)?.trackingNumber} (${actionLog.actionTaken})`,
        status: 'Completed',
        referenceId: `DBT/FSSAI/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`
      };

      setWalletTransactions((prev) => [newTxn, ...prev]);

      showToast(
        `Action enforced by FSO ${actionLog.officerName}! ₹${bountyAmount.toLocaleString()} statutory bounty credited to citizen wallet.`,
        'success'
      );
    } else {
      showToast(`Action recorded by FSO ${actionLog.officerName}. Inspection report archived.`, 'success');
    }
  };

  // Withdraw funds
  const handleWithdrawFunds = (amount: number, ifsc: string, accNum: string) => {
    setCitizen((prev) => ({
      ...prev,
      walletBalanceINR: prev.walletBalanceINR - amount
    }));

    const withdrawTxn: WalletTransaction = {
      id: `TXN-WTH-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'withdrawal_bank',
      amountINR: amount,
      description: `Direct Bank Transfer to ${citizen.bankAccount?.bankName || 'Bank'} (${accNum})`,
      status: 'Completed',
      referenceId: `NEFT/NPCI/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`
    };

    setWalletTransactions((prev) => [withdrawTxn, ...prev]);
    showToast(`₹${amount.toLocaleString()} withdrawn to ${ifsc}. Transfer reference generated.`, 'success');
  };

  // Add new licensee to registry
  const handleAddNewLicensee = (fbo: FSSAILicensee) => {
    setFssaiRegistry((prev) => [fbo, ...prev]);
    showToast(`Food Business Operator ${fbo.businessName} indexed into FoSCoS registry.`, 'success');
  };

  // Critical cases count
  const criticalCount = grievances.filter((g) => g.priority === 'Critical').length;

  return (
    <div className="min-h-screen bg-[#2C2016] text-[#FBF6EE] flex flex-col font-sans selection:bg-[#F4D9A0] selection:text-[#2C2016]">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        citizen={citizen}
        totalGrievancesCount={grievances.length}
        criticalCasesCount={criticalCount}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#1F160E] border border-[#F4D9A0]/40 text-[#FBF6EE] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-[#F4D9A0] shrink-0" />
          <p className="text-xs font-medium leading-snug">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {activeTab === 'hero' && (
          <FrontPageHero
            onNavigate={(tab) => setActiveTab(tab)}
            totalGrievances={grievances.length}
            criticalCount={criticalCount}
            walletBalance={citizen.walletBalanceINR}
          />
        )}

        {activeTab === 'filing' && (
          <GrievanceFilingWizard
            citizen={citizen}
            fssaiRegistry={fssaiRegistry}
            onOpenKycModal={() => setIsKycModalOpen(true)}
            onSubmitGrievance={handleSubmitGrievance}
            onNavigateToPipeline={() => setActiveTab('pipeline')}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineVerificationDashboard
            grievances={grievances}
            onSelectDossier={(d) => setSelectedDossier(d)}
            onDispatchOfficer={handleDispatchOfficer}
          />
        )}

        {activeTab === 'officer' && (
          <HigherOfficialDashboard
            grievances={grievances}
            onEnforceOfficerAction={handleEnforceOfficerAction}
            onSelectDossier={(d) => setSelectedDossier(d)}
          />
        )}

        {activeTab === 'wallet' && (
          <CitizenWalletView
            citizen={citizen}
            transactions={walletTransactions}
            onWithdrawFunds={handleWithdrawFunds}
            onOpenKycModal={() => setIsKycModalOpen(true)}
          />
        )}

        {activeTab === 'registry' && (
          <FSSAIDatabaseView
            registry={fssaiRegistry}
            onAddNewLicensee={handleAddNewLicensee}
          />
        )}
      </main>

      {/* Case Dossier Detail Modal */}
      <GrievanceDossierModal
        dossier={selectedDossier}
        onClose={() => setSelectedDossier(null)}
      />

      {/* Citizen KYC Registration Modal */}
      <CitizenRegistrationModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        citizen={citizen}
        onUpdateCitizen={(updated) => {
          setCitizen(updated);
          showToast('Citizen KYC & bank account details saved successfully.', 'success');
        }}
      />

      {/* Editorial Footer */}
      <footer className="mt-auto border-t border-[#F4D9A0]/15 bg-[#1F160E] py-8 text-xs text-[#CDBFAC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-[#C86D24]" />
            <span className="font-editorial text-sm font-bold text-[#FBF6EE]">
              Food Safety &amp; Standards Authority of India (FSSAI) Sentinel
            </span>
          </div>
          <div className="text-center md:text-right font-mono text-[11px] text-stone-400">
            Controlled Public-to-Official Pipeline &bull; FSS Act 2006 Governance &bull; Smart India Hackathon
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
