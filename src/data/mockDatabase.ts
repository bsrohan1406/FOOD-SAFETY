import { FSSAIBusinessRecord, Grievance, CitizenUser, WalletTransaction } from '../types';
import { generateGrievanceHash } from '../utils/foodSafetyRules';

export const INITIAL_CITIZEN: CitizenUser = {
  id: 'CITIZEN-IN-88219',
  firstName: 'Arjun',
  lastName: 'Verma',
  email: 'arjun.verma@example.in',
  mobile: '+91 98765 43210',
  dateOfBirth: '1998-05-14',
  permanentAddress: 'Plot 42, Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103',
  temporaryAddress: 'Flat 302, Sai Residency, HSR Layout Sector 2, Bengaluru, Karnataka - 560102',
  isVerified: true,
  walletBalanceINR: 2000
};

export const MOCK_FSSAI_DATABASE: FSSAIBusinessRecord[] = [
  {
    licenseNumber: '11223334000128',
    businessName: 'Royal Spice Kitchen & Biryani',
    businessType: 'Restaurant & Cloud Kitchen (Category 10)',
    address: 'Shop 14, 27th Main Rd, Sector 1, HSR Layout, Bengaluru',
    state: 'Karnataka',
    pincode: '560102',
    licenseStatus: 'ACTIVE',
    issueDate: '2022-03-15',
    expiryDate: '2027-03-14',
    lastLabInspectionDate: '2026-08-10',
    labResultSummary: 'Permissible coliform bacterial count; synthetic food colors detected slightly above permissible limit in red gravy (Improvement notice served).',
    hygieneRatingStars: 3,
    activeWarningsCount: 1
  },
  {
    licenseNumber: '11221004000941',
    businessName: 'Green Meadows Organic Dairy',
    businessType: 'Dairy Processing & Packaging (Category 01)',
    address: 'Survey 88, Whitefield Main Road, Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    licenseStatus: 'ACTIVE',
    issueDate: '2021-01-10',
    expiryDate: '2028-01-09',
    lastLabInspectionDate: '2026-09-02',
    labResultSummary: 'Milk fat 4.2%, SNF 8.7%. Zero adulterants (urea, detergent, starch negative). Compliant with FSS (Food Products Standards) 2011.',
    hygieneRatingStars: 5,
    activeWarningsCount: 0
  },
  {
    licenseNumber: '11219001000674',
    businessName: 'Midnight Cravings Burger Hub',
    businessType: 'Fast Food Quick Service Restaurant',
    address: '100 Feet Road, Indiranagar, Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    licenseStatus: 'EXPIRED',
    issueDate: '2020-04-01',
    expiryDate: '2025-03-31',
    lastLabInspectionDate: '2024-11-12',
    labResultSummary: 'License lapsed by >18 months. Re-used frying oil total polar compounds (TPC) exceeded 32% (Legal limit 25%).',
    hygieneRatingStars: 1,
    activeWarningsCount: 3
  },
  {
    licenseNumber: '11224005001290',
    businessName: 'Anand Sweets & Savouries',
    businessType: 'Confectionery & Sweets Manufacturing',
    address: 'Commercial Street, Tasker Town, Shivaji Nagar, Bengaluru',
    state: 'Karnataka',
    pincode: '560051',
    licenseStatus: 'ACTIVE',
    issueDate: '2023-06-18',
    expiryDate: '2028-06-17',
    lastLabInspectionDate: '2026-07-25',
    labResultSummary: 'Mawa purity test passed. Silver leaf (Vark) tested 99.9% pure silver foil without heavy metal traces.',
    hygieneRatingStars: 4,
    activeWarningsCount: 0
  },
  {
    licenseNumber: '11220008000311',
    businessName: 'Tasty Corner Street Eatery',
    businessType: 'Petty Food Manufacturer / Street Stall',
    address: 'Opposite Metro Pillar 142, BTM Layout 2nd Stage, Bengaluru',
    state: 'Karnataka',
    pincode: '560076',
    licenseStatus: 'NOT_FOUND',
    issueDate: 'N/A',
    expiryDate: 'N/A',
    lastLabInspectionDate: 'Never Inspected',
    labResultSummary: 'No central or state registration found in FSSAI FoSCoS portal. Operating un-registered.',
    hygieneRatingStars: 1,
    activeWarningsCount: 2
  }
];

export const MOCK_OFFICIALS = [
  {
    id: 'OFFICER-KA-042',
    name: 'Dr. Suresh Babu, M.Sc (Food Tech)',
    designation: 'Senior Food Safety Officer (FSO)',
    jurisdictionDistrict: 'Bengaluru South & East Zone',
    contactNumber: '+91 80 2234 5678',
    activeGrievancesCount: 4,
    raidsConductedThisMonth: 19
  },
  {
    id: 'OFFICER-KA-019',
    name: 'Dr. Priya V. Nair, Ph.D',
    designation: 'Designated Officer (DO) & Joint Commissioner',
    jurisdictionDistrict: 'Bengaluru Urban District',
    contactNumber: '+91 80 2234 9811',
    activeGrievancesCount: 2,
    raidsConductedThisMonth: 31
  },
  {
    id: 'OFFICER-KA-STATE',
    name: 'Shri Manoj Kumar Singh, IAS',
    designation: 'Commissioner of Food Safety, Karnataka',
    jurisdictionDistrict: 'State Headquarters Appellate',
    contactNumber: '+91 80 2286 0001',
    activeGrievancesCount: 1,
    raidsConductedThisMonth: 82
  }
];

export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'SIH-GRV-2026-1001',
    hashCode: generateGrievanceHash('Midnight Cravings Burger Hub', 'Expired reused black cooking oil and stale meat patties', 'Bengaluru'),
    userId: 'CITIZEN-IN-88219',
    userFullName: 'Arjun Verma',
    userMobile: '+91 98765 43210',
    createdAt: '2026-10-24T14:30:00Z',
    slaDeadline: '2026-10-26T14:30:00Z', // 48 hr SLA
    issueType: 'offline',
    keywordSummary: 'Expired reused black cooking oil and stale meat patties',
    detailedDescription: 'The cooking oil in deep fryers has turned pitch black and emitted a burning chemical odor. Burger patties tasted decomposed. When asked for FSSAI certificate, the store manager aggressively threatened us.',
    voiceDurationSeconds: 24,
    images: [
      {
        id: 'IMG-01',
        dataUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        angleLabel: 'Fryer Station & Burnt Oil',
        timestamp: Date.now() - 86400000,
        source: 'live_camera',
        structuralMetrics: {
          brightness: 110,
          blurScore: 18,
          isPitchBlack: false,
          isOverexposed: false,
          isLikelyScreenshot: false,
          hasFoodRelatedObjects: true,
          detectedObjects: ['kitchen', 'fryer', 'food', 'oil'],
          passed: true
        }
      },
      {
        id: 'IMG-02',
        dataUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        angleLabel: 'Burger Patty with Discoloration',
        timestamp: Date.now() - 86350000,
        source: 'live_camera',
        structuralMetrics: {
          brightness: 135,
          blurScore: 12,
          isPitchBlack: false,
          isOverexposed: false,
          isLikelyScreenshot: false,
          hasFoodRelatedObjects: true,
          detectedObjects: ['plate', 'food', 'burger'],
          passed: true
        }
      }
    ],
    location: {
      latitude: 12.9716,
      longitude: 77.6412,
      formattedAddress: '100 Feet Road, Indiranagar, Bengaluru, Karnataka',
      city: 'Bengaluru',
      landmark: 'Near Indiranagar Metro Station'
    },
    businessName: 'Midnight Cravings Burger Hub',
    fssaiDetails: MOCK_FSSAI_DATABASE[2],
    hasFSSAIWarningOrExpired: true,
    hasFacedBusinessWarnings: true,
    businessWarningDetails: 'Store manager physically intimidated citizen and refused to share bill or food safety registration number.',
    verificationState: {
      structuralFilterPassed: true,
      jurisdictionVerified: true,
      jurisdictionSectionCited: 'Section 51 & Section 31 (Lapsed License & Decomposed Food)',
      jurisdictionVerdictNotes: 'Operating with expired FSSAI license since March 2025. Total Polar Compounds violation confirmed. Forwarded as Critical.',
      isCustomerServiceOnly: false,
      isDuplicate: false,
      clusterHotspotCount: 3,
      assignedOfficerId: 'OFFICER-KA-042',
      assignedOfficerName: 'Dr. Suresh Babu'
    },
    priority: 'critical',
    status: 'officer_investigating',
    rewardStatus: 'pending_settlement',
    rewardAmountINR: 3500
  },
  {
    id: 'SIH-GRV-2026-1002',
    hashCode: generateGrievanceHash('Royal Spice Kitchen & Biryani', 'Dead insect found floating in chicken gravy', 'Bengaluru'),
    userId: 'CITIZEN-IN-99120',
    userFullName: 'Neha Deshmukh',
    userMobile: '+91 97112 34567',
    createdAt: '2026-10-23T11:00:00Z',
    slaDeadline: '2026-10-25T11:00:00Z',
    issueType: 'online',
    invoiceUrl: 'INV-ZOM-992144',
    invoiceOcrText: 'Vendor: Royal Spice Kitchen | Date: 23 Oct 2026 | Total: INR 680 | Status: Delivered',
    invoiceNeedsManualReview: false,
    keywordSummary: 'Dead insect found floating in chicken gravy',
    detailedDescription: 'Found a dead insect clearly visible inside the sealed food box delivered via online order.',
    images: [
      {
        id: 'IMG-03',
        dataUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        angleLabel: 'Food Container with Foreign Particle',
        timestamp: Date.now() - 172800000,
        source: 'live_camera',
        structuralMetrics: {
          brightness: 128,
          blurScore: 14,
          isPitchBlack: false,
          isOverexposed: false,
          isLikelyScreenshot: false,
          hasFoodRelatedObjects: true,
          detectedObjects: ['bowl', 'food', 'gravy', 'insect'],
          passed: true
        }
      },
      {
        id: 'IMG-04',
        dataUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        angleLabel: 'Packaging Seal & Bill Match',
        timestamp: Date.now() - 172750000,
        source: 'live_camera',
        structuralMetrics: {
          brightness: 142,
          blurScore: 20,
          isPitchBlack: false,
          isOverexposed: false,
          isLikelyScreenshot: false,
          hasFoodRelatedObjects: true,
          detectedObjects: ['packet', 'food'],
          passed: true
        }
      }
    ],
    location: {
      latitude: 12.9116,
      longitude: 77.6389,
      formattedAddress: 'Sector 1, HSR Layout, Bengaluru, Karnataka',
      city: 'Bengaluru'
    },
    businessName: 'Royal Spice Kitchen & Biryani',
    fssaiDetails: MOCK_FSSAI_DATABASE[0],
    hasFSSAIWarningOrExpired: false,
    hasFacedBusinessWarnings: false,
    verificationState: {
      structuralFilterPassed: true,
      jurisdictionVerified: true,
      jurisdictionSectionCited: 'Section 54 - Food Containing Extraneous Matter',
      jurisdictionVerdictNotes: 'Extraneous insect contamination confirmed under FSSA 2006. Warranted on-site kitchen audit.',
      isCustomerServiceOnly: false,
      isDuplicate: false,
      clusterHotspotCount: 1,
      assignedOfficerId: 'OFFICER-KA-042',
      assignedOfficerName: 'Dr. Suresh Babu'
    },
    priority: 'high',
    status: 'settled',
    officialResolution: {
      officerId: 'OFFICER-KA-042',
      officerName: 'Dr. Suresh Babu',
      designation: 'Senior Food Safety Officer',
      visitTimestamp: '2026-10-24T16:00:00Z',
      proofImages: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
      ],
      findingsNotes: 'Surprise inspection conducted. Pest control register had lapsed for 4 months. Seized 3 gravy batches. Compounded spot fine of INR 25,000 imposed under Sec 69 of FSSA 2006 and mandatory pest eradication order issued.',
      actionTaken: 'compounded_fine',
      fineAmountINR: 25000,
      sampleBatchCodes: ['BATCH-SP-881', 'BATCH-SP-882'],
      independentAuditorApproved: true,
      auditorRemarks: 'Dual verification validated by District Joint Commissioner. Spot fine challan #CH-88291 verified.',
      citizenAcknowledged: true
    },
    rewardStatus: 'credited',
    rewardAmountINR: 1500
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'TXN-SIH-9901',
    grievanceId: 'SIH-GRV-2026-1002',
    timestamp: '2026-10-24T18:30:00Z',
    type: 'CREDIT_REWARD',
    amountINR: 1500,
    description: 'Bounty reward for High Priority settled grievance SIH-GRV-2026-1002 (Pest Contamination)',
    referenceNumber: 'FSSAI-BOUNTY-0091823',
    status: 'COMPLETED'
  },
  {
    id: 'TXN-SIH-9900',
    timestamp: '2026-10-15T09:15:00Z',
    type: 'CREDIT_REWARD',
    amountINR: 500,
    description: 'Bounty reward for Medium Priority settled grievance SIH-GRV-2026-0844',
    referenceNumber: 'FSSAI-BOUNTY-0077120',
    status: 'COMPLETED'
  }
];
