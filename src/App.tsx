import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Welcome from './components/core/Welcome';
import NotFound from './components/core/NotFound';
import ForgotPassword from './components/auth/ForgotPassword';
import EmailVerification from './components/auth/EmailVerification';
import ResetPassword from './components/auth/ResetPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Layout from './components/core/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Users from './components/user/Users';
import UserRoles from './components/user/UserRoles';
import Employees from './components/employee/Employees';
import EmployeeRequests from './components/employee/EmployeeRequests';
import AuthorizeEmployees from './components/backup/AuthorizeEmployees';
import Settlements from './components/settlement/Settlements';
import Reports from './components/report/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <Welcome initialTab="signin" />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Welcome initialTab="signup" />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <EmailVerification />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Protected routes with persistent sidebar */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* User Management routes */}
            <Route path="users" element={<Users />} />
            <Route path="user-roles" element={<UserRoles />} />
            {/* Employee Management routes */}
            <Route path="employees" element={<Employees />} />
            <Route path="employee-requests" element={<EmployeeRequests />} />
            <Route path="authorize-employees" element={<AuthorizeEmployees />} />
            <Route path="settlements" element={<Settlements />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
