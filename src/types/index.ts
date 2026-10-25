export type GrievanceType = 'online_delivery' | 'offline_dine_in';

export type GrievanceStatus = 
  | 'submitted'
  | 'ai_cv_verified'
  | 'statutory_screened'
  | 'officer_assigned'
  | 'inspection_in_progress'
  | 'action_enforced'
  | 'reward_disbursed'
  | 'rejected_non_jurisdiction'
  | 'rejected_quality_failure';

export type StatutorySection = 
  | 'Section 31' // Unlicensed / Unregistered Food Business
  | 'Section 50' // Deficient quality / Food not of nature demanded
  | 'Section 51' // Substandard Food
  | 'Section 52' // Misbranded Food
  | 'Section 54' // Extraneous matter / Contaminants
  | 'Section 59' // Unsafe Food / Severe Adulteration
  | 'Section 69'; // Compounding of offences

export type PriorityLevel = 'Standard' | 'Elevated' | 'Critical';

export interface FSSAILicensee {
  licenseNumber: string;
  businessName: string;
  category: 'Restaurant' | 'Cloud Kitchen' | 'Sweet Shop' | 'Dairy' | 'Baker' | 'Street Vendor' | 'Packaged Food';
  address: string;
  district: string;
  state: string;
  pincode: string;
  validUntil: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Under Investigation';
  hygieneRating: number; // 1 to 5
  lastInspectionDate: string;
  registeredOfficer: string;
  pastViolationsCount: number;
}

export interface CapturedEvidence {
  id: string;
  timestamp: string;
  dataUrl: string;
  angleDescription: string;
  luminance: number; // 0 - 255
  blurScore: number; // Variance measure
  foodHeuristicConfidence: number; // 0 - 100%
  hash: string;
  passedQualityCheck: boolean;
  qualityFailureReason?: string;
}

export interface CitizenProfile {
  id: string;
  fullName: string;
  age: number;
  aadhaarNumberMasked: string;
  phone: string;
  email: string;
  isKycVerified: boolean;
  walletBalanceINR: number;
  bankAccount?: {
    accountNumberMasked: string;
    ifsc: string;
    bankName: string;
  };
}

export interface StatutoryReview {
  isJurisdictionValid: boolean;
  applicableSections: StatutorySection[];
  severityScore: number; // 1 to 10
  clusterId?: string;
  clusteredIncidentCount: number;
  summaryRationale: string;
  flaggedKeywords: string[];
  rejectionReason?: string;
}

export interface OfficerActionLog {
  officerId: string;
  officerName: string;
  designation: string;
  station: string;
  inspectionTimestamp: string;
  onSiteFindings: string;
  actionTaken: 'Notice Issued' | 'Sample Seized for Lab' | 'Establishment Sealed' | 'Compounding Fine' | 'Warning';
  compoundingFineINR: number;
  penaltyNoticeNumber?: string;
  evidencePhotoUrls: string[];
  sampleSealId?: string;
  secondaryAuditorSignOff?: {
    auditorName: string;
    auditorDesignation: string;
    approvedAt: string;
    remarks: string;
  };
}

export interface GrievanceDossier {
  id: string;
  trackingNumber: string;
  type: GrievanceType;
  filingDate: string;
  citizen: {
    fullName: string;
    maskedPhone: string;
    maskedAadhaar: string;
  };
  establishment: {
    name: string;
    fssaiLicense: string;
    address: string;
    platformName?: string; // e.g., Zomato, Swiggy, Direct
    orderId?: string;
  };
  violationCategory: string;
  violationKeywords: string[];
  incidentDescription: string;
  voiceNoteTranscript?: string;
  evidenceImages: CapturedEvidence[];
  invoiceImageUrl?: string;
  invoiceParsedData?: {
    orderNumber?: string;
    billedAmount?: string;
    restaurantName?: string;
    parsedDate?: string;
  };
  statutoryReview: StatutoryReview;
  priority: PriorityLevel;
  status: GrievanceStatus;
  officerAction?: OfficerActionLog;
  rewardDisbursedINR: number;
  dossierHash: string;
}

export interface WalletTransaction {
  id: string;
  timestamp: string;
  type: 'credit_bounty' | 'withdrawal_bank';
  amountINR: number;
  dossierTrackingNumber?: string;
  description: string;
  status: 'Completed' | 'Processing' | 'Pending';
  referenceId: string;
}
