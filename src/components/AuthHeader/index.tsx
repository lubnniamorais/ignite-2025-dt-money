import { useKeyboardVisible } from '@/shared/hooks/useKeyboardVisible';
import { Image, View } from 'react-native';

export const AuthHeader = () => {
  const keyboardIsVisible = useKeyboardVisible();

  if (keyboardIsVisible) {
    return <></>;
  }

  return (
    <View className='items-center justify-center w-full min-h-40'>
      <Image
        className='w-[255px] h-[48px]'
        source={require('@/assets/logo.png')}
      />
    </View>
  );
};
