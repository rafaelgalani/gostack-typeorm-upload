import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import * as csv from 'fast-csv';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import Transaction from '../models/Transaction';

const upload = multer({ dest: 'tmp/csv/' });

const transactionsRouter = Router();

transactionsRouter.get('/', async () => {
  return new TransactionsRepository().find();
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
  async (request, _) => {
    const rows: Partial<Transaction>[] = [];
    fs.createReadStream(request.file.path)
      .pipe(csv.parse({ headers: true }))
      .pipe(
        csv.format<Partial<Transaction>, Partial<Transaction>>({
          headers: true,
        }),
      )
      .transform((row, next) => {
        rows.push(row);
        next(null, row);
      })
      .on('end', () => {
        // eslint-disable-next-line no-console
        console.log(rows);
      });
  },
);

export default transactionsRouter;
