import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/useAuthContext';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formValidation = useMemo(() => {
    const { email, password } = formData;

    const isEmailValid = email.trim() !== '';
    const isPasswordValid = password.trim() !== '';
    const isValid = isEmailValid && isPasswordValid;

    return {
      isEmailValid,
      isPasswordValid,
      isValid
    };
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValidation.isValid) return;

    setIsLoading(true);
    setError(null);

    try {
      await login(formData);
      // Redirect to the route they were trying to access, or default to /app
      const from = location.state?.from?.pathname || '/app';
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/forgot-password');
  };

  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter Email" required disabled={isLoading} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-container">
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter Password" required disabled={isLoading} />
            <div className="forgot-password">
              <a href="#" onClick={handleForgotPassword}>
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
        <button type="submit" className="signin-btn" disabled={!formValidation.isValid || isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="signin-footer">
          <span>Don't have an Account? </span>
          <a href="#" className="signin-link" onClick={handleSignUp}>
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
