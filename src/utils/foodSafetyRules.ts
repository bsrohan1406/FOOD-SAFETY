import { PriorityLevel, FSSAIBusinessRecord, IssueType } from '../types';

/**
 * Validates if the citizen is at least 18 years old.
 */
export function isCitizenAgeValid(birthDateStr: string, referenceDate: Date = new Date()): { isValid: boolean; age: number; error?: string } {
  if (!birthDateStr) {
    return { isValid: false, age: 0, error: 'Date of birth is required.' };
  }
  const dob = new Date(birthDateStr);
  if (isNaN(dob.getTime())) {
    return { isValid: false, age: 0, error: 'Invalid date format.' };
  }
  let age = referenceDate.getFullYear() - dob.getFullYear();
  const m = referenceDate.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < dob.getDate())) {
    age--;
  }
  if (age < 18) {
    return { 
      isValid: false, 
      age, 
      error: `Citizen must be at least 18 years old to file legal food grievances. Current calculated age: ${age} years.` 
    };
  }
  return { isValid: true, age };
}

/**
 * Structural image validation filter (The first line of defence).
 * Fast, lightweight check to prevent corrupted, pitch-black, blank or accidental screenshots from entering the pipeline.
 */
export interface StructuralFilterResult {
  passed: boolean;
  brightness: number; // 0-255
  blurScore: number; // 0 (sharp) to 100 (unreadable blur)
  isPitchBlack: boolean;
  isOverexposed: boolean;
  isLikelyScreenshot: boolean;
  hasFoodRelatedObjects: boolean;
  detectedObjects: string[];
  rejectionReason?: string;
}

export function evaluateStructuralImageFilter(
  pixelMetrics: { 
    averageLuminance: number; 
    laplacianVariance: number; 
    aspectRatio?: number;
    detectedKeywords?: string[];
  }
): StructuralFilterResult {
  const brightness = Math.round(pixelMetrics.averageLuminance);
  // Low variance indicates high blur
  const blurScore = Math.max(0, Math.min(100, Math.round(100 - (pixelMetrics.laplacianVariance / 5))));
  
  const isPitchBlack = brightness < 18;
  const isOverexposed = brightness > 242;
  const isTooBlurry = blurScore > 78 || pixelMetrics.laplacianVariance < 60;
  
  // Screenshot check: common mobile resolutions or explicit screenshot markers
  const isLikelyScreenshot = (pixelMetrics.aspectRatio !== undefined) && 
    (Math.abs(pixelMetrics.aspectRatio - 19.5/9) < 0.05 || Math.abs(pixelMetrics.aspectRatio - 20/9) < 0.05);

  const foodObjectKeywords = [
    'food', 'dish', 'plate', 'kitchen', 'meal', 'soup', 'meat', 'vegetable', 
    'bread', 'sauce', 'packet', 'container', 'oil', 'pan', 'glass', 'beverage',
    'insect', 'mold', 'fungus', 'utensil', 'tray', 'counter', 'refrigerator'
  ];

  const detectedObjects = pixelMetrics.detectedKeywords || ['food', 'plate', 'kitchen'];
  const hasFoodRelatedObjects = detectedObjects.some(obj => 
    foodObjectKeywords.some(keyword => obj.toLowerCase().includes(keyword))
  );

  if (isPitchBlack) {
    return {
      passed: false,
      brightness,
      blurScore,
      isPitchBlack: true,
      isOverexposed,
      isLikelyScreenshot,
      hasFoodRelatedObjects,
      detectedObjects,
      rejectionReason: 'Image rejected: Camera captured pitch-black or obscured lens. Please retake under proper lighting.'
    };
  }

  if (isOverexposed) {
    return {
      passed: false,
      brightness,
      blurScore,
      isPitchBlack,
      isOverexposed: true,
      isLikelyScreenshot,
      hasFoodRelatedObjects,
      detectedObjects,
      rejectionReason: 'Image rejected: Severe flash glare or overexposed brightness. Details cannot be verified.'
    };
  }

  if (isTooBlurry) {
    return {
      passed: false,
      brightness,
      blurScore,
      isPitchBlack,
      isOverexposed,
      isLikelyScreenshot,
      hasFoodRelatedObjects,
      detectedObjects,
      rejectionReason: 'Image rejected: Photo is excessively blurred. Official inspection requires sharp evidential clarity.'
    };
  }

  if (!hasFoodRelatedObjects) {
    return {
      passed: false,
      brightness,
      blurScore,
      isPitchBlack,
      isOverexposed,
      isLikelyScreenshot,
      hasFoodRelatedObjects: false,
      detectedObjects,
      rejectionReason: 'Object detection filter: Image does not contain recognizable food, beverage, packaging, kitchen, or dining artifacts.'
    };
  }

  return {
    passed: true,
    brightness,
    blurScore,
    isPitchBlack: false,
    isOverexposed: false,
    isLikelyScreenshot: false,
    hasFoodRelatedObjects: true,
    detectedObjects
  };
}

/**
 * Food Safety and Standards Act, 2006 Legal Jurisdiction Scanner.
 * Ref: https://fssai.gov.in/cms/food-safety-and-standards-act-2006.php
 * Verifies if the complaint is a legitimate food safety statutory offense or merely a customer service dispute.
 */
export interface JurisdictionEvaluation {
  jurisdictionVerified: boolean;
  isCustomerServiceOnly: boolean;
  citedFSSAISection?: string;
  verdictTitle: string;
  verdictDescription: string;
  suggestedAction: 'FORWARD_TO_OFFICERS' | 'REJECT_REDIRECT_CONSUMER_COURT';
}

export function scanFSSAIJurisdiction(text: string): JurisdictionEvaluation {
  const normalized = text.toLowerCase();

  // Pure customer service keywords (Non-statutory food safety matters)
  const customerServiceTriggers = [
    'late delivery', 'delayed delivery', 'delivery boy', 'delivery partner was rude',
    'wrong cold drink flavor', 'cold food', 'cold burger', 'spilled ketchup in bag',
    'forgot to give extra tissue', 'no plastic spoon', 'portion size is small',
    'too expensive', 'discount code not applied', 'refund refused by app',
    'zomato rider took wrong turn', 'swiggy delivery agent arguing', 'rider canceled'
  ];

  // Statutory offenses under FSSA 2006
  const statutoryOffenses = [
    {
      keywords: ['cockroach', 'dead fly', 'insect', 'worm', 'maggot', 'spider', 'lizard', 'rat', 'rodent', 'hair', 'glass', 'metal wire', 'stapler pin', 'stone', 'foreign particle', 'extraneous'],
      section: 'Section 54 - Penalty for Food Containing Extraneous Matter',
      title: 'Extraneous & Contaminant Matter Violation'
    },
    {
      keywords: ['food poisoning', 'vomiting', 'hospitalized', 'diarrhea', 'nausea', 'infection', 'toxic', 'severe stomach cramps', 'poisoned', 'sick after eating'],
      section: 'Section 59 - Punishment for Unsafe Food causing injury or mortality',
      title: 'Severe Public Health Endangerment (Unsafe Food)'
    },
    {
      keywords: ['rotten', 'foul smelling', 'decayed', 'stale', 'smelling like acid', 'smells sour', 'curdled milk', 'fungus', 'mold', 'slime', 'spoiled meat', 'green mold', 'fungal growth'],
      section: 'Section 51 - Penalty for Sub-Standard & Decomposed Food',
      title: 'Sub-Standard & Decomposed Food Article'
    },
    {
      keywords: ['synthetic milk', 'adulterated', 'chemical color', 'urea', 'detergent', 'chalk in milk', 'adulterated oil', 'brick powder in chilli', 'industrial dye', 'metanil yellow'],
      section: 'Section 57 - Penalty for Possessing and Using Adulterant',
      title: 'Chemical Adulteration & Hazardous Food Additives'
    },
    {
      keywords: ['expired', 'expiry date erased', 'best before crossed', 'fake manufacturing date', 're-labeled date', 'tampered sticker', 'unlabeled package'],
      section: 'Section 52 - Penalty for Misbranded Food & Mandatory Label Tampering',
      title: 'Misbranding & Tampered Date of Expiry'
    },
    {
      keywords: ['unhygienic kitchen', 'open sewer next to kitchen', 'no hairnets', 'filthy utensils', 'untreated tap water in cooking', 'cockroach infestation in dining', 'maggots in raw meat storage'],
      section: 'Section 26 & Schedule 4 - General Sanitary and Hygiene Requirements',
      title: 'Gross Breach of Mandatory Sanitary Standards'
    },
    {
      keywords: ['beef served instead of veg', 'non veg in veg order', 'pork served without notice', 'deceptive food category', 'halal adulteration'],
      section: 'Section 53 - Penalty for Misleading Representation to Consumer',
      title: 'Deceptive Representation of Food Nature'
    }
  ];

  // Check if statutory offenses match
  for (const offense of statutoryOffenses) {
    if (offense.keywords.some(k => normalized.includes(k))) {
      return {
        jurisdictionVerified: true,
        isCustomerServiceOnly: false,
        citedFSSAISection: offense.section,
        verdictTitle: offense.title,
        verdictDescription: `Falls squarely under FSSA 2006 statutory purview: ${offense.section}. Official site raid and seizure warranted.`,
        suggestedAction: 'FORWARD_TO_OFFICERS'
      };
    }
  }

  // Check if it's purely customer service dispute
  const isCustService = customerServiceTriggers.some(trigger => normalized.includes(trigger));
  if (isCustService) {
    return {
      jurisdictionVerified: false,
      isCustomerServiceOnly: true,
      verdictTitle: 'Non-Jurisdictional Commercial / Delivery Dispute',
      verdictDescription: 'This grievance pertains to commercial delivery delay or customer service quality rather than public food safety hygiene, adulteration, or contamination under FSSAI 2006. Case routed to Consumer Forum / App Support.',
      suggestedAction: 'REJECT_REDIRECT_CONSUMER_COURT'
    };
  }

  // Default fallback check: If food quality or health is mentioned even broadly
  if (normalized.includes('ill') || normalized.includes('hygiene') || normalized.includes('smell') || normalized.includes('dirty') || normalized.includes('safety') || normalized.includes('taste strange')) {
    return {
      jurisdictionVerified: true,
      isCustomerServiceOnly: false,
      citedFSSAISection: 'Section 26 - General Food Safety Responsibility',
      verdictTitle: 'Suspected Food Quality & Safety Anomaly',
      verdictDescription: 'Borderline food safety issue verified for physical officer review under general safety standards.',
      suggestedAction: 'FORWARD_TO_OFFICERS'
    };
  }

  // Otherwise rejected
  return {
    jurisdictionVerified: false,
    isCustomerServiceOnly: false,
    verdictTitle: 'Insufficient Food Safety Grounds',
    verdictDescription: 'Description does not demonstrate a prima facie violation of the Food Safety and Standards Act 2006. Please provide specific details of contamination, adulteration, or illness.',
    suggestedAction: 'REJECT_REDIRECT_CONSUMER_COURT'
  };
}

/**
 * Computes a standardized hash code for grievance content (text + business + issue)
 * to detect concurrent duplicates across higher officials' dashboards.
 */
export function generateGrievanceHash(businessName: string, keywordSummary: string, city: string): string {
  const raw = `${businessName.trim().toLowerCase()}|${keywordSummary.trim().toLowerCase()}|${city.trim().toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `GRV-HASH-${hex.toUpperCase()}`;
}

/**
 * Calculates priority based on:
 * - Violation severity
 * - FSSAI license validity (expired or missing = instant escalation!)
 * - Multiple duplicate reports / Hotspot clusters
 * - Warnings or threats issued by business
 */
export function calculateGrievancePriority(params: {
  jurisdictionSection?: string;
  fssaiLicenseStatus: FSSAIBusinessRecord['licenseStatus'];
  clusterCount: number;
  hasBusinessThreatenedCitizen: boolean;
  issueType: IssueType;
}): PriorityLevel {
  const { jurisdictionSection, fssaiLicenseStatus, clusterCount, hasBusinessThreatenedCitizen } = params;

  // Rule 1: Operating without active license / expired license is an immediate High or Critical offense
  if (fssaiLicenseStatus === 'EXPIRED' || fssaiLicenseStatus === 'SUSPENDED' || fssaiLicenseStatus === 'NOT_FOUND') {
    if (clusterCount >= 2 || hasBusinessThreatenedCitizen) {
      return 'critical';
    }
    return 'high';
  }

  // Rule 2: Unsafe food / hospitalization / toxic adulteration
  if (jurisdictionSection?.includes('Section 59') || jurisdictionSection?.includes('Section 57')) {
    return 'critical';
  }

  // Rule 3: Extraneous matter / pests / dead insect
  if (jurisdictionSection?.includes('Section 54')) {
    if (clusterCount >= 3 || hasBusinessThreatenedCitizen) {
      return 'critical';
    }
    return 'high';
  }

  // Rule 4: Substandard / hygiene violations
  if (jurisdictionSection?.includes('Section 51') || jurisdictionSection?.includes('Section 26')) {
    if (clusterCount >= 3) {
      return 'high';
    }
    return 'medium';
  }

  // Default
  return 'low';
}

/**
 * Computes citizen reward bounty upon successful physical raid and settlement.
 */
export function calculateCitizenReward(priority: PriorityLevel): number {
  switch (priority) {
    case 'critical':
      return 3500;
    case 'high':
      return 1500;
    case 'medium':
      return 500;
    case 'low':
    default:
      return 250;
  }
}

/**
 * Bank Account and IFSC validation.
 */
export function validateBankDetails(accountNumber: string, ifscCode: string): { isValid: boolean; error?: string } {
  if (!accountNumber || accountNumber.trim().length < 9 || accountNumber.trim().length > 18) {
    return { isValid: false, error: 'Bank account number must be between 9 and 18 digits.' };
  }
  if (!/^\d+$/.test(accountNumber.trim())) {
    return { isValid: false, error: 'Bank account number must contain only numbers.' };
  }
  const ifscClean = ifscCode.trim().toUpperCase();
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(ifscClean)) {
    return { isValid: false, error: 'Invalid IFSC format. Expected 4 letters, 0, then 6 alphanumeric characters (e.g. SBIN0001234, HDFC0000456).' };
  }
  return { isValid: true };
}
