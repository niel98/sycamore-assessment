import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { Inject } from '@nestjs/common';
import { SEQUELIZE } from '../../lib/common/database';
import {
  Wallet,
  TransactionLog,
  TRANSACTION_LOG_STATE,
  type TransactionLogState,
} from '../../lib/common/database';
import {
  IBadRequestException,
  INotFoundException,
} from '../../lib/utils/exceptions/exception';

export interface TransferResult {
  id: number;
  reference: string;
  status: TransactionLogState;
  fromWalletId: number;
  toWalletId: number;
  amount: number;
  created_at: Date;
  updated_at: Date;
}

function toTransferResult(log: TransactionLog): TransferResult {
  return {
    id: log.id,
    reference: log.reference,
    status: log.status,
    fromWalletId: log.fromWalletId,
    toWalletId: log.toWalletId,
    amount: Number(log.amount),
    created_at: log.created_at,
    updated_at: log.updated_at,
  };
}

@Injectable()
export class TransactionService {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  async transfer(
    reference: string,
    fromWalletId: number,
    toWalletId: number,
    amount: number,
  ): Promise<TransferResult> {
    if (fromWalletId === toWalletId) {
      throw new IBadRequestException({
        message: 'fromWalletId and toWalletId must be different',
      });
    }

    const existing = await TransactionLog.findOne({
      where: { reference },
    });
    if (existing) {
      return toTransferResult(existing);
    }

    let log: TransactionLog;
    try {
      log = await TransactionLog.create({
        reference,
        status: TRANSACTION_LOG_STATE.PENDING,
        fromWalletId,
        toWalletId,
        amount,
      });
    } catch (err: any) {
      if (err?.name === 'SequelizeUniqueConstraintError') {
        const again = await TransactionLog.findOne({
          where: { reference },
        });
        if (again) return toTransferResult(again);
      }
      throw err;
    }

    const t = await this.sequelize.transaction();

    try {
      const [fromWallet, toWallet] = await Promise.all([
        Wallet.findByPk(fromWalletId, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        }),
        Wallet.findByPk(toWalletId, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        }),
      ]);

      if (!fromWallet) {
        await log.update(
          { status: TRANSACTION_LOG_STATE.FAILED },
          { transaction: t },
        );
        await t.rollback();
        throw new INotFoundException({ message: 'From wallet not found' });
      }
      if (!toWallet) {
        await log.update(
          { status: TRANSACTION_LOG_STATE.FAILED },
          { transaction: t },
        );
        await t.rollback();
        throw new INotFoundException({ message: 'To wallet not found' });
      }

      const balance = Number(fromWallet.balance);
      if (balance < amount) {
        await log.update(
          { status: TRANSACTION_LOG_STATE.FAILED },
          { transaction: t },
        );
        await t.rollback();
        throw new IBadRequestException({
          message: 'Insufficient balance',
          data: { balance: balance, required: amount },
        });
      }

      await fromWallet.update(
        { balance: balance - amount },
        { transaction: t },
      );
      await toWallet.update(
        { balance: Number(toWallet.balance) + amount },
        { transaction: t },
      );
      await log.update(
        { status: TRANSACTION_LOG_STATE.COMPLETED },
        { transaction: t },
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      await log
        .update({ status: TRANSACTION_LOG_STATE.FAILED }, { transaction: t })
        .catch(() => {});
      throw err;
    }

    await log.reload();
    return toTransferResult(log);
  }
}
