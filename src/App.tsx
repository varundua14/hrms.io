import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy loaded pages
const CandidatesPage = lazy(() => import('./pages/candidates/CandidatesPage'));
const EmployeesPage = lazy(() => import('./pages/employees/EmployeesPage'));
const AttendancePage = lazy(() => import('./pages/attendance/AttendancePage'));
const LeavesPage = lazy(() => import('./pages/leaves/LeavesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const { isAuthenticated, checkAuth, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && location.pathname !== '/login') {
        navigate('/login');
      } else if (isAuthenticated && location.pathname === '/login') {
        navigate('/candidates');
      }
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    }>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/candidates" replace />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="leaves" element={<LeavesPage />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;