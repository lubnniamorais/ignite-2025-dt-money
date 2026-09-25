import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '@/shared/colors';

interface BottomsheetContextType {
  openBottomSheet: (content: React.ReactNode, index: number) => void;
  closeBottomSheet: () => void;
}

export const BottomSheetContext = createContext({} as BottomsheetContextType);

export const BottomSheetProvider: FC<PropsWithChildren> = ({ children }) => {
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [index, setIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  // Essa constante vai dizer para nosso BottomSheet a porcentagem que ele pode ocupar da tela disponível do nosso app
  // ou seja, inicialmente começa com 70%, podendo se expandir para 90%
  const snapPoints = ['70%', '90%'];

  const openBottomSheet = useCallback(
    (newContent: React.ReactNode, index: number) => {
      setIndex(index);
      setContent(newContent);
      setIsOpen(true);

      // Define qual altura o BottomSheet deve abrir, por exemplo se o index tiver 0 vai abrir 70%
      // caso ele esteja 1 vai abrir ocupando 90%
      requestAnimationFrame(() => {
        bottomSheetRef.current?.snapToIndex(index);
      });
    },
    []
  );

  const closeBottomSheet = useCallback(() => {
    setIsOpen(false);
    setContent(null);
    setIndex(-1);

    bottomSheetRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsOpen(false);
    }
  }, []);

  return (
    <BottomSheetContext.Provider
      value={{
        openBottomSheet,
        closeBottomSheet,
      }}
    >
      {children}

      {isOpen && (
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <View className='absolute inset-0 bg-black/70 z-1' />
        </TouchableWithoutFeedback>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        style={{ zIndex: 2 }}
        index={index}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backgroundStyle={{
          backgroundColor: colors['background-secondary'],
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          elevation: 9,
        }}
      >
        <BottomSheetScrollView>{content}</BottomSheetScrollView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

// Aqui estamos criando um hook que irá facilitar a utilização das
// propriedades dentro do nosso contexto
export const useBottomSheetContext = () => {
  return useContext(BottomSheetContext);
};
