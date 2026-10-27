import { FC, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '@/shared/colors';
import { DeleteModal } from './DeleteModal';
import * as transactionService from '@/shared/services/dt-money/transaction.service';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { useSnackbarContext } from '@/context/snackbar.context';

interface Params {
  transactionId: number;
}

export const RightAction: FC<Params> = ({ transactionId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { notify } = useSnackbarContext();

  const showModal = () => setModalVisible((oldState) => !oldState);

  const hiddeModal = () => setModalVisible(false);

  const { handlerError } = useErrorHandler();

  const handleDeleteTransaction = async () => {
    try {
      setLoading(true);
      await transactionService.deleteTransaction(transactionId);
      notify({
        message: 'Transação deletada com sucesso.',
        messageType: 'SUCCESS',
      });

      hiddeModal();
    } catch (error) {
      handlerError(error, 'Falha ao deletar transação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        className='h-[140] w-[80] bg-accent-red-background-primary rounded-r-[6] 
        items-center justify-center'
        onPress={showModal}
      >
        <MaterialIcons name='delete-outline' color={colors.white} size={30} />
      </TouchableOpacity>
      <DeleteModal
        handleDeleteTransaction={handleDeleteTransaction}
        visible={modalVisible}
        hiddeModal={hiddeModal}
        loading={loading}
      />
    </>
  );
};
