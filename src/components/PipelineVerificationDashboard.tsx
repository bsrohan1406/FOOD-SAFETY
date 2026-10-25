import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Hash, 
  Search, 
  ExternalLink, 
  Layers, 
  Sliders, 
  TrendingUp, 
  Clock, 
  Eye, 
  FileCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Grievance, PriorityLevel } from '../types';
import { scanFSSAIJurisdiction } from '../utils/foodSafetyRules';

interface PipelineVerificationDashboardProps {
  grievances: Grievance[];
  onSelectGrievanceForAudit: (grievance: Grievance) => void;
  onNavigateToOfficerCommand: () => void;
}

export const PipelineVerificationDashboard: React.FC<PipelineVerificationDashboardProps> = ({
  grievances,
  onSelectGrievanceForAudit,
  onNavigateToOfficerCommand
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive FSSAI Jurisdiction Simulator
  const [simulatorInput, setSimulatorInput] = useState('Found pieces of broken glass in pickled mango jar');
  const simulatorResult = scanFSSAIJurisdiction(simulatorInput);

  const filteredGrievances = grievances.filter(g => {
    const matchesPriority = filterPriority === 'all' || g.priority === filterPriority;
    const matchesSearch = 
      g.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.keywordSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.hashCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const getPriorityBadgeClass = (priority: PriorityLevel) => {
    switch (priority) {
      case 'critical':
        return 'bg-[#C86D24] text-white border-[#C86D24] font-bold';
      case 'high':
        return 'bg-[#5B4632] text-[#F4D9A0] border-[#F4D9A0] font-bold';
      case 'medium':
        return 'bg-[#36281C] text-[#F4D9A0] border-[#F4D9A0]/50 font-semibold';
      case 'low':
      default:
        return 'bg-[#2C2016] text-[#FBF6EE]/70 border-[#F4D9A0]/20';
    }
  };

  const getStatusBadge = (status: Grievance['status']) => {
    switch (status) {
      case 'forwarded_to_officer':
        return { label: 'Verified · Dispatched to Officer', color: 'text-[#F4D9A0] bg-[#5B4632]/60 border-[#F4D9A0]/40' };
      case 'officer_investigating':
        return { label: 'Officer Investigating On-Site', color: 'text-amber-300 bg-amber-950/60 border-amber-500/40' };
      case 'proof_submitted_pending_audit':
        return { label: 'Proof Submitted · Pending Human Check', color: 'text-blue-300 bg-blue-950/60 border-blue-500/40' };
      case 'settled':
        return { label: 'Settled & Bounty Credited', color: 'text-[#F4D9A0] bg-[#5B4632]/80 border-[#F4D9A0]' };
      case 'rejected_jurisdiction':
        return { label: 'Rejected (Non-Statutory Jurisdiction)', color: 'text-[#C86D24] bg-[#401f18] border-[#C86D24]/50' };
      case 'rejected_image_quality':
        return { label: 'Rejected (Structural Quality Failure)', color: 'text-[#C86D24] bg-[#401f18] border-[#C86D24]/50' };
      default:
        return { label: 'Under Verification', color: 'text-[#FBF6EE]/70 bg-[#2C2016] border-[#F4D9A0]/30' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 60-30-10 Header Banner (Mocha Brown 60%, Champagne Gold 30%, Burnt Amber/White 10%) */}
      <div className="bg-gradient-to-r from-[#2C2016] via-[#5B4632] to-[#36281C] rounded-2xl p-6 text-[#FBF6EE] shadow-xl border border-[#F4D9A0]/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2C2016] text-[#C86D24] font-mono text-xs px-2.5 py-0.5 rounded font-bold uppercase mb-2 border border-[#C86D24]/40">
              Pipeline Stage 2: Dual-Ended Verification Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#FBF6EE]">
              Automated FSSAI Statutory Verification State
            </h1>
            <p className="text-xs sm:text-sm text-[#F4D9A0]/85 mt-1 max-w-2xl">
              Every complaint is rigorously filtered against FSSAI 2006 statutory laws, image structural clarity, computer vision food detection, and hash code clustering before official dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateToOfficerCommand}
              className="px-5 py-2.5 bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] text-xs font-bold rounded-xl border border-[#F4D9A0] shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#2C2016]" />
              Open Officer Command View →
            </button>
          </div>
        </div>
      </div>

      {/* KPI 4-Card Strip (Mocha Brown structures, Champagne Gold & Burnt Amber metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-xl p-4 text-[#FBF6EE]">
          <span className="text-xs text-[#FBF6EE]/60 block font-medium">Total In-Pipeline</span>
          <div className="text-2xl font-black font-mono text-[#FBF6EE] mt-1 tabular-nums">
            {grievances.length}
          </div>
          <span className="text-[11px] text-[#F4D9A0] mt-1 block">Live dual-ended monitoring</span>
        </div>

        <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-xl p-4 text-[#FBF6EE]">
          <span className="text-xs text-[#FBF6EE]/60 block font-medium">Critical Priority Violations</span>
          <div className="text-2xl font-black font-mono text-[#C86D24] mt-1 tabular-nums">
            {grievances.filter(g => g.priority === 'critical').length}
          </div>
          <span className="text-[11px] text-[#C86D24] mt-1 block">Immediate raid dispatch</span>
        </div>

        <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-xl p-4 text-[#FBF6EE]">
          <span className="text-xs text-[#FBF6EE]/60 block font-medium">Expired License Escalations</span>
          <div className="text-2xl font-black font-mono text-[#C86D24] mt-1 tabular-nums">
            {grievances.filter(g => g.hasFSSAIWarningOrExpired).length}
          </div>
          <span className="text-[11px] text-[#C86D24] mt-1 block">Overdue FSSAI renewal alerts</span>
        </div>

        <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-xl p-4 text-[#FBF6EE]">
          <span className="text-xs text-[#FBF6EE]/60 block font-medium">Settled & Bounties Disbursed</span>
          <div className="text-2xl font-black font-mono text-[#F4D9A0] mt-1 tabular-nums">
            {grievances.filter(g => g.status === 'settled').length}
          </div>
          <span className="text-[11px] text-[#F4D9A0]/80 mt-1 block">Dual verified by citizens</span>
        </div>
      </div>

      {/* Interactive FSSAI Jurisdiction Simulator Tool */}
      <div className="bg-[#36281C] border border-[#F4D9A0]/40 rounded-2xl p-6 text-[#FBF6EE] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4D9A0]/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5B4632] flex items-center justify-center text-[#F4D9A0] border border-[#F4D9A0]/30">
              <FileCheck className="w-4 h-4 text-[#F4D9A0]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#FBF6EE]">
                FSSAI Legal Jurisdiction Test Bench (Food Safety & Standards Act 2006)
              </h2>
              <p className="text-[11px] text-[#FBF6EE]/70">
                Scans text to test if grievances fall under statutory safety laws vs commercial delivery disputes.
              </p>
            </div>
          </div>
          <a
            href="https://fssai.gov.in/cms/food-safety-and-standards-act-2006.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#F4D9A0] hover:text-[#F9E6BD] flex items-center gap-1 font-semibold"
          >
            FSSA 2006 Reference Gazette <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[#FBF6EE]/80 block mb-1">
              Type or select a test complaint statement:
            </label>
            <input
              type="text"
              value={simulatorInput}
              onChange={e => setSimulatorInput(e.target.value)}
              className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-[#FBF6EE]/60 text-[11px] self-center">Try presets:</span>
            <button
              type="button"
              onClick={() => setSimulatorInput('Dead cockroach found inside dal bowl')}
              className="px-2.5 py-1 rounded bg-[#2C2016] hover:bg-[#5B4632] text-[#F4D9A0] border border-[#F4D9A0]/30 text-[11px] cursor-pointer"
            >
              Foreign Matter (Insect)
            </button>
            <button
              type="button"
              onClick={() => setSimulatorInput('Severe vomiting and diarrhea after eating spoiled paneer')}
              className="px-2.5 py-1 rounded bg-[#2C2016] hover:bg-[#5B4632] text-[#C86D24] border border-[#C86D24]/40 text-[11px] cursor-pointer"
            >
              Food Poisoning (Unsafe Food)
            </button>
            <button
              type="button"
              onClick={() => setSimulatorInput('Zomato delivery was delayed by 50 minutes and pizza was cold')}
              className="px-2.5 py-1 rounded bg-[#2C2016] hover:bg-[#5B4632] text-[#FBF6EE]/70 border border-[#F4D9A0]/20 text-[11px] cursor-pointer"
            >
              Delivery Delay (Customer Service)
            </button>
            <button
              type="button"
              onClick={() => setSimulatorInput('Chemical odor and adulterated milk testing positive for starch')}
              className="px-2.5 py-1 rounded bg-[#2C2016] hover:bg-[#5B4632] text-amber-300 border border-amber-500/30 text-[11px] cursor-pointer"
            >
              Adulteration (Sec 57)
            </button>
          </div>

          {/* Result card */}
          <div className={`p-4 rounded-xl border text-xs ${
            simulatorResult.jurisdictionVerified
              ? 'bg-[#2C2016] border-[#F4D9A0]/50 text-[#F4D9A0]'
              : 'bg-[#401f18] border-[#C86D24] text-[#FBF6EE]'
          }`}>
            <div className="flex items-center justify-between font-bold text-sm">
              <span className="flex items-center gap-2">
                {simulatorResult.jurisdictionVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-[#F4D9A0]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#C86D24]" />
                )}
                Decision: {simulatorResult.jurisdictionVerified ? 'ACCEPTED UNDER FOOD SAFETY LAW' : 'REJECTED AT FIRST GATEWAY'}
              </span>
              <span className="font-mono text-xs bg-[#2C2016] px-2 py-0.5 rounded text-[#C86D24] border border-[#C86D24]/50">
                Action: {simulatorResult.suggestedAction}
              </span>
            </div>

            <div className="mt-2 text-xs">
              <span className="font-bold">Violation Title:</span> {simulatorResult.verdictTitle}
              {simulatorResult.citedFSSAISection && (
                <span className="block mt-0.5 text-[#F4D9A0] font-mono">
                  Statutory Citation: {simulatorResult.citedFSSAISection}
                </span>
              )}
            </div>

            <p className="mt-1 text-[#FBF6EE]/80 text-[11px]">
              {simulatorResult.verdictDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Grievance Pipeline Table & Cards */}
      <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 text-[#FBF6EE] shadow-xl space-y-4">
        {/* Table Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4D9A0]/20 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#FBF6EE]">
              Grievances in Verification State
            </h2>
            <span className="text-xs bg-[#5B4632] text-[#F4D9A0] border border-[#F4D9A0]/40 font-mono px-2 py-0.5 rounded-full font-bold">
              {filteredGrievances.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#FBF6EE]/50 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search business, hash, ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0] w-48 sm:w-60"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#2C2016] p-1 rounded-lg border border-[#F4D9A0]/20 text-xs">
              {['all', 'critical', 'high', 'medium', 'low'].map(pri => (
                <button
                  key={pri}
                  type="button"
                  onClick={() => setFilterPriority(pri)}
                  className={`px-2.5 py-1 rounded text-xs capitalize transition-colors font-semibold cursor-pointer ${
                    filterPriority === pri
                      ? 'bg-[#F4D9A0] text-[#2C2016]'
                      : 'text-[#FBF6EE]/70 hover:text-white'
                  }`}
                >
                  {pri}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List of Grievance Dossiers */}
        {filteredGrievances.length === 0 ? (
          <div className="py-12 text-center text-[#FBF6EE]/50">
            <ShieldAlert className="w-8 h-8 text-[#C86D24] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-[#FBF6EE]/80">No grievances match current filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGrievances.map(grievance => {
              const statusInfo = getStatusBadge(grievance.status);

              return (
                <div
                  key={grievance.id}
                  className="bg-[#2C2016] border border-[#F4D9A0]/30 hover:border-[#F4D9A0] rounded-xl p-4 sm:p-5 transition-all space-y-3"
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black font-mono text-[#FBF6EE]">
                        {grievance.id}
                      </span>
                      <span className="text-[11px] font-mono text-[#F4D9A0] bg-[#36281C] px-2 py-0.5 rounded border border-[#F4D9A0]/30 flex items-center gap-1">
                        <Hash className="w-3 h-3 text-[#F4D9A0]" />
                        {grievance.hashCode}
                      </span>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${getPriorityBadgeClass(grievance.priority)}`}>
                        {grievance.priority} Priority
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Business & Location Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#36281C] p-3 rounded-lg border border-[#F4D9A0]/20">
                    <div>
                      <span className="text-[#FBF6EE]/60 block">Food Business & FSSAI Lic:</span>
                      <span className="text-[#FBF6EE] font-bold block">{grievance.businessName}</span>
                      <span className="text-[#F4D9A0] font-mono text-[11px]">
                        Lic #: {grievance.fssaiDetails.licenseNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#FBF6EE]/60 block">Incident Location & Channel:</span>
                      <span className="text-[#FBF6EE]/90 block truncate">{grievance.location.formattedAddress}</span>
                      <span className="text-[#F4D9A0] font-semibold uppercase text-[10px]">
                        Mode: {grievance.issueType} {grievance.issueType === 'online' ? '(Invoice Verified)' : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#FBF6EE]/60 block">Assigned Official & Bounty:</span>
                      <span className="text-[#FBF6EE] font-medium block">{grievance.verificationState.assignedOfficerName}</span>
                      <span className="text-[#F4D9A0] font-bold font-mono">
                        Bounty: ₹{grievance.rewardAmountINR.toLocaleString('en-IN')} (Upon Settlement)
                      </span>
                    </div>
                  </div>

                  {/* Summary & Structural Evidence Check */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F4D9A0]">Citizen Claim:</span>
                      <span className="text-[#FBF6EE] font-medium">"{grievance.keywordSummary}"</span>
                    </div>

                    <p className="text-[#FBF6EE]/75 text-[11px]">
                      {grievance.detailedDescription}
                    </p>

                    {grievance.hasFacedBusinessWarnings && (
                      <div className="p-2 bg-[#401f18] border border-[#C86D24] rounded text-[#FBF6EE] text-[11px] font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#C86D24] shrink-0" />
                        <span>
                          Warning from Business Logged: {grievance.businessWarningDetails || 'Threats faced by reporting citizen. Dispatched to Vigilance.'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Evidence Photo Strip & FSSA Citation */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F4D9A0]/20 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2 overflow-hidden">
                        {grievance.images.map((img, i) => (
                          <img
                            key={i}
                            src={img.dataUrl}
                            alt="Evidence"
                            className="inline-block h-8 w-8 rounded-lg ring-2 ring-[#36281C] object-cover"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#FBF6EE]/70">
                        {grievance.images.length} verified live camera angles (CV Food: Pass)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectGrievanceForAudit(grievance)}
                        className="px-3 py-1.5 bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] font-bold text-xs rounded-lg transition-colors shadow flex items-center gap-1.5 cursor-pointer border border-[#F4D9A0]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect Dossier & Raid Status
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
