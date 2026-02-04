import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from 'sequelize';
import { Sequelize } from 'sequelize';

export const TRANSACTION_LOG_STATE = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type TransactionLogState =
  (typeof TRANSACTION_LOG_STATE)[keyof typeof TRANSACTION_LOG_STATE];

export class TransactionLog extends Model<
  InferAttributes<TransactionLog>,
  InferCreationAttributes<TransactionLog>
> {
  declare id: CreationOptional<number>;
  declare reference: string;
  declare status: TransactionLogState;
  declare fromWalletId: number;
  declare toWalletId: number;
  declare amount: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export function initTransactionLogModel(sequelize: Sequelize) {
  TransactionLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reference: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'reference',
      },
      status: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      fromWalletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'from_wallet_id',
      },
      toWalletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'to_wallet_id',
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'amount',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'transaction_logs',
      underscored: true,
      timestamps: true,
    },
  );
  return TransactionLog;
}
