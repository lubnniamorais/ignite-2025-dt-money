import './src/styles/global.css';

import { SnackBarContextProvider } from '@/context/snackbar.context';
import { AuthContextProvider } from '@/context/auth.context';

import NavigationRoutes from '@/routes';
import { Snackbar } from '@/components/Snackbar';

export default function App() {
  return (
    <SnackBarContextProvider>
      <AuthContextProvider>
        <NavigationRoutes />
        <Snackbar />
      </AuthContextProvider>
    </SnackBarContextProvider>
  );
}
