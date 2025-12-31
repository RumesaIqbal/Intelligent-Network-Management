// components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="header" style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      borderBottom: '1px solid #475569',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      padding: '15px 0'
    }}>
      <div className="header-content" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div className="logo" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div className="logo-icon" style={{
            fontSize: '40px',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            width: '60px',
            height: '60px',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(96, 165, 250, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>🌐</div>
          <div className="logo-text">
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px'
            }}>Network Management System</h1>
            <p style={{
              margin: '5px 0 0 0',
              fontSize: '14px',
              color: '#94a3b8',
              fontWeight: '500'
            }}>Intelligent Network Monitoring & Analysis</p>
          </div>
        </div>
        <div className="header-actions" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div className="status-indicator" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '1px solid #047857',
            boxShadow: '0 4px 15px rgba(4, 120, 87, 0.3)'
          }}>
            <div className="status-dot online" style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#d1fae5'
            }}>System Online</span>
          </div>
          <div className="user-profile" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div className="avatar" style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f3e8ff',
              fontWeight: '700',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>AD</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
        
        .avatar:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6) !important;
        }
        
        .status-indicator {
          transition: all 0.3s ease;
        }
        
        .status-indicator:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(4, 120, 87, 0.4) !important;
        }
      `}</style>
    </header>
  );
};

export default Header;