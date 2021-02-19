// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(transactionId: string): Promise<void> {
    await getRepository(Transaction).delete(transactionId);
  }
}

export default DeleteTransactionService;
