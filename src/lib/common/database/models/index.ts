import { Sequelize } from 'sequelize';
import { initWalletModel } from './wallet.model';
import { initTransactionLogModel } from './transaction-log.model';
import { Wallet } from './wallet.model';
import { TransactionLog } from './transaction-log.model';

export function initModels(sequelize: Sequelize) {
  initWalletModel(sequelize);
  initTransactionLogModel(sequelize);

  TransactionLog.belongsTo(Wallet, {
    as: 'fromWallet',
    foreignKey: 'fromWalletId',
  });
  TransactionLog.belongsTo(Wallet, {
    as: 'toWallet',
    foreignKey: 'toWalletId',
  });
  Wallet.hasMany(TransactionLog, { foreignKey: 'fromWalletId' });
  Wallet.hasMany(TransactionLog, { foreignKey: 'toWalletId' });

  return { Wallet, TransactionLog };
}

export { Wallet } from './wallet.model';
export {
  TransactionLog,
  TRANSACTION_LOG_STATE,
  type TransactionLogState,
} from './transaction-log.model';
