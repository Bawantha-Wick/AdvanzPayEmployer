import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa',
        padding: '2rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '3rem',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
          borderRadius: '4px'
        }}
      >
        <img
          src={logo}
          alt="AdvanzPay Logo"
          style={{
            width: '160px',
            marginBottom: '3rem'
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3rem',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              borderRight: '1px solid #e0e0e0',
              paddingRight: '3rem'
            }}
          >
            <h1
              style={{
                color: '#d75c4f',
                fontSize: '4rem',
                fontWeight: '600',
                margin: 0,
                lineHeight: 1
              }}
            >
              404
            </h1>
          </div>

          <div style={{ textAlign: 'left' }}>
            <h2
              style={{
                color: '#2c3e50',
                fontSize: '1.5rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}
            >
              Page Not Found
            </h2>
            <p
              style={{
                color: '#6c757d',
                fontSize: '1rem',
                lineHeight: '1.5',
                margin: 0
              }}
            >
              The requested page could not be found. Please verify the URL or return to the homepage.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem'
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 24px',
              backgroundColor: '#d75c4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#c54b3f';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#d75c4f';
            }}
          >
            Return to Home Page
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: '2rem',
          color: '#6c757d',
          fontSize: '0.875rem',
          textAlign: 'center'
        }}
      >
        © {new Date().getFullYear()} AdvanzPay. All rights reserved.
      </div>
    </div>
  );
};

export default NotFound;
