import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const emailFromUrl = queryParams.get('email') || '';

  const [formData, setFormData] = useState({
    email: emailFromUrl,
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState('Weak');
  const [passwordRequirements, setPasswordRequirements] = useState({
    containsNameOrEmail: false,
    hasMinLength: false,
    hasNumberOrSymbol: false
  });

  const evaluatePassword = useCallback(
    (password: string) => {
      const hasMinLength = password.length >= 8;
      const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
      const containsNameOrEmail = formData.email && password.toLowerCase().includes(formData.email.toLowerCase());

      setPasswordRequirements({
        containsNameOrEmail: !containsNameOrEmail,
        hasMinLength,
        hasNumberOrSymbol
      });

      if (password.length === 0) {
        setPasswordStrength('Weak');
      } else if (hasMinLength && hasNumberOrSymbol && !containsNameOrEmail) {
        setPasswordStrength('Strong');
      } else {
        setPasswordStrength('Weak');
      }
    },
    [formData.email]
  );

  useEffect(() => {
    evaluatePassword(formData.password);
  }, [formData.password, evaluatePassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log('Password reset with:', { email: formData.email, password: formData.password });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5ece6] p-4">
      <div className="w-[95vw] h-[90vh] bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
        <div className="text-center w-[600px]">
          <div className="flex justify-center mb-10">
            <img src="/src/assets/logo.png" alt="advanzpay" className="h-8" />
          </div>

          <h2 className="text-[32px] font-medium text-gray-800">Reset Password</h2>
          <p className="text-gray-500 text-[26px] whitespace-nowrap">Change your password in here</p>

          <div style={{ width: '480px', margin: '0 auto' }} className="mt-6">
            <form onSubmit={handleSubmit}>
              <div className="" style={{ marginTop: '40px' }}>
                <label className="block text-[16px] font-medium text-gray-600 mb-2 float-left">Password</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full py-3 border border-gray-200 rounded-md focus:outline-none h-12" style={{ paddingLeft: '16px', textAlign: 'left' }} required placeholder="Enter new password" />
              </div>

              <div className="" style={{ marginTop: '20px' }}>
                <label className="block text-[16px] font-medium text-gray-600 mb-2 float-left">Confirm Password</label>
                <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full py-3 border border-gray-200 rounded-md focus:outline-none h-12" style={{ paddingLeft: '16px', textAlign: 'left' }} required placeholder="Enter password again" />
              </div>

              <div style={{ marginTop: '30px', marginLeft: '10px' }}>
                <div className="flex items-center mb-1">
                  <span className={`${passwordStrength === 'Strong' ? 'text-green-600' : 'text-gray-400'}`} style={{ marginRight: '12px' }}>
                    ✓
                  </span>
                  <p className={`text-sm ${passwordStrength === 'Strong' ? 'text-green-600' : 'text-gray-600'}`}>Password Strength: </p>
                  <p className={`ml-1 text-sm ${passwordStrength === 'Strong' ? 'text-green-600' : 'text-red-500'}`}>{passwordStrength}</p>
                </div>
                <ul className="text-sm text-gray-600">
                  <li className={`flex items-center ${passwordRequirements.containsNameOrEmail ? 'text-green-600' : 'text-gray-600'}`}>
                    <span className={`${passwordRequirements.containsNameOrEmail ? 'text-green-600' : 'text-gray-400'}`} style={{ marginRight: '12px' }}>
                      ✓
                    </span>
                    Cannot contain your email address
                  </li>
                  <li className={`flex items-center ${passwordRequirements.hasMinLength ? 'text-green-600' : 'text-gray-600'}`}>
                    <span className={`${passwordRequirements.hasMinLength ? 'text-green-600' : 'text-gray-400'}`} style={{ marginRight: '12px' }}>
                      ✓
                    </span>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${passwordRequirements.hasNumberOrSymbol ? 'text-green-600' : 'text-gray-600'}`}>
                    <span className={`${passwordRequirements.hasNumberOrSymbol ? 'text-green-600' : 'text-gray-400'}`} style={{ marginRight: '12px' }}>
                      ✓
                    </span>
                    Contains a number or symbol
                  </li>
                </ul>
              </div>

              <div className="flex justify-center mt-8">
                <button type="submit" className="w-full px-16 py-3 text-white bg-[#e15241] rounded-full hover:bg-[#d14535] text-[16px] font-medium" style={{ height: '45px', marginTop: '45px' }} disabled={!passwordRequirements.containsNameOrEmail || !passwordRequirements.hasMinLength || !passwordRequirements.hasNumberOrSymbol}>
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
