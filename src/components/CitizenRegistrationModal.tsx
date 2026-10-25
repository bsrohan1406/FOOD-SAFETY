import React, { useState } from 'react';
import { 
  UserCheck, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  KeyRound, 
  Building, 
  CheckCircle2 
} from 'lucide-react';
import { CitizenProfile } from '../types';
import { isValidIFSC } from '../utils/foodSafetyRules';

interface CitizenRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  citizen: CitizenProfile;
  onUpdateCitizen: (updated: CitizenProfile) => void;
}

export const CitizenRegistrationModal: React.FC<CitizenRegistrationModalProps> = ({
  isOpen,
  onClose,
  citizen,
  onUpdateCitizen
}) => {
  const [fullName, setFullName] = useState(citizen.fullName);
  const [age, setAge] = useState(citizen.age.toString());
  const [phone, setPhone] = useState(citizen.phone);
  const [aadhaarDigits, setAadhaarDigits] = useState('8921');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(citizen.isKycVerified);
  
  // Bank details
  const [accountNumber, setAccountNumber] = useState(citizen.bankAccount?.accountNumberMasked.replace(/\D/g, '') || '98765432104589');
  const [ifsc, setIfsc] = useState(citizen.bankAccount?.ifsc || 'SBIN0001844');
  const [bankName, setBankName] = useState(citizen.bankAccount?.bankName || 'State Bank of India');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      setErrorMsg('Statutory Age Requirement: Complainants must be at least 18 years old to file legal food safety complaints.');
      return;
    }
    setErrorMsg(null);
    setOtpSent(true);
    setOtpCode('7492'); // Pre-fill mock OTP for smooth testing
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) {
      setErrorMsg('Please enter the 4-digit SMS OTP.');
      return;
    }
    setErrorMsg(null);
    setOtpVerified(true);
  };

  const handleSave = () => {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      setErrorMsg('Age must be 18 or above.');
      return;
    }

    if (!isValidIFSC(ifsc)) {
      setErrorMsg('Invalid IFSC code format (e.g. SBIN0001844).');
      return;
    }

    const updatedProfile: CitizenProfile = {
      ...citizen,
      fullName,
      age: ageNum,
      phone,
      aadhaarNumberMasked: `XXXX-XXXX-${aadhaarDigits.slice(-4)}`,
      isKycVerified: otpVerified,
      bankAccount: {
        accountNumberMasked: `XXXXXXXX${accountNumber.slice(-4)}`,
        ifsc: ifsc.toUpperCase(),
        bankName
      }
    };

    onUpdateCitizen(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#2C2016] border border-[#F4D9A0]/40 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-[#36281C] px-6 py-4 border-b border-[#F4D9A0]/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-[#F4D9A0]" />
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#FBF6EE]">
                Citizen Identity &amp; Statutory KYC Verification
              </h3>
              <p className="text-xs text-[#CDBFAC]">
                FSS Act 2006 Age Compliance &amp; Payout Account Binding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#CDBFAC] hover:text-[#FBF6EE] hover:bg-[#2C2016] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {errorMsg && (
            <div className="p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Citizen Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#F4D9A0] mb-1">
                Full Name (As per Aadhaar)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#F4D9A0] mb-1">
                Age (Must be &ge; 18)
              </label>
              <input
                type="number"
                min="18"
                max="105"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
              />
            </div>
          </div>

          {/* Aadhaar & Phone OTP */}
          <div className="space-y-3 p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/20">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F4D9A0] block">
              UIDAI / Aadhaar &amp; Mobile OTP Binding
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#CDBFAC] mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#2C2016] border border-[#F4D9A0]/20 rounded-lg px-3 py-1.5 text-xs text-[#FBF6EE]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#CDBFAC] mb-1">Last 4 Digits of Aadhaar</label>
                <input
                  type="text"
                  maxLength={4}
                  value={aadhaarDigits}
                  onChange={(e) => setAadhaarDigits(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#2C2016] border border-[#F4D9A0]/20 rounded-lg px-3 py-1.5 text-xs text-[#FBF6EE] font-mono"
                  placeholder="8921"
                />
              </div>
            </div>

            {/* OTP Action */}
            {!otpVerified ? (
              <div className="pt-2 flex flex-col sm:flex-row gap-2 items-center">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full sm:w-auto px-4 py-1.5 bg-[#C86D24] text-white text-xs font-semibold rounded-lg hover:bg-[#d97c31] transition-colors"
                  >
                    Send OTP to Mobile
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="bg-[#2C2016] border border-[#F4D9A0]/40 rounded-lg px-3 py-1.5 text-xs font-mono text-[#F4D9A0] text-center"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-500 transition-colors"
                    >
                      Confirm OTP
                    </button>
                    <span className="text-[11px] text-stone-400">Demo OTP: 7492</span>
                  </>
                )}
              </div>
            ) : (
              <div className="pt-1 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Identity Verified via UIDAI Ecosystem Token</span>
              </div>
            )}
          </div>

          {/* Direct Benefit Transfer (DBT) Bank Account */}
          <div className="space-y-3 p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/20">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F4D9A0] block">
              Citizen Reward Wallet &bull; Indian Bank DBT Account
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#CDBFAC] mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-[#2C2016] border border-[#F4D9A0]/20 rounded-lg px-3 py-1.5 text-xs text-[#FBF6EE] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-[#CDBFAC] mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  className="w-full bg-[#2C2016] border border-[#F4D9A0]/20 rounded-lg px-3 py-1.5 text-xs text-[#F4D9A0] font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#CDBFAC] mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-[#2C2016] border border-[#F4D9A0]/20 rounded-lg px-3 py-1.5 text-xs text-[#FBF6EE]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#36281C] text-[#CDBFAC] hover:text-[#FBF6EE] text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-[#F4D9A0] text-[#2C2016] font-bold text-xs hover:bg-[#ffe1a6] transition-colors shadow"
            >
              Save &amp; Bind KYC Profile
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
