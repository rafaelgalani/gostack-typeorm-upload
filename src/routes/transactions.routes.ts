import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import * as csv from 'fast-csv';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService, { ImportedTransaction } from '../services/ImportTransactionsService';
import Transaction from '../models/Transaction';

const upload = multer({ dest: 'tmp/csv/' });

const transactionsRouter = Router();

transactionsRouter.get('/', async (_, response) => {
  const result = await getCustomRepository(TransactionsRepository).getBalance();
  return response.status(200).json(result);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const result = await new CreateTransactionService().execute({
    title,
    value,
    type,
    category,
  });
  return response.status(201).json(result);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id: transactionId } = request.params;
  const result = new DeleteTransactionService().execute(transactionId);
  return response.status(204).json(result);
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const rows: ImportedTransaction[] = [];
    const content = fs.readFileSync(request.file.path, 'utf8');

    await csv
      .parseString<ImportedTransaction, ImportedTransaction>(content, {
        headers: true,
        trim: true,
      })
      .on('data', row => {
        rows.push(row);
      })
      .on('end', async () => {
        await new ImportTransactionsService().execute(rows);
        return response.status(201).json(rows);
      });
  },
);

export default transactionsRouter;
