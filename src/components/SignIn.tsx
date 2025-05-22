import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in form submitted with:', formData);
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
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter Email" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-container">
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter Password" required />
            <div className="forgot-password">
              <a href="#" onClick={handleForgotPassword}>
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
        <button type="submit" className="signin-btn" disabled={!formValidation.isValid}>
          Sign In
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
