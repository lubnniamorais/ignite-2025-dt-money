import { api } from '@/shared/api/dt-money';
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
