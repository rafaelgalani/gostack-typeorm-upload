// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  public async execute(
    transactions: Array<
      Pick<Transaction, 'category' | 'type' | 'title' | 'value'>
    >,
  ): Promise<Transaction[]> {
    const transactionRepository = new TransactionRepository();

    const createdTransactions = transactions.map(transaction =>
      Object.assign(new Transaction(), transaction),
    );
    const result = await transactionRepository.save(createdTransactions);
    return result;
  }
}

export default ImportTransactionsService;
