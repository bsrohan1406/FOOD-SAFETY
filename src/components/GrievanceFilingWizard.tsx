import React, { useState } from 'react';
import { 
  Camera, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Building, 
  Mic, 
  MicOff, 
  Search, 
  Trash2, 
  Plus, 
  ArrowRight, 
  Upload, 
  ShieldCheck, 
  Sparkles,
  Info,
  Clock,
  Layers
} from 'lucide-react';
import { 
  GrievanceType, 
  CapturedEvidence, 
  GrievanceDossier, 
  CitizenProfile, 
  FSSAILicensee 
} from '../types';
import { 
  isValidFSSAILicense, 
  scanStatutoryJurisdiction, 
  calculatePriorityLevel,
  calculateStatutoryBountyINR,
  generateEvidenceHash,
  STATUTORY_KEYWORD_RULES
} from '../utils/foodSafetyRules';
import { LiveCameraCaptureModal } from './LiveCameraCaptureModal';

interface GrievanceFilingWizardProps {
  citizen: CitizenProfile;
  fssaiRegistry: FSSAILicensee[];
  onOpenKycModal: () => void;
  onSubmitGrievance: (dossier: GrievanceDossier) => void;
  onNavigateToPipeline: () => void;
}

export const GrievanceFilingWizard: React.FC<GrievanceFilingWizardProps> = ({
  citizen,
  fssaiRegistry,
  onOpenKycModal,
  onSubmitGrievance,
  onNavigateToPipeline
}) => {
  // Wizard step: 1 (Establishment & Type), 2 (Live Evidence & Invoice), 3 (Violation & Voice), 4 (Statutory Review)
  const [step, setStep] = useState<number>(1);
  const [grievanceType, setGrievanceType] = useState<GrievanceType>('online_delivery');

  // Establishment fields
  const [fssaiInput, setFssaiInput] = useState<string>('11521034000456');
  const [matchedFBO, setMatchedFBO] = useState<FSSAILicensee | null>(null);
  const [establishmentName, setEstablishmentName] = useState<string>('SpiceCraft Cloud Kitchens Pvt Ltd');
  const [establishmentAddress, setEstablishmentAddress] = useState<string>('Unit 4B, Lower Parel Industrial Estate, Mumbai');
  const [platformName, setPlatformName] = useState<string>('Zomato');
  const [orderId, setOrderId] = useState<string>('ZOM-902184-OCT');

  // Evidence photos (requires 2-15)
  const [capturedImages, setCapturedImages] = useState<CapturedEvidence[]>([]);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [currentAnglePrompt, setCurrentAnglePrompt] = useState<string>('Angle 1: Top-down macro focus on foreign matter / food defect');

  // Invoice OCR (optional for delivery)
  const [invoiceImage, setInvoiceImage] = useState<string | null>(null);
  const [invoiceParsed, setInvoiceParsed] = useState<{
    orderNumber?: string;
    billedAmount?: string;
    restaurantName?: string;
    parsedDate?: string;
  } | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);

  // Symptoms & Voice
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(['foreign object', 'plastic fragment', 'rancid oil']);
  const [incidentDescription, setIncidentDescription] = useState<string>(
    'Received chicken korma order with severe rancid smell and sharp metallic/plastic fragments embedded in gravy.'
  );
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>(
    'The oil had a bitter smell and I found hard plastic sharp edges inside the meat gravy.'
  );

  // Wizard validation error
  const [stepError, setStepError] = useState<string | null>(null);

  // FSSAI FoSCoS Auto-Lookup
  const handleFssaiLookup = (licenseNum: string) => {
    setFssaiInput(licenseNum);
    const clean = licenseNum.trim();
    const found = fssaiRegistry.find(r => r.licenseNumber === clean);
    if (found) {
      setMatchedFBO(found);
      setEstablishmentName(found.businessName);
      setEstablishmentAddress(`${found.address}, ${found.district}, ${found.state} - ${found.pincode}`);
    } else {
      setMatchedFBO(null);
    }
  };

  // Preset angles prompts
  const angleSequence = [
    'Angle 1: Top-down macro shot of violation / foreign particle',
    'Angle 2: 45-degree angle showing dish packaging & seal',
    'Angle 3: Wider context shot of dining table / delivery bag with timestamp',
    'Angle 4: Macro close-up of ingredient discoloration or mold'
  ];

  const handleOpenNextCameraAngle = () => {
    const nextIdx = capturedImages.length;
    const prompt = angleSequence[nextIdx] || `Angle ${nextIdx + 1}: Supporting physical perspective`;
    setCurrentAnglePrompt(prompt);
    setIsCameraModalOpen(true);
  };

  const handleAddEvidence = (evd: CapturedEvidence) => {
    setCapturedImages(prev => [...prev, evd]);
  };

  const handleRemoveEvidence = (id: string) => {
    setCapturedImages(prev => prev.filter(img => img.id !== id));
  };

  // Invoice simulated OCR parser
  const handleSimulateInvoiceOcr = () => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      setInvoiceImage('https://images.unsplash.com/photo-1554415707-9e4466bfe0c2?w=600&auto=format&fit=crop&q=80');
      setInvoiceParsed({
        orderNumber: orderId || 'ZOM-902184-OCT',
        billedAmount: '₹648.00',
        restaurantName: establishmentName || 'SpiceCraft Cloud Kitchens',
        parsedDate: new Date().toLocaleDateString('en-IN')
      });
      setIsOcrProcessing(false);
    }, 1200);
  };

  // Voice recording toggle
  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
    } else {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        setVoiceTranscript('I opened the dinner package at 8:30 PM. The gravy was acidic and contained sharp debris.');
      }, 3000);
    }
  };

  const toggleKeyword = (kw: string) => {
    setSelectedKeywords(prev => 
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
  };

  // Pre-calculated statutory review
  const isLicenseExpiredOrMissing = matchedFBO ? matchedFBO.status === 'Expired' : !isValidFSSAILicense(fssaiInput);
  const statutoryPreview = scanStatutoryJurisdiction(
    incidentDescription, 
    selectedKeywords, 
    isLicenseExpiredOrMissing
  );
  const calculatedPriority = calculatePriorityLevel(
    statutoryPreview.severityScore, 
    statutoryPreview.clusteredIncidentCount, 
    isLicenseExpiredOrMissing
  );
  const estimatedBounty = calculateStatutoryBountyINR(35000, statutoryPreview.severityScore);

  // Validate step navigation
  const handleNextStep = () => {
    setStepError(null);

    if (step === 1) {
      if (!establishmentName.trim()) {
        setStepError('Please enter or look up the Food Business Operator name.');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (capturedImages.length < 2) {
        setStepError('Statutory Minimum: You must capture at least 2 multi-angle live photos with camera.');
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (selectedKeywords.length === 0) {
        setStepError('Please select at least one statutory symptom / violation keyword.');
        return;
      }
      if (!incidentDescription.trim() || incidentDescription.length < 20) {
        setStepError('Please provide a descriptive explanation of the food safety violation (minimum 20 characters).');
        return;
      }
      setStep(4);
      return;
    }
  };

  const handleFinalSubmit = () => {
    const trackingNumber = `FSSA-IN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dossierHash = generateEvidenceHash('FSSAI_LEDGER', `${trackingNumber}_${citizen.id}`);

    const newDossier: GrievanceDossier = {
      id: `GRV-${Date.now()}`,
      trackingNumber,
      type: grievanceType,
      filingDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      citizen: {
        fullName: citizen.fullName,
        maskedPhone: citizen.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
        maskedAadhaar: citizen.aadhaarNumberMasked
      },
      establishment: {
        name: establishmentName,
        fssaiLicense: fssaiInput,
        address: establishmentAddress,
        platformName: grievanceType === 'online_delivery' ? platformName : undefined,
        orderId: grievanceType === 'online_delivery' ? orderId : undefined
      },
      violationCategory: statutoryPreview.applicableSections.join(' & ') || 'Food Safety Violation',
      violationKeywords: selectedKeywords,
      incidentDescription,
      voiceNoteTranscript: voiceTranscript,
      evidenceImages: capturedImages,
      invoiceImageUrl: invoiceImage || undefined,
      invoiceParsedData: invoiceParsed || undefined,
      statutoryReview: statutoryPreview,
      priority: calculatedPriority,
      status: statutoryPreview.isJurisdictionValid ? 'submitted' : 'rejected_non_jurisdiction',
      rewardDisbursedINR: 0,
      dossierHash
    };

    onSubmitGrievance(newDossier);
    onNavigateToPipeline();
  };

  // Pre-seed samples if user wants quick test
  const handleLoadDemoViolation = () => {
    handleFssaiLookup('11521034000456');
    setGrievanceType('online_delivery');
    setPlatformName('Zomato');
    setOrderId('ZOM-902184-OCT');
    setCapturedImages([
      {
        id: 'EVD-DEMO-01',
        timestamp: new Date().toISOString(),
        dataUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        angleDescription: 'Angle 1: Top-down macro focus on foreign matter',
        luminance: 142,
        blurScore: 42,
        foodHeuristicConfidence: 94,
        hash: 'SHA256_EVD_DEMO_01',
        passedQualityCheck: true
      },
      {
        id: 'EVD-DEMO-02',
        timestamp: new Date().toISOString(),
        dataUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
        angleDescription: 'Angle 2: 45-degree angle showing container seal',
        luminance: 138,
        blurScore: 48,
        foodHeuristicConfidence: 91,
        hash: 'SHA256_EVD_DEMO_02',
        passedQualityCheck: true
      }
    ]);
    setSelectedKeywords(['foreign object', 'plastic fragment', 'rancid oil']);
    setIncidentDescription('Received chicken korma order with severe rancid smell and sharp metallic/plastic fragments embedded in gravy.');
    setVoiceTranscript('The oil had a bitter smell and I found hard plastic sharp edges inside the meat gravy.');
    handleSimulateInvoiceOcr();
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      
      {/* Wizard Header Bar */}
      <div className="bg-[#36281C] border border-[#F4D9A0]/25 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#F4D9A0] uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4 text-[#C86D24]" />
            <span>FSSAI Public Grievance Protocol &bull; Step {step} of 4</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#FBF6EE]">
            File Official Food Safety Grievance
          </h2>
          <p className="text-xs text-[#CDBFAC] mt-0.5">
            Complainant: <span className="font-semibold text-[#FBF6EE]">{citizen.fullName}</span> (Age: {citizen.age}) &bull; KYC: {citizen.isKycVerified ? 'Verified' : 'Pending'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleLoadDemoViolation}
            className="text-xs font-mono bg-[#1F160E] hover:bg-[#2C2016] text-[#F4D9A0] px-3 py-2 rounded-lg border border-[#F4D9A0]/30 transition-all flex items-center gap-1.5"
            title="Load realistic verified complaint data for demonstration"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C86D24]" />
            <span>Load Demo Case</span>
          </button>

          <button
            type="button"
            onClick={onOpenKycModal}
            className="text-xs font-semibold bg-[#2C2016] hover:bg-[#453424] text-[#FBF6EE] px-3 py-2 rounded-lg border border-[#F4D9A0]/30 transition-all"
          >
            KYC &amp; Bank Settings
          </button>
        </div>
      </div>

      {/* Step Progress Pills */}
      <div className="grid grid-cols-4 gap-2 text-xs font-mono">
        {[
          { num: 1, label: 'FBO & Type' },
          { num: 2, label: 'Live Camera (2-15)' },
          { num: 3, label: 'Symptoms & Voice' },
          { num: 4, label: 'Statutory Review' }
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => {
              if (s.num < step) setStep(s.num);
            }}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              step === s.num
                ? 'bg-[#F4D9A0] text-[#2C2016] font-bold border-[#F4D9A0] shadow'
                : step > s.num
                ? 'bg-[#36281C] text-[#F4D9A0] border-[#F4D9A0]/40'
                : 'bg-[#1F160E]/50 text-[#CDBFAC]/50 border-stone-800'
            }`}
          >
            <span className="block text-[10px] uppercase">Step 0{s.num}</span>
            <span className="font-sans font-medium text-xs truncate">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Error alert */}
      {stepError && (
        <div className="p-3.5 bg-red-950/70 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* STEP 1: Grievance Type & Establishment Lookup */}
      {step === 1 && (
        <div className="bg-[#36281C] border border-[#F4D9A0]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[#F4D9A0]/15 pb-4">
            <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
              1. Incident Context &amp; Food Business Operator (FBO)
            </h3>
            <p className="text-xs text-[#CDBFAC]">
              Specify whether this occurred through an online delivery aggregator or physical dine-in/takeaway.
            </p>
          </div>

          {/* Grievance Type Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setGrievanceType('online_delivery')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                grievanceType === 'online_delivery'
                  ? 'bg-[#2C2016] border-[#F4D9A0] shadow-md ring-1 ring-[#F4D9A0]'
                  : 'bg-[#1F160E]/60 border-[#F4D9A0]/20 hover:border-[#F4D9A0]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#FBF6EE]">Online Food Delivery</span>
                {grievanceType === 'online_delivery' && <CheckCircle2 className="w-4 h-4 text-[#F4D9A0]" />}
              </div>
              <p className="text-xs text-[#CDBFAC] mt-1">
                Zomato, Swiggy, direct cloud kitchens, or platform orders with digital receipt.
              </p>
            </div>

            <div
              onClick={() => setGrievanceType('offline_dine_in')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                grievanceType === 'offline_dine_in'
                  ? 'bg-[#2C2016] border-[#F4D9A0] shadow-md ring-1 ring-[#F4D9A0]'
                  : 'bg-[#1F160E]/60 border-[#F4D9A0]/20 hover:border-[#F4D9A0]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#FBF6EE]">Offline Dine-in / Street Outlet</span>
                {grievanceType === 'offline_dine_in' && <CheckCircle2 className="w-4 h-4 text-[#F4D9A0]" />}
              </div>
              <p className="text-xs text-[#CDBFAC] mt-1">
                Restaurants, sweet shops, bakeries, school cafeterias, or physical stores.
              </p>
            </div>
          </div>

          {/* FSSAI 14-Digit Auto-Lookup Engine */}
          <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/25 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#F4D9A0] flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#C86D24]" />
                <span>FSSAI FoSCoS 14-Digit License Verification</span>
              </label>
              <span className="text-[10px] text-stone-400 font-mono">National Database Sync</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                maxLength={14}
                value={fssaiInput}
                onChange={(e) => handleFssaiLookup(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 11521034000456 (14 digits)"
                className="flex-1 bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3.5 py-2.5 text-sm font-mono text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
              />
              <button
                type="button"
                onClick={() => handleFssaiLookup(fssaiInput)}
                className="px-4 py-2 bg-[#36281C] hover:bg-[#453424] text-[#F4D9A0] border border-[#F4D9A0]/40 rounded-lg text-xs font-mono flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Verify</span>
              </button>
            </div>

            {/* Matched Registry Card */}
            {matchedFBO ? (
              <div className="p-3 bg-[#2C2016] rounded-lg border border-emerald-500/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#FBF6EE]">{matchedFBO.businessName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    matchedFBO.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    Status: {matchedFBO.status}
                  </span>
                </div>
                <p className="text-stone-300 text-[11px]">{matchedFBO.address}, {matchedFBO.district}</p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-[#CDBFAC] pt-1">
                  <span>Hygiene Rating: {matchedFBO.hygieneRating}/5 &starf;</span>
                  <span>License Valid Until: {matchedFBO.validUntil}</span>
                  {matchedFBO.pastViolationsCount > 0 && (
                    <span className="text-red-400 font-bold">{matchedFBO.pastViolationsCount} Prior Violations</span>
                  )}
                </div>
              </div>
            ) : (
              fssaiInput.length === 14 && (
                <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-lg text-[11px] text-amber-200">
                  License not indexed in FoSCoS fast cache. Will be investigated under <strong>Section 31 (Unregistered/Unlicensed Business)</strong> by FSO upon filing.
                </div>
              )
            )}
          </div>

          {/* Establishment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#CDBFAC] font-mono mb-1">Establishment / Brand Name</label>
              <input
                type="text"
                value={establishmentName}
                onChange={(e) => setEstablishmentName(e.target.value)}
                placeholder="e.g. SpiceCraft Cloud Kitchens"
                className="w-full bg-[#1F160E] border border-[#F4D9A0]/25 rounded-lg px-3 py-2 text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
              />
            </div>

            <div>
              <label className="block text-[#CDBFAC] font-mono mb-1">Full Physical Address</label>
              <input
                type="text"
                value={establishmentAddress}
                onChange={(e) => setEstablishmentAddress(e.target.value)}
                placeholder="e.g. Unit 4B, Lower Parel Industrial Estate, Mumbai"
                className="w-full bg-[#1F160E] border border-[#F4D9A0]/25 rounded-lg px-3 py-2 text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
              />
            </div>

            {grievanceType === 'online_delivery' && (
              <>
                <div>
                  <label className="block text-[#CDBFAC] font-mono mb-1">Delivery Platform</label>
                  <select
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full bg-[#1F160E] border border-[#F4D9A0]/25 rounded-lg px-3 py-2 text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                  >
                    <option value="Zomato">Zomato</option>
                    <option value="Swiggy">Swiggy</option>
                    <option value="Direct Website">Direct Restaurant Delivery</option>
                    <option value="EatSure">EatSure</option>
                    <option value="Blinkit">Blinkit / Instant Grocery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#CDBFAC] font-mono mb-1">Platform Order Reference ID</label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. ZOM-902184-OCT"
                    className="w-full bg-[#1F160E] border border-[#F4D9A0]/25 rounded-lg px-3 py-2 text-[#FBF6EE] font-mono focus:outline-none focus:border-[#F4D9A0]"
                  />
                </div>
              </>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-[#F4D9A0] text-[#2C2016] font-bold text-xs rounded-xl hover:bg-[#ffe1a6] transition-all flex items-center gap-2 shadow"
            >
              <span>Next: Live Camera Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Live Camera Evidence (2 to 15 shots) & Invoice OCR */}
      {step === 2 && (
        <div className="bg-[#36281C] border border-[#F4D9A0]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[#F4D9A0]/15 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
                  2. Tamper-Proof Live Physical Evidence
                </h3>
                <p className="text-xs text-[#CDBFAC]">
                  Mandatory: Capture between 2 and 15 multi-angle physical shots via live camera. Gallery uploads are disabled.
                </p>
              </div>
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#1F160E] text-[#F4D9A0] border border-[#F4D9A0]/30">
                {capturedImages.length} / 15 Captured
              </span>
            </div>
          </div>

          {/* Live Capture Action Area */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/20">
            <div>
              <span className="block text-xs font-bold text-[#FBF6EE]">Live Camera Viewfinder Gate</span>
              <span className="text-[11px] text-[#CDBFAC]">
                Filters luminance (&lt;35 / &gt;240) and Laplacian motion blur in real time.
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenNextCameraAngle}
              className="px-5 py-2.5 bg-[#C86D24] text-white font-bold text-xs rounded-xl hover:bg-[#d97c31] transition-all flex items-center gap-2 shadow"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Live Photo ({capturedImages.length + 1})</span>
            </button>
          </div>

          {/* Captured Photos Grid */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#F4D9A0] block">
              Captured Evidence Registry ({capturedImages.length} Shots)
            </label>

            {capturedImages.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-[#F4D9A0]/20 rounded-xl text-center space-y-2">
                <Camera className="w-10 h-10 text-stone-500 mx-auto" />
                <p className="text-xs text-[#CDBFAC]">No photos captured yet.</p>
                <p className="text-[11px] text-stone-400">
                  Click the button above to capture at least 2 distinct angles of the defect.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {capturedImages.map((evd, idx) => (
                  <div 
                    key={evd.id} 
                    className="bg-[#2C2016] border border-[#F4D9A0]/25 rounded-xl overflow-hidden shadow relative group"
                  >
                    <div className="aspect-video w-full bg-black overflow-hidden relative">
                      <img 
                        src={evd.dataUrl} 
                        alt={evd.angleDescription} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(evd.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        title="Delete this capture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-3 text-[11px] space-y-1">
                      <div className="font-semibold text-[#FBF6EE] truncate">
                        {evd.angleDescription}
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[#F4D9A0]">
                        <span>Sharpness: {evd.blurScore}</span>
                        <span>Food Conf: {evd.foodHeuristicConfidence}%</span>
                      </div>
                      <div className="text-[9px] font-mono text-stone-400 truncate">
                        Hash: {evd.hash}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Optional Order Invoice OCR Review */}
          {grievanceType === 'online_delivery' && (
            <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#F4D9A0] block">
                    Order Invoice OCR Review (Optional)
                  </span>
                  <span className="text-[11px] text-[#CDBFAC]">
                    Extracts restaurant name and transaction timestamp. Does not auto-reject on imperfect OCR.
                  </span>
                </div>

                {!invoiceImage && (
                  <button
                    type="button"
                    onClick={handleSimulateInvoiceOcr}
                    disabled={isOcrProcessing}
                    className="px-3.5 py-1.5 bg-[#36281C] hover:bg-[#453424] text-[#FBF6EE] border border-[#F4D9A0]/30 rounded-lg text-xs font-mono flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#F4D9A0]" />
                    <span>{isOcrProcessing ? 'Reading Receipt...' : 'Attach Delivery Bill'}</span>
                  </button>
                )}
              </div>

              {invoiceParsed && (
                <div className="p-3 bg-[#2C2016] rounded-lg border border-[#F4D9A0]/25 text-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-emerald-400 font-mono text-[10px] block font-bold">
                      OCR EXTRACTION VERIFIED
                    </span>
                    <p className="text-[#FBF6EE] font-semibold">{invoiceParsed.restaurantName}</p>
                    <p className="text-stone-400 text-[11px]">
                      Bill: {invoiceParsed.billedAmount} &bull; Order #{invoiceParsed.orderNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceImage(null);
                      setInvoiceParsed(null);
                    }}
                    className="text-xs text-stone-400 hover:text-red-400 underline font-mono"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-[#2C2016] text-[#CDBFAC] font-medium text-xs rounded-xl hover:text-[#FBF6EE]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-[#F4D9A0] text-[#2C2016] font-bold text-xs rounded-xl hover:bg-[#ffe1a6] transition-all flex items-center gap-2 shadow"
            >
              <span>Next: Symptoms &amp; Voice Note</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Symptoms, Keywords & Voice Recording */}
      {step === 3 && (
        <div className="bg-[#36281C] border border-[#F4D9A0]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[#F4D9A0]/15 pb-4">
            <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
              3. Statutory Violation Symptoms &amp; Testimony
            </h3>
            <p className="text-xs text-[#CDBFAC]">
              Select all legal violation keywords matching your evidence. FSSAI statutory scanner correlates these tags.
            </p>
          </div>

          {/* Violation Keyword Chips */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#F4D9A0] block">
              Statutory Symptom Tags (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'foreign object',
                'plastic fragment',
                'glass shards',
                'cockroach',
                'dead insect',
                'rancid oil',
                'foul smell',
                'fungus',
                'moldy bread',
                'sour curd',
                'adulterated paneer',
                'expired batch',
                'missing fssai logo'
              ].map((kw) => {
                const isSelected = selectedKeywords.includes(kw);
                return (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => toggleKeyword(kw)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-[#C86D24] text-white border-[#C86D24] shadow'
                        : 'bg-[#1F160E] text-[#CDBFAC] border-[#F4D9A0]/20 hover:border-[#F4D9A0]/50'
                    }`}
                  >
                    {kw}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Testimony */}
          <div>
            <label className="block text-xs font-mono text-[#F4D9A0] mb-1">
              Detailed Citizen Incident Description
            </label>
            <textarea
              rows={4}
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              placeholder="Describe the condition of food, odor, taste anomaly, packaging condition, and any health symptoms experienced..."
              className="w-full bg-[#1F160E] border border-[#F4D9A0]/25 rounded-xl p-3.5 text-xs text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
            />
          </div>

          {/* Voice Testimony Note */}
          <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#F4D9A0]" />
                <span className="text-xs font-mono uppercase text-[#FBF6EE]">
                  Voice Note Statement (Optional)
                </span>
              </div>

              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#36281C] text-[#F4D9A0] border border-[#F4D9A0]/30 hover:bg-[#453424]'
                }`}
              >
                {isRecordingVoice ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Recording... (Click to Finish)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Record Voice Note</span>
                  </>
                )}
              </button>
            </div>

            {voiceTranscript && (
              <div className="p-3 bg-[#2C2016] rounded-lg border border-[#F4D9A0]/15 text-xs">
                <span className="text-[10px] font-mono text-[#F4D9A0] uppercase block">
                  Automated Speech Transcription:
                </span>
                <p className="text-stone-300 italic mt-0.5">"{voiceTranscript}"</p>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-[#2C2016] text-[#CDBFAC] font-medium text-xs rounded-xl hover:text-[#FBF6EE]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-[#F4D9A0] text-[#2C2016] font-bold text-xs rounded-xl hover:bg-[#ffe1a6] transition-all flex items-center gap-2 shadow"
            >
              <span>Next: Statutory Legal Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Real-time Statutory Review & Final Submission */}
      {step === 4 && (
        <div className="bg-[#36281C] border border-[#F4D9A0]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[#F4D9A0]/15 pb-4">
            <h3 className="font-editorial text-xl font-bold text-[#FBF6EE]">
              4. FSSA 2006 Statutory Law Pre-Screening
            </h3>
            <p className="text-xs text-[#CDBFAC]">
              Autonomous legal jurisdiction check before logging into the National Enforcement Docket.
            </p>
          </div>

          {/* Pre-Screening Result Banner */}
          <div className={`p-5 rounded-xl border space-y-3 ${
            statutoryPreview.isJurisdictionValid
              ? 'bg-[#1F160E] border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/50 border-red-500/40 text-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#F4D9A0]" />
                <span className="font-bold text-sm uppercase tracking-wider font-mono">
                  {statutoryPreview.isJurisdictionValid
                    ? 'Admissible under Food Safety & Standards Act, 2006'
                    : 'Non-Jurisdictional Consumer Issue'}
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                calculatedPriority === 'Critical'
                  ? 'bg-rose-600/30 text-rose-300'
                  : 'bg-amber-600/30 text-amber-200'
              }`}>
                Priority: {calculatedPriority}
              </span>
            </div>

            <p className="text-xs text-[#FBF6EE] leading-relaxed">
              {statutoryPreview.summaryRationale}
            </p>

            {statutoryPreview.applicableSections.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {statutoryPreview.applicableSections.map((sec) => (
                  <span
                    key={sec}
                    className="px-2.5 py-1 rounded bg-[#36281C] border border-[#F4D9A0]/30 text-[#F4D9A0] text-xs font-mono"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dossier Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/15 space-y-2">
              <span className="font-mono text-[#F4D9A0] uppercase block text-[10px]">Establishment Under Audit</span>
              <div className="font-bold text-sm text-[#FBF6EE]">{establishmentName}</div>
              <p className="text-[#CDBFAC]">{establishmentAddress}</p>
              <div className="text-stone-400 font-mono text-[11px] pt-1">
                FSSAI License: {fssaiInput}
              </div>
            </div>

            <div className="p-4 bg-[#1F160E] rounded-xl border border-[#F4D9A0]/15 space-y-2">
              <span className="font-mono text-[#F4D9A0] uppercase block text-[10px]">Citizen Vigilance Payout</span>
              <div className="font-bold text-sm text-[#F4D9A0]">
                Up to ₹{estimatedBounty.toLocaleString()} INR Statutory Reward
              </div>
              <p className="text-[#CDBFAC]">
                Credited directly to citizen wallet upon on-site FSO compounding settlement under Section 69.
              </p>
              <div className="text-emerald-400 font-mono text-[11px] pt-1">
                Bank Linked: {citizen.bankAccount?.bankName || 'State Bank of India'}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-[#2C2016] text-[#CDBFAC] font-medium text-xs rounded-xl hover:text-[#FBF6EE]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-8 py-3 bg-gradient-to-r from-[#F4D9A0] to-[#D4B776] text-[#2C2016] font-bold text-sm rounded-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-lg"
            >
              <ShieldCheck className="w-5 h-5 text-[#C86D24]" />
              <span>Submit to National Enforcement Docket</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Camera Viewfinder Modal */}
      <LiveCameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleAddEvidence}
        angleTarget={currentAnglePrompt}
        existingCount={capturedImages.length}
      />

    </div>
  );
};
