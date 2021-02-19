// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

type ImportedTransaction = Pick<
  Transaction,
  'category' | 'type' | 'title' | 'value'
>;
class ImportTransactionsService {
  public async execute(
    transactions: Array<ImportedTransaction & { category: string }>,
  ): Promise<Transaction[]> {
    const transactionRepository = getRepository(Transaction);

    let result = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const transaction of transactions){
      const { title, value, type, category } = transaction;
      const newTransaction = new Transaction();
      Object.assign(newTransaction, { title, value, type });

      newTransaction.category =
        // eslint-disable-next-line no-await-in-loop
        (await getRepository(Category).findOne({ title: category })) ||
        new Category();
      newTransaction.category.title = category;

      result.push(newTransaction);
    }
    result = await transactionRepository.save(result);
    return result;
  }
}

export default ImportTransactionsService;
