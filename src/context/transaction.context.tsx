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
import {
  Filters,
  Pagination,
} from '@/shared/interfaces/https/get-transactions-request';

interface FetchTransactionsParams {
  page: number;
}

interface Loadings {
  initial: boolean;
  refresh: boolean;
  loadMore: boolean;
}

interface HandleLoadingParams {
  key: keyof Loadings;
  value: boolean;
}

interface HandleFiltersParams {
  key: keyof Filters;
  value: Date | boolean | number;
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
  loadingMoreTransactions: () => Promise<void>;
  loadings: Loadings;
  handleLoadings: (params: HandleLoadingParams) => void;
  pagination: Pagination;
  setSearchText: (text: string) => void;
  searchText: string;
  filters: Filters;
  handleFilters: (params: HandleFiltersParams) => void;
};

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<Filters>({
    categoryIds: {},
    from: undefined,
    to: undefined,
    typeId: undefined,
  });

  const [loadings, setLoadings] = useState<Loadings>({
    initial: false,
    refresh: false,
    loadMore: false,
  });
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

  const handleLoadings = ({ key, value }: HandleLoadingParams) =>
    setLoadings((oldValue) => ({ ...oldValue, [key]: value }));

  const refreshTransactions = useCallback(async () => {
    const { page, perPage } = pagination;

    const transactionResponse = await transactionServices.getTransactions({
      page: 1,
      perPage: page * perPage,
    });

    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions);
    setPagination({
      ...pagination,
      page,
      totalPages: transactionResponse.totalPages,
      totalRows: transactionResponse.totalRows,
    });
  }, [pagination]);

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
      const transactionResponse = await transactionServices.getTransactions({
        page,
        perPage: pagination.perPage,
        searchText,
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
    },
    [pagination, searchText]
  );

  const loadingMoreTransactions = useCallback(async () => {
    if (loadings.loadMore || pagination.page >= pagination.totalPages) {
      return;
    }

    fetchTransactions({ page: pagination.page + 1 });
  }, [loadings.loadMore, pagination, fetchTransactions]);

  const handleFilters = ({ key, value }: HandleFiltersParams) => {
    setFilters((oldValue) => ({ ...oldValue, [key]: value }));
  };

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
        loadingMoreTransactions,
        handleLoadings,
        loadings,
        pagination,
        setSearchText,
        searchText,
        filters,
        handleFilters,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  return useContext(TransactionContext);
};
