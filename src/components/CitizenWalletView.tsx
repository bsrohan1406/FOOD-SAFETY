import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Building2, 
  Scale, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { CitizenProfile, WalletTransaction } from '../types';
import { isValidIFSC } from '../utils/foodSafetyRules';

interface CitizenWalletViewProps {
  citizen: CitizenProfile;
  transactions: WalletTransaction[];
  onWithdrawFunds: (amount: number, ifsc: string, accNum: string) => void;
  onOpenKycModal: () => void;
}

export const CitizenWalletView: React.FC<CitizenWalletViewProps> = ({
  citizen,
  transactions,
  onWithdrawFunds,
  onOpenKycModal
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState<number>(citizen.walletBalanceINR > 0 ? citizen.walletBalanceINR : 1000);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccess(null);

    if (withdrawAmount <= 0) {
      setWithdrawError('Withdrawal amount must be greater than zero.');
      return;
    }

    if (withdrawAmount > citizen.walletBalanceINR) {
      setWithdrawError(`Insufficient wallet balance. Maximum available: ₹${citizen.walletBalanceINR}`);
      return;
    }

    if (!citizen.bankAccount || !isValidIFSC(citizen.bankAccount.ifsc)) {
      setWithdrawError('Please verify your bank account and IFSC code first.');
      return;
    }

    onWithdrawFunds(
      withdrawAmount, 
      citizen.bankAccount.ifsc, 
      citizen.bankAccount.accountNumberMasked
    );

    setWithdrawSuccess(`Transfer request of ₹${withdrawAmount.toLocaleString()} initiated via Direct Benefit Transfer (NEFT/RTGS).`);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      
      {/* Wallet Banner Card */}
      <div className="bg-gradient-to-br from-[#36281C] via-[#2C2016] to-[#1F160E] border border-[#F4D9A0]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#F4D9A0] uppercase tracking-wider">
              <Scale className="w-4 h-4 text-[#C86D24]" />
              <span>Section 69 Statutory Bounty Escrow</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#FBF6EE]">
              Citizen Vigilance Reward Wallet
            </h2>
            <p className="text-xs text-[#CDBFAC] max-w-lg">
              Statutory 10% bounty on compounding penalties recovered from non-compliant food operators, deposited into sovereign escrow.
            </p>
          </div>

          {/* Balance display */}
          <div className="bg-[#1F160E]/90 border border-[#F4D9A0]/40 rounded-2xl p-6 text-center sm:text-right shrink-0 shadow-inner">
            <span className="text-xs font-mono text-[#CDBFAC] uppercase block">Available Balance</span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#F4D9A0] my-1">
              ₹{citizen.walletBalanceINR.toLocaleString()} <span className="text-sm font-sans font-normal text-stone-400">INR</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-center sm:justify-end gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>KYC &amp; Aadhaar Verified</span>
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Grid: Bank Payout on Left, Transactions Ledger on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Bank Transfer Direct Benefit (1 Col) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#36281C] border border-[#F4D9A0]/20 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="border-b border-[#F4D9A0]/15 pb-3">
              <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
                Direct Bank Payout
              </h3>
              <p className="text-xs text-[#CDBFAC]">
                Transfer reward balance to Indian bank account.
              </p>
            </div>

            {/* Linked Bank Card */}
            <div className="p-3.5 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/20 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#F4D9A0] uppercase">Linked Bank (DBT)</span>
                <button
                  type="button"
                  onClick={onOpenKycModal}
                  className="text-[10px] text-stone-400 hover:text-[#F4D9A0] underline"
                >
                  Change
                </button>
              </div>
              <div className="font-bold text-[#FBF6EE]">
                {citizen.bankAccount?.bankName || 'State Bank of India'}
              </div>
              <div className="font-mono text-stone-300 text-[11px]">
                A/C: {citizen.bankAccount?.accountNumberMasked || 'XXXXXXXX4589'}
              </div>
              <div className="font-mono text-[#F4D9A0] text-[11px]">
                IFSC: {citizen.bankAccount?.ifsc || 'SBIN0001844'}
              </div>
            </div>

            {/* Withdrawal Form */}
            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#CDBFAC] font-mono mb-1">Transfer Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-[#F4D9A0]">₹</span>
                  <input
                    type="number"
                    min="100"
                    max={citizen.walletBalanceINR}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-[#1F160E] border border-[#F4D9A0]/30 rounded-lg font-mono text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                  />
                </div>
              </div>

              {withdrawError && (
                <div className="p-2.5 bg-red-950/70 border border-red-500/40 rounded-lg text-[11px] text-red-200">
                  {withdrawError}
                </div>
              )}

              {withdrawSuccess && (
                <div className="p-2.5 bg-emerald-950/70 border border-emerald-500/40 rounded-lg text-[11px] text-emerald-200">
                  {withdrawSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={citizen.walletBalanceINR <= 0}
                className="w-full py-2.5 bg-[#F4D9A0] text-[#2C2016] font-bold text-xs rounded-xl hover:bg-[#ffe1a6] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Withdraw to Bank Account</span>
              </button>
            </form>

            <div className="pt-2 text-[10px] text-stone-400 font-mono leading-relaxed border-t border-[#F4D9A0]/10">
              Direct Benefit Transfer processed under RBI guidelines through NPCI Aadhaar Payment Bridge.
            </div>
          </div>
        </div>

        {/* Right: Transactions Ledger (2 Cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#36281C] border border-[#F4D9A0]/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-[#F4D9A0]/15 pb-4">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
                  Statutory Payout &amp; Transfer Ledger
                </h3>
                <p className="text-xs text-[#CDBFAC]">
                  Immutable audit log of vigilance rewards and bank withdrawals.
                </p>
              </div>
              <span className="font-mono text-xs text-[#F4D9A0]">
                {transactions.length} Records
              </span>
            </div>

            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400">
                  No transactions yet. File grievances to earn statutory bounties upon resolution.
                </div>
              ) : (
                transactions.map((tx) => {
                  const isCredit = tx.type === 'credit_bounty';
                  return (
                    <div
                      key={tx.id}
                      className="p-4 bg-[#1F160E] border border-[#F4D9A0]/15 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isCredit ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-[#2C2016] text-[#F4D9A0] border border-[#F4D9A0]/30'
                        }`}>
                          {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs text-[#FBF6EE]">
                            {tx.description}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-mono text-stone-400">
                            <span>{tx.timestamp}</span>
                            <span>Ref: {tx.referenceId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-mono text-sm font-bold ${
                          isCredit ? 'text-emerald-400' : 'text-[#FBF6EE]'
                        }`}>
                          {isCredit ? '+' : '-'}₹{tx.amountINR.toLocaleString()}
                        </div>
                        <span className="text-[10px] font-mono text-stone-400">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
