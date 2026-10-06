import './src/styles/global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SnackBarContextProvider } from '@/context/snackbar.context';
import { AuthContextProvider } from '@/context/auth.context';
import { TransactionContextProvider } from '@/context/transaction.context';
import { BottomSheetProvider } from '@/context/bottomsheet.context';

import { Snackbar } from '@/components/Snackbar';

import NavigationRoutes from '@/routes';

export default function App() {
  return (
    <GestureHandlerRootView className='flex-1'>
      <SnackBarContextProvider>
        <AuthContextProvider>
          <TransactionContextProvider>
            <BottomSheetProvider>
              <NavigationRoutes />
              <Snackbar />
            </BottomSheetProvider>
          </TransactionContextProvider>
        </AuthContextProvider>
      </SnackBarContextProvider>
    </GestureHandlerRootView>
  );
}
