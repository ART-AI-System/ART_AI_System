import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { AuthProvider } from '../context/AuthContext';
import { router } from './router';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
