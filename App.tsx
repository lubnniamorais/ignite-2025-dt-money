import './src/styles/global.css';

import { AuthContextProvider } from '@/context/auth.context';

import NavigationRoutes from '@/routes';

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationRoutes />;
    </AuthContextProvider>
  );
}
