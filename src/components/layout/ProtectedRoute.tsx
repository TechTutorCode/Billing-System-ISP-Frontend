import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const token = localStorage.getItem('access_token');

  // Check both store and localStorage for token
  if (!isAuthenticated && !token) {
    return <Navigate to="/dashboard/login" replace />;
  }

  return <>{children}</>;
};
