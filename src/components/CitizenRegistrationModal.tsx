import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Phone, Mail, MapPin, Calendar, User } from 'lucide-react';
import { CitizenUser } from '../types';
import { isCitizenAgeValid } from '../utils/foodSafetyRules';

interface CitizenRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  citizen: CitizenUser;
  onUpdateCitizen: (updated: CitizenUser) => void;
}

export const CitizenRegistrationModal: React.FC<CitizenRegistrationModalProps> = ({
  isOpen,
  onClose,
  citizen,
  onUpdateCitizen
}) => {
  const [formData, setFormData] = useState<CitizenUser>({ ...citizen });
  const [step, setStep] = useState<'profile' | 'otp'>('profile');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [simulatedReceivedOtp, setSimulatedReceivedOtp] = useState('782941');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [ageValidationError, setAgeValidationError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);

  if (!isOpen) return null;

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    setFormData(prev => ({ ...prev, dateOfBirth: dob }));
    const check = isCitizenAgeValid(dob);
    if (!check.isValid) {
      setAgeValidationError(check.error || 'Must be 18 years or older.');
    } else {
      setAgeValidationError(null);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const ageCheck = isCitizenAgeValid(formData.dateOfBirth);
    if (!ageCheck.isValid) {
      setAgeValidationError(ageCheck.error || 'Age must be 18+');
      return;
    }
    // Generate fresh 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedReceivedOtp(code);
    setStep('otp');
    setResendCooldown(30);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(0, 1);
    }
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const entered = otpCode.join('');
    if (entered === simulatedReceivedOtp || entered === '123456') {
      const updatedUser: CitizenUser = {
        ...formData,
        isVerified: true
      };
      onUpdateCitizen(updatedUser);
      onClose();
    } else {
      setOtpError('Invalid OTP code. Please enter the simulated SMS code shown above or click "Auto-fill OTP".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#36281C] border border-[#F4D9A0]/50 rounded-2xl w-full max-w-xl text-[#FBF6EE] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C2016] via-[#5B4632] to-[#36281C] p-6 border-b border-[#F4D9A0]/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#2C2016] text-[#F4D9A0] font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-[#F4D9A0]/30">
                SIH Citizen Verification
              </span>
              <h2 className="text-xl font-extrabold text-[#FBF6EE]">
                {step === 'profile' ? 'Citizen KYC & Profile (Age ≥ 18)' : 'Mobile Number OTP Authentication'}
              </h2>
            </div>
            <p className="text-xs text-[#F4D9A0]/80 mt-1">
              Statutory verification under Food Safety and Standards Authority of India (FSSAI) Act 2006.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/30 text-[#FBF6EE]/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'profile' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#F4D9A0] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Arjun"
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Verma"
                    className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#F4D9A0] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="arjun.verma@example.in"
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                    Mobile Number (OTP Auth) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#F4D9A0] absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                  Date of Birth (Mandatory Age ≥ 18 Check) *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#F4D9A0] absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.dateOfBirth}
                    onChange={handleDobChange}
                    className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                  />
                </div>
                {ageValidationError && (
                  <p className="text-[#C86D24] text-xs mt-1.5 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {ageValidationError}
                  </p>
                )}
                <p className="text-[#FBF6EE]/60 text-[11px] mt-1">
                  Only adult citizens (18 years or older) are authorized to file official food safety statutory complaints.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                  Permanent Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#F4D9A0] absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    required
                    value={formData.permanentAddress}
                    onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })}
                    placeholder="Full permanent residential address with pincode..."
                    className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                  Temporary / Current Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#F4D9A0] absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    required
                    value={formData.temporaryAddress}
                    onChange={e => setFormData({ ...formData, temporaryAddress: e.target.value })}
                    placeholder="Current location / temporary address..."
                    className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-[#FBF6EE]/70 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!ageValidationError}
                  className="px-6 py-2.5 text-sm font-bold text-[#2C2016] bg-[#F4D9A0] rounded-lg hover:bg-[#F9E6BD] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center gap-2 cursor-pointer border border-[#F4D9A0]"
                >
                  Proceed to Mobile OTP Auth →
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Simulated SMS Alert Box */}
              <div className="bg-[#2C2016] border border-[#F4D9A0]/40 rounded-xl p-4 text-[#F4D9A0]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F4D9A0]">
                    📲 Govt SMS Gateway Simulation
                  </span>
                  <span className="text-[11px] font-mono text-[#FBF6EE]/60">
                    Recipient: {formData.mobile}
                  </span>
                </div>
                <div className="mt-2 text-sm text-[#FBF6EE]">
                  Your SIH Food Safety Sentinel Verification Code is:{' '}
                  <span className="text-xl font-mono font-black text-[#F4D9A0] tracking-widest bg-[#5B4632] px-2 py-0.5 rounded border border-[#F4D9A0]/50">
                    {simulatedReceivedOtp}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const digits = simulatedReceivedOtp.split('');
                    setOtpCode(digits);
                    setOtpError(null);
                  }}
                  className="mt-3 text-xs font-bold text-[#F4D9A0] hover:underline cursor-pointer"
                >
                  Click to Auto-fill Code ({simulatedReceivedOtp})
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-[#FBF6EE]/80 mb-4">
                  Enter the 6-digit OTP sent to your registered mobile number
                </p>

                {/* 6 Digit Input */}
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(index, e.target.value)}
                      className="w-11 h-13 text-center text-xl font-bold font-mono bg-[#2C2016] border border-[#F4D9A0]/30 focus:border-[#F4D9A0] rounded-lg text-[#FBF6EE] focus:outline-none"
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-[#C86D24] text-xs mt-3 flex items-center justify-center gap-1 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {otpError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-[#FBF6EE]/60 pt-2 border-t border-[#F4D9A0]/20">
                <button
                  type="button"
                  onClick={() => setStep('profile')}
                  className="text-[#FBF6EE]/70 hover:text-white cursor-pointer"
                >
                  ← Edit Information
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const fresh = Math.floor(100000 + Math.random() * 900000).toString();
                    setSimulatedReceivedOtp(fresh);
                    setResendCooldown(30);
                  }}
                  disabled={resendCooldown > 0}
                  className="text-[#F4D9A0] hover:underline disabled:text-[#FBF6EE]/40 cursor-pointer"
                >
                  Resend OTP {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
                </button>
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-3 text-sm font-bold text-[#2C2016] bg-[#F4D9A0] rounded-lg hover:bg-[#F9E6BD] transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#F4D9A0]"
              >
                <ShieldCheck className="w-4 h-4 text-[#2C2016]" />
                Authenticate & Verify Citizen Identity
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
