import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

import * as transactionServices from '@/shared/services/dt-money/transaction.service';

import { TransactionCategory } from '@/shared/interfaces/https/transaction-categories-response';
import { CreateTransactionInterface } from '@/shared/interfaces/https/create-transaction-request';
import { UpdateTransactionInterface } from '@/shared/interfaces/https/update-transaction-request';
import { Transaction } from '@/shared/interfaces/transaction';
import { TotalTransactions } from '@/shared/interfaces/total-transactions';
import { Pagination } from '@/shared/interfaces/https/get-transactions-request';

interface FetchTransactionsParams {
  page: number;
}

export type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
  createTransaction: (transaction: CreateTransactionInterface) => Promise<void>;
  updateTransaction: (transaction: UpdateTransactionInterface) => Promise<void>;
  fetchTransactions: (params: FetchTransactionsParams) => Promise<void>;
  totalTransactions: TotalTransactions;
  transactions: Transaction[];
  refreshTransactions: () => Promise<void>;
  loading: boolean;
  loadingMoreTransactions: () => Promise<void>;
};

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState<TotalTransactions>(
    {
      expense: 0,
      revenue: 0,
      total: 0,
    }
  );

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    perPage: 10,
    totalRows: 0,
    totalPages: 0,
  });

  const refreshTransactions = async () => {
    setLoading(true);
    const transactionResponse = await transactionServices.getTransactions({
      page: 0,
      perPage: 10,
    });

    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions);
    setLoading(false);
  };

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

    await refreshTransactions();
  };

  const updateTransaction = async ({
    id,
    categoryId,
    description,
    typeId,
    value,
  }: UpdateTransactionInterface) => {
    await transactionServices.updateTransaction({
      id,
      categoryId,
      description,
      typeId,
      value,
    });

    await refreshTransactions();
  };

  const fetchTransactions = useCallback(
    async ({ page = 1 }: FetchTransactionsParams) => {
      setLoading(true);

      const transactionResponse = await transactionServices.getTransactions({
        page,
        perPage: pagination.perPage,
      });

      if (page === 1) {
        setTransactions(transactionResponse.data);
      } else {
        setTransactions((oldState) => [
          ...oldState,
          ...transactionResponse.data,
        ]);
      }

      setTotalTransactions(transactionResponse.totalTransactions);
      setPagination({
        ...pagination,
        page,
        totalRows: transactionResponse.totalRows,
        totalPages: transactionResponse.totalPages,
      });
      setLoading(false);
    },
    [pagination]
  );

  const loadingMoreTransactions = useCallback(async () => {
    if (loading || pagination.page >= pagination.totalPages) {
      return;
    }

    fetchTransactions({ page: pagination.page + 1 });
  }, [loading, pagination, fetchTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        categories,
        fetchCategories,
        createTransaction,
        updateTransaction,
        fetchTransactions,
        totalTransactions,
        transactions,
        refreshTransactions,
        loading,
        loadingMoreTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  return useContext(TransactionContext);
};
