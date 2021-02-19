import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const incomeTransations = allTransactions.filter(
      transaction => transaction.type === 'income',
    );
    const outcomeTransations = allTransactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const result = {} as Balance;

    result.income = incomeTransations.reduce(
      (a: number, b: Transaction) => a + b.value,
      0,
    );
    result.outcome = outcomeTransations.reduce(
      (a: number, b: Transaction) => a + b.value,
      0,
    );
    result.total = result.income - result.outcome;
    return result;
  }
}

export default TransactionsRepository;
