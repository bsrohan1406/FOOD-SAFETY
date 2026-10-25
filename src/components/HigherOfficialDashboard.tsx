import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  Scale, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  Award, 
  Building, 
  FileText,
  UserCheck,
  Eye,
  Lock
} from 'lucide-react';
import { GrievanceDossier, OfficerActionLog } from '../types';
import { LiveCameraCaptureModal } from './LiveCameraCaptureModal';

interface HigherOfficialDashboardProps {
  grievances: GrievanceDossier[];
  onEnforceOfficerAction: (dossierId: string, actionLog: OfficerActionLog) => void;
  onSelectDossier: (dossier: GrievanceDossier) => void;
}

export const HigherOfficialDashboard: React.FC<HigherOfficialDashboardProps> = ({
  grievances,
  onEnforceOfficerAction,
  onSelectDossier
}) => {
  // Active cases requiring officer inspection
  const activeCases = grievances.filter(
    (g) => g.status === 'submitted' || g.status === 'inspection_in_progress'
  );

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    activeCases[0]?.id || (grievances[0]?.id ?? '')
  );

  const selectedCase = grievances.find((g) => g.id === selectedCaseId);

  // Form state
  const [onSiteFindings, setOnSiteFindings] = useState<string>(
    'Conducted physical inspection of kitchen premises. Discovered unsealed oil containers with high rancidity and cross-contamination in prep area.'
  );
  const [actionType, setActionType] = useState<
    'Compounding Fine' | 'Sample Seized for Lab' | 'Notice Issued' | 'Establishment Sealed' | 'Warning'
  >('Compounding Fine');
  const [compoundingFineINR, setCompoundingFineINR] = useState<number>(35000);
  const [noticeNumber, setNoticeNumber] = useState<string>(
    `NOTICE/FSSAI/MH/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [sampleSealId, setSampleSealId] = useState<string>('SEAL-NABL-8942-A');
  const [secondaryRemarks, setSecondaryRemarks] = useState<string>(
    'Raid evidence and laboratory chain of custody verified compliant with FSS Act 2006.'
  );

  // Live raid evidence photos (camera capture)
  const [inspectionPhotos, setInspectionPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80'
  ]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleCaptureInspectionPhoto = (evd: any) => {
    setInspectionPhotos(prev => [...prev, evd.dataUrl]);
  };

  const handleExecuteEnforcement = () => {
    if (!selectedCase) return;

    const actionLog: OfficerActionLog = {
      officerId: 'FSO-MH-412',
      officerName: 'Meenakshi Kulkarni',
      designation: 'Designated Food Safety Officer',
      station: 'Brihanmumbai Food Safety Enforcement Cell',
      inspectionTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      onSiteFindings,
      actionTaken: actionType,
      compoundingFineINR: actionType === 'Compounding Fine' ? compoundingFineINR : 0,
      penaltyNoticeNumber: noticeNumber,
      evidencePhotoUrls: inspectionPhotos,
      sampleSealId: actionType === 'Sample Seized for Lab' ? sampleSealId : undefined,
      secondaryAuditorSignOff: {
        auditorName: 'Dr. Vivek Deshmukh',
        auditorDesignation: 'Joint Commissioner (Enforcement)',
        approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        remarks: secondaryRemarks
      }
    };

    onEnforceOfficerAction(selectedCase.id, actionLog);
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Officer Command Header */}
      <div className="bg-[#36281C] border border-[#F4D9A0]/25 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4D9A0]/15 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-[#2C2016] border border-[#F4D9A0]/40 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#F4D9A0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl font-bold text-[#FBF6EE]">
                  FSO Meenakshi Kulkarni
                </span>
                <span className="bg-[#F4D9A0]/15 text-[#F4D9A0] text-[10px] font-mono px-2 py-0.5 rounded border border-[#F4D9A0]/30">
                  EMP: FSSAI-MH-412
                </span>
              </div>
              <p className="text-xs text-[#CDBFAC]">
                Designated Food Safety Officer &bull; Mumbai Division Enforcement Cell
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="bg-[#1F160E] px-3 py-1.5 rounded-lg border border-[#F4D9A0]/20 text-[#F4D9A0]">
              Pending Raids: <span className="font-bold">{activeCases.length}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#CDBFAC] leading-relaxed">
          Higher officials and FSOs exercise statutory police power under <strong>Sections 38, 41, and 69 of the Food Safety &amp; Standards Act, 2006</strong>. 
          To prevent weak accountability, settlement requires physical on-site evidence photos and secondary supervisory sign-off.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Assigned Case Queue */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#F4D9A0] uppercase">
            <span>Inspection Docket Queue</span>
            <span>{activeCases.length} Active</span>
          </div>

          {activeCases.length === 0 ? (
            <div className="p-6 bg-[#36281C]/50 border border-[#F4D9A0]/20 rounded-xl text-center text-xs text-[#CDBFAC]">
              No pending cases requiring on-site inspection.
            </div>
          ) : (
            <div className="space-y-3">
              {activeCases.map((c) => {
                const isSelected = c.id === selectedCaseId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#2C2016] border-[#F4D9A0] shadow-md ring-1 ring-[#F4D9A0]'
                        : 'bg-[#36281C] border-[#F4D9A0]/20 hover:border-[#F4D9A0]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-[#F4D9A0]">{c.trackingNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        c.priority === 'Critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-200'
                      }`}>
                        {c.priority}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-[#FBF6EE] truncate">
                      {c.establishment.name}
                    </div>
                    <div className="text-[11px] text-[#CDBFAC] truncate">
                      {c.violationCategory}
                    </div>

                    <div className="pt-2 flex justify-between items-center text-[10px] text-stone-400 font-mono">
                      <span>{c.evidenceImages.length} Evidence Shots</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDossier(c);
                        }}
                        className="text-[#F4D9A0] hover:underline flex items-center gap-0.5"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Dossier</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Physical On-Site Enforcement Action Form */}
        <div className="lg:col-span-2">
          {selectedCase ? (
            <div className="bg-[#36281C] border border-[#F4D9A0]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              
              <div className="border-b border-[#F4D9A0]/15 pb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C86D24] block">
                  Action Recording &bull; Case {selectedCase.trackingNumber}
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#FBF6EE]">
                  On-Site Inspection &amp; Statutory Enforcement Protocol
                </h3>
                <p className="text-xs text-[#CDBFAC]">
                  Inspecting: <strong className="text-[#FBF6EE]">{selectedCase.establishment.name}</strong> ({selectedCase.establishment.address})
                </p>
              </div>

              {/* Action Type Selection */}
              <div>
                <label className="block text-xs font-mono text-[#F4D9A0] mb-2 uppercase">
                  Statutory Enforcement Action Taken
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    'Compounding Fine',
                    'Sample Seized for Lab',
                    'Notice Issued',
                    'Establishment Sealed',
                    'Warning'
                  ].map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setActionType(act as any)}
                      className={`p-2.5 rounded-lg border font-medium transition-all text-center ${
                        actionType === act
                          ? 'bg-[#C86D24] text-white border-[#C86D24] font-bold shadow'
                          : 'bg-[#1F160E] text-[#CDBFAC] border-[#F4D9A0]/20 hover:border-[#F4D9A0]/40'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific enforcement inputs */}
              {actionType === 'Compounding Fine' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/20">
                  <div>
                    <label className="block text-xs font-mono text-[#F4D9A0] mb-1">
                      Compounding Fine Amount (INR) &bull; Section 69
                    </label>
                    <input
                      type="number"
                      min="5000"
                      max="500000"
                      step="5000"
                      value={compoundingFineINR}
                      onChange={(e) => setCompoundingFineINR(Number(e.target.value))}
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm font-mono text-[#F4D9A0]"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Citizen Bounty (10%): ₹{(compoundingFineINR * 0.1).toLocaleString()} INR
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#F4D9A0] mb-1">
                      Statutory Notice / Challan Number
                    </label>
                    <input
                      type="text"
                      value={noticeNumber}
                      onChange={(e) => setNoticeNumber(e.target.value)}
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-xs font-mono text-[#FBF6EE]"
                    />
                  </div>
                </div>
              )}

              {actionType === 'Sample Seized for Lab' && (
                <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/20 space-y-2 text-xs">
                  <label className="block font-mono text-[#F4D9A0]">
                    NABL Accredited Food Analysis Lab Seal ID
                  </label>
                  <input
                    type="text"
                    value={sampleSealId}
                    onChange={(e) => setSampleSealId(e.target.value)}
                    className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 font-mono text-[#FBF6EE]"
                  />
                  <p className="text-[11px] text-stone-400">
                    Tamper-evident seal assigned to official sample dispatched to State Food Laboratory.
                  </p>
                </div>
              )}

              {/* On-Site Findings Field */}
              <div>
                <label className="block text-xs font-mono text-[#F4D9A0] mb-1">
                  On-Site Inspection &amp; Physical Search Findings
                </label>
                <textarea
                  rows={3}
                  value={onSiteFindings}
                  onChange={(e) => setOnSiteFindings(e.target.value)}
                  className="w-full bg-[#1F160E] border border-[#F4D9A0]/25 rounded-xl p-3 text-xs text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                />
              </div>

              {/* Physical Raid Proof Photos */}
              <div className="space-y-3 p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#F4D9A0] block">
                      Tamper-Proof On-Site Raid Photos
                    </span>
                    <span className="text-[11px] text-[#CDBFAC]">
                      Live camera snapshot of kitchen inspection, sample collection, or notice pasting.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="px-3 py-1.5 bg-[#36281C] hover:bg-[#453424] text-[#F4D9A0] border border-[#F4D9A0]/30 rounded-lg text-xs font-mono flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#C86D24]" />
                    <span>Live Officer Camera</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {inspectionPhotos.map((url, idx) => (
                    <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-[#F4D9A0]/30 relative bg-black">
                      <img src={url} alt="Officer inspection proof" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual-Ended Secondary Auditor Sign-Off */}
              <div className="p-4 bg-[#2C2016] rounded-xl border border-emerald-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[#F4D9A0]">
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Secondary Independent Audit Counter-Signature
                  </span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                    SUPERVISORY GATE
                  </span>
                </div>
                <p className="text-stone-300 text-[11px]">
                  Audited by: <strong>Dr. Vivek Deshmukh</strong>, Joint Commissioner (Food Safety Enforcement).
                </p>
                <input
                  type="text"
                  value={secondaryRemarks}
                  onChange={(e) => setSecondaryRemarks(e.target.value)}
                  className="w-full bg-[#1F160E] border border-[#F4D9A0]/20 rounded-lg px-3 py-1.5 text-xs text-[#FBF6EE]"
                />
              </div>

              {/* Submit Final Settlement */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleExecuteEnforcement}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#F4D9A0] to-[#D4B776] text-[#2C2016] font-bold text-sm rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
                >
                  <Award className="w-5 h-5 text-[#C86D24]" />
                  <span>Enforce Penalty &amp; Disburse Statutory Bounty</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-[#36281C]/50 border border-[#F4D9A0]/20 rounded-2xl text-xs text-[#CDBFAC]">
              Select a case from the queue to conduct official inspection.
            </div>
          )}
        </div>

      </div>

      {/* Live camera modal for officer proof */}
      <LiveCameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCaptureInspectionPhoto}
        angleTarget="Officer Physical On-Site Inspection Evidence"
        existingCount={inspectionPhotos.length}
      />

    </div>
  );
};
