import React, { useState } from 'react';
import { 
  Scale, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  ShieldAlert, 
  Layers, 
  Clock, 
  FileText,
  Filter,
  BadgeAlert,
  Building2,
  ArrowRight
} from 'lucide-react';
import { GrievanceDossier, PriorityLevel, GrievanceStatus } from '../types';

interface PipelineVerificationDashboardProps {
  grievances: GrievanceDossier[];
  onSelectDossier: (dossier: GrievanceDossier) => void;
  onDispatchOfficer: (dossierId: string) => void;
}

export const PipelineVerificationDashboard: React.FC<PipelineVerificationDashboardProps> = ({
  grievances,
  onSelectDossier,
  onDispatchOfficer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | PriorityLevel>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filtered grievances
  const filtered = grievances.filter((g) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      g.trackingNumber.toLowerCase().includes(q) ||
      g.establishment.name.toLowerCase().includes(q) ||
      g.establishment.fssaiLicense.includes(q) ||
      g.violationCategory.toLowerCase().includes(q);

    const matchesPriority = priorityFilter === 'All' || g.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Clustered incidents count
  const clusteredGroups = grievances.reduce((acc, curr) => {
    const key = curr.establishment.fssaiLicense || curr.establishment.name;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const repeatOffenders = Object.entries(clusteredGroups).filter(([_, count]) => count > 1);

  return (
    <div className="space-y-8 py-4">
      
      {/* Header and Cluster Banner */}
      <div className="bg-[#36281C] border border-[#F4D9A0]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F4D9A0]/15 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#F4D9A0] uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4 text-[#C86D24]" />
              <span>National Food Safety Docket &bull; FSS Act 2006</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#FBF6EE]">
              Verification Pipeline &amp; Statutory Law Scanner
            </h2>
            <p className="text-xs text-[#CDBFAC]">
              Autonomous legal jurisdiction gate, incident clustering &amp; priority escalation triage.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-[#1F160E] text-[#F4D9A0] border border-[#F4D9A0]/30">
              Total Docket Entries: {grievances.length}
            </span>
          </div>
        </div>

        {/* Repeat Offender Clustering Telemetry */}
        {repeatOffenders.length > 0 && (
          <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-red-300 font-bold uppercase">
              <BadgeAlert className="w-4 h-4 text-red-400" />
              <span>Incident Clustering Engine: {repeatOffenders.length} Repeat FBO Cluster(s) Detected</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {repeatOffenders.map(([license, count]) => {
                const sample = grievances.find(g => g.establishment.fssaiLicense === license);
                return (
                  <span
                    key={license}
                    className="px-3 py-1 rounded bg-[#2C2016] border border-red-400/40 text-red-200 font-mono flex items-center gap-1.5"
                  >
                    <span>{sample?.establishment.name || license}</span>
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
                      {count} Complaints Linked
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-[#CDBFAC] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracking #, FBO, license..."
              className="w-full pl-9 pr-3 py-2 bg-[#1F160E] border border-[#F4D9A0]/25 rounded-xl text-xs text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
            />
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#1F160E] border border-[#F4D9A0]/25 rounded-xl text-xs text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="Elevated">Elevated Priority</option>
              <option value="Standard">Standard Priority</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#1F160E] border border-[#F4D9A0]/25 rounded-xl text-xs text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
            >
              <option value="All">All Statuses</option>
              <option value="submitted">Submitted (Pending FSO)</option>
              <option value="inspection_in_progress">Inspection in Progress</option>
              <option value="action_enforced">Action Enforced</option>
              <option value="reward_disbursed">Reward Disbursed</option>
              <option value="rejected_non_jurisdiction">Non-Jurisdiction Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grievance Queue Table / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#CDBFAC]">
          <span>Displaying {filtered.length} Dossier Cases</span>
          <span>Dual-Ended Timestamp Verification Active</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#36281C]/50 border border-[#F4D9A0]/20 rounded-2xl space-y-2">
            <FileText className="w-10 h-10 text-stone-500 mx-auto" />
            <p className="text-sm text-[#FBF6EE]">No grievances match the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((dossier) => {
              const isCritical = dossier.priority === 'Critical';
              const isNonJurisdiction = dossier.status === 'rejected_non_jurisdiction';

              return (
                <div
                  key={dossier.id}
                  className={`bg-[#36281C] border rounded-2xl p-6 transition-all hover:border-[#F4D9A0]/60 shadow-lg ${
                    isCritical
                      ? 'border-red-500/40 ring-1 ring-red-500/20'
                      : 'border-[#F4D9A0]/20'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Metadata & Establishment */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#F4D9A0] bg-[#1F160E] px-2.5 py-1 rounded border border-[#F4D9A0]/25">
                          {dossier.trackingNumber}
                        </span>

                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
                          isCritical
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : dossier.priority === 'Elevated'
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                            : 'bg-stone-700/50 text-stone-300'
                        }`}>
                          {dossier.priority} Priority
                        </span>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          dossier.status === 'action_enforced' || dossier.status === 'reward_disbursed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : dossier.status === 'inspection_in_progress'
                            ? 'bg-blue-500/20 text-blue-300'
                            : isNonJurisdiction
                            ? 'bg-stone-800 text-stone-400'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          Status: {dossier.status.replace(/_/g, ' ')}
                        </span>

                        <span className="text-[11px] font-mono text-stone-400">
                          {dossier.filingDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#F4D9A0]" />
                        <h4 className="font-editorial text-lg font-bold text-[#FBF6EE]">
                          {dossier.establishment.name}
                        </h4>
                        <span className="text-xs font-mono text-[#CDBFAC]">
                          (FSSAI: {dossier.establishment.fssaiLicense})
                        </span>
                      </div>

                      <p className="text-xs text-[#CDBFAC] line-clamp-2">
                        {dossier.incidentDescription}
                      </p>

                      {/* Statutory Sections Flags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {dossier.statutoryReview.applicableSections.map((sec) => (
                          <span
                            key={sec}
                            className="text-[10px] font-mono px-2 py-0.5 bg-[#1F160E] text-[#F4D9A0] rounded border border-[#F4D9A0]/20"
                          >
                            {sec}
                          </span>
                        ))}
                        {dossier.evidenceImages.length > 0 && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                            {dossier.evidenceImages.length} Live CV Photos Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F4D9A0]/10">
                      
                      {dossier.status === 'submitted' && (
                        <button
                          type="button"
                          onClick={() => onDispatchOfficer(dossier.id)}
                          className="px-4 py-2 bg-[#C86D24] hover:bg-[#d97c31] text-white text-xs font-semibold rounded-xl transition-all shadow"
                        >
                          Dispatch FSO On-Site
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectDossier(dossier)}
                        className="px-4 py-2 bg-[#2C2016] hover:bg-[#1F160E] text-[#F4D9A0] border border-[#F4D9A0]/30 text-xs font-mono rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Case Dossier</span>
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
