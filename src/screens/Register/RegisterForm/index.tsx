import { Text, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';

import { PublicStackParamsList } from '@/routes/PublicRoutes';

import { schema } from './schema';

interface RegisterFormParams {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormParams>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(schema),
  });

  const navigation = useNavigation<NavigationProp<PublicStackParamsList>>();

  const onSubmit = async () => {};

  return (
    <>
      <AppInput
        control={control}
        name='name'
        leftIconName='person'
        label='NOME'
        placeholder='Seu nome'
      />

      <AppInput
        control={control}
        name='email'
        leftIconName='mail-outline'
        label='E-MAIL '
        placeholder='mail@example.com.br'
      />

      <AppInput
        control={control}
        name='password'
        leftIconName='lock-outline'
        label='SENHA'
        placeholder='Sua senha'
        secureTextEntry
      />

      <AppInput
        control={control}
        name='confirmPassword'
        leftIconName='lock-outline'
        label='CONFIRMAR SENHA'
        placeholder='Confirme sua senha'
        secureTextEntry
      />

      <View className='flex-1 justify-between mt-8 mb-6 min-h-[250px]'>
        <AppButton onPress={handleSubmit(onSubmit)} iconName='arrow-forward'>
          Cadastrar
        </AppButton>

        <View>
          <Text className='mb-6 text-gray-300 text-base'>
            Já possui uma conta?
          </Text>
          <AppButton
            onPress={() => navigation.navigate('Login')}
            iconName='arrow-forward'
            mode='outline'
          >
            Acessar
          </AppButton>
        </View>
      </View>
    </>
  );
};
