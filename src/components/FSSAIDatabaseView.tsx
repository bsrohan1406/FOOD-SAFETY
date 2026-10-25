import React, { useState } from 'react';
import { Database, Search, ShieldCheck, AlertTriangle, Calendar, Building2, CheckCircle2 } from 'lucide-react';
import { MOCK_FSSAI_DATABASE } from '../data/mockDatabase';
import { FSSAIBusinessRecord } from '../types';

export const FSSAIDatabaseView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRecords = MOCK_FSSAI_DATABASE.filter(record => {
    const matchesSearch = 
      record.businessName.toLowerCase().includes(search.toLowerCase()) ||
      record.licenseNumber.includes(search) ||
      record.address.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.licenseStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* 60-30-10 Header Banner (60% Mocha Brown, 30% Champagne Gold, 10% Burnt Amber & White) */}
      <div className="bg-gradient-to-r from-[#2C2016] via-[#5B4632] to-[#36281C] rounded-2xl p-6 sm:p-8 text-[#FBF6EE] shadow-xl border border-[#F4D9A0]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2C2016] text-[#F4D9A0] font-mono text-xs px-2.5 py-0.5 rounded font-bold uppercase mb-2 border border-[#F4D9A0]/30">
              National FoSCoS Registry Sync
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#FBF6EE]">
              FSSAI Food Business Operator (FBO) Registry
            </h1>
            <p className="text-xs sm:text-sm text-[#F4D9A0]/80 mt-1 max-w-2xl">
              Cross-verify any food establishment's 14-digit FSSAI license, expiry dates, hygiene ratings, and statutory laboratory inspection histories.
            </p>
          </div>

          <div className="bg-[#2C2016]/95 p-3 rounded-xl border border-[#F4D9A0]/30 text-xs shrink-0 sm:text-right">
            <span className="text-[#FBF6EE]/60 block">Registry Node:</span>
            <span className="text-[#FBF6EE] font-mono font-bold block">FoSCoS Central Hub</span>
            <span className="text-[#F4D9A0] font-mono text-[11px] block">
              ● Live Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 text-[#FBF6EE] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#FBF6EE]/50 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Food Business Name, 14-digit License No, or Location..."
              className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg pl-9 pr-4 py-2.5 text-xs sm:text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-xs text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0] cursor-pointer"
            >
              <option value="all">All License Statuses</option>
              <option value="ACTIVE">Active Licenses Only</option>
              <option value="EXPIRED">Expired / Overdue Only</option>
              <option value="NOT_FOUND">Unregistered / Not Found</option>
            </select>
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredRecords.map(record => (
            <div
              key={record.licenseNumber}
              className={`rounded-xl p-5 border text-xs space-y-3 transition-all ${
                record.licenseStatus === 'ACTIVE'
                  ? 'bg-[#2C2016] border-[#F4D9A0]/30 hover:border-[#F4D9A0]'
                  : 'bg-[#401f18] border-[#C86D24] hover:border-[#e07a2a]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#FBF6EE] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#F4D9A0] shrink-0" />
                    {record.businessName}
                  </h3>
                  <span className="text-[11px] text-[#FBF6EE]/60 block mt-0.5">
                    {record.businessType}
                  </span>
                </div>

                <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  record.licenseStatus === 'ACTIVE'
                    ? 'bg-[#5B4632] text-[#F4D9A0] border border-[#F4D9A0]/40'
                    : 'bg-[#C86D24] text-white border border-[#C86D24]'
                }`}>
                  {record.licenseStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#36281C] p-2.5 rounded-lg border border-[#F4D9A0]/20">
                <div>
                  <span className="text-[#FBF6EE]/60 block">14-Digit FSSAI Lic #:</span>
                  <span className="text-[#FBF6EE] font-mono font-semibold">{record.licenseNumber}</span>
                </div>

                <div>
                  <span className="text-[#FBF6EE]/60 block">Renewal / Expiry:</span>
                  <span className={`font-mono font-semibold ${
                    record.licenseStatus === 'EXPIRED' ? 'text-[#C86D24]' : 'text-[#F4D9A0]'
                  }`}>
                    {record.expiryDate}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-[#FBF6EE]/60 block">Address:</span>
                  <span className="text-[#FBF6EE]/80">{record.address}, {record.state} - {record.pincode}</span>
                </div>
              </div>

              <div>
                <span className="text-[#FBF6EE]/60 block">Hygiene Rating:</span>
                <span className="text-[#F4D9A0] font-bold text-sm">
                  {'★'.repeat(record.hygieneRatingStars)}{'☆'.repeat(5 - record.hygieneRatingStars)}
                </span>
              </div>

              <div className="border-t border-[#F4D9A0]/20 pt-2 text-[11px]">
                <span className="text-[#F4D9A0] font-bold block">Laboratory Inspection Summary:</span>
                <p className="text-[#FBF6EE]/80 mt-0.5">{record.labResultSummary}</p>
                <span className="text-[#FBF6EE]/50 text-[10px] block mt-1">
                  Last Inspected: {record.lastLabInspectionDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
