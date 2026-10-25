import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Plus, 
  X,
  FileText
} from 'lucide-react';
import { FSSAILicensee } from '../types';

interface FSSAIDatabaseViewProps {
  registry: FSSAILicensee[];
  onAddNewLicensee: (licensee: FSSAILicensee) => void;
}

export const FSSAIDatabaseView: React.FC<FSSAIDatabaseViewProps> = ({
  registry,
  onAddNewLicensee
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New licensee form state
  const [newLicenseNum, setNewLicenseNum] = useState('');
  const [newBizName, setNewBizName] = useState('');
  const [newCategory, setNewCategory] = useState<FSSAILicensee['category']>('Restaurant');
  const [newAddress, setNewAddress] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newState, setNewState] = useState('Delhi');
  const [newPincode, setNewPincode] = useState('110001');
  const [newRating, setNewRating] = useState(4);

  const filtered = registry.filter((fbo) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      fbo.businessName.toLowerCase().includes(q) ||
      fbo.licenseNumber.includes(q) ||
      fbo.district.toLowerCase().includes(q) ||
      fbo.address.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === 'All' || fbo.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || fbo.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateLicensee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLicenseNum || newLicenseNum.length !== 14) {
      alert('FSSAI License must be exactly 14 digits.');
      return;
    }

    const created: FSSAILicensee = {
      licenseNumber: newLicenseNum,
      businessName: newBizName,
      category: newCategory,
      address: newAddress,
      district: newDistrict,
      state: newState,
      pincode: newPincode,
      validUntil: '2028-12-31',
      status: 'Active',
      hygieneRating: newRating,
      lastInspectionDate: new Date().toISOString().substring(0, 10),
      registeredOfficer: 'FSO Rajiv Varma (Emp ID: FSSAI-UP-882)',
      pastViolationsCount: 0
    };

    onAddNewLicensee(created);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="bg-[#36281C] border border-[#F4D9A0]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F4D9A0]/15 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#F4D9A0] uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4 text-[#C86D24]" />
              <span>Food Safety Compliance System (FoSCoS)</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#FBF6EE]">
              National FSSAI License &amp; FBO Operator Registry
            </h2>
            <p className="text-xs text-[#CDBFAC]">
              Centralized repository of verified commercial kitchens, restaurants, food packaging plants &amp; cloud hubs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#F4D9A0] text-[#2C2016] font-bold text-xs rounded-xl hover:bg-[#ffe1a6] transition-all flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Index New Food Operator</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#CDBFAC] absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 14-digit license, brand name, city..."
              className="w-full pl-9 pr-3 py-2 bg-[#1F160E] border border-[#F4D9A0]/25 rounded-xl text-xs text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#1F160E] border border-[#F4D9A0]/25 rounded-xl text-xs text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
            >
              <option value="All">All Categories</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Cloud Kitchen">Cloud Kitchen</option>
              <option value="Sweet Shop">Sweet Shop</option>
              <option value="Dairy">Dairy</option>
              <option value="Baker">Baker</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#1F160E] border border-[#F4D9A0]/25 rounded-xl text-xs text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Licenses</option>
              <option value="Expired">Expired</option>
              <option value="Under Investigation">Under Investigation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((fbo) => {
          const isExpired = fbo.status === 'Expired';
          return (
            <div
              key={fbo.licenseNumber}
              className={`bg-[#36281C] border rounded-2xl p-6 space-y-4 shadow-lg transition-all hover:border-[#F4D9A0]/60 ${
                isExpired ? 'border-red-500/40 bg-red-950/10' : 'border-[#F4D9A0]/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F160E] text-[#F4D9A0] border border-[#F4D9A0]/20">
                    {fbo.category}
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
                    {fbo.businessName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#CDBFAC]">
                    <MapPin className="w-3.5 h-3.5 text-[#C86D24]" />
                    <span>{fbo.address}, {fbo.district}, {fbo.state} - {fbo.pincode}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                  fbo.status === 'Active'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {fbo.status}
                </span>
              </div>

              {/* License Details & Hygiene */}
              <div className="pt-2 border-t border-[#F4D9A0]/15 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-stone-400 block">FSSAI 14-Digit Number</span>
                  <span className="font-bold text-[#F4D9A0]">{fbo.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Valid Until</span>
                  <span className="text-[#FBF6EE]">{fbo.validUntil}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Hygiene Rating</span>
                  <span className="text-amber-300 font-bold">
                    {'★'.repeat(fbo.hygieneRating)}{'☆'.repeat(5 - fbo.hygieneRating)} ({fbo.hygieneRating}/5)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Past Violations</span>
                  <span className={fbo.pastViolationsCount > 0 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {fbo.pastViolationsCount} Incidents Logged
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-stone-400 border-t border-[#F4D9A0]/10 pt-2 flex justify-between items-center">
                <span>Assigned: {fbo.registeredOfficer}</span>
                <span>Last Inspected: {fbo.lastInspectionDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Licensee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#2C2016] border border-[#F4D9A0]/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-[#36281C] px-6 py-4 border-b border-[#F4D9A0]/20 flex items-center justify-between">
              <h3 className="font-editorial text-lg font-bold text-[#FBF6EE]">
                Index Food Business Operator
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-[#CDBFAC] hover:text-[#FBF6EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLicensee} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-mono text-[#F4D9A0] mb-1">14-Digit FSSAI License Number</label>
                <input
                  type="text"
                  maxLength={14}
                  required
                  value={newLicenseNum}
                  onChange={(e) => setNewLicenseNum(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 10019011000999"
                  className="w-full bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-[#FBF6EE] font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-[#F4D9A0] mb-1">Business Operator / Trade Name</label>
                <input
                  type="text"
                  required
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  placeholder="e.g. Royal Bengal Sweets"
                  className="w-full bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-[#FBF6EE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[#F4D9A0] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-[#FBF6EE]"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                    <option value="Sweet Shop">Sweet Shop</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Baker">Baker</option>
                    <option value="Packaged Food">Packaged Food</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[#F4D9A0] mb-1">Hygiene Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-[#FBF6EE]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#F4D9A0] mb-1">Premise Address</label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Shop number, road, landmark"
                  className="w-full bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-[#FBF6EE]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-mono text-[#F4D9A0] mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg px-2.5 py-1.5 text-[#FBF6EE]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[#F4D9A0] mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg px-2.5 py-1.5 text-[#FBF6EE]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[#F4D9A0] mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg px-2.5 py-1.5 text-[#FBF6EE]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#36281C] text-[#CDBFAC] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F4D9A0] text-[#2C2016] font-bold rounded-lg hover:bg-[#ffe1a6]"
                >
                  Register in FoSCoS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
