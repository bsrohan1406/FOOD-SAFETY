import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Receipt, 
  Download, 
  History, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { CitizenUser, WalletTransaction } from '../types';
import { validateBankDetails } from '../utils/foodSafetyRules';

interface CitizenWalletViewProps {
  citizen: CitizenUser;
  transactions: WalletTransaction[];
  onWithdrawFunds: (amountINR: number, bankDetails: { account: string; ifsc: string; holder: string }) => void;
}

export const CitizenWalletView: React.FC<CitizenWalletViewProps> = ({
  citizen,
  transactions,
  onWithdrawFunds
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState('1500');
  const [accountNumber, setAccountNumber] = useState('309811245091');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('309811245091');
  const [ifscCode, setIfscCode] = useState('SBIN0001234');
  const [accountHolderName, setAccountHolderName] = useState(`${citizen.firstName} ${citizen.lastName}`);
  const [upiId, setUpiId] = useState('arjun@okhdfcbank');
  
  const [withdrawalSuccess, setWithdrawalSuccess] = useState<{
    utr: string;
    amount: number;
    timestamp: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Please enter a valid withdrawal amount.');
      return;
    }

    if (amount > citizen.walletBalanceINR) {
      setErrorMessage(`Insufficient wallet balance. You have ₹${citizen.walletBalanceINR.toLocaleString('en-IN')} available.`);
      return;
    }

    if (accountNumber !== confirmAccountNumber) {
      setErrorMessage('Account number and Confirm Account number do not match.');
      return;
    }

    const bankCheck = validateBankDetails(accountNumber, ifscCode);
    if (!bankCheck.isValid) {
      setErrorMessage(bankCheck.error || 'Invalid bank account or IFSC details.');
      return;
    }

    onWithdrawFunds(amount, {
      account: accountNumber,
      ifsc: ifscCode.toUpperCase(),
      holder: accountHolderName
    });

    setWithdrawalSuccess({
      utr: `NEFT-FSSAI-${Math.floor(10000000 + Math.random() * 90000000)}`,
      amount,
      timestamp: new Date().toLocaleTimeString('en-IN')
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 60-30-10 Header Banner (60% Mocha Brown, 30% Champagne Gold, 10% Burnt Amber & White) */}
      <div className="bg-gradient-to-r from-[#2C2016] via-[#5B4632] to-[#36281C] rounded-2xl p-6 sm:p-8 text-[#FBF6EE] shadow-xl border border-[#F4D9A0]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2C2016] text-[#F4D9A0] font-mono text-xs px-2.5 py-0.5 rounded font-bold uppercase mb-2 border border-[#F4D9A0]/30">
              SIH Citizen Statutory Bounty System
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#FBF6EE]">
              Citizen Food Safety Vigilance Wallet
            </h1>
            <p className="text-xs sm:text-sm text-[#F4D9A0]/80 mt-1 max-w-xl">
              Direct public rewards for verified food safety grievances settled by higher official raids. 
              Convert your earned rewards directly into INR into your bank account at any time.
            </p>
          </div>

          {/* Balance card */}
          <div className="bg-[#2C2016]/95 backdrop-blur-md p-5 rounded-2xl border-2 border-[#F4D9A0]/40 shadow-2xl text-left sm:text-right shrink-0">
            <span className="text-xs text-[#FBF6EE]/60 uppercase tracking-wider block font-bold">
              Available Wallet Balance
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-[#FBF6EE] mt-1 tabular-nums flex items-center sm:justify-end gap-1">
              <span className="text-[#F4D9A0] font-sans font-bold">₹</span>
              <span>{citizen.walletBalanceINR.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[11px] text-[#F4D9A0] font-medium block mt-1">
              ✓ 100% Tax-Exempt Whistleblower Reward
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Direct INR Withdrawal Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 text-[#FBF6EE] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F4D9A0]/20 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#5B4632] flex items-center justify-center text-[#F4D9A0] border border-[#F4D9A0]/30 shadow-md">
                  <ArrowUpRight className="w-4 h-4 text-[#F4D9A0]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#FBF6EE]">Convert Wallet Bounty into INR</h2>
                  <p className="text-[11px] text-[#FBF6EE]/60">Instant direct bank NEFT/IMPS payout</p>
                </div>
              </div>

              <span className="text-xs font-mono text-[#F4D9A0]">
                0% Transfer Fee
              </span>
            </div>

            {withdrawalSuccess ? (
              <div className="p-6 bg-[#2C2016] border border-[#F4D9A0]/50 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#F4D9A0] mx-auto" />
                <h3 className="text-lg font-bold text-[#FBF6EE]">
                  ₹{withdrawalSuccess.amount.toLocaleString('en-IN')} Successfully Disbursed!
                </h3>
                <p className="text-xs text-[#F4D9A0] max-w-md mx-auto">
                  Transfer processed to {accountHolderName}'s account (A/c ending in ...{accountNumber.slice(-4)}) via RBI National Payment Gateway.
                </p>

                <div className="bg-[#36281C] p-3 rounded-lg border border-[#F4D9A0]/20 text-xs font-mono text-[#FBF6EE] inline-block text-left">
                  <div><strong>Transaction Reference (UTR):</strong> {withdrawalSuccess.utr}</div>
                  <div><strong>Execution Time:</strong> {withdrawalSuccess.timestamp}</div>
                  <div><strong>Status:</strong> COMPLETED / CREDITED</div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawalSuccess(null)}
                    className="px-5 py-2 bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Initiate Another Transfer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWithdrawalSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#FBF6EE]/80 font-bold mb-1">
                    Withdrawal Amount in INR (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#F4D9A0] font-bold text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min="100"
                      max={citizen.walletBalanceINR}
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg pl-7 pr-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0] font-mono font-bold"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#FBF6EE]/60 mt-1">
                    <span>Min withdrawal: ₹100</span>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(citizen.walletBalanceINR.toString())}
                      className="text-[#F4D9A0] hover:underline font-semibold cursor-pointer"
                    >
                      Withdraw Full Balance (₹{citizen.walletBalanceINR})
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#FBF6EE]/80 font-bold mb-1">
                      Bank Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      placeholder="e.g. 309811245091"
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#FBF6EE]/80 font-bold mb-1">
                      Confirm Bank Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={confirmAccountNumber}
                      onChange={e => setConfirmAccountNumber(e.target.value)}
                      placeholder="Re-enter bank account number"
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#FBF6EE]/80 font-bold mb-1">
                      Bank IFSC Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={ifscCode}
                      onChange={e => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SBIN0001234"
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0] font-mono uppercase"
                    />
                    <span className="text-[10px] text-[#FBF6EE]/60 block mt-0.5">
                      Branch: State Bank of India · Indiranagar Branch
                    </span>
                  </div>

                  <div>
                    <label className="block text-[#FBF6EE]/80 font-bold mb-1">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={accountHolderName}
                      onChange={e => setAccountHolderName(e.target.value)}
                      placeholder="Full name as per bank records"
                      className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#FBF6EE]/80 font-bold mb-1">
                    Optional UPI ID (Fast-track IMPS)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="e.g. username@oksbi"
                    className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0] font-mono"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 bg-[#401f18] border border-[#C86D24] rounded-lg text-[#FBF6EE] text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#C86D24] shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={citizen.walletBalanceINR <= 0}
                    className="w-full py-3 bg-[#F4D9A0] hover:bg-[#F9E6BD] disabled:opacity-40 disabled:cursor-not-allowed text-[#2C2016] font-extrabold text-sm rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#F4D9A0]"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Convert to INR & Transfer to Bank
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Col: Statutory Reward Priority Matrix */}
        <div className="space-y-6">
          <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 text-[#FBF6EE] shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-[#FBF6EE] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F4D9A0]" />
              Statutory Bounty Reward Matrix
            </h2>
            <p className="text-xs text-[#FBF6EE]/70">
              Rewards are sanctioned from the FSSAI Consumer Protection & Vigilance Corpus upon successful physical raid verification.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#2C2016] border border-[#C86D24] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#C86D24] block">Critical Priority</span>
                  <span className="text-[10px] text-[#FBF6EE]/60">Poisoning, expired license, hazardous chemicals</span>
                </div>
                <span className="text-sm font-mono font-black text-[#FBF6EE]">₹3,500</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#2C2016] border border-[#F4D9A0]/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F4D9A0] block">High Priority</span>
                  <span className="text-[10px] text-[#FBF6EE]/60">Extraneous matter, dead insects, severe decay</span>
                </div>
                <span className="text-sm font-mono font-black text-[#FBF6EE]">₹1,500</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#2C2016] border border-[#F4D9A0]/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F4D9A0]/80 block">Medium Priority</span>
                  <span className="text-[10px] text-[#FBF6EE]/60">Substandard food, unhygienic preparation</span>
                </div>
                <span className="text-sm font-mono font-black text-[#FBF6EE]">₹500</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#2C2016] border border-[#F4D9A0]/20 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#FBF6EE]/70 block">Low Priority</span>
                  <span className="text-[10px] text-[#FBF6EE]/60">Labeling anomalies, packaging defects</span>
                </div>
                <span className="text-sm font-mono font-black text-[#FBF6EE]">₹250</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Transaction History Ledger */}
      <div className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 text-[#FBF6EE] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#F4D9A0]/20 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#F4D9A0]" />
            <h2 className="text-sm font-bold text-[#FBF6EE]">Wallet Transaction Ledger & Audit Trail</h2>
          </div>
          <span className="text-xs text-[#F4D9A0] font-mono">
            {transactions.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#F4D9A0]/20 text-[#F4D9A0] font-semibold">
                <th className="pb-2">Transaction ID</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Description</th>
                <th className="pb-2">Reference (UTR)</th>
                <th className="pb-2 text-right">Amount (INR)</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4D9A0]/10 font-mono">
              {transactions.map(txn => (
                <tr key={txn.id} className="hover:bg-[#2C2016]/50">
                  <td className="py-3 text-[#FBF6EE] font-bold">{txn.id}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      txn.type === 'CREDIT_REWARD'
                        ? 'bg-[#5B4632] text-[#F4D9A0] border border-[#F4D9A0]/40'
                        : 'bg-[#401f18] text-[#C86D24] border border-[#C86D24]/40'
                    }`}>
                      {txn.type === 'CREDIT_REWARD' ? 'REWARD CREDIT' : 'INR WITHDRAWAL'}
                    </span>
                  </td>
                  <td className="py-3 text-[#FBF6EE]/90 font-sans">{txn.description}</td>
                  <td className="py-3 text-[#FBF6EE]/60 text-[11px]">{txn.referenceNumber}</td>
                  <td className={`py-3 text-right font-black tabular-nums ${
                    txn.type === 'CREDIT_REWARD' ? 'text-[#F4D9A0]' : 'text-[#C86D24]'
                  }`}>
                    {txn.type === 'CREDIT_REWARD' ? '+' : '-'}₹{txn.amountINR.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[#F4D9A0] font-bold text-[10px]">
                      ● {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
