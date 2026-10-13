import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Checkbox from 'expo-checkbox';

import { useTransactionContext } from '@/context/transaction.context';

interface Props {
  selectedCategory: number;
  onSelectCategory: (categoryId: number) => void;
}

export const SelectCategoryModal: FC<Props> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [showModal, setShowModal] = useState(false);

  const { categories } = useTransactionContext();

  const handleOpenModal = () => setShowModal((oldState) => !oldState);
  const handleSelect = (categoryId: number) => {
    onSelectCategory(categoryId);
    setShowModal(false);
  };

  const selected = useMemo(
    () => categories.find(({ id }) => id === selectedCategory),
    [categories, selectedCategory]
  );

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenModal}
        className='h-[50] bg-background-primary my-2 rounded-[6] pl-4 justify-center'
      >
        <Text
          className={clsx(
            'text-lg',
            selectedCategory ? 'text--white' : 'text-gray-700'
          )}
        >
          Categoria
        </Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType='slide'>
        <TouchableWithoutFeedback onPress={handleOpenModal}>
          <View className='flex-1 justify-center items-center bg-black/50'>
            <View className='w-[90%] bg-background-secondary p-4 rounded-xl'>
              <Text className='text-white text-lg mb-4'>
                Selecione uma categoria
              </Text>
            </View>
            <FlatList
              keyExtractor={(item) => `category-${item.id}`}
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.id)}
                  className='flex-row items-center bg-gray-800 rounded-lg mb-2 p-4'
                >
                  <Checkbox
                    value={selected?.id === item.id}
                    onValueChange={() => {
                      handleSelect(item.id);
                    }}
                    className='mr-2'
                  />
                  <Text className='text-white text-lg'>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};
