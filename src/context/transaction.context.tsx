import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

import { TransactionCategory } from '@/shared/interfaces/https/transaction-categories-response';
import * as transactionServices from '@/shared/services/dt-money/transaction.service';
import { CreateTransactionInterface } from '@/shared/interfaces/https/create-transaction-request';

export type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createTransaction: (transaction: CreateTransactionInterface) => Promise<void>;
};

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);

  const fetchCategories = async () => {
    const categoriesResponse =
      await transactionServices.getTransactionCategories();

    setCategories(categoriesResponse);
  };

  const createTransaction = async ({
    categoryId,
    description,
    typeId,
    value,
  }: CreateTransactionInterface) => {
    await transactionServices.createTransaction({
      categoryId,
      description,
      typeId,
      value,
    });
  };

  return (
    <TransactionContext.Provider
      value={{ categories, fetchCategories, createTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  return useContext(TransactionContext);
};
