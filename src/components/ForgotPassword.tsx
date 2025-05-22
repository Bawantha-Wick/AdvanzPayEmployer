import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    navigate('/verify-email');
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5ece6] p-4">
      <div className="w-[95vw] h-[90vh] bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
        <div className="text-center w-[600px]">
          <div className="flex justify-center mb-10">
            <img src="/src/assets/logo.png" alt="advanzpay" className="h-8" />
          </div>

          <h2 className="text-[32px] font-medium text-gray-800">Forgot your Password ?</h2>
          <p className="text-gray-500 text-[26px] whitespace-nowrap">Enter your email address to reset password</p>

          <div style={{ width: '480px', margin: '0 auto' }} className="mt-6">
            <form onSubmit={handleSubmit}>
              <div className="" style={{ marginTop: '40px' }}>
                <label className="block text-[16px] font-medium text-gray-600 mb-2 float-left">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-3 border border-gray-200 rounded-md focus:outline-none h-12" style={{ paddingLeft: '16px', textAlign: 'left' }} required placeholder="Enter your email address" />
              </div>

              <div className="flex gap-16" style={{ marginTop: '45px' }}>
                <button type="button" onClick={handleBackToLogin} className="flex-1 px-6 py-5 text-[#e15241] border rounded-full hover:bg-gray-50 text-[16px] font-medium" style={{ border: '1px solid #e15241', height: '45px' }}>
                  Back to login
                </button>
                <button type="submit" className="flex-1 px-6 py-5 text-white bg-[#e15241] rounded-full hover:bg-[#d14535] text-[16px] font-medium" style={{ height: '45px' }}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
