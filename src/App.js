import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms from './pages/admin/AdminRooms';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReports from './pages/admin/AdminReports';
import AdminSearch from './pages/admin/AdminSearch';

import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AvailableRooms from './pages/employee/AvailableRooms';
import RoomSchedule from './pages/employee/RoomSchedule';
import MyBookings from './pages/employee/MyBookings';

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === 'ADMIN' ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/employee/dashboard" replace />
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<Layout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/rooms" element={<AdminRooms />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/search" element={<AdminSearch />} />
                <Route path="/admin/reports" element={<AdminReports />} />
              </Route>
            </Route>

            {/* Employee Routes */}
            <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
              <Route element={<Layout />}>
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/employee/rooms" element={<AvailableRooms />} />
                <Route path="/employee/schedule" element={<RoomSchedule />} />
                <Route path="/employee/bookings" element={<MyBookings />} />
              </Route>
            </Route>

            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
