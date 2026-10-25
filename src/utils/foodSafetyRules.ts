import { StatutorySection, StatutoryReview, PriorityLevel, CapturedEvidence } from '../types';

/**
 * Validates FSSAI 14-digit license number format
 */
export function isValidFSSAILicense(license: string): boolean {
  const clean = license.trim().replace(/\s+/g, '');
  return /^\d{14}$/.test(clean);
}

/**
 * Validates Indian IFSC bank code format
 */
export function isValidIFSC(ifsc: string): boolean {
  const clean = ifsc.trim().toUpperCase();
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(clean);
}

/**
 * Non-jurisdiction keywords under FSSA 2006 (Civil / Consumer Forum issues, not food safety)
 */
export const NON_JURISDICTION_TERMS = [
  'late delivery',
  'delivery boy',
  'driver rude',
  'wrong change',
  'discount coupon',
  'overpriced',
  'price high',
  'delivery delay',
  'cold food',
  'small portion',
  'packaging torn outside',
  'spilled gravy in bag',
  'app refund',
  'waiter service slow',
  'music too loud',
  'ac not working'
];

/**
 * Statutory Violation keywords mapped to Sections of Food Safety & Standards Act, 2006
 */
export const STATUTORY_KEYWORD_RULES: {
  section: StatutorySection;
  keywords: string[];
  severity: number;
  description: string;
}[] = [
  {
    section: 'Section 59', // Unsafe food / adulteration / dangerous contaminants
    keywords: ['glass shards', 'dead lizard', 'cockroach', 'rat poop', 'poisonous', 'chemical smell', 'maggots', 'larvae', 'metal piece', 'needle', 'severe food poisoning', 'hospitalized', 'vomiting blood'],
    severity: 10,
    description: 'Punishment for Unsafe Food (Serious health injury hazard or severe contamination under Section 59)'
  },
  {
    section: 'Section 54', // Extraneous matter / contaminants
    keywords: ['foreign object', 'hair strand', 'stone pebbles', 'dirt', 'plastic fragment', 'sand particles', 'dead insect', 'rubber band', 'extraneous matter'],
    severity: 8,
    description: 'Food containing extraneous matter or non-toxic particulate contaminants under Section 54'
  },
  {
    section: 'Section 51', // Substandard Food
    keywords: ['foul smell', 'rancid oil', 'rotten meat', 'spoiled gravy', 'sour curd', 'fungus', 'moldy bread', 'decomposed', 'stale odor', 'decayed vegetables'],
    severity: 7,
    description: 'Penalty for Substandard Food falling below requisite microbiological or freshness standards under Section 51'
  },
  {
    section: 'Section 52', // Misbranded Food
    keywords: ['missing fssai logo', 'expired batch', 'tampered date', 'relabelled', 'false organic claim', 'misleading label', 'hidden ingredients', 'fake fssai number'],
    severity: 6,
    description: 'Penalty for Misbranded Food or fraudulent statutory labeling under Section 52'
  },
  {
    section: 'Section 50', // Food not of nature or substance demanded
    keywords: ['synthetic milk', 'adulterated paneer', 'chalk powder', 'colored chili powder', 'artificial food dye', 'substitute ingredient', 'animal fat adulteration', 'starch adulteration'],
    severity: 8,
    description: 'Penalty for selling food not of the nature, substance or quality demanded under Section 50'
  }
];

/**
 * Evaluates citizen grievance text and selected tags against FSS Act 2006
 */
export function scanStatutoryJurisdiction(
  text: string,
  selectedKeywords: string[] = [],
  isLicenseExpiredOrMissing: boolean = false
): StatutoryReview {
  const combined = `${text.toLowerCase()} ${selectedKeywords.map(k => k.toLowerCase()).join(' ')}`;

  // 1. Detect if it's strictly a civil consumer issue rather than food safety
  const matchesNonJurisdiction = NON_JURISDICTION_TERMS.some(term => combined.includes(term));
  const hasSafetyTerms = STATUTORY_KEYWORD_RULES.some(rule => 
    rule.keywords.some(k => combined.includes(k.toLowerCase()))
  );

  if (matchesNonJurisdiction && !hasSafetyTerms && !isLicenseExpiredOrMissing) {
    return {
      isJurisdictionValid: false,
      applicableSections: [],
      severityScore: 1,
      clusteredIncidentCount: 1,
      flaggedKeywords: [],
      summaryRationale: 'Grievance relates purely to commercial delivery/customer service delay and falls under District Consumer Commission, outside FSSAI Food Safety jurisdiction.',
      rejectionReason: 'Non-jurisdictional consumer dispute under Section 3(1)(k) of FSS Act 2006.'
    };
  }

  // 2. Identify all applicable statutory sections
  const matchedSections: StatutorySection[] = [];
  const flaggedKeywords: string[] = [];
  let maxSeverity = 4;

  if (isLicenseExpiredOrMissing) {
    matchedSections.push('Section 31');
    maxSeverity = Math.max(maxSeverity, 8);
    flaggedKeywords.push('unlicensed / expired FSSAI');
  }

  for (const rule of STATUTORY_KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      if (combined.includes(kw.toLowerCase())) {
        if (!matchedSections.includes(rule.section)) {
          matchedSections.push(rule.section);
        }
        if (!flaggedKeywords.includes(kw)) {
          flaggedKeywords.push(kw);
        }
        if (rule.severity > maxSeverity) {
          maxSeverity = rule.severity;
        }
      }
    }
  }

  if (matchedSections.length === 0) {
    // Default to Section 50/51 broad safety review if user flagged genuine food defect
    matchedSections.push('Section 50');
    matchedSections.push('Section 51');
    maxSeverity = 5;
  }

  // If fine or compounding may apply
  if (maxSeverity >= 6) {
    matchedSections.push('Section 69');
  }

  return {
    isJurisdictionValid: true,
    applicableSections: matchedSections,
    severityScore: maxSeverity,
    clusteredIncidentCount: 1,
    flaggedKeywords,
    summaryRationale: `Categorized under FSSA 2006 statutory jurisdiction: ${matchedSections.join(', ')}. Severity score: ${maxSeverity}/10.`
  };
}

/**
 * Determines pipeline priority based on severity, repeat cluster, and license status
 */
export function calculatePriorityLevel(
  severityScore: number,
  clusterCount: number,
  isUnlicensed: boolean
): PriorityLevel {
  if (isUnlicensed || severityScore >= 8 || clusterCount >= 3) {
    return 'Critical';
  }
  if (severityScore >= 6 || clusterCount >= 2) {
    return 'Elevated';
  }
  return 'Standard';
}

/**
 * Calculates statutory citizen bounty based on officer compounding fine or standard statutory bracket
 */
export function calculateStatutoryBountyINR(compoundingFineINR: number = 0, severityScore: number = 5): number {
  if (compoundingFineINR > 0) {
    // 10% of compounding fine under Section 69, capped between ₹1,000 and ₹15,000
    const tenPercent = Math.round(compoundingFineINR * 0.1);
    return Math.max(1000, Math.min(15000, tenPercent));
  }

  // Statutory baseline reward tier
  if (severityScore >= 8) return 5000;
  if (severityScore >= 6) return 2500;
  return 1000;
}

/**
 * Evaluates client-side image canvas data for luminance, blur variance & heuristic quality
 */
export function analyzeImageStructuralQuality(
  imgData: ImageData
): {
  luminance: number;
  blurScore: number;
  foodConfidence: number;
  passed: boolean;
  failureReason?: string;
} {
  const data = imgData.data;
  const totalPixels = imgData.width * imgData.height;
  if (totalPixels === 0) {
    return { luminance: 0, blurScore: 0, foodConfidence: 0, passed: false, failureReason: 'Empty image' };
  }

  let totalLuminance = 0;
  let colorVariation = 0;
  const step = 4; // Sample every 4th pixel for speed
  let sampleCount = 0;

  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuminance += lum;
    colorVariation += Math.abs(r - g) + Math.abs(g - b);
    sampleCount++;
  }

  const avgLuminance = Math.round(totalLuminance / sampleCount);
  const avgVariation = colorVariation / sampleCount;

  // Approximate edge gradient / blur estimation
  let gradientSum = 0;
  const width = imgData.width;
  for (let y = 1; y < imgData.height - 1; y += 4) {
    for (let x = 1; x < width - 1; x += 4) {
      const idx = (y * width + x) * 4;
      const rightIdx = (y * width + (x + 1)) * 4;
      const downIdx = ((y + 1) * width + x) * 4;
      
      const diffX = Math.abs(data[idx] - data[rightIdx]);
      const diffY = Math.abs(data[idx] - data[downIdx]);
      gradientSum += diffX + diffY;
    }
  }

  const blurScore = Math.min(100, Math.round((gradientSum / (sampleCount * 0.5)) * 1.8));
  // Food heuristic based on natural organic color tone variations (warm amber/yellow/greens vs monochromatic)
  const foodConfidence = Math.min(98, Math.max(45, Math.round(avgVariation * 1.5 + (avgLuminance > 50 && avgLuminance < 210 ? 25 : 0))));

  if (avgLuminance < 35) {
    return {
      luminance: avgLuminance,
      blurScore,
      foodConfidence,
      passed: false,
      failureReason: 'Luminance too low (Pitch black / underexposed). Please shine adequate light.'
    };
  }

  if (avgLuminance > 240) {
    return {
      luminance: avgLuminance,
      blurScore,
      foodConfidence,
      passed: false,
      failureReason: 'Luminance too high (Washed out / flash glare). Please avoid harsh direct reflection.'
    };
  }

  if (blurScore < 14) {
    return {
      luminance: avgLuminance,
      blurScore,
      foodConfidence,
      passed: false,
      failureReason: 'Motion blur detected. Hold the camera steady for clear macro focus.'
    };
  }

  return {
    luminance: avgLuminance,
    blurScore,
    foodConfidence,
    passed: true
  };
}

/**
 * Generates cryptographic-styled mock hash for evidence verification
 */
export function generateEvidenceHash(prefix: string, seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const rand = Math.random().toString(16).substring(2, 8);
  return `${prefix}_0x${hex}${rand}`.toUpperCase();
}
