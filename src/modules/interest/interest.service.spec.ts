import {
  getDaysInYear,
  isLeapYear,
  calculateDailyInterest,
  ANNUAL_RATE_THOUSANDTHS,
} from './interest.service';

describe('InterestService (math and edge cases)', () => {
  describe('getDaysInYear', () => {
    it('returns 365 for non-leap years', () => {
      expect(getDaysInYear(2023)).toBe(365);
      expect(getDaysInYear(2022)).toBe(365);
      expect(getDaysInYear(1900)).toBe(365);
      expect(getDaysInYear(2100)).toBe(365);
    });

    it('returns 366 for leap years', () => {
      expect(getDaysInYear(2024)).toBe(366);
      expect(getDaysInYear(2020)).toBe(366);
      expect(getDaysInYear(2000)).toBe(366);
      expect(getDaysInYear(2400)).toBe(366);
    });

    it('throws for invalid year', () => {
      expect(() => getDaysInYear(0)).toThrow(RangeError);
      expect(() => getDaysInYear(10000)).toThrow(RangeError);
      expect(() => getDaysInYear(1.5)).toThrow(RangeError);
    });
  });

  describe('isLeapYear', () => {
    it('returns true for years divisible by 4 but not 100', () => {
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2020)).toBe(true);
      expect(isLeapYear(2016)).toBe(true);
    });

    it('returns false for years divisible by 100 but not 400', () => {
      expect(isLeapYear(1900)).toBe(false);
      expect(isLeapYear(2100)).toBe(false);
    });

    it('returns true for years divisible by 400', () => {
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(2400)).toBe(true);
    });

    it('returns false for non-leap years', () => {
      expect(isLeapYear(2023)).toBe(false);
      expect(isLeapYear(2019)).toBe(false);
    });
  });

  describe('calculateDailyInterestCents (math precision)', () => {
    const rate = ANNUAL_RATE_THOUSANDTHS;

    it('returns 0 for zero principal', () => {
      expect(calculateDailyInterest(0, 1, 2023, rate)).toBe(0n);
      expect(calculateDailyInterest(0n, 365, 2023, rate)).toBe(0n);
    });

    it('returns 0 for zero days', () => {
      expect(calculateDailyInterest(10000, 0, 2023, rate)).toBe(0n);
    });

    it('computes one day interest for non-leap year (no floating-point error)', () => {
      // 10_000 cents at 27.5% for 1 day in 365-day year: 10000 * 275 * 1 / (1000 * 365) = 7.53... -> 7 (truncated)
      const interest = calculateDailyInterest(10_000, 1, 2023, rate);
      expect(interest).toBe(7n);
    });

    it('computes one day interest for leap year (different denominator)', () => {
      // 10_000 cents at 27.5% for 1 day in 366-day year: 10000 * 275 * 1 / (1000 * 366) = 7.51... -> 7 (truncated)
      const interest = calculateDailyInterest(10_000, 1, 2024, rate);
      expect(interest).toBe(7n);
    });

    it('full year non-leap: interest equals 27.5% of principal (integer truncation)', () => {
      const principalCents = 100_000;
      const interest = calculateDailyInterest(principalCents, 365, 2023, rate);
      // 100000 * 0.275 = 27500 cents exact
      expect(interest).toBe(27_500n);
    });

    it('full year leap: interest slightly less per day, 366 days total', () => {
      const principalCents = 100_000;
      const interest = calculateDailyInterest(principalCents, 366, 2024, rate);
      // 100000 * 275 * 366 / (1000 * 366) = 27500
      expect(interest).toBe(27_500n);
    });

    it('uses BigInt and avoids floating-point rounding errors for large amounts', () => {
      const principalCents = 99_999_999_999; // large amount
      const interest = calculateDailyInterest(principalCents, 1, 2023, rate);
      // Exact integer: 99999999999 * 275 / (1000 * 365) = 75342465...
      expect(interest).toBe(75_342_465n);
      expect(typeof interest).toBe('bigint');
    });

    it('throws for negative days', () => {
      expect(() => calculateDailyInterest(1000, -1, 2023, rate)).toThrow(
        RangeError,
      );
    });

    it('accepts bigint principal', () => {
      expect(calculateDailyInterest(10_000n, 1, 2023, rate)).toBe(7n);
    });

    it('scales to larger principal without floating-point error (1M cents, 1 day)', () => {
      // 1_000_000 cents at 27.5% for 1 day in 365-day year: 1000000 * 275 / (1000 * 365) = 753.424... -> 753
      expect(calculateDailyInterest(1_000_000, 1, 2023, rate)).toBe(753n);
    });
  });

  describe('InterestService (unit)', () => {
    it('uses ANNUAL_RATE_THOUSANDTHS 275 for 27.5%', () => {
      expect(ANNUAL_RATE_THOUSANDTHS).toBe(275);
    });
  });
});
