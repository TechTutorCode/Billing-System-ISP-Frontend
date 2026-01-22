import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui/toast';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './auth/Login';
import { Dashboard } from './features/dashboard/Dashboard';
import { Customers } from './features/customers/Customers';
import { Packages } from './features/packages/Packages';
import { Subscriptions } from './features/subscriptions/Subscriptions';
import { Payments } from './features/payments/Payments';
import { Routers } from './features/routers/Routers';
import { LoginPage } from './features/hotspot/LoginPage';
import { ConnectedPage } from './features/hotspot/components/ConnectedPage';
import { HotspotUsers } from './features/hotspot/HotspotUsers';
import { HotspotPackages } from './features/hotspot/HotspotPackages';
import { LandingPage } from './pages/LandingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
// dcjnkj
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing Page - Public */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Hotspot Portal Routes - Public Access */}
            <Route path="/hotspot/login" element={<LoginPage />} />
            <Route path="/hotspot/connected" element={<ConnectedPage />} />
            
            {/* Dashboard Routes - Protected */}
            <Route path="/dashboard/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/customers"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Customers />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/packages"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Packages />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/subscriptions"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Subscriptions />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/payments"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Payments />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/routers"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routers />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/hotspot/users"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <HotspotUsers />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/hotspot/packages"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <HotspotPackages />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
