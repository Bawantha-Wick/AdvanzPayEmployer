import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import ForgotPassword from './components/ForgotPassword';
import EmailVerification from './components/EmailVerification';
import ResetPassword from './components/ResetPassword';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signin" element={<Welcome initialTab="signin" />} />
        <Route path="/signup" element={<Welcome initialTab="signup" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/layout" element={<Layout />} />

      </Routes>
    </Router>
  );
}

export default App;
