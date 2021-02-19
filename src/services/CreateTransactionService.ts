// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class CreateTransactionService {
  public async execute({
    title,
    value,
    category,
    type,
  }: Partial<Transaction> & { category: string }): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const newTransaction = new Transaction();
    Object.assign(newTransaction, { title, value, type });

    newTransaction.category =
      (await getRepository(Category).findOne({ title: category })) ||
      new Category();

    newTransaction.category.title = category;

    const result = await transactionRepository.save(newTransaction);
    return result;
  }
}

export default CreateTransactionService;
