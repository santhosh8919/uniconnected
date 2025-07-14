import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Landing from './components/Landing/Landing';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';

const PrivateRoute: React.FC<{ children: React.ReactNode, allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const DashboardRoute: React.FC = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'alumni':
      return <StudentDashboard />; // You can create AlumniDashboard component
    default:
      return <StudentDashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
              <Route path="dashboard" element={<DashboardRoute />} />
              
              {/* Admin Routes */}
              <Route path="admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />
              <Route path="admin/users" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <UserManagement />
                </PrivateRoute>
              } />
              
              {/* Student/Alumni Routes */}
              <Route path="connections" element={
                <PrivateRoute allowedRoles={['student']}>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900">Connections</h2>
                    <p className="text-gray-600 mt-2">Feature coming soon...</p>
                  </div>
                </PrivateRoute>
              } />
              
              <Route path="chat" element={
                <PrivateRoute allowedRoles={['student', 'alumni']}>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900">Chat</h2>
                    <p className="text-gray-600 mt-2">Feature coming soon...</p>
                  </div>
                </PrivateRoute>
              } />
              
              <Route path="jobs" element={
                <PrivateRoute allowedRoles={['student', 'alumni']}>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900">Jobs</h2>
                    <p className="text-gray-600 mt-2">Feature coming soon...</p>
                  </div>
                </PrivateRoute>
              } />
              
              <Route path="profile" element={
                <PrivateRoute>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
                    <p className="text-gray-600 mt-2">Feature coming soon...</p>
                  </div>
                </PrivateRoute>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;