import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from 'sequelize';
import { Sequelize } from 'sequelize';

export class InterestAccrual extends Model<
  InferAttributes<InterestAccrual>,
  InferCreationAttributes<InterestAccrual>
> {
  declare id: CreationOptional<number>;
  declare walletId: number;
  declare accruedForDate: Date;
  declare principal: bigint;
  declare interest: bigint;
  declare annualRate: number;
  declare year: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export function initInterestAccrualModel(sequelize: Sequelize) {
  InterestAccrual.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'wallet_id',
      },
      accruedForDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'accrued_for_date',
      },
      principal: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'principal',
      },
      interest: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'interest',
      },
      annualRate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'annual_rate',
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: 'interest_accruals',
      underscored: true,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['wallet_id', 'accrued_for_date'],
          name: 'interest_accruals_wallet_date_unique',
        },
      ],
    },
  );
  return InterestAccrual;
}
