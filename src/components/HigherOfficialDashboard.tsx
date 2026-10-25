import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  Upload, 
  FileText, 
  DollarSign, 
  Send, 
  X, 
  ExternalLink,
  Building,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';
import { Grievance, OfficialProof, PriorityLevel } from '../types';
import { calculateCitizenReward } from '../utils/foodSafetyRules';

interface HigherOfficialDashboardProps {
  grievances: Grievance[];
  onUpdateGrievance: (updated: Grievance) => void;
  onCreditCitizenWallet: (amountINR: number, grievanceId: string, description: string) => void;
  onNavigateToWallet: () => void;
}

export const HigherOfficialDashboard: React.FC<HigherOfficialDashboardProps> = ({
  grievances,
  onUpdateGrievance,
  onCreditCitizenWallet,
  onNavigateToWallet
}) => {
  // Sort from higher priority to lower priority (Critical -> High -> Medium -> Low)
  const priorityOrder: Record<PriorityLevel, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3
  };

  const sortedGrievances = [...grievances].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Active modal for resolution proof submission
  const [selectedGrievanceForProof, setSelectedGrievanceForProof] = useState<Grievance | null>(null);

  // Resolution Form Data
  const [actionTaken, setActionTaken] = useState<OfficialProof['actionTaken']>('compounded_fine');
  const [findingsNotes, setFindingsNotes] = useState('');
  const [fineAmountINR, setFineAmountINR] = useState('15000');
  const [sampleBatchCodes, setSampleBatchCodes] = useState('BATCH-SEIZE-9912, BATCH-SEIZE-9913');
  const [raidProofImages, setRaidProofImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
  ]);
  const [proofValidationError, setProofValidationError] = useState<string | null>(null);

  // Inspection simulation check
  const handleOpenRaidModal = (grievance: Grievance) => {
    setSelectedGrievanceForProof(grievance);
    setFindingsNotes(`On-site surprise inspection conducted at ${grievance.businessName}. Physical inspection confirmed violation under ${grievance.verificationState.jurisdictionSectionCited || 'FSSA 2006'}.`);
    setProofValidationError(null);
  };

  const handleOfficerSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievanceForProof) return;

    // Weak accountability loop checks:
    // 1. Officer cannot submit without proofs
    if (raidProofImages.length === 0) {
      setProofValidationError('Accountability Violation: Officers are strictly prohibited from resolving grievances without authentic physical raid photographs.');
      return;
    }

    // 2. Cannot submit blank findings
    if (findingsNotes.trim().length < 20) {
      setProofValidationError('Official findings must contain detailed description of inspection findings and statutory sections applied.');
      return;
    }

    const officialProof: OfficialProof = {
      officerId: 'OFFICER-KA-042',
      officerName: 'Dr. Suresh Babu, M.Sc (Food Tech)',
      designation: 'Senior Food Safety Officer',
      visitTimestamp: new Date().toISOString(),
      proofImages: raidProofImages,
      findingsNotes,
      actionTaken,
      fineAmountINR: Number(fineAmountINR) || 0,
      sampleBatchCodes: sampleBatchCodes.split(',').map(s => s.trim()).filter(Boolean),
      independentAuditorApproved: false, // Must be audited by human/citizen
      citizenAcknowledged: false
    };

    const updated: Grievance = {
      ...selectedGrievanceForProof,
      status: 'proof_submitted_pending_audit',
      officialResolution: officialProof
    };

    onUpdateGrievance(updated);
    setSelectedGrievanceForProof(null);
  };

  // Human Independent Audit Simulation (Dual-ended approval or rejection)
  const handleAuditorDecision = (grievance: Grievance, approved: boolean, rejectionRemarks?: string) => {
    if (approved) {
      const reward = calculateCitizenReward(grievance.priority);
      const updated: Grievance = {
        ...grievance,
        status: 'settled',
        rewardStatus: 'credited',
        rewardAmountINR: reward,
        officialResolution: grievance.officialResolution ? {
          ...grievance.officialResolution,
          independentAuditorApproved: true,
          citizenAcknowledged: true,
          auditorRemarks: 'Dual verification validated by District Magistrate inspection auditor & citizen concurrence.'
        } : undefined
      };

      onUpdateGrievance(updated);
      // Credit to citizen wallet!
      onCreditCitizenWallet(
        reward,
        grievance.id,
        `Bounty for settled ${grievance.priority.toUpperCase()} priority grievance against ${grievance.businessName}`
      );
    } else {
      // Revert back to officer dashboard!
      const updated: Grievance = {
        ...grievance,
        status: 'officer_investigating',
        officialResolution: grievance.officialResolution ? {
          ...grievance.officialResolution,
          independentAuditorApproved: false,
          auditorRemarks: rejectionRemarks || 'Proof rejected during human check: Insufficient evidence of sample seizure seal. Re-inspection required.'
        } : undefined
      };
      onUpdateGrievance(updated);
    }
  };

  const handleEscalateToStateAuthority = (grievance: Grievance) => {
    const updated: Grievance = {
      ...grievance,
      status: 'escalated_to_state_authority',
      priority: 'critical'
    };
    onUpdateGrievance(updated);
    alert(`Grievance ${grievance.id} has crossed SLA timeline. Escalated directly to Shri Manoj Kumar Singh, IAS (Commissioner of Food Safety, Karnataka) with disciplinary accountability notice.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 60-30-10 Header (Mocha Brown 60%, Champagne Gold 30%, Burnt Amber/White 10%) */}
      <div className="bg-gradient-to-r from-[#2C2016] via-[#5B4632] to-[#36281C] rounded-2xl p-6 text-[#FBF6EE] shadow-xl border border-[#F4D9A0]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2C2016] text-[#C86D24] font-mono text-xs px-2.5 py-0.5 rounded font-bold uppercase mb-2 border border-[#C86D24]/40">
              Pipeline Stage 3: Official Raid Command & Anti-Tamper Audit
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#FBF6EE]">
              Higher Officials Inspection & Enforcement Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#F4D9A0]/85 mt-1 max-w-2xl">
              Strict dual-ended accountability protocol: Officers must physically inspect locations and cannot settle issues without authentic live photo proofs and independent human sign-off.
            </p>
          </div>

          <div className="bg-[#2C2016]/95 p-3 rounded-xl border border-[#F4D9A0]/30 text-xs shrink-0 sm:text-right">
            <span className="text-[#FBF6EE]/60 block">Logged In Official:</span>
            <span className="text-[#FBF6EE] font-bold block">Dr. Suresh Babu, M.Sc (Food Tech)</span>
            <span className="text-[#F4D9A0] font-mono text-[11px] block">
              Senior Food Safety Officer (FSO) · KA-042
            </span>
          </div>
        </div>
      </div>

      {/* Priority Sorted Grievance Queue */}
      <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 text-[#FBF6EE] shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#F4D9A0]/20 pb-4">
          <div>
            <h2 className="text-base font-bold text-[#FBF6EE] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#F4D9A0]" />
              Prioritized Enforcement Queue (Higher to Lower Priority)
            </h2>
            <p className="text-xs text-[#FBF6EE]/70 mt-0.5">
              Strict SLA enforcement: Grievances unaddressed within 48 hours are automatically escalated to the State Food Safety Commissioner.
            </p>
          </div>

          <span className="text-xs font-mono bg-[#2C2016] text-[#F4D9A0] px-3 py-1 rounded-lg border border-[#F4D9A0]/30 font-bold">
            {sortedGrievances.length} Active Dossiers
          </span>
        </div>

        {/* Grievances list */}
        <div className="space-y-4">
          {sortedGrievances.map(grievance => {
            const isEscalated = grievance.status === 'escalated_to_state_authority';
            const isSettled = grievance.status === 'settled';
            const isPendingAudit = grievance.status === 'proof_submitted_pending_audit';

            return (
              <div
                key={grievance.id}
                className={`rounded-2xl p-5 border transition-all ${
                  grievance.priority === 'critical'
                    ? 'bg-[#2C2016] border-[#C86D24]'
                    : grievance.priority === 'high'
                    ? 'bg-[#2C2016] border-[#F4D9A0]/60'
                    : 'bg-[#2C2016]/80 border-[#F4D9A0]/20'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4D9A0]/20 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black font-mono text-[#FBF6EE]">
                      {grievance.id}
                    </span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${
                      grievance.priority === 'critical'
                        ? 'bg-[#C86D24] text-white border-[#C86D24]'
                        : grievance.priority === 'high'
                        ? 'bg-[#5B4632] text-[#F4D9A0] border-[#F4D9A0]'
                        : 'bg-[#36281C] text-[#F4D9A0] border-[#F4D9A0]/40'
                    }`}>
                      {grievance.priority} Priority
                    </span>
                    {grievance.hasFSSAIWarningOrExpired && (
                      <span className="text-[10px] bg-[#401f18] text-[#C86D24] font-bold px-2 py-0.5 rounded border border-[#C86D24]/40">
                        ⚠️ EXPIRED FSSAI LICENSE
                      </span>
                    )}
                    {grievance.verificationState.clusterHotspotCount >= 2 && (
                      <span className="text-[10px] bg-[#5B4632] text-[#F4D9A0] font-bold px-2 py-0.5 rounded border border-[#F4D9A0]/40">
                        🔥 HOTSPOT ({grievance.verificationState.clusterHotspotCount} complaints)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-[#FBF6EE]/60 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#F4D9A0]" />
                      SLA: 48h Window (Mandate)
                    </span>
                    {isEscalated ? (
                      <span className="text-[#C86D24] font-bold bg-[#401f18] px-2 py-0.5 rounded border border-[#C86D24]/50">
                        ESCALATED TO STATE COMMISSIONER
                      </span>
                    ) : isSettled ? (
                      <span className="text-[#F4D9A0] font-bold bg-[#5B4632] px-2 py-0.5 rounded border border-[#F4D9A0]/40">
                        SETTLED & BOUNTY CREDITED
                      </span>
                    ) : isPendingAudit ? (
                      <span className="text-blue-300 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">
                        PROOF SUBMITTED (AUDIT IN PROGRESS)
                      </span>
                    ) : (
                      <span className="text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                        PHYSICAL RAID REQUIRED
                      </span>
                    )}
                  </div>
                </div>

                {/* Body details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
                  <div>
                    <span className="text-[#FBF6EE]/60 block">Food Business:</span>
                    <span className="text-[#FBF6EE] font-bold text-sm block">{grievance.businessName}</span>
                    <span className="text-[#FBF6EE]/80 block mt-0.5">{grievance.location.formattedAddress}</span>
                    <span className="text-[#F4D9A0] font-mono text-[11px] block mt-0.5">
                      FSSAI Lic: {grievance.fssaiDetails.licenseNumber} ({grievance.fssaiDetails.licenseStatus})
                    </span>
                  </div>

                  <div>
                    <span className="text-[#FBF6EE]/60 block">Citizen Grievance & Keyword:</span>
                    <span className="text-[#F4D9A0] font-semibold block">"{grievance.keywordSummary}"</span>
                    <p className="text-[#FBF6EE]/75 text-[11px] mt-1 line-clamp-2">
                      {grievance.detailedDescription}
                    </p>
                    <span className="text-[#FBF6EE]/50 text-[11px] block mt-1">
                      Reported by: {grievance.userFullName} ({grievance.userMobile})
                    </span>
                  </div>

                  <div>
                    <span className="text-[#FBF6EE]/60 block">Statutory Section & Citizen Bounty:</span>
                    <span className="text-[#FBF6EE] font-mono font-medium block">
                      {grievance.verificationState.jurisdictionSectionCited || 'Section 26 (FSSA 2006)'}
                    </span>
                    <span className="text-[#F4D9A0] font-bold font-mono text-sm block mt-1">
                      Eligible Bounty: ₹{grievance.rewardAmountINR.toLocaleString('en-IN')}
                    </span>
                    {grievance.hasFacedBusinessWarnings && (
                      <span className="text-[#C86D24] font-bold text-[11px] block mt-1">
                        ⚠️ Threat Reported: {grievance.businessWarningDetails}
                      </span>
                    )}
                  </div>
                </div>

                {/* Evidence thumbnails */}
                <div className="mt-3 pt-3 border-t border-[#F4D9A0]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FBF6EE]/60 text-[11px]">Citizen Live Photos:</span>
                    <div className="flex gap-1.5">
                      {grievance.images.map((img, i) => (
                        <img
                          key={i}
                          src={img.dataUrl}
                          alt="Citizen Proof"
                          className="w-10 h-10 rounded-lg object-cover border border-[#F4D9A0]/30"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resolution proof display if already submitted */}
                  {grievance.officialResolution && (
                    <div className="bg-[#36281C] p-2.5 rounded-lg border border-[#F4D9A0]/20 text-[11px] max-w-md">
                      <div className="flex items-center justify-between font-bold text-[#F4D9A0]">
                        <span>Official Inspection Record:</span>
                        <span className="text-[#FBF6EE] font-mono">Fine: ₹{grievance.officialResolution.fineAmountINR?.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[#FBF6EE]/80 mt-0.5 line-clamp-2">
                        {grievance.officialResolution.findingsNotes}
                      </p>
                    </div>
                  )}

                  {/* Actions for this grievance */}
                  <div className="flex flex-wrap items-center gap-2">
                    {!isSettled && !isPendingAudit && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenRaidModal(grievance)}
                          className="px-4 py-2 bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] font-bold text-xs rounded-lg transition-colors shadow flex items-center gap-1.5 cursor-pointer border border-[#F4D9A0]"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Conduct Physical Raid & Upload Proof
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEscalateToStateAuthority(grievance)}
                          className="px-3 py-2 bg-[#2C2016] hover:bg-[#401f18] text-[#C86D24] font-semibold text-xs rounded-lg border border-[#C86D24]/40 transition-colors cursor-pointer"
                        >
                          Escalate to State Authority
                        </button>
                      </>
                    )}

                    {isPendingAudit && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#FBF6EE]/70">Independent Human Audit:</span>
                        <button
                          type="button"
                          onClick={() => handleAuditorDecision(grievance, true)}
                          className="px-3 py-1.5 bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] font-bold text-xs rounded-lg transition-colors shadow flex items-center gap-1 cursor-pointer border border-[#F4D9A0]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2C2016]" />
                          Approve Proof & Settle (Credit Bounty)
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAuditorDecision(grievance, false, 'Proof rejected: Missing seizure seal memo.')}
                          className="px-3 py-1.5 bg-[#C86D24] hover:bg-[#a65518] text-white font-bold text-xs rounded-lg transition-colors shadow flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reject & Revert to Officer
                        </button>
                      </div>
                    )}

                    {isSettled && (
                      <button
                        type="button"
                        onClick={onNavigateToWallet}
                        className="px-4 py-2 bg-[#2C2016] border border-[#F4D9A0]/40 text-[#F4D9A0] hover:bg-[#5B4632] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-[#F4D9A0]" />
                        View Credited Citizen Reward (₹{grievance.rewardAmountINR}) →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Physical Raid Proof Submission (Weak Accountability Breaker) */}
      {selectedGrievanceForProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#36281C] border border-[#F4D9A0]/50 rounded-2xl w-full max-w-2xl text-[#FBF6EE] shadow-2xl overflow-hidden my-6">
            <div className="bg-gradient-to-r from-[#2C2016] via-[#5B4632] to-[#36281C] p-5 border-b border-[#F4D9A0]/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#2C2016] text-[#F4D9A0] font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-[#F4D9A0]/30">
                    Anti-Tamper Protocol
                  </span>
                  <h3 className="text-base font-extrabold text-[#FBF6EE]">
                    Submit On-Site Raid Proofs & Enforcement Action
                  </h3>
                </div>
                <p className="text-xs text-[#F4D9A0]/80 mt-0.5">
                  Target: {selectedGrievanceForProof.businessName} (Case {selectedGrievanceForProof.id})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGrievanceForProof(null)}
                className="p-1 rounded-lg hover:bg-black/30 text-[#FBF6EE]/80 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleOfficerSubmitProof} className="p-6 space-y-4 text-xs">
              {/* Weak accountability loop warning */}
              <div className="p-3 bg-[#2C2016] border border-[#F4D9A0]/30 rounded-xl text-[#FBF6EE]/85">
                <span className="font-bold text-[#F4D9A0] block mb-0.5">
                  Anti-Tamper Rule 3.4 (Weak Accountability Loop Prevention):
                </span>
                Officers cannot upload blank or generic gallery photos to arbitrarily settle issues. 
                All evidence must undergo independent human audit and citizen concurrence before grievance closure.
              </div>

              <div>
                <label className="block text-[#FBF6EE]/80 font-bold mb-1">
                  Enforcement Action Taken *
                </label>
                <select
                  value={actionTaken}
                  onChange={e => setActionTaken(e.target.value as any)}
                  className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg p-2.5 text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                >
                  <option value="compounded_fine">Compounded Spot Penalty Fine Imposed (Sec 69)</option>
                  <option value="seized_samples">Seized Food Samples for Government Food Analyst (Sec 38)</option>
                  <option value="issued_improvement_notice">Issued Statutory Improvement Notice (Sec 32)</option>
                  <option value="sealed_premises">Premises Sealed & Operating License Suspended</option>
                  <option value="clean_bill_of_health">Clean Bill of Health (Full Hygiene Compliance Confirmed)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#FBF6EE]/80 font-bold mb-1">
                    Compounded Spot Fine Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#F4D9A0] font-bold">₹</span>
                    <input
                      type="number"
                      value={fineAmountINR}
                      onChange={e => setFineAmountINR(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg pl-7 pr-3 py-2 text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#FBF6EE]/80 font-bold mb-1">
                    Seizure Sample Barcode / Batch Codes
                  </label>
                  <input
                    type="text"
                    value={sampleBatchCodes}
                    onChange={e => setSampleBatchCodes(e.target.value)}
                    placeholder="BATCH-001, BATCH-002"
                    className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#FBF6EE]/80 font-bold mb-1">
                  Detailed Findings Notes & Laboratory Seizure Remarks *
                </label>
                <textarea
                  rows={3}
                  required
                  value={findingsNotes}
                  onChange={e => setFindingsNotes(e.target.value)}
                  placeholder="Detail exact findings, pest condition, oil quality meter reading, batch seizure details..."
                  className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                />
              </div>

              {/* Physical Raid Proof Photos (Camera only, no gallery) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[#FBF6EE]/80 font-bold">
                    Live On-Site Physical Raid Proofs (Camera Only) *
                  </label>
                  <span className="text-[11px] text-[#F4D9A0] font-mono">
                    {raidProofImages.length} live camera evidence photos
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {raidProofImages.map((url, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-[#F4D9A0]/30 aspect-video bg-black">
                      <img src={url} alt="Official Raid Proof" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 text-[9px] font-mono text-[#FBF6EE]/80 truncate">
                        Raid Proof #{idx + 1}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setRaidProofImages(prev => [
                        ...prev,
                        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
                      ]);
                    }}
                    className="border-2 border-dashed border-[#F4D9A0]/50 rounded-lg aspect-video flex flex-col items-center justify-center p-2 text-[#F4D9A0] hover:bg-[#5B4632]/30 transition-colors cursor-pointer"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">Take Live Raid Photo</span>
                  </button>
                </div>
              </div>

              {proofValidationError && (
                <div className="p-3 bg-[#401f18] border border-[#C86D24] rounded-lg text-[#FBF6EE] text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#C86D24] shrink-0" />
                  <span>{proofValidationError}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3 border-t border-[#F4D9A0]/20">
                <button
                  type="button"
                  onClick={() => setSelectedGrievanceForProof(null)}
                  className="px-4 py-2 font-medium text-[#FBF6EE]/60 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] font-extrabold rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer border border-[#F4D9A0]"
                >
                  <Send className="w-4 h-4" />
                  Submit Official Proof for Dual Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
