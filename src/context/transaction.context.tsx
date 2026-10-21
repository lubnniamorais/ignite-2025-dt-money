import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

import { TransactionCategory } from '@/shared/interfaces/https/transaction-categories-response';
import * as transactionServices from '@/shared/services/dt-money/transaction.service';
import { CreateTransactionInterface } from '@/shared/interfaces/https/create-transaction-request';
import { Transaction } from '@/shared/interfaces/transaction';
import { TotalTransactions } from '@/shared/interfaces/total-transactions';

export type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createTransaction: (transaction: CreateTransactionInterface) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  totalTransactions: TotalTransactions;
  transactions: Transaction[];
};

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<TotalTransactions>(
    {
      expense: 0,
      revenue: 0,
      total: 0,
    }
  );

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

  const fetchTransactions = useCallback(async () => {
    const transactionResponse = await transactionServices.getTransactions({
      page: 0,
      perPage: 10,
    });

    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions);
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        categories,
        fetchCategories,
        createTransaction,
        fetchTransactions,
        totalTransactions,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  return useContext(TransactionContext);
};
