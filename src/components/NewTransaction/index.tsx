import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { MaterialIcons } from '@expo/vector-icons';

import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { CreateTransactionInterface } from '@/shared/interfaces/https/create-transaction-request';
import { colors } from '@/shared/colors';

export const NewTransaction = () => {
  const { closeBottomSheet } = useBottomSheetContext();

  const [transaction, setTransaction] = useState<CreateTransactionInterface>({
    categoryId: 0,
    description: '',
    typeId: 0,
    value: 0,
  });

  const setTransactionData = (
    key: keyof CreateTransactionInterface,
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
      </View>
    </View>
  );
};
