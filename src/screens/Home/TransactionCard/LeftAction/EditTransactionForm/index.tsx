import { FC, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { MaterialIcons } from '@expo/vector-icons';
import { z as zod } from 'zod';

import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { UpdateTransactionInterface } from '@/shared/interfaces/https/update-transaction-request';
import { colors } from '@/shared/colors';

import { TransactionTypeSelector } from '@/components/SelectType';
import { SelectCategoryModal } from '@/components/SelectCategoryModal';
import { transactionSchema } from './schema';
import { AppButton } from '@/components/AppButton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useTransactionContext } from '@/context/transaction.context';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { Transaction } from '@/shared/interfaces/transaction';

type ValidationErrorsTypes = Record<keyof UpdateTransactionInterface, string>;

interface Params {
  transaction: Transaction;
}

export const EditTransactionForm: FC<Params> = ({
  transaction: transactionToUpdate,
}) => {
  const { closeBottomSheet } = useBottomSheetContext();
  const { updateTransaction } = useTransactionContext();
  const { handlerError } = useErrorHandler();

  const [loading, setLoading] = useState(false);

  const [transaction, setTransaction] = useState<UpdateTransactionInterface>({
    id: transactionToUpdate.id,
    description: transactionToUpdate.description,
    typeId: transactionToUpdate.typeId,
    categoryId: transactionToUpdate.categoryId,
    value: transactionToUpdate.value,
  });
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrorsTypes>();

  const handleUpdateTransaction = async () => {
    try {
      setLoading(true);
      transactionSchema.safeParse(transaction);

      await updateTransaction(transaction);
      closeBottomSheet();
    } catch (error) {
      if (error instanceof zod.ZodError) {
        const errors = {} as ValidationErrorsTypes;

        error.issues.forEach((issue) => {
          if (issue.path) {
            errors[issue.path[0] as keyof UpdateTransactionInterface] =
              issue.message;
          }
        });

        setValidationErrors(errors);
      } else {
        handlerError(error, 'Falha ao atualizar transação.');
      }
    } finally {
      setLoading(false);
    }
  };

  const setTransactionData = (
    key: keyof UpdateTransactionInterface,
    value: string | number
  ) => {
    setTransaction((oldState) => ({ ...oldState, [key]: value }));
  };

  return (
    <View className='px-8 py-5'>
      <TouchableOpacity
        onPress={closeBottomSheet}
        className='w-full flex-row items-center justify-between'
      >
        <Text className='text-white text-xl font-bold'>Nova Transação</Text>
        <MaterialIcons name='close' size={20} color={colors.gray[700]} />
      </TouchableOpacity>

      <View className='flex-1 mt-8 mb-8'>
        <TextInput
          className='
            text-white text-lg h-[50px] bg-background-primary
            my-2 rounded-[6] pl-4
          '
          placeholder='Descrição'
          placeholderTextColor={colors.gray[700]}
          value={transaction.description}
          onChangeText={(text) => {
            setTransactionData('description', text);
          }}
        />

        {validationErrors?.description && (
          <ErrorMessage>{validationErrors.description}</ErrorMessage>
        )}

        <CurrencyInput
          className='
            text-white text-lg h-[50px] bg-background-primary 
            my-2 rounded-[6] pl-4
          '
          value={transaction.value}
          prefix='R$ '
          delimiter='.'
          separator=','
          precision={2}
          minValue={0}
          onChangeValue={(value) => {
            setTransactionData('value', value ?? 0);
          }}
        />

        {validationErrors?.value && (
          <ErrorMessage>{validationErrors.value}</ErrorMessage>
        )}

        <SelectCategoryModal
          selectedCategory={transaction.categoryId}
          onSelectCategory={(categoryId) => {
            setTransactionData('categoryId', categoryId);
          }}
        />

        {validationErrors?.categoryId && (
          <ErrorMessage>{validationErrors.categoryId}</ErrorMessage>
        )}

        <TransactionTypeSelector
          typeId={transaction.typeId}
          setTransactionType={(typeId) => {
            setTransactionData('typeId', typeId);
          }}
        />

        {validationErrors?.typeId && (
          <ErrorMessage>{validationErrors.typeId}</ErrorMessage>
        )}

        <View className='my-4'>
          <AppButton onPress={handleUpdateTransaction}>
            {loading ? <ActivityIndicator color={colors.white} /> : 'Atualizar'}
          </AppButton>
        </View>
      </View>
    </View>
  );
};
