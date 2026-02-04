import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from 'sequelize';
import { Sequelize } from 'sequelize';

export class Wallet extends Model<
  InferAttributes<Wallet>,
  InferCreationAttributes<Wallet>
> {
  declare id: CreationOptional<number>;
  declare balance: number;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export function initWalletModel(sequelize: Sequelize) {
  Wallet.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      balance: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'balance',
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
      tableName: 'wallets',
      underscored: true,
      timestamps: true,
    },
  );
  return Wallet;
}
