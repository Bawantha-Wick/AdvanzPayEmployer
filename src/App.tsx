import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import ForgotPassword from './components/users/ForgotPassword';
import EmailVerification from './components/users/EmailVerification';
import ResetPassword from './components/users/ResetPassword';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Users from './components/users/Users';
import UserRoles from './components/UserRoles';
import Employees from './components/backup/Employees';
import EmployeeRequests from './components/backup/EmployeeRequests';
import AuthorizeEmployees from './components/backup/AuthorizeEmployees';
import Settlements from './components/backup/Settlements';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/signin" element={<Welcome initialTab="signin" />} />
        <Route path="/signup" element={<Welcome initialTab="signup" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes with persistent sidebar */}
        <Route path="/app" element={<Layout />}>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
