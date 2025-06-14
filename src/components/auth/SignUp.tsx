import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const passwordValidation = useMemo(() => {
    const { password, email } = formData;

    const hasMinLength = password.length >= 8;
    const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

    let doesNotContainPersonalInfo = true;
    if (email && password) {
      const emailUsername = email.toLowerCase().split('@')[0];
      const passwordLower = password.toLowerCase();

      if (emailUsername.length >= 3 && passwordLower.includes(emailUsername)) {
        doesNotContainPersonalInfo = false;
      }

      if (passwordLower.includes(email.toLowerCase())) {
        doesNotContainPersonalInfo = false;
      }
    }

    let strength = 'Weak';
    let totalCriteria = 0;

    if (hasMinLength) totalCriteria++;
    if (hasNumberOrSymbol) totalCriteria++;
    if (doesNotContainPersonalInfo) totalCriteria++;

    if (totalCriteria === 3) {
      strength = 'Strong';
    } else if (totalCriteria === 2) {
      strength = 'Medium';
    }

    const isValid = hasMinLength && hasNumberOrSymbol && doesNotContainPersonalInfo;

    return {
      hasMinLength,
      hasNumberOrSymbol,
      doesNotContainPersonalInfo,
      isValid,
      strength
    };
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!passwordValidation.isValid) {
      alert('Please ensure your password meets all requirements');
      return;
    }

    console.log('Form submitted with valid data:', formData);
  };

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/signin');
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
          <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter Password" required />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Enter Password" required />
        </div>
        <div className="password-requirements">
          <div className="requirement">
            <span className={`check ${passwordValidation.isValid ? 'valid' : 'invalid'}`}>✓</span>
            Password Strength : <span className={`password-strength-${passwordValidation.strength.toLowerCase()}`}>{passwordValidation.strength}</span>
          </div>
          <div className="requirement">
            <span className={`check ${passwordValidation.doesNotContainPersonalInfo ? 'valid' : 'invalid'}`}>✓</span>
            Cannot contain your name or email address
          </div>
          <div className="requirement">
            <span className={`check ${passwordValidation.hasMinLength ? 'valid' : 'invalid'}`}>✓</span>
            At least 8 characters
          </div>
          <div className="requirement">
            <span className={`check ${passwordValidation.hasNumberOrSymbol ? 'valid' : 'invalid'}`}>✓</span>
            Contains a number or symbol
          </div>
        </div>
        <button type="submit" className="create-account-btn" disabled={!passwordValidation.isValid || formData.password !== formData.confirmPassword || !formData.email}>
          Create Account
        </button>
        <div className="signin-footer">
          <span>Already have an Account? </span>
          <a href="#" className="signin-link" onClick={handleSignIn}>
            Sign In
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
