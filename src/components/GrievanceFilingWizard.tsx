import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Camera, 
  MapPin, 
  Mic, 
  MicOff, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Building2, 
  Sparkles, 
  Search, 
  ExternalLink,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CitizenUser, IssueType, GrievanceImage, Grievance, FSSAIBusinessRecord } from '../types';
import { MOCK_FSSAI_DATABASE, MOCK_OFFICIALS } from '../data/mockDatabase';
import { LiveCameraCaptureModal } from './LiveCameraCaptureModal';
import { 
  scanFSSAIJurisdiction, 
  generateGrievanceHash, 
  calculateGrievancePriority, 
  calculateCitizenReward 
} from '../utils/foodSafetyRules';

interface GrievanceFilingWizardProps {
  citizen: CitizenUser;
  onOpenCitizenModal: () => void;
  onSubmitGrievance: (grievance: Grievance) => void;
  existingGrievances: Grievance[];
}

export const GrievanceFilingWizard: React.FC<GrievanceFilingWizardProps> = ({
  citizen,
  onOpenCitizenModal,
  onSubmitGrievance,
  existingGrievances
}) => {
  // Wizard State
  const [issueType, setIssueType] = useState<IssueType>('online');
  const [businessName, setBusinessName] = useState('Royal Spice Kitchen & Biryani');
  const [selectedFSSAI, setSelectedFSSAI] = useState<FSSAIBusinessRecord | null>(MOCK_FSSAI_DATABASE[0]);
  const [keywordSummary, setKeywordSummary] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  
  // Invoice state (Online mode)
  const [invoiceUploaded, setInvoiceUploaded] = useState(false);
  const [invoiceFileName, setInvoiceFileName] = useState('swiggy_order_invoice_88291.pdf');
  const [invoiceOcrText, setInvoiceOcrText] = useState('Vendor: Royal Spice Kitchen | Inv #SW-88291 | Total: INR 540 | Date: 25 Oct 2026');
  const [invoiceOcrConfidence, setInvoiceOcrConfidence] = useState<'CLEAR' | 'UNCLEAR_SENT_FOR_REVIEW'>('CLEAR');
  
  // Images (Min 2, Max 15)
  const [images, setImages] = useState<GrievanceImage[]>([]);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  
  // Geolocation
  const [location, setLocation] = useState({
    latitude: 12.9716,
    longitude: 77.6412,
    formattedAddress: 'HSR Layout Sector 2, 27th Main Rd, Bengaluru, Karnataka - 560102',
    city: 'Bengaluru'
  });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  // Voice Note
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  
  // Warnings from Business or Officials
  const [hasFacedWarnings, setHasFacedWarnings] = useState(false);
  const [warningDetails, setWarningDetails] = useState('');

  // Live Jurisdiction Pre-Check
  const jurisdictionCheck = scanFSSAIJurisdiction(keywordSummary + ' ' + detailedDescription);

  // Business Lookup Handler
  const handleBusinessSelect = (name: string) => {
    setBusinessName(name);
    const found = MOCK_FSSAI_DATABASE.find(b => b.businessName.toLowerCase() === name.toLowerCase()) || {
      licenseNumber: 'UNREGISTERED-PETTY-FOOD',
      businessName: name,
      businessType: 'Unregistered Food Business Operator',
      address: location.formattedAddress,
      state: 'Karnataka',
      pincode: '560102',
      licenseStatus: 'NOT_FOUND',
      issueDate: 'N/A',
      expiryDate: 'N/A',
      lastLabInspectionDate: 'Never Inspected',
      labResultSummary: 'No active FSSAI registration found in central database. Operating unlawfully.',
      hygieneRatingStars: 1,
      activeWarningsCount: 1
    };
    setSelectedFSSAI(found);
  };

  const handleFetchCurrentLocation = () => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLocation({
            latitude: Number(pos.coords.latitude.toFixed(4)),
            longitude: Number(pos.coords.longitude.toFixed(4)),
            formattedAddress: `Lat ${pos.coords.latitude.toFixed(4)}, Long ${pos.coords.longitude.toFixed(4)}, Indiranagar Zone, Bengaluru`,
            city: 'Bengaluru'
          });
          setIsFetchingLocation(false);
        },
        () => {
          setIsFetchingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsFetchingLocation(false);
    }
  };

  const handleVoiceToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setVoiceRecorded(false);
      setVoiceDuration(0);
      const timer = setInterval(() => {
        setVoiceDuration(prev => {
          if (prev >= 15) {
            clearInterval(timer);
            setIsRecordingVoice(false);
            setVoiceRecorded(true);
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecordingVoice(false);
      setVoiceRecorded(true);
    }
  };

  const handleAddCapturedImage = (image: GrievanceImage) => {
    if (images.length >= 15) {
      alert('Statutory requirement: Maximum 15 photos allowed per grievance under statutory protocol.');
      return;
    }
    setImages(prev => [...prev, image]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!citizen.isVerified) {
      onOpenCitizenModal();
      return;
    }

    if (images.length < 2) {
      alert('Statutory requirement: Please capture at least 2 live camera photos from different angles (e.g. Overview & Macro close-up) before submitting.');
      return;
    }

    if (issueType === 'online' && !invoiceUploaded) {
      alert('Online grievances require an order invoice. Please attach the order receipt or invoice.');
      return;
    }

    // Hash calculation and duplicate detection
    const grievanceHash = generateGrievanceHash(businessName, keywordSummary, location.city);
    const existingDuplicate = existingGrievances.find(g => g.hashCode === grievanceHash && g.status !== 'settled');
    
    // Cluster hotspot calculation (how many distinct reports in short window)
    const clusterCount = existingGrievances.filter(g => g.businessName.toLowerCase() === businessName.toLowerCase()).length + 1;

    // FSSAI license check
    const fssaiRecord = selectedFSSAI || MOCK_FSSAI_DATABASE[0];
    const isLicenseExpiredOrMissing = fssaiRecord.licenseStatus === 'EXPIRED' || fssaiRecord.licenseStatus === 'NOT_FOUND' || fssaiRecord.licenseStatus === 'SUSPENDED';

    // Priority computation
    const calculatedPriority = calculateGrievancePriority({
      jurisdictionSection: jurisdictionCheck.citedFSSAISection,
      fssaiLicenseStatus: fssaiRecord.licenseStatus,
      clusterCount,
      hasBusinessThreatenedCitizen: hasFacedWarnings,
      issueType
    });

    const rewardINR = calculateCitizenReward(calculatedPriority);
    const assignedOfficer = MOCK_OFFICIALS[0];

    const newGrievance: Grievance = {
      id: `SIH-GRV-${Date.now().toString().slice(-6)}`,
      hashCode: grievanceHash,
      userId: citizen.id,
      userFullName: `${citizen.firstName} ${citizen.lastName}`,
      userMobile: citizen.mobile,
      createdAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      issueType,
      invoiceUrl: issueType === 'online' ? invoiceFileName : undefined,
      invoiceOcrText: issueType === 'online' ? invoiceOcrText : undefined,
      invoiceNeedsManualReview: invoiceOcrConfidence === 'UNCLEAR_SENT_FOR_REVIEW',
      keywordSummary,
      detailedDescription,
      voiceDurationSeconds: voiceRecorded ? voiceDuration : undefined,
      images,
      location,
      businessName,
      fssaiDetails: fssaiRecord,
      hasFSSAIWarningOrExpired: isLicenseExpiredOrMissing,
      hasFacedBusinessWarnings: hasFacedWarnings,
      businessWarningDetails: hasFacedWarnings ? warningDetails : undefined,
      verificationState: {
        structuralFilterPassed: true,
        jurisdictionVerified: jurisdictionCheck.jurisdictionVerified,
        jurisdictionSectionCited: jurisdictionCheck.citedFSSAISection,
        jurisdictionVerdictNotes: jurisdictionCheck.verdictDescription,
        isCustomerServiceOnly: jurisdictionCheck.isCustomerServiceOnly,
        isDuplicate: !!existingDuplicate,
        duplicateOfId: existingDuplicate?.id,
        clusterHotspotCount: clusterCount,
        assignedOfficerId: assignedOfficer.id,
        assignedOfficerName: assignedOfficer.name
      },
      priority: calculatedPriority,
      status: !jurisdictionCheck.jurisdictionVerified && jurisdictionCheck.isCustomerServiceOnly
        ? 'rejected_jurisdiction'
        : 'forwarded_to_officer',
      rewardStatus: 'pending_settlement',
      rewardAmountINR: rewardINR
    };

    onSubmitGrievance(newGrievance);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 60-30-10 Color Scheme Header (60% Mocha Brown, 30% Champagne Gold, 10% Burnt Amber & White) */}
      <div className="bg-gradient-to-br from-[#2C2016] via-[#5B4632] to-[#36281C] rounded-2xl p-6 sm:p-8 text-[#FBF6EE] shadow-xl mb-8 border border-[#F4D9A0]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2C2016] text-[#C86D24] font-mono text-xs px-2.5 py-1 rounded-md uppercase font-bold tracking-wider mb-2 border border-[#C86D24]/50">
              SIH Problem Statement · Food Tech Pipeline
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FBF6EE]">
              Public to Official Food Safety Grievance Filing
            </h1>
            <p className="text-sm text-[#F4D9A0]/85 mt-1 max-w-2xl">
              Dual-ended statutory complaint portal under the Food Safety and Standards Act 2006. 
              Submissions undergo live structural image filtering, automated FSSAI registry cross-check, and tamper-proof officer assignment.
            </p>
          </div>

          <div className="bg-[#2C2016]/95 backdrop-blur-md p-4 rounded-xl border border-[#F4D9A0]/30 text-xs sm:text-right shrink-0">
            <span className="text-[#FBF6EE]/60 block">Authenticated Citizen:</span>
            <span className="text-[#FBF6EE] font-bold text-sm block">
              {citizen.firstName} {citizen.lastName}
            </span>
            <span className="text-[#F4D9A0] font-mono block text-[11px]">
              {citizen.mobile} · Age: 28 (Verified)
            </span>
            <button
              type="button"
              onClick={onOpenCitizenModal}
              className="mt-2 text-xs font-semibold text-[#2C2016] bg-[#F4D9A0] hover:bg-[#F9E6BD] px-3 py-1 rounded border border-[#F4D9A0] cursor-pointer"
            >
              Update Credentials
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Step 1: Issue Type (Online vs Offline) */}
        <section className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 shadow-md text-[#FBF6EE]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#FBF6EE] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] text-xs flex items-center justify-center font-bold border border-[#F4D9A0]/40">1</span>
              Incident Nature & Order Channel
            </h2>
            <span className="text-xs text-[#C86D24] font-semibold">Mandatory Step</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setIssueType('online');
                setInvoiceUploaded(true);
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                issueType === 'online'
                  ? 'border-[#F4D9A0] bg-[#5B4632]/50'
                  : 'border-[#F4D9A0]/20 bg-[#2C2016] hover:border-[#F4D9A0]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#FBF6EE]">Online Order Issue</span>
                {issueType === 'online' && <CheckCircle2 className="w-5 h-5 text-[#F4D9A0]" />}
              </div>
              <p className="text-xs text-[#FBF6EE]/70 mt-1">
                Zomato, Swiggy, Blinkit, Cloud Kitchen, or online portal food deliveries. Requires order invoice upload.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setIssueType('offline')}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                issueType === 'offline'
                  ? 'border-[#F4D9A0] bg-[#5B4632]/50'
                  : 'border-[#F4D9A0]/20 bg-[#2C2016] hover:border-[#F4D9A0]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#FBF6EE]">Offline / Dine-in Issue</span>
                {issueType === 'offline' && <CheckCircle2 className="w-5 h-5 text-[#F4D9A0]" />}
              </div>
              <p className="text-xs text-[#FBF6EE]/70 mt-1">
                Dine-in restaurant, sweet shop, grocery supermarket, dairy, street vendor, or catering event.
              </p>
            </button>
          </div>

          {/* If Online: Order Invoice Uploader with OCR Tolerance Note */}
          {issueType === 'online' && (
            <div className="mt-6 p-4 rounded-xl bg-[#2C2016] border border-[#F4D9A0]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#F4D9A0]" />
                  <span className="text-sm font-bold text-[#FBF6EE]">Order Invoice Upload (*)</span>
                </div>
                <span className="text-[11px] bg-[#5B4632] text-[#F4D9A0] px-2 py-0.5 rounded font-mono border border-[#F4D9A0]/40">
                  OCR Engine Active
                </span>
              </div>

              {/* Informative Callout about Lenient OCR */}
              <div className="bg-[#36281C] p-3 rounded-lg border border-[#F4D9A0]/20 text-xs text-[#FBF6EE]/80 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#F4D9A0] shrink-0 mt-0.5" />
                <span>
                  <strong>Lenient OCR Policy:</strong> Don't worry if your invoice has wrinkles or imperfect resolution. 
                  Unclear cases are automatically queued for official human manual verification rather than rejected.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#2C2016] rounded-lg border border-dashed border-[#F4D9A0]/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#5B4632] text-[#F4D9A0] flex items-center justify-center font-mono text-xs font-bold border border-[#F4D9A0]/30">
                    PDF
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#FBF6EE] block">{invoiceFileName}</span>
                    <span className="text-[11px] font-mono text-[#F4D9A0]/80 block">{invoiceOcrText}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={invoiceOcrConfidence}
                    onChange={e => setInvoiceOcrConfidence(e.target.value as any)}
                    className="bg-[#36281C] border border-[#F4D9A0]/30 text-xs text-[#FBF6EE] px-2.5 py-1.5 rounded focus:outline-none"
                  >
                    <option value="CLEAR">OCR Status: Sharp / Clear</option>
                    <option value="UNCLEAR_SENT_FOR_REVIEW">OCR Status: Unclear (Sent for Review)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setInvoiceUploaded(true)}
                    className="text-xs bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] font-semibold px-3 py-1.5 rounded cursor-pointer"
                  >
                    Replace File
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Step 2: Food Business & FSSAI Registry Auto-Cross Check */}
        <section className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 shadow-md text-[#FBF6EE]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#FBF6EE] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] text-xs flex items-center justify-center font-bold border border-[#F4D9A0]/40">2</span>
              Target Food Business & FSSAI Registry Details
            </h2>
            <span className="text-xs text-[#F4D9A0] font-semibold">Real-Time Registry Query</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                Food Business Name *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={e => handleBusinessSelect(e.target.value)}
                  placeholder="Enter restaurant or vendor name..."
                  className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
                />
              </div>

              {/* Quick Select Popular Samples */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                <span className="text-[#FBF6EE]/60">Quick Test Databases:</span>
                {MOCK_FSSAI_DATABASE.map((b, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleBusinessSelect(b.businessName)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
                      businessName === b.businessName
                        ? 'bg-[#F4D9A0] text-[#2C2016] border-[#F4D9A0] font-bold'
                        : 'bg-[#2C2016] text-[#FBF6EE]/70 border-[#F4D9A0]/20 hover:text-white'
                    }`}
                  >
                    {b.businessName} {b.licenseStatus === 'EXPIRED' ? '(⚠️ Expired)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* FSSAI Live Record Card */}
            {selectedFSSAI && (
              <div className={`p-4 rounded-xl border text-xs ${
                selectedFSSAI.licenseStatus === 'ACTIVE'
                  ? 'bg-[#2C2016] border-[#F4D9A0]/40 text-[#FBF6EE]/90'
                  : 'bg-[#401f18] border-[#C86D24] text-[#FBF6EE]'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4D9A0]/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#F4D9A0]" />
                    <span className="font-bold text-sm text-[#FBF6EE]">{selectedFSSAI.businessName}</span>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      selectedFSSAI.licenseStatus === 'ACTIVE'
                        ? 'bg-[#5B4632] text-[#F4D9A0] border border-[#F4D9A0]/40'
                        : 'bg-[#C86D24] text-white'
                    }`}>
                      License: {selectedFSSAI.licenseStatus}
                    </span>
                  </div>

                  <span className="font-mono text-[#F4D9A0] text-[11px]">
                    FSSAI Lic #: {selectedFSSAI.licenseNumber}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div>
                    <span className="text-[#FBF6EE]/60 block">Category:</span>
                    <span className="text-[#FBF6EE] font-medium">{selectedFSSAI.businessType}</span>
                  </div>
                  <div>
                    <span className="text-[#FBF6EE]/60 block">Validity / Renewal:</span>
                    <span className={`font-mono font-semibold ${
                      selectedFSSAI.licenseStatus === 'EXPIRED' ? 'text-[#C86D24]' : 'text-[#F4D9A0]'
                    }`}>
                      {selectedFSSAI.expiryDate} {selectedFSSAI.licenseStatus === 'EXPIRED' ? '(OVERDUE)' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#FBF6EE]/60 block">FSSAI Hygiene Rating:</span>
                    <span className="text-[#F4D9A0] font-bold">
                      {'★'.repeat(selectedFSSAI.hygieneRatingStars)}{'☆'.repeat(5 - selectedFSSAI.hygieneRatingStars)}
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-[#F4D9A0]/20 text-[11px]">
                  <span className="text-[#F4D9A0] font-semibold">Last Laboratory Inspection: </span>
                  <span>{selectedFSSAI.labResultSummary}</span>
                </div>

                {selectedFSSAI.licenseStatus === 'EXPIRED' && (
                  <div className="mt-3 p-2 bg-[#C86D24]/30 border border-[#C86D24] rounded text-[#FBF6EE] text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#C86D24] shrink-0" />
                    <span>
                      Critical Statutory Trigger: Target food business is operating with an expired FSSAI license. 
                      This grievance will be escalated directly to Higher Officials with maximum priority!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Step 3: Location (Maps / GPS coordinates) */}
        <section className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 shadow-md text-[#FBF6EE]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#FBF6EE] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] text-xs flex items-center justify-center font-bold border border-[#F4D9A0]/40">3</span>
              Incident Physical Location
            </h2>
            <button
              type="button"
              onClick={handleFetchCurrentLocation}
              disabled={isFetchingLocation}
              className="text-xs bg-[#2C2016] border border-[#F4D9A0]/40 text-[#F4D9A0] hover:bg-[#5B4632] px-3 py-1 rounded flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F4D9A0]" />
              {isFetchingLocation ? 'Fetching GPS...' : 'Fetch Device GPS (Google Maps)'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                Resolved Street Address & Landmark
              </label>
              <input
                type="text"
                required
                value={location.formattedAddress}
                onChange={e => setLocation({ ...location, formattedAddress: e.target.value })}
                className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                Jurisdiction City / Ward
              </label>
              <input
                type="text"
                required
                value={location.city}
                onChange={e => setLocation({ ...location, city: e.target.value })}
                className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
              />
            </div>
          </div>

          <div className="mt-2 text-[11px] text-[#F4D9A0]/70 font-mono">
            High Precision Geotag: {location.latitude}° N, {location.longitude}° E · Auto-routes to Designated Officer of South Zone
          </div>
        </section>

        {/* Step 4: Multi-Angle Camera Capture (Min 2, Max 15) */}
        <section className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 shadow-md text-[#FBF6EE]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#FBF6EE] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] text-xs flex items-center justify-center font-bold border border-[#F4D9A0]/40">4</span>
                Multi-Angle Photo Evidence (Min 2 · Max 15)
              </h2>
              <p className="text-xs text-[#F4D9A0]/80 mt-0.5">
                Saved gallery uploads blocked. Live camera snapshot only to prevent counterfeit or AI-generated media.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCameraModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-[#2C2016] bg-[#F4D9A0] hover:bg-[#F9E6BD] rounded-lg transition-colors flex items-center gap-2 shadow-md border border-[#F4D9A0] cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Open Live Shutter ({images.length}/15 captured)
            </button>
          </div>

          {/* Captured Images Grid */}
          {images.length === 0 ? (
            <div className="border-2 border-dashed border-[#F4D9A0]/30 rounded-xl p-8 text-center text-[#FBF6EE]/60 bg-[#2C2016]">
              <Camera className="w-10 h-10 text-[#F4D9A0] mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold text-[#FBF6EE]">No photos captured yet</p>
              <p className="text-xs text-[#FBF6EE]/70 max-w-md mx-auto mt-1">
                Click "Open Live Shutter" to capture at least 2 photos from different angles. 
                Our structural filter evaluates clarity, blur, brightness, and computer vision food object presence.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={img.id} className="relative rounded-xl overflow-hidden border border-[#F4D9A0]/30 bg-[#2C2016] group">
                  <div className="aspect-video w-full bg-black overflow-hidden">
                    <img
                      src={img.dataUrl}
                      alt={img.angleLabel}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FBF6EE] truncate">{img.angleLabel}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="text-[#C86D24] hover:text-[#e07a2a] p-1 cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
                      <span className="bg-[#5B4632] text-[#F4D9A0] px-1.5 py-0.5 rounded font-mono border border-[#F4D9A0]/30">
                        ✓ Structural PASS
                      </span>
                      <span className="bg-[#5B4632] text-[#F4D9A0] px-1.5 py-0.5 rounded font-mono border border-[#F4D9A0]/30">
                        CV: Food Object
                      </span>
                      <span className="text-[#FBF6EE]/50 font-mono">
                        Angle #{idx + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length > 0 && images.length < 2 && (
            <p className="text-[#C86D24] text-xs mt-3 flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              Please capture at least 1 more photo from a different angle to satisfy the minimum 2-photo statutory requirement.
            </p>
          )}
        </section>

        {/* Step 5: Keyword Summary, Detailed Description & Voice Note */}
        <section className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 shadow-md text-[#FBF6EE]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#FBF6EE] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] text-xs flex items-center justify-center font-bold border border-[#F4D9A0]/40">5</span>
              Grievance Keyword, Description & Voice Note
            </h2>
            <span className="text-xs text-[#F4D9A0] font-semibold">FSSAI Legal Scanner</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                Summary Keyword / One-line Sentence (Must match the photo) *
              </label>
              <input
                type="text"
                required
                value={keywordSummary}
                onChange={e => setKeywordSummary(e.target.value)}
                placeholder="e.g. Dead cockroach found inside gravy container / Altered expiry date on milk packet"
                className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#FBF6EE]/80 mb-1">
                Detailed Description of the Problem Faced *
              </label>
              <textarea
                rows={3}
                required
                value={detailedDescription}
                onChange={e => setDetailedDescription(e.target.value)}
                placeholder="Provide complete facts: time of consumption, foreign particles noticed, smell or texture defects, symptoms of nausea/food poisoning, lack of hygiene..."
                className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-sm text-[#FBF6EE] focus:outline-none focus:border-[#F4D9A0]"
              />
            </div>

            {/* Voice Description Component */}
            <div className="p-4 rounded-xl bg-[#2C2016] border border-[#F4D9A0]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#F4D9A0]" />
                  <span className="text-xs font-bold text-[#FBF6EE]">Voice Description Record (Optional)</span>
                </div>
                <p className="text-[11px] text-[#FBF6EE]/70 mt-0.5">
                  Record an official audio statement. Transcribed and attached directly to the case dossier.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isRecordingVoice && (
                  <span className="flex items-center gap-2 text-xs text-[#C86D24] font-mono font-bold animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C86D24]" />
                    Recording: {voiceDuration}s / 15s
                  </span>
                )}
                {voiceRecorded && (
                  <span className="text-xs text-[#F4D9A0] font-medium">
                    ✓ Voice Note Saved ({voiceDuration}s)
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isRecordingVoice
                      ? 'bg-[#C86D24] text-white'
                      : 'bg-[#F4D9A0] text-[#2C2016] hover:bg-[#F9E6BD]'
                  }`}
                >
                  {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  {isRecordingVoice ? 'Stop Recording' : voiceRecorded ? 'Re-record Audio' : 'Record Voice Note'}
                </button>
              </div>
            </div>

            {/* Live Legal Jurisdiction Scanner Feedback Box */}
            {(keywordSummary || detailedDescription) && (
              <div className={`p-4 rounded-xl border text-xs ${
                jurisdictionCheck.jurisdictionVerified
                  ? 'bg-[#2C2016] border-[#F4D9A0]/50 text-[#F4D9A0]'
                  : 'bg-[#401f18] border-[#C86D24] text-[#FBF6EE]'
              }`}>
                <div className="flex items-center justify-between font-bold text-sm">
                  <span className="flex items-center gap-2">
                    {jurisdictionCheck.jurisdictionVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-[#F4D9A0]" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#C86D24]" />
                    )}
                    FSSA 2006 Statutory Assessment: {jurisdictionCheck.verdictTitle}
                  </span>
                  {jurisdictionCheck.citedFSSAISection && (
                    <span className="font-mono text-xs bg-[#2C2016] px-2 py-0.5 rounded text-[#C86D24] border border-[#C86D24]/50">
                      {jurisdictionCheck.citedFSSAISection}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs opacity-90 text-[#FBF6EE]">
                  {jurisdictionCheck.verdictDescription}
                </p>

                {jurisdictionCheck.isCustomerServiceOnly && (
                  <p className="mt-2 text-[#C86D24] font-semibold text-[11px] bg-[#2C2016] p-2 rounded border border-[#C86D24]/40">
                    ⚠️ Notice: This appears to be a delivery delay or commercial customer service dispute. 
                    Pure delivery complaints do not fall under the statutory jurisdiction of Food Safety laws (Section 26-59 of FSSA 2006).
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Step 6: Warning & Intimidation Inquiry */}
        <section className="bg-[#36281C] border border-[#F4D9A0]/30 rounded-2xl p-6 shadow-md text-[#FBF6EE]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#FBF6EE] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#5B4632] text-[#F4D9A0] text-xs flex items-center justify-center font-bold border border-[#F4D9A0]/40">6</span>
              Warnings & Intimidation Inquiry
            </h2>
            <span className="text-xs text-[#C86D24] font-semibold">Whistleblower Protection</span>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#FBF6EE]/80">
              Have you faced any warnings, threats, harassment, or bribes from the food business operator or higher officials?
            </p>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="warningsCheck"
                  checked={hasFacedWarnings === true}
                  onChange={() => setHasFacedWarnings(true)}
                  className="accent-[#F4D9A0]"
                />
                <span className="text-[#C86D24] font-bold">Yes, I faced threats / intimidation</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="warningsCheck"
                  checked={hasFacedWarnings === false}
                  onChange={() => setHasFacedWarnings(false)}
                  className="accent-[#F4D9A0]"
                />
                <span>No warnings or threats</span>
              </label>
            </div>

            {hasFacedWarnings && (
              <div className="mt-3 p-3 bg-[#401f18] border border-[#C86D24] rounded-xl space-y-2">
                <label className="block text-xs font-bold text-[#C86D24]">
                  Provide Warning Details (Directly dispatched to State Vigilance Officer) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={warningDetails}
                  onChange={e => setWarningDetails(e.target.value)}
                  placeholder="Describe who threatened you, phone calls received, or store staff hostility..."
                  className="w-full bg-[#2C2016] border border-[#F4D9A0]/30 rounded-lg px-3 py-2 text-xs text-[#FBF6EE] focus:outline-none focus:border-[#C86D24]"
                />
                <span className="text-[11px] text-[#FBF6EE]/70 block">
                  🛡️ Whistleblower protection activated. Contact info sealed and submitted directly to the State Food Safety Commissioner.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Submit Grievance Button */}
        <div className="bg-gradient-to-r from-[#2C2016] via-[#5B4632] to-[#36281C] p-6 rounded-2xl border border-[#F4D9A0]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-base font-extrabold text-[#FBF6EE]">
              Submit Grievance to Dual-Ended Verification Pipeline
            </div>
            <p className="text-xs text-[#F4D9A0]/80 mt-0.5">
              Upon physical raid verification and settlement, citizen receives an immediate cash bounty credited to wallet.
            </p>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#F4D9A0] hover:bg-[#F9E6BD] text-[#2C2016] font-extrabold text-sm rounded-xl shadow-2xl transition-all border border-[#F4D9A0] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5 text-[#C86D24]" />
            Submit & Dispatch to Officers
          </button>
        </div>
      </form>

      {/* Live Camera Modal */}
      <LiveCameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCaptureImage={handleAddCapturedImage}
        currentCount={images.length}
      />
    </div>
  );
};
