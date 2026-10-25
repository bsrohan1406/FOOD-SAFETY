import React from 'react';
import { 
  X, 
  Scale, 
  ShieldCheck, 
  Building2, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Mic, 
  FileText, 
  Award,
  Layers,
  Printer
} from 'lucide-react';
import { GrievanceDossier } from '../types';

interface GrievanceDossierModalProps {
  dossier: GrievanceDossier | null;
  onClose: () => void;
}

export const GrievanceDossierModal: React.FC<GrievanceDossierModalProps> = ({
  dossier,
  onClose
}) => {
  if (!dossier) return null;

  const isCritical = dossier.priority === 'Critical';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#2C2016] border border-[#F4D9A0]/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-8">
        
        {/* Modal Header */}
        <div className="bg-[#36281C] px-6 py-4 border-b border-[#F4D9A0]/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#2C2016] border border-[#F4D9A0]/30 flex items-center justify-center text-[#F4D9A0]">
              <Scale className="w-5 h-5 text-[#C86D24]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
                  Case Dossier: {dossier.trackingNumber}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isCritical ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-200'
                }`}>
                  {dossier.priority} Priority
                </span>
              </div>
              <p className="text-xs font-mono text-[#F4D9A0]">
                Ledger Hash: {dossier.dossierHash} &bull; Filed: {dossier.filingDate}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg text-[#CDBFAC] hover:text-[#FBF6EE] hover:bg-[#2C2016] transition-colors"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#CDBFAC] hover:text-[#FBF6EE] hover:bg-[#2C2016] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Body Content */}
        <div className="p-6 space-y-6 text-xs overflow-y-auto max-h-[80vh]">
          
          {/* Section 1: Parties involved */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Complainant */}
            <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/15 space-y-1.5">
              <span className="font-mono text-[#F4D9A0] text-[10px] uppercase block">
                Complainant (Verified Citizen)
              </span>
              <div className="font-bold text-sm text-[#FBF6EE]">{dossier.citizen.fullName}</div>
              <p className="text-[#CDBFAC]">Phone: {dossier.citizen.maskedPhone}</p>
              <p className="text-stone-400 font-mono text-[11px]">
                Aadhaar: {dossier.citizen.maskedAadhaar} (KYC Compliant)
              </p>
            </div>

            {/* Food Business Operator */}
            <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/15 space-y-1.5">
              <span className="font-mono text-[#F4D9A0] text-[10px] uppercase block">
                Respondent Establishment (FBO)
              </span>
              <div className="font-bold text-sm text-[#FBF6EE]">{dossier.establishment.name}</div>
              <p className="text-[#CDBFAC]">{dossier.establishment.address}</p>
              <p className="text-[#F4D9A0] font-mono text-[11px]">
                FSSAI License: {dossier.establishment.fssaiLicense}
              </p>
              {dossier.establishment.platformName && (
                <p className="text-stone-400 font-mono text-[10px]">
                  Via: {dossier.establishment.platformName} (Order #{dossier.establishment.orderId})
                </p>
              )}
            </div>

          </div>

          {/* Section 2: Statutory Law Review */}
          <div className="p-4 bg-[#36281C] rounded-xl border border-[#F4D9A0]/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[#F4D9A0] uppercase font-bold text-xs flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#C86D24]" />
                FSS Act 2006 Statutory Law Review &amp; Jurisdiction
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Severity Score: {dossier.statutoryReview.severityScore}/10
              </span>
            </div>

            <p className="text-[#FBF6EE] leading-relaxed">
              {dossier.statutoryReview.summaryRationale}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {dossier.statutoryReview.applicableSections.map((sec) => (
                <span
                  key={sec}
                  className="px-2.5 py-1 rounded bg-[#1F160E] border border-[#F4D9A0]/30 text-[#F4D9A0] font-mono text-[11px]"
                >
                  {sec}
                </span>
              ))}
            </div>

            {dossier.statutoryReview.clusterId && (
              <div className="pt-2 border-t border-[#F4D9A0]/15 text-[11px] font-mono text-red-300">
                &bull; Incident Cluster: {dossier.statutoryReview.clusterId} ({dossier.statutoryReview.clusteredIncidentCount} Linked Citizen Reports)
              </div>
            )}
          </div>

          {/* Section 3: Evidence Image Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[#F4D9A0] uppercase font-bold text-xs flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#C86D24]" />
                Live Camera Physical Evidence ({dossier.evidenceImages.length} Multi-Angle Shots)
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                On-device CV Quality Gated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dossier.evidenceImages.map((evd) => (
                <div
                  key={evd.id}
                  className="bg-[#1F160E] border border-[#F4D9A0]/20 rounded-xl overflow-hidden"
                >
                  <div className="aspect-video w-full bg-black overflow-hidden">
                    <img src={evd.dataUrl} alt={evd.angleDescription} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2.5 space-y-1">
                    <div className="font-semibold text-[#FBF6EE] truncate text-[11px]">
                      {evd.angleDescription}
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-[#F4D9A0]">
                      <span>Lum: {evd.luminance}</span>
                      <span>Sharpness: {evd.blurScore}</span>
                      <span>Food: {evd.foodHeuristicConfidence}%</span>
                    </div>
                    <div className="text-[9px] font-mono text-stone-400 truncate">
                      {evd.hash}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Citizen Testimony & Voice Note */}
          <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/15 space-y-2">
            <span className="font-mono text-[#F4D9A0] text-[10px] uppercase block">
              Citizen Incident Testimony
            </span>
            <p className="text-[#FBF6EE] leading-relaxed">
              "{dossier.incidentDescription}"
            </p>

            {dossier.voiceNoteTranscript && (
              <div className="pt-2 border-t border-[#F4D9A0]/10 flex items-start gap-2 text-stone-300">
                <Mic className="w-4 h-4 text-[#F4D9A0] mt-0.5 shrink-0" />
                <div className="italic text-[11px]">
                  Voice statement: "{dossier.voiceNoteTranscript}"
                </div>
              </div>
            )}
          </div>

          {/* Section 5: FSO Officer Physical Enforcement Report */}
          {dossier.officerAction ? (
            <div className="p-5 bg-[#36281C] rounded-xl border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-emerald-400 font-bold uppercase text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Official FSO Inspection &amp; Penalty Enforcement Report
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                  {dossier.officerAction.actionTaken}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-400 font-mono">Enforcing Officer: </span>
                  <span className="text-[#FBF6EE] font-semibold">{dossier.officerAction.officerName}</span> ({dossier.officerAction.designation})
                </div>
                <div>
                  <span className="text-stone-400 font-mono">Station: </span>
                  <span className="text-[#FBF6EE]">{dossier.officerAction.station}</span>
                </div>
                {dossier.officerAction.penaltyNoticeNumber && (
                  <div>
                    <span className="text-stone-400 font-mono">Statutory Notice: </span>
                    <span className="text-[#F4D9A0] font-mono font-bold">{dossier.officerAction.penaltyNoticeNumber}</span>
                  </div>
                )}
                {dossier.officerAction.compoundingFineINR > 0 && (
                  <div>
                    <span className="text-stone-400 font-mono">Section 69 Penalty: </span>
                    <span className="text-emerald-400 font-mono font-bold">₹{dossier.officerAction.compoundingFineINR.toLocaleString()} INR</span>
                  </div>
                )}
              </div>

              <div className="text-stone-300 bg-[#2C2016] p-3 rounded-lg border border-[#F4D9A0]/15">
                <span className="font-mono text-[10px] text-[#F4D9A0] block uppercase">On-Site Findings</span>
                <p className="mt-0.5">{dossier.officerAction.onSiteFindings}</p>
              </div>

              {/* Secondary Auditor Sign-Off */}
              {dossier.officerAction.secondaryAuditorSignOff && (
                <div className="p-3 bg-[#1F160E] rounded-lg border border-emerald-500/20 text-[11px] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-400 font-mono text-[10px] block">
                      DUAL VALIDATION CERTIFIED
                    </span>
                    <p className="text-[#FBF6EE]">
                      Counter-signed by: {dossier.officerAction.secondaryAuditorSignOff.auditorName} ({dossier.officerAction.secondaryAuditorSignOff.auditorDesignation})
                    </p>
                    <p className="text-stone-400 text-[10px]">
                      "{dossier.officerAction.secondaryAuditorSignOff.remarks}"
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/15 text-center text-[#CDBFAC]">
              Officer physical inspection pending or currently scheduled.
            </div>
          )}

          {/* Section 6: Reward Disbursement Status */}
          {dossier.rewardDisbursedINR > 0 && (
            <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-[#F4D9A0]" />
                <div>
                  <span className="font-bold text-sm text-[#F4D9A0] block">
                    Citizen Vigilance Bounty Disbursed: ₹{dossier.rewardDisbursedINR.toLocaleString()} INR
                  </span>
                  <span className="text-[11px] text-[#CDBFAC]">
                    Credited to complainant wallet via Section 69 statutory bounty allocation.
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
