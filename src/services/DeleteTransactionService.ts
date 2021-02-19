// import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(transactionId: string): Promise<void> {
    const transactionRepository = new TransactionRepository();
    await transactionRepository.delete(transactionId);
  }
}

export default DeleteTransactionService;
