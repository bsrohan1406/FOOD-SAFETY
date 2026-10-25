export type IssueType = 'online' | 'offline';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export type GrievanceStatus = 
  | 'draft'
  | 'under_verification'
  | 'rejected_jurisdiction'
  | 'rejected_image_quality'
  | 'forwarded_to_officer'
  | 'officer_investigating'
  | 'proof_submitted_pending_audit'
  | 'escalated_to_state_authority'
  | 'settled';

export interface CitizenUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string; // YYYY-MM-DD
  permanentAddress: string;
  temporaryAddress: string;
  isVerified: boolean;
  walletBalanceINR: number;
}

export interface FSSAIBusinessRecord {
  licenseNumber: string;
  businessName: string;
  businessType: string;
  address: string;
  state: string;
  pincode: string;
  licenseStatus: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'NOT_FOUND';
  issueDate: string;
  expiryDate: string;
  lastLabInspectionDate: string;
  labResultSummary: string;
  hygieneRatingStars: number; // 1-5
  activeWarningsCount: number;
}

export interface GrievanceImage {
  id: string;
  dataUrl: string;
  angleLabel: string; // e.g. "Front Angle", "Close-up Defect", "Kitchen/Packaging", "Batch Code/Plate"
  timestamp: number;
  source: 'live_camera';
  structuralMetrics: {
    brightness: number; // 0 - 255
    blurScore: number; // 0 (sharp) to 100 (heavily blurred)
    isPitchBlack: boolean;
    isOverexposed: boolean;
    isLikelyScreenshot: boolean;
    hasFoodRelatedObjects: boolean;
    detectedObjects: string[];
    passed: boolean;
    rejectionReason?: string;
  };
}

export interface OfficialProof {
  officerId: string;
  officerName: string;
  designation: string;
  visitTimestamp: string;
  proofImages: string[];
  findingsNotes: string;
  actionTaken: 'seized_samples' | 'issued_improvement_notice' | 'compounded_fine' | 'sealed_premises' | 'clean_bill_of_health';
  fineAmountINR?: number;
  sampleBatchCodes?: string[];
  independentAuditorApproved: boolean;
  auditorRemarks?: string;
  citizenAcknowledged?: boolean;
}

export interface Grievance {
  id: string;
  hashCode: string;
  userId: string;
  userFullName: string;
  userMobile: string;
  createdAt: string;
  slaDeadline: string; // ISO string
  issueType: IssueType;
  invoiceUrl?: string;
  invoiceOcrText?: string;
  invoiceNeedsManualReview?: boolean;
  
  keywordSummary: string;
  detailedDescription: string;
  voiceNoteUrl?: string;
  voiceDurationSeconds?: number;
  
  images: GrievanceImage[];
  
  // Location
  location: {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    city: string;
    landmark?: string;
  };
  
  // Food Business Information
  businessName: string;
  fssaiDetails: FSSAIBusinessRecord;
  hasFSSAIWarningOrExpired: boolean;
  
  // Intimidation check
  hasFacedBusinessWarnings: boolean;
  businessWarningDetails?: string;
  
  // Dual-Ended Verification Engine Output
  verificationState: {
    structuralFilterPassed: boolean;
    structuralFilterReason?: string;
    jurisdictionVerified: boolean;
    jurisdictionSectionCited?: string;
    jurisdictionVerdictNotes: string;
    isCustomerServiceOnly: boolean;
    isDuplicate: boolean;
    duplicateOfId?: string;
    clusterHotspotCount: number;
    assignedOfficerId: string;
    assignedOfficerName: string;
  };
  
  priority: PriorityLevel;
  status: GrievanceStatus;
  
  // Resolution & Proofs
  officialResolution?: OfficialProof;
  
  // Reward & Wallet
  rewardStatus: 'uneligible' | 'pending_settlement' | 'credited';
  rewardAmountINR: number;
}

export interface BankAccountDetails {
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
  upiId?: string;
}

export interface WalletTransaction {
  id: string;
  grievanceId?: string;
  timestamp: string;
  type: 'CREDIT_REWARD' | 'DEBIT_WITHDRAWAL';
  amountINR: number;
  description: string;
  referenceNumber: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
}
