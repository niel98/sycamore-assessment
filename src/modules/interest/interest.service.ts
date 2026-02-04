import { Injectable, Inject } from '@nestjs/common';
import { SEQUELIZE } from '../../lib/common/database';
import { Wallet, InterestAccrual } from '../../lib/common/database';
import type { Sequelize } from 'sequelize';
import { INotFoundException } from '../../lib/utils/exceptions/exception';

/** 27.5% per annum = 275 thousandths (no floating point) */
export const ANNUAL_RATE_THOUSANDTHS = 275;

/**
 * Returns the number of days in the given year (365 or 366 for leap years).
 * Used for precise daily rate calculation.
 */
export function getDaysInYear(year: number): number {
  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    throw new RangeError('year must be an integer between 1 and 9999');
  }
  return isLeapYear(year) ? 366 : 365;
}

export function isLeapYear(year: number): boolean {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  if (year % 4 === 0) return true;
  return false;
}

/**
 * Computes daily interest using integer math (BigInt) to avoid floating-point errors.
 * Formula: interest = floor(principalCents * rate * days / (1000 * daysInYear))
 * Rate is 27.5% = 275/1000.
 */
export function calculateDailyInterest(
  principalCents: number | bigint,
  days: number,
  year: number,
  annualRateThousandths: number = ANNUAL_RATE_THOUSANDTHS,
): bigint {
  if (days < 0 || !Number.isInteger(days)) {
    throw new RangeError('days must be a non-negative integer');
  }
  if (days === 0) return 0n;
  const principal = BigInt(principalCents);
  if (principal <= 0n) return 0n;
  const daysInYear = getDaysInYear(year);
  const rate = BigInt(annualRateThousandths);
  return (principal * rate * BigInt(days)) / (1000n * BigInt(daysInYear));
}

@Injectable()
export class InterestService {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  /**
   * Calculates interest for a given principal, number of days, and year.
   * Uses BigInt for precision; returns number of interest cents.
   */
  calculateInterest(
    principal: number | bigint,
    days: number,
    year: number,
    annualRate: number = ANNUAL_RATE_THOUSANDTHS,
  ): bigint {
    return calculateDailyInterest(principal, days, year, annualRate);
  }

  /**
   * Records an interest accrual row in the database.
   */
  async recordAccrual(
    walletId: number,
    accruedForDate: Date,
    principal: bigint,
    interest: bigint,
    year: number,
    annualRate: number = ANNUAL_RATE_THOUSANDTHS,
  ): Promise<InterestAccrual> {
    const dateOnly = new Date(accruedForDate);
    dateOnly.setUTCHours(0, 0, 0, 0);
    return InterestAccrual.create({
      walletId,
      accruedForDate: dateOnly,
      principal,
      interest,
      annualRate,
      year,
    });
  }

  /**
   * Accrues one day of interest for a wallet on the given date: reads balance,
   * computes interest with correct days-in-year (leap year), records accrual,
   * and optionally credits the wallet (caller can do that to keep accrual immutable).
   */
  async accrueInterestForWallet(
    walletId: number,
    forDate: Date,
  ): Promise<{ interestCents: bigint; accrual: InterestAccrual }> {
    const wallet = await Wallet.findByPk(walletId);
    if (!wallet) {
      throw new INotFoundException({ message: 'Wallet not found' });
    }
    const principalCents = BigInt(wallet.get('balance') ?? 0);
    const year = forDate.getFullYear();
    const interestCents = this.calculateInterest(principalCents, 1, year);

    const accrual = await this.recordAccrual(
      walletId,
      forDate,
      principalCents,
      interestCents,
      year,
    );
    return { interestCents, accrual };
  }
}
