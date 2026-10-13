import { useForm } from 'react-hook-form';
import { ActivityIndicator, Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';

import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { PublicStackParamsList } from '@/routes/PublicRoutes';
import { schema } from './schema';
import { useAuthContext } from '@/context/auth.context';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { colors } from '@/shared/colors';

export interface FormLoginParams {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormLoginParams>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const navigation = useNavigation<NavigationProp<PublicStackParamsList>>();

  const { handleAuthenticate } = useAuthContext();
  const { handlerError } = useErrorHandler();

  const onSubmit = async ({ email, password }: FormLoginParams) => {
    try {
      await handleAuthenticate({ email, password });
    } catch (error) {
      handlerError(error, 'Falha ao realizar login.');
    }
  };

  return (
    <>
      <AppInput
        control={control}
        name='email'
        label='E-MAIL'
        placeholder='mail@example.com.br'
        leftIconName='mail-outline'
      />

      <AppInput
        control={control}
        name='password'
        label='SENHA'
        placeholder='Senha'
        leftIconName='lock-outline'
        secureTextEntry
      />

      <View className='flex-1 justify-between mt-8 mb-6 min-h-[250px]'>
        <AppButton onPress={handleSubmit(onSubmit)} iconName='arrow-forward'>
          {isSubmitting ? <ActivityIndicator color={colors.white} /> : 'Login'}
        </AppButton>

        <View>
          <Text className='mb-6 text-gray-300 text-base'>
            Ainda não possui uma conta?
          </Text>
          <AppButton
            onPress={() => navigation.navigate('Register')}
            iconName='arrow-forward'
            mode='outline'
          >
            Cadastrar
          </AppButton>
        </View>
      </View>
    </>
  );
};
