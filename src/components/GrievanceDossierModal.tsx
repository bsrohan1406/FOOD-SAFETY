import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Camera, 
  MapPin, 
  Clock, 
  Hash, 
  Building2, 
  UserCheck, 
  Award,
  ExternalLink
} from 'lucide-react';
import { Grievance } from '../types';

interface GrievanceDossierModalProps {
  grievance: Grievance | null;
  onClose: () => void;
  onApproveByAuditor?: (grievance: Grievance) => void;
}

export const GrievanceDossierModal: React.FC<GrievanceDossierModalProps> = ({
  grievance,
  onClose,
  onApproveByAuditor
}) => {
  if (!grievance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#36281C] border border-[#F4D9A0]/50 rounded-2xl w-full max-w-4xl text-[#FBF6EE] shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header (Mocha Brown gradient) */}
        <div className="bg-gradient-to-r from-[#2C2016] via-[#5B4632] to-[#36281C] p-5 border-b border-[#F4D9A0]/30 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#2C2016] text-[#F4D9A0] font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-[#F4D9A0]/30">
                Dual-Ended Case Dossier
              </span>
              <h2 className="text-lg font-black text-[#FBF6EE]">
                Grievance #{grievance.id}
              </h2>
            </div>
            <p className="text-xs text-[#F4D9A0]/80 mt-0.5">
              Hash: {grievance.hashCode} · Target: {grievance.businessName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/30 text-[#FBF6EE]/80 hover:text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Status & Priority Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#2C2016] rounded-xl border border-[#F4D9A0]/30">
            <div className="flex items-center gap-2">
              <span className="text-[#FBF6EE]/60">Current Status:</span>
              <span className="font-bold text-[#F4D9A0] uppercase font-mono">
                {grievance.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#FBF6EE]/60">Statutory Priority:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                grievance.priority === 'critical' ? 'bg-[#C86D24] text-white' : 'bg-[#5B4632] text-[#F4D9A0] border border-[#F4D9A0]/40'
              }`}>
                {grievance.priority} Priority
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#FBF6EE]/60">Citizen Bounty:</span>
              <span className="text-[#F4D9A0] font-black font-mono text-sm">
                ₹{grievance.rewardAmountINR.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Section 1: Citizen Evidence & Claim */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#F4D9A0] flex items-center gap-1.5 border-b border-[#F4D9A0]/20 pb-1">
              <FileText className="w-4 h-4 text-[#F4D9A0]" />
              1. Citizen Filing & Live Evidence Submission
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#2C2016] p-4 rounded-xl border border-[#F4D9A0]/30">
              <div>
                <span className="text-[#FBF6EE]/60 block">Complainant (Age ≥ 18 Verified):</span>
                <span className="text-[#FBF6EE] font-bold block">{grievance.userFullName}</span>
                <span className="text-[#F4D9A0] font-mono">{grievance.userMobile}</span>
              </div>

              <div>
                <span className="text-[#FBF6EE]/60 block">Location & Channel:</span>
                <span className="text-[#FBF6EE] block">{grievance.location.formattedAddress}</span>
                <span className="text-[#F4D9A0] uppercase font-semibold text-[11px]">
                  Mode: {grievance.issueType}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[#FBF6EE]/60 block">Keyword / One-line Summary:</span>
                <span className="text-[#FBF6EE] font-semibold text-sm">"{grievance.keywordSummary}"</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[#FBF6EE]/60 block">Detailed Description:</span>
                <p className="text-[#FBF6EE]/80 mt-1 leading-relaxed">{grievance.detailedDescription}</p>
              </div>

              {grievance.invoiceUrl && (
                <div className="sm:col-span-2 p-2.5 bg-[#36281C] rounded-lg border border-[#F4D9A0]/20">
                  <span className="text-[#F4D9A0] font-bold block">Order Invoice OCR Extraction:</span>
                  <span className="text-[#FBF6EE]/90 font-mono text-[11px] block mt-0.5">
                    {grievance.invoiceOcrText}
                  </span>
                </div>
              )}
            </div>

            {/* Live Camera Photos with Structural Metrics */}
            <div>
              <span className="text-[#FBF6EE]/80 block mb-2 font-bold">
                Live Evidence Multi-Angle Photos ({grievance.images.length} angles captured)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {grievance.images.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-[#F4D9A0]/30 bg-[#2C2016]">
                    <div className="aspect-video w-full bg-black">
                      <img src={img.dataUrl} alt={img.angleLabel} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2 space-y-1">
                      <span className="text-[11px] font-bold text-[#FBF6EE] block truncate">{img.angleLabel}</span>
                      <div className="flex flex-wrap gap-1 text-[9px] font-mono">
                        <span className="bg-[#5B4632] text-[#F4D9A0] px-1 rounded border border-[#F4D9A0]/30">✓ Sharp</span>
                        <span className="bg-[#5B4632] text-[#F4D9A0] px-1 rounded border border-[#F4D9A0]/30">CV: Food</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Automated Legal & FSSAI Verification */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#F4D9A0] flex items-center gap-1.5 border-b border-[#F4D9A0]/20 pb-1">
              <ShieldCheck className="w-4 h-4 text-[#F4D9A0]" />
              2. FSSA 2006 Statutory Jurisdiction & Registry Verification
            </h3>

            <div className="p-4 bg-[#2C2016] border border-[#F4D9A0]/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#F4D9A0]">
                  Statutory Offense: {grievance.verificationState.jurisdictionSectionCited || 'FSSA 2006 Section 26'}
                </span>
                <span className="bg-[#36281C] font-mono px-2 py-0.5 rounded text-[#F4D9A0] text-[10px] border border-[#F4D9A0]/30">
                  FSSAI JURISDICTION VERIFIED
                </span>
              </div>

              <p className="text-[#FBF6EE]/80">
                {grievance.verificationState.jurisdictionVerdictNotes}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#F4D9A0]/20 text-[11px]">
                <div>
                  <span className="text-[#FBF6EE]/60 block">FSSAI License:</span>
                  <span className="text-[#FBF6EE] font-mono">{grievance.fssaiDetails.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-[#FBF6EE]/60 block">License Expiry:</span>
                  <span className={`font-mono font-bold ${
                    grievance.fssaiDetails.licenseStatus === 'EXPIRED' ? 'text-[#C86D24]' : 'text-[#F4D9A0]'
                  }`}>
                    {grievance.fssaiDetails.expiryDate} ({grievance.fssaiDetails.licenseStatus})
                  </span>
                </div>
                <div>
                  <span className="text-[#FBF6EE]/60 block">Assigned Official:</span>
                  <span className="text-[#FBF6EE] font-medium">{grievance.verificationState.assignedOfficerName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Official Resolution & Anti-Tamper Raid Proofs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#F4D9A0] flex items-center gap-1.5 border-b border-[#F4D9A0]/20 pb-1">
              <UserCheck className="w-4 h-4 text-[#F4D9A0]" />
              3. Higher Official Physical Raid Proof & Human Check
            </h3>

            {grievance.officialResolution ? (
              <div className="p-4 bg-[#2C2016] border border-[#F4D9A0]/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#FBF6EE] text-sm">
                    {grievance.officialResolution.officerName} ({grievance.officialResolution.designation})
                  </span>
                  <span className="font-mono text-[#F4D9A0] text-[11px]">
                    Inspected: {new Date(grievance.officialResolution.visitTimestamp).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#36281C] p-3 rounded-lg border border-[#F4D9A0]/20">
                  <div>
                    <span className="text-[#FBF6EE]/60 block">Enforcement Action:</span>
                    <span className="text-[#F4D9A0] font-bold uppercase">
                      {grievance.officialResolution.actionTaken.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#FBF6EE]/60 block">Compounded Penalty Fine:</span>
                    <span className="text-[#FBF6EE] font-mono font-bold">
                      ₹{grievance.officialResolution.fineAmountINR?.toLocaleString('en-IN') || 0}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[#FBF6EE]/60 block">Official Findings Notes:</span>
                    <p className="text-[#FBF6EE]/80 mt-0.5">{grievance.officialResolution.findingsNotes}</p>
                  </div>

                  {grievance.officialResolution.sampleBatchCodes && grievance.officialResolution.sampleBatchCodes.length > 0 && (
                    <div className="sm:col-span-2">
                      <span className="text-[#FBF6EE]/60 block">Seized Laboratory Sample Barcodes:</span>
                      <div className="flex gap-2 mt-1">
                        {grievance.officialResolution.sampleBatchCodes.map((batch, bIdx) => (
                          <span key={bIdx} className="bg-[#2C2016] text-[#F4D9A0] font-mono text-[10px] px-2 py-0.5 rounded border border-[#F4D9A0]/30">
                            {batch}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Raid Photo Proofs */}
                <div>
                  <span className="text-[#FBF6EE]/80 block mb-2 font-bold">
                    Official On-Site Live Inspection Photographs (Camera Captured)
                  </span>
                  <div className="flex gap-3">
                    {grievance.officialResolution.proofImages.map((proofUrl, pIdx) => (
                      <img
                        key={pIdx}
                        src={proofUrl}
                        alt="Official Proof"
                        className="w-32 h-20 rounded-lg object-cover border border-[#F4D9A0]/40"
                      />
                    ))}
                  </div>
                </div>

                {/* Dual Audit Stamp */}
                <div className="p-3 bg-[#5B4632]/50 border border-[#F4D9A0]/40 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#F4D9A0] shrink-0" />
                    <div>
                      <span className="font-bold text-[#FBF6EE] block">Dual-Ended Independent Sign-Off</span>
                      <span className="text-[#F4D9A0] text-[11px] block">
                        {grievance.officialResolution.auditorRemarks || 'Verified by District Appellate Auditor & Citizen Notification sent.'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] bg-[#F4D9A0] text-[#2C2016] font-mono font-bold px-2 py-0.5 rounded uppercase">
                    SEALED & SETTLED
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#2C2016] border border-[#F4D9A0]/30 rounded-xl text-center text-[#FBF6EE]/60">
                <Clock className="w-8 h-8 text-[#C86D24] mx-auto mb-1 opacity-70" />
                <p className="font-semibold text-[#FBF6EE]">Physical Raid Pending</p>
                <p className="text-[11px] text-[#FBF6EE]/60 mt-0.5">
                  Assigned officer must physically visit the location and submit live camera proofs before settlement.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#2C2016] border-t border-[#F4D9A0]/20 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] font-bold text-xs rounded-xl cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
