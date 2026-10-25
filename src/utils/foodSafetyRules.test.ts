import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isCitizenAgeValid,
  evaluateStructuralImageFilter,
  scanFSSAIJurisdiction,
  generateGrievanceHash,
  calculateGrievancePriority,
  calculateCitizenReward,
  validateBankDetails
} from './foodSafetyRules';

test('isCitizenAgeValid validates age threshold >= 18', () => {
  const ref = new Date('2026-10-25T00:00:00Z');
  // 20 years old
  const adult = isCitizenAgeValid('2006-01-01', ref);
  assert.equal(adult.isValid, true);
  assert.equal(adult.age >= 18, true);

  // 17 years old
  const minor = isCitizenAgeValid('2009-01-01', ref);
  assert.equal(minor.isValid, false);
  assert.match(minor.error || '', /Citizen must be at least 18 years old/);

  // Empty string
  const empty = isCitizenAgeValid('', ref);
  assert.equal(empty.isValid, false);
});

test('evaluateStructuralImageFilter rejects pitch black or blurred images', () => {
  // Pitch black image
  const pitchBlack = evaluateStructuralImageFilter({
    averageLuminance: 5,
    laplacianVariance: 200,
    detectedKeywords: ['food']
  });
  assert.equal(pitchBlack.passed, false);
  assert.equal(pitchBlack.isPitchBlack, true);
  assert.match(pitchBlack.rejectionReason || '', /pitch-black/);

  // Heavily blurred image
  const blurry = evaluateStructuralImageFilter({
    averageLuminance: 120,
    laplacianVariance: 30, // low variance = blurry
    detectedKeywords: ['food']
  });
  assert.equal(blurry.passed, false);
  assert.match(blurry.rejectionReason || '', /blurred/);

  // Non-food object image
  const nonFood = evaluateStructuralImageFilter({
    averageLuminance: 120,
    laplacianVariance: 300,
    detectedKeywords: ['laptop', 'car', 'keyboard']
  });
  assert.equal(nonFood.passed, false);
  assert.equal(nonFood.hasFoodRelatedObjects, false);

  // Sharp valid food image
  const valid = evaluateStructuralImageFilter({
    averageLuminance: 130,
    laplacianVariance: 450,
    detectedKeywords: ['plate', 'food', 'meal']
  });
  assert.equal(valid.passed, true);
  assert.equal(valid.hasFoodRelatedObjects, true);
});

test('scanFSSAIJurisdiction distinguishes statutory food safety vs customer service complaints', () => {
  // Statutory foreign object
  const pestCase = scanFSSAIJurisdiction('Found a dead cockroach inside the biryani box');
  assert.equal(pestCase.jurisdictionVerified, true);
  assert.equal(pestCase.isCustomerServiceOnly, false);
  assert.match(pestCase.citedFSSAISection || '', /Section 54/);
  assert.equal(pestCase.suggestedAction, 'FORWARD_TO_OFFICERS');

  // Statutory unsafe food poisoning
  const illnessCase = scanFSSAIJurisdiction('Severe food poisoning and vomiting after eating paneer butter masala');
  assert.equal(illnessCase.jurisdictionVerified, true);
  assert.match(illnessCase.citedFSSAISection || '', /Section 59/);

  // Pure customer service dispute
  const deliveryDelay = scanFSSAIJurisdiction('Zomato rider took wrong turn and delivery was delayed by 60 minutes');
  assert.equal(deliveryDelay.jurisdictionVerified, false);
  assert.equal(deliveryDelay.isCustomerServiceOnly, true);
  assert.equal(deliveryDelay.suggestedAction, 'REJECT_REDIRECT_CONSUMER_COURT');
});

test('generateGrievanceHash computes consistent unique hash codes', () => {
  const hash1 = generateGrievanceHash('Royal Biryani', 'Cockroach in meal', 'Hyderabad');
  const hash2 = generateGrievanceHash('Royal Biryani', 'Cockroach in meal', 'Hyderabad');
  const hashDiff = generateGrievanceHash('Taj Mahal Hotel', 'Cold tea', 'Mumbai');

  assert.equal(hash1, hash2);
  assert.notEqual(hash1, hashDiff);
  assert.match(hash1, /^GRV-HASH-[A-F0-9]+$/);
});

test('calculateGrievancePriority escalates on expired FSSAI license or repeated clusters', () => {
  // Expired license instantly gives high priority
  const expiredCase = calculateGrievancePriority({
    jurisdictionSection: 'Section 51',
    fssaiLicenseStatus: 'EXPIRED',
    clusterCount: 1,
    hasBusinessThreatenedCitizen: false,
    issueType: 'offline'
  });
  assert.equal(expiredCase, 'high');

  // Expired license + multiple cluster reports = critical
  const clusterExpiredCase = calculateGrievancePriority({
    jurisdictionSection: 'Section 51',
    fssaiLicenseStatus: 'EXPIRED',
    clusterCount: 3,
    hasBusinessThreatenedCitizen: false,
    issueType: 'offline'
  });
  assert.equal(clusterExpiredCase, 'critical');

  // Active license with simple substandard
  const normalCase = calculateGrievancePriority({
    jurisdictionSection: 'Section 51',
    fssaiLicenseStatus: 'ACTIVE',
    clusterCount: 1,
    hasBusinessThreatenedCitizen: false,
    issueType: 'online'
  });
  assert.equal(normalCase, 'medium');
});

test('calculateCitizenReward returns correct INR bounty matrix', () => {
  assert.equal(calculateCitizenReward('critical'), 3500);
  assert.equal(calculateCitizenReward('high'), 1500);
  assert.equal(calculateCitizenReward('medium'), 500);
  assert.equal(calculateCitizenReward('low'), 250);
});

test('validateBankDetails checks IFSC and account numbers', () => {
  assert.equal(validateBankDetails('123456789012', 'SBIN0001234').isValid, true);
  assert.equal(validateBankDetails('123', 'SBIN0001234').isValid, false);
  assert.equal(validateBankDetails('123456789012', 'INVALID_IFSC').isValid, false);
});
