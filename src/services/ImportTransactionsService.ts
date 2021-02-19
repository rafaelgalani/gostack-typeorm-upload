// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

export type ImportedTransaction = Pick<
  Transaction,
  'category' | 'type' | 'title' | 'value'
> & { category: string };
class ImportTransactionsService {
  public async execute(
    transactions: Array<ImportedTransaction>,
  ): Promise<Transaction[]> {
    const transactionRepository = getRepository(Transaction);

    let result = [];
    const categories: { name: string; category: Category }[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const transaction of transactions) {
      const { title, value, type, category } = transaction;
      const newTransaction = new Transaction();
      Object.assign(newTransaction, { title, value, type });

      newTransaction.category =
        // eslint-disable-next-line no-await-in-loop
        (await getRepository(Category).findOne({ title: category })) ||
        categories.find(a => a.name === category)?.category ||
        new Category();

      newTransaction.category.title = category;
      categories.push({
        name: newTransaction.category.title,
        category: newTransaction.category,
      });
      result.push(newTransaction);
    }
    result = await transactionRepository.save(result);
    return result;
  }
}

export default ImportTransactionsService;
