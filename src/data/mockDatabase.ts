import { FSSAILicensee, GrievanceDossier, CitizenProfile, WalletTransaction } from '../types';

export const INITIAL_CITIZEN: CitizenProfile = {
  id: 'CIT-2026-9041',
  fullName: 'Aarav Sharma',
  age: 26,
  aadhaarNumberMasked: 'XXXX-XXXX-8921',
  phone: '+91 98765 43210',
  email: 'aarav.sharma@sentinel-citizen.in',
  isKycVerified: true,
  walletBalanceINR: 3500,
  bankAccount: {
    accountNumberMasked: 'XXXXXXXX4589',
    ifsc: 'SBIN0001844',
    bankName: 'State Bank of India (Connaught Place Branch)'
  }
};

export const INITIAL_FSSAI_REGISTRY: FSSAILicensee[] = [
  {
    licenseNumber: '10019011000123',
    businessName: 'Royal Biryani & Mughlai Kitchen',
    category: 'Restaurant',
    address: 'Plot 42, Sector 18, Commercial Belt, Noida',
    district: 'Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    pincode: '201301',
    validUntil: '2027-11-15',
    status: 'Active',
    hygieneRating: 4,
    lastInspectionDate: '2026-08-10',
    registeredOfficer: 'FSO Rajiv Varma (Emp ID: FSSAI-UP-882)',
    pastViolationsCount: 1
  },
  {
    licenseNumber: '11521034000456',
    businessName: 'SpiceCraft Cloud Kitchens Pvt Ltd',
    category: 'Cloud Kitchen',
    address: 'Unit 4B, Lower Parel Industrial Estate, Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    pincode: '400013',
    validUntil: '2026-03-31', // Expired
    status: 'Expired',
    hygieneRating: 2,
    lastInspectionDate: '2025-10-14',
    registeredOfficer: 'FSO Meenakshi Kulkarni (Emp ID: FSSAI-MH-412)',
    pastViolationsCount: 4
  },
  {
    licenseNumber: '11222333000789',
    businessName: 'Annapurna Sweets & Dairy Treats',
    category: 'Sweet Shop',
    address: 'Shop 12-14, Brigade Road, Ashok Nagar, Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    pincode: '560025',
    validUntil: '2028-05-20',
    status: 'Active',
    hygieneRating: 5,
    lastInspectionDate: '2026-09-02',
    registeredOfficer: 'FSO C. Ramesh (Emp ID: FSSAI-KA-119)',
    pastViolationsCount: 0
  },
  {
    licenseNumber: '13320005000999',
    businessName: 'Golden Crust Gourmet Bakery',
    category: 'Baker',
    address: '88 Park Street, Central District, Kolkata',
    district: 'Kolkata',
    state: 'West Bengal',
    pincode: '700016',
    validUntil: '2026-12-18',
    status: 'Under Investigation',
    hygieneRating: 2,
    lastInspectionDate: '2026-10-01',
    registeredOfficer: 'FSO Debashis Roy (Emp ID: FSSAI-WB-302)',
    pastViolationsCount: 3
  },
  {
    licenseNumber: '12423002000845',
    businessName: 'Krishna Pure Ghee & Dairy Products',
    category: 'Dairy',
    address: 'Khari Baoli Wholesale Market, Old Delhi',
    district: 'North Delhi',
    state: 'Delhi',
    pincode: '110006',
    validUntil: '2027-01-22',
    status: 'Active',
    hygieneRating: 3,
    lastInspectionDate: '2026-06-18',
    registeredOfficer: 'FSO Harpreet Singh (Emp ID: FSSAI-DL-073)',
    pastViolationsCount: 2
  }
];

export const INITIAL_GRIEVANCES: GrievanceDossier[] = [
  {
    id: 'GRV-2026-00481',
    trackingNumber: 'FSSA-DL-2026-8941',
    type: 'online_delivery',
    filingDate: '2026-10-24 14:32:00',
    citizen: {
      fullName: 'Aarav Sharma',
      maskedPhone: '+91 98765 XXXXX',
      maskedAadhaar: 'XXXX-XXXX-8921'
    },
    establishment: {
      name: 'SpiceCraft Cloud Kitchens Pvt Ltd',
      fssaiLicense: '11521034000456',
      address: 'Unit 4B, Lower Parel Industrial Estate, Mumbai',
      platformName: 'Zomato',
      orderId: 'ZOM-902184-OCT'
    },
    violationCategory: 'Extraneous Matter & Substandard Cooking Fat',
    violationKeywords: ['foreign object', 'plastic fragment', 'rancid oil'],
    incidentDescription: 'Received chicken korma order with severe rancid smell and sharp metallic/plastic fragments embedded in gravy. FSSAI license listed on packaging is expired.',
    voiceNoteTranscript: 'I opened the package around 1:30 PM. The oil had a bitter toxic smell, and while tasting I bit into a hard plastic piece with sharp edges. Immediate stomach ache followed.',
    evidenceImages: [
      {
        id: 'EVD-01',
        timestamp: '2026-10-24 14:35:10',
        dataUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        angleDescription: 'Angle 1: Macro top-down shot of foreign sharp fragment in food',
        luminance: 142,
        blurScore: 42,
        foodHeuristicConfidence: 94,
        hash: 'SHA256_EVD_0x4F89A12B',
        passedQualityCheck: true
      },
      {
        id: 'EVD-02',
        timestamp: '2026-10-24 14:36:22',
        dataUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
        angleDescription: 'Angle 2: 45-degree angle showing container seal and batch marking',
        luminance: 138,
        blurScore: 48,
        foodHeuristicConfidence: 91,
        hash: 'SHA256_EVD_0x7C11B09F',
        passedQualityCheck: true
      }
    ],
    invoiceImageUrl: 'https://images.unsplash.com/photo-1554415707-9e4466bfe0c2?w=600&auto=format&fit=crop&q=80',
    invoiceParsedData: {
      orderNumber: 'ZOM-902184-OCT',
      billedAmount: '₹648.00',
      restaurantName: 'SpiceCraft Cloud Kitchens',
      parsedDate: '24-Oct-2026'
    },
    statutoryReview: {
      isJurisdictionValid: true,
      applicableSections: ['Section 31', 'Section 51', 'Section 54', 'Section 69'],
      severityScore: 9,
      clusterId: 'CLUSTER-SPICECRAFT-MUM',
      clusteredIncidentCount: 3,
      flaggedKeywords: ['expired FSSAI', 'plastic fragment', 'rancid oil'],
      summaryRationale: 'Repeat complaint cluster #3. Operating on expired license (Sec 31), presence of hazardous extraneous plastic (Sec 54) and rancid fat (Sec 51).'
    },
    priority: 'Critical',
    status: 'inspection_in_progress',
    officerAction: {
      officerId: 'FSO-MH-412',
      officerName: 'Meenakshi Kulkarni',
      designation: 'Designated Food Safety Officer',
      station: 'Brihanmumbai Municipal Corporation Food Wing',
      inspectionTimestamp: '2026-10-25 10:15:00',
      onSiteFindings: 'Surprise physical inspection conducted at Lower Parel facility. Found multiple unsealed oil drums with peroxide smell and unlicensed packaging line. Seized sample #FSS-MUM-7721.',
      actionTaken: 'Sample Seized for Lab',
      compoundingFineINR: 35000,
      penaltyNoticeNumber: 'NOTICE/FSSAI/MH/2026/0914',
      evidencePhotoUrls: [
        'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80'
      ],
      sampleSealId: 'SEAL-LAB-89104-NABL',
      secondaryAuditorSignOff: {
        auditorName: 'Dr. Vivek Deshmukh',
        auditorDesignation: 'Joint Commissioner (Food Safety Enforcement)',
        approvedAt: '2026-10-25 11:30:00',
        remarks: 'Physical raid proof certified authentic. Compounding notice under Section 69 initiated.'
      }
    },
    rewardDisbursedINR: 3500,
    dossierHash: 'FSSAI_LEDGER_0x89B4C2A1E9'
  },
  {
    id: 'GRV-2026-00472',
    trackingNumber: 'FSSA-KA-2026-7201',
    type: 'offline_dine_in',
    filingDate: '2026-10-22 19:40:00',
    citizen: {
      fullName: 'Sunita Reddy',
      maskedPhone: '+91 97401 XXXXX',
      maskedAadhaar: 'XXXX-XXXX-4102'
    },
    establishment: {
      name: 'Annapurna Sweets & Dairy Treats',
      fssaiLicense: '11222333000789',
      address: 'Shop 12-14, Brigade Road, Ashok Nagar, Bengaluru'
    },
    violationCategory: 'Substandard Dairy / Sour Spoiled Chenna',
    violationKeywords: ['sour curd', 'foul smell'],
    incidentDescription: 'Purchased Rasmalai sweets which curdled with strong sour fermenting odor upon serving.',
    evidenceImages: [
      {
        id: 'EVD-11',
        timestamp: '2026-10-22 19:42:00',
        dataUrl: 'https://images.unsplash.com/photo-1505253758473-96b3015f21c9?w=600&auto=format&fit=crop&q=80',
        angleDescription: 'Angle 1: Macro bowl shot of curdled milk solids',
        luminance: 155,
        blurScore: 50,
        foodHeuristicConfidence: 89,
        hash: 'SHA256_EVD_0x22A91D0E',
        passedQualityCheck: true
      },
      {
        id: 'EVD-12',
        timestamp: '2026-10-22 19:43:10',
        dataUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        angleDescription: 'Angle 2: Wide restaurant billing counter with store board',
        luminance: 120,
        blurScore: 46,
        foodHeuristicConfidence: 82,
        hash: 'SHA256_EVD_0x9910BB78',
        passedQualityCheck: true
      }
    ],
    statutoryReview: {
      isJurisdictionValid: true,
      applicableSections: ['Section 51', 'Section 69'],
      severityScore: 6,
      clusteredIncidentCount: 1,
      flaggedKeywords: ['sour curd', 'foul smell'],
      summaryRationale: 'Substandard dairy products falling below freshness benchmark under Section 51.'
    },
    priority: 'Elevated',
    status: 'action_enforced',
    officerAction: {
      officerId: 'FSO-KA-119',
      officerName: 'C. Ramesh',
      designation: 'Designated Food Safety Officer',
      station: 'BBMP Food Safety Cell, Shanthi Nagar',
      inspectionTimestamp: '2026-10-23 11:00:00',
      onSiteFindings: 'Refrigeration unit was malfunctioning at 18 degrees Celsius. 14kg of milk products discarded immediately in presence of inspector.',
      actionTaken: 'Compounding Fine',
      compoundingFineINR: 15000,
      penaltyNoticeNumber: 'NOTICE/FSSAI/KA/2026/0411',
      evidencePhotoUrls: [
        'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=600&auto=format&fit=crop&q=80'
      ],
      secondaryAuditorSignOff: {
        auditorName: 'P. Balasubramanian',
        auditorDesignation: 'Deputy Food Safety Commissioner',
        approvedAt: '2026-10-23 16:30:00',
        remarks: 'Fine recovered on spot under Section 69. Case resolved.'
      }
    },
    rewardDisbursedINR: 1500,
    dossierHash: 'FSSAI_LEDGER_0x7721C00E19'
  },
  {
    id: 'GRV-2026-00465',
    trackingNumber: 'FSSA-WB-2026-6632',
    type: 'offline_dine_in',
    filingDate: '2026-10-21 16:15:00',
    citizen: {
      fullName: 'Ranjan Banerjee',
      maskedPhone: '+91 98302 XXXXX',
      maskedAadhaar: 'XXXX-XXXX-9901'
    },
    establishment: {
      name: 'Golden Crust Gourmet Bakery',
      fssaiLicense: '13320005000999',
      address: '88 Park Street, Central District, Kolkata'
    },
    violationCategory: 'Fungal Mold on Baked Confectionery',
    violationKeywords: ['fungus', 'moldy bread'],
    incidentDescription: 'Packed bread loaf exhibited blue-green fungal colonies underneath crust.',
    evidenceImages: [
      {
        id: 'EVD-21',
        timestamp: '2026-10-21 16:18:00',
        dataUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        angleDescription: 'Angle 1: Macro bread slice with fungal spores',
        luminance: 130,
        blurScore: 40,
        foodHeuristicConfidence: 96,
        hash: 'SHA256_EVD_0x3344DD11',
        passedQualityCheck: true
      },
      {
        id: 'EVD-22',
        timestamp: '2026-10-21 16:19:00',
        dataUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80',
        angleDescription: 'Angle 2: Packaging sticker with batch date',
        luminance: 145,
        blurScore: 44,
        foodHeuristicConfidence: 80,
        hash: 'SHA256_EVD_0x5566EE22',
        passedQualityCheck: true
      }
    ],
    statutoryReview: {
      isJurisdictionValid: true,
      applicableSections: ['Section 51', 'Section 59'],
      severityScore: 8,
      clusteredIncidentCount: 2,
      flaggedKeywords: ['fungus', 'moldy bread'],
      summaryRationale: 'Microbiological hazard due to fungal growth on perishable bakery goods.'
    },
    priority: 'Critical',
    status: 'reward_disbursed',
    officerAction: {
      officerId: 'FSO-WB-302',
      officerName: 'Debashis Roy',
      designation: 'Designated Food Safety Officer',
      station: 'Kolkata Municipal Corporation Food Department',
      inspectionTimestamp: '2026-10-22 12:00:00',
      onSiteFindings: 'Bakery kitchen had severe dampness and ceiling leakage in flour storage room. Improvement notice served under Section 32 with 7-day compliance deadline.',
      actionTaken: 'Notice Issued',
      compoundingFineINR: 20000,
      penaltyNoticeNumber: 'NOTICE/FSSAI/WB/2026/0881',
      evidencePhotoUrls: [
        'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80'
      ],
      secondaryAuditorSignOff: {
        auditorName: 'Ananya Sen',
        auditorDesignation: 'Chief Health Officer',
        approvedAt: '2026-10-22 17:00:00',
        remarks: 'Confirmed penalty of ₹20,000 paid. Bounty disbursed to complainant.'
      }
    },
    rewardDisbursedINR: 2000,
    dossierHash: 'FSSAI_LEDGER_0x33B99FF001'
  }
];

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'TXN-9081',
    timestamp: '2026-10-25 11:32:00',
    type: 'credit_bounty',
    amountINR: 3500,
    dossierTrackingNumber: 'FSSA-DL-2026-8941',
    description: '10% Compounding Bounty for Grievance FSSA-DL-2026-8941 (SpiceCraft)',
    status: 'Completed',
    referenceId: 'DBT/FSSAI/2026/998124'
  },
  {
    id: 'TXN-8812',
    timestamp: '2026-10-18 16:45:00',
    type: 'withdrawal_bank',
    amountINR: 2000,
    description: 'NEFT Transfer to State Bank of India (XXXX4589)',
    status: 'Completed',
    referenceId: 'NEFT/P2A/2026/0014892'
  },
  {
    id: 'TXN-8201',
    timestamp: '2026-10-15 14:10:00',
    type: 'credit_bounty',
    amountINR: 2000,
    dossierTrackingNumber: 'FSSA-WB-2026-6632',
    description: 'Statutory Vigilance Bounty for Grievance FSSA-WB-2026-6632 (Golden Crust)',
    status: 'Completed',
    referenceId: 'DBT/FSSAI/2026/774011'
  }
];
