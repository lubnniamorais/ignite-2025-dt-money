import { api } from '@/shared/api/dt-money';
import { CreateTransactionInterface } from '@/shared/interfaces/https/create-transaction-request';
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
