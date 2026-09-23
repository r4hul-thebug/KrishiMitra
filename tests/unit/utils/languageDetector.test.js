import { describe, it, expect } from '@jest/globals';
import { getStateLanguage } from '@/utils/languageDetector.js';

describe('Utility: getStateLanguage', () => {
  it('should return null when input is null, undefined, or empty', () => {
    expect(getStateLanguage(null)).toBeNull();
    expect(getStateLanguage(undefined)).toBeNull();
    expect(getStateLanguage('')).toBeNull();
  });

  it('should correctly map Northern and Central Hindi-belt states', () => {
    expect(getStateLanguage('Uttar Pradesh')).toBe('hi');
    expect(getStateLanguage('madhya pradesh')).toBe('hi');
    expect(getStateLanguage('Bihar')).toBe('hi');
    expect(getStateLanguage('Rajasthan')).toBe('hi');
    expect(getStateLanguage('Haryana')).toBe('hi');
    expect(getStateLanguage('Jharkhand')).toBe('hi');
    expect(getStateLanguage('Chhattisgarh')).toBe('hi');
    expect(getStateLanguage('Uttarakhand')).toBe('hi');
    expect(getStateLanguage('Himachal Pradesh')).toBe('hi');
    expect(getStateLanguage('Delhi')).toBe('hi');
  });

  it('should correctly map Western Indian states', () => {
    expect(getStateLanguage('Maharashtra')).toBe('mr');
    expect(getStateLanguage('Goa')).toBe('mr');
    expect(getStateLanguage('Gujarat')).toBe('gu');
    expect(getStateLanguage('Dadra and Nagar Haveli')).toBe('gu');
  });

  it('should correctly map Southern Indian states', () => {
    expect(getStateLanguage('Tamil Nadu')).toBe('ta');
    expect(getStateLanguage('Puducherry')).toBe('ta');
    expect(getStateLanguage('Telangana')).toBe('te');
    expect(getStateLanguage('Andhra Pradesh')).toBe('te');
    expect(getStateLanguage('Karnataka')).toBe('kn');
    expect(getStateLanguage('Kerala')).toBe('ml');
    expect(getStateLanguage('Lakshadweep')).toBe('ml');
  });

  it('should correctly map Eastern Indian states', () => {
    expect(getStateLanguage('Punjab')).toBe('pa');
    expect(getStateLanguage('Chandigarh')).toBe('pa');
    expect(getStateLanguage('West Bengal')).toBe('bn');
    expect(getStateLanguage('Tripura')).toBe('bn');
    expect(getStateLanguage('Odisha')).toBe('or');
    expect(getStateLanguage('Assam')).toBe('as');
  });

  it('should return null for states without custom regional override (defaults to Hindi/English)', () => {
    expect(getStateLanguage('Nagaland')).toBeNull();
    expect(getStateLanguage('Mizoram')).toBeNull();
    expect(getStateLanguage('Sikkim')).toBeNull();
  });
});
