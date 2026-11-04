import { useAuthContext } from '@/context/auth.context';
import { useTransactionContext } from '@/context/transaction.context';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListHeader } from './ListHeader';
import { TransactionCard } from './TransactionCard';

export const Home = () => {
  const { handleLogout } = useAuthContext();

  const {
    fetchCategories,
    fetchTransactions,
    transactions,
    refreshTransactions,
    loadingMoreTransactions,
    handleLoadings,
    loadings,
  } = useTransactionContext();
  const { handlerError } = useErrorHandler();

  const handleFetchCategories = async () => {
    try {
      handleLoadings({
        key: 'initial',
        value: true,
      });
      await fetchCategories();
    } catch (error) {
      handlerError(error, 'Falha ao buscar as categorias');
    } finally {
      handleLoadings({
        key: 'initial',
        value: false,
      });
    }
  };

  const handleFetchInitalTransactions = async () => {
    try {
      handleLoadings({
        key: 'initial',
        value: true,
      });
      await fetchTransactions({ page: 1 });
    } catch (error) {
      handlerError(error, 'Falha ao buscar as transações');
    } finally {
      handleLoadings({
        key: 'initial',
        value: false,
      });
    }
  };

  const handleLoadMoreTransactions = async () => {
    try {
      handleLoadings({
        key: 'loadMore',
        value: true,
      });
      await loadingMoreTransactions();
    } catch (error) {
      handlerError(error, 'Falha ao carregar novas transações');
    } finally {
      handleLoadings({
        key: 'loadMore',
        value: false,
      });
    }
  };

  const handleRefreshTransactions = async () => {
    try {
      handleLoadings({
        key: 'refresh',
        value: true,
      });
      await refreshTransactions();
    } catch (error) {
      handlerError(error, 'Falha ao atualizar as transações');
    } finally {
      handleLoadings({
        key: 'refresh',
        value: false,
      });
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([
        handleFetchCategories(),
        handleFetchInitalTransactions,
      ]);
    })();
  }, []);

  return (
    <SafeAreaView className='flex-1 bg-background-primary'>
      <FlatList
        className='bg-background-secondary'
        data={transactions}
        keyExtractor={({ id }) => `transaction-${id}`}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        ListHeaderComponent={ListHeader}
        onEndReached={handleLoadMoreTransactions}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={}
            onRefresh={handleRefreshTransactions}
          />
        }
      />
    </SafeAreaView>
  );
};
