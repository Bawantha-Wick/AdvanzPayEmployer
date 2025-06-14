import React, { useState, useEffect } from 'react';
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import logo from '../../assets/logo.png';

type WelcomeProps = {
  initialTab?: 'signin' | 'signup';
};

const Welcome: React.FC<WelcomeProps> = ({ initialTab = 'signup' }) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="welcome-container">
      <div className="welcome-left">
        <img src={logo} alt="AdvanzPay Logo" className="logo" />
      </div>
      <div className="welcome-right">
        <div className="auth-container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              width: '100%',
              maxWidth: '400px'
            }}
          >
            <button
              onClick={() => setActiveTab('signup')}
              style={{
                width: '49.5%',
                padding: '12px 0',
                backgroundColor: activeTab === 'signup' ? 'white' : 'rgba(255, 255, 255, 0.2)',
                color: activeTab === 'signup' ? '#d75c4f' : 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: activeTab === 'signup' ? 'bold' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('signin')}
              style={{
                width: '49.5%',
                padding: '12px 0',
                backgroundColor: activeTab === 'signin' ? 'white' : 'rgba(255, 255, 255, 0.2)',
                color: activeTab === 'signin' ? '#d75c4f' : 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: activeTab === 'signin' ? 'bold' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Sign In
            </button>
          </div>
          {activeTab === 'signup' ? <SignUp /> : <SignIn />}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
