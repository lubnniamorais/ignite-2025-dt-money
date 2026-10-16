import { Image, Text, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/shared/colors';
import { useAuthContext } from '@/context/auth.context';
import { useBottomSheetContext } from '@/context/bottomsheet.context';
import { NewTransaction } from '../NewTransaction';

export const AppHeader = () => {
  const { handleLogout } = useAuthContext();
  const { openBottomSheet } = useBottomSheetContext();

  return (
    <View className='w-full flex-row p-8 justify-between bg-background-primary'>
      <View>
        <Image
          source={require('@/assets/Logo.png')}
          className='w-[130px] h-[30px]'
        />

        <TouchableOpacity
          onPress={handleLogout}
          className='flex-row items-center gap-2 mt-2'
        >
          <MaterialIcons name='logout' size={15} color={colors.gray[700]} />
          <Text className='text-gray-700 text-base'>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openBottomSheet(<NewTransaction />, 0)}
          className='
            bg-accent-brand w-[130px] h-[50px]
            items-center justify-center
            rouded-xl
          '
        >
          <Text className='text-white text-bold text-sm'>Nova transação</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
