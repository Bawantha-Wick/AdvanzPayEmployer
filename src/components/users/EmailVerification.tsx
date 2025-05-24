import React, { useState, useRef, useEffect } from 'react';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(5).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 5);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 4) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    console.log('Verifying OTP:', otpValue);
    navigate('/reset-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5ece6] p-4">
      <div className="w-[95vw] h-[90vh] bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
        <div className="text-center w-[600px]">
          <div className="flex justify-center mb-10">
            <img src="/src/assets/logo.png" alt="advanzpay" className="h-8" />
          </div>

          <h2 className="text-[32px] font-medium text-gray-800">Email Verification</h2>
          <div className="flex items-center justify-center mb-6 gap-1">
            <BsFillInfoCircleFill />
            <p className="text-gray-500 text-[16px]">An OTP has been to your email to change password</p>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '40px' }}>
            <div className="flex justify-center space-x-4 mb-8 gap-5">
              {Array.from({ length: 5 }, (_, index) => {
                const inputStyles = 'w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:border-[#e15241]';
                return (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    aria-label={`OTP digit ${index + 1}`}
                    maxLength={1}
                    className={inputStyles}
                    value={otp[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                );
              })}
            </div>

            <div className="flex justify-center mt-8">
              <button type="submit" className="w-100 px-16 py-3 text-white bg-[#e15241] rounded-full hover:bg-[#d14535] text-[16px] font-medium" style={{ height: '45px', marginTop: '45px' }}>
                Proceed
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
