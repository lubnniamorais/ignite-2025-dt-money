import qs from 'qs';

import { api } from '@/shared/api/dt-money';

import { CreateTransactionInterface } from '@/shared/interfaces/https/create-transaction-request';
import {
  GetTransactionsParams,
  GetTransactionsResponse,
} from '@/shared/interfaces/https/get-transactions-request';
import { TransactionCategory } from '@/shared/interfaces/https/transaction-categories-response';

// Vai retornar um array de categorias
export const getTransactionCategories = async (): Promise<
  TransactionCategory[]
> => {
  const response = await api.get<TransactionCategory[]>(
    '/transactions/categories'
  );

  return response.data;
};

// Vai criar uma nova transação
export const createTransaction = async ({
  categoryId,
  description,
  typeId,
  value,
}: CreateTransactionInterface) => {
  await api.post('/transactions', {
    categoryId,
    description,
    typeId,
    value,
  });
};

// Vai retornar um array de transações
export const getTransactions = async (
  params: GetTransactionsParams
): Promise<GetTransactionsResponse> => {
  const response = await api.get<GetTransactionsResponse>('/transaction', {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
  });

  return response.data;
};

// Vai deletar uma transação
export const deleteTransaction = async (id: number) => {
  await api.delete(`/transactions/${id}`);
};
