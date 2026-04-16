import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminPanel from './pages/AdminPanel';
import HotelDetail from './pages/HotelDetail';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--toast-bg, #ffffff)',
                color: '#1e293b',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                padding: '12px 16px',
              },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/hotel/:id" element={<HotelDetail />} />

            {/* User */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/*" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            } />

            {/* Owner */}
            <Route path="/owner" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/owner/*" element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
