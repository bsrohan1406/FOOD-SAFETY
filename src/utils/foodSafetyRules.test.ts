import test from 'node:test';
import assert from 'node:assert';
import { 
  isValidFSSAILicense, 
  isValidIFSC, 
  scanStatutoryJurisdiction, 
  calculatePriorityLevel,
  calculateStatutoryBountyINR
} from './foodSafetyRules.ts';

test('FSSAI license validation tests', () => {
  assert.strictEqual(isValidFSSAILicense('10019011000123'), true);
  assert.strictEqual(isValidFSSAILicense('12345'), false);
  assert.strictEqual(isValidFSSAILicense('1001901100012A'), false);
  assert.strictEqual(isValidFSSAILicense('  10019011000123  '), true);
});

test('IFSC code validation tests', () => {
  assert.strictEqual(isValidIFSC('SBIN0001234'), true);
  assert.strictEqual(isValidIFSC('HDFC0005678'), true);
  assert.strictEqual(isValidIFSC('INVALID123'), false);
});

test('Statutory Jurisdiction Scanner detects non-jurisdictional consumer delays', () => {
  const result = scanStatutoryJurisdiction('My delivery was late and the delivery boy was rude, order delayed by 40 minutes');
  assert.strictEqual(result.isJurisdictionValid, false);
  assert.ok(result.rejectionReason?.includes('Non-jurisdictional'));
});

test('Statutory Jurisdiction Scanner tags dangerous contamination under Section 59', () => {
  const result = scanStatutoryJurisdiction('Found glass shards and cockroach in chicken biryani ordered today');
  assert.strictEqual(result.isJurisdictionValid, true);
  assert.ok(result.applicableSections.includes('Section 59'));
  assert.strictEqual(result.severityScore, 10);
});

test('Statutory Jurisdiction Scanner flags unlicensed food business under Section 31', () => {
  const result = scanStatutoryJurisdiction('Local street kitchen serving paneer', [], true);
  assert.strictEqual(result.isJurisdictionValid, true);
  assert.ok(result.applicableSections.includes('Section 31'));
});

test('Priority Level computation escalates repeat clusters and high severity', () => {
  assert.strictEqual(calculatePriorityLevel(10, 1, false), 'Critical');
  assert.strictEqual(calculatePriorityLevel(5, 3, false), 'Critical');
  assert.strictEqual(calculatePriorityLevel(6, 1, false), 'Elevated');
  assert.strictEqual(calculatePriorityLevel(4, 1, false), 'Standard');
});

test('Statutory Bounty rewards 10% compounding fine or tiered baseline', () => {
  assert.strictEqual(calculateStatutoryBountyINR(25000, 7), 2500);
  assert.strictEqual(calculateStatutoryBountyINR(0, 10), 5000);
  assert.strictEqual(calculateStatutoryBountyINR(0, 5), 1000);
});
