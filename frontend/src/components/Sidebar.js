// components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const Sidebar = ({ activeModule, setActiveModule }) => {
  const [systemStatus, setSystemStatus] = useState({
    healthScore: 0,
    criticalAlerts: 0,
    warningAlerts: 0,
    activeConnections: 0,
    internetStatus: 'Unknown'
  });
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchSidebarData = async () => {
    try {
      const [statusData, alertsData] = await Promise.all([
        apiService.getSystemStatus(),
        apiService.getAlerts()
      ]);
      
      const criticalCount = alertsData.CRITICAL?.length || 0;
      const warningCount = alertsData.WARNING?.length || 0;
      
      setSystemStatus({
        healthScore: statusData.health_score || 0,
        criticalAlerts: criticalCount,
        warningAlerts: warningCount,
        activeConnections: statusData.active_connections || 0,
        internetStatus: statusData.internet || 'Unknown'
      });
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching sidebar data:', error);
      // Keep previous data or set to defaults
    }
  };

  useEffect(() => {
    fetchSidebarData();
    const interval = setInterval(fetchSidebarData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'log-summarization', label: 'Log Summarization', icon: '📋' },
    { id: 'alert-classification', label: 'Alert Classification', icon: '🚨' },
    { id: 'chatops', label: 'ChatOps Assistant', icon: '💬' },
    { id: 'system-status', label: 'System Status', icon: '🔧' },
  ];

  const getHealthColor = (score) => {
    if (score > 80) return '#10b981';
    if (score > 60) return '#f9a108ff';
    return '#ef4444';
  };

  return (
    <aside className="sidebar" style={{
      width: '280px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      color: '#e2e8f0',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
      boxShadow: '8px 0 30px rgba(0, 0, 0, 0.4)',
      overflowY: 'auto',
      overflowX: 'hidden',
      borderRight: '1px solid #475569'
    }}>
      <div className="sidebar-content" style={{
        padding: '25px 20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div className="sidebar-header" style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #475569'
        }}>
          <div style={{
            fontSize: '40px',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            width: '70px',
            height: '70px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            boxShadow: '0 6px 20px rgba(96, 165, 250, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>🌐</div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '800',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px'
          }}>
            Network Manager
          </h1>
          <p style={{
            fontSize: '12px',
            color: '#94a3b8',
            margin: 0,
            fontWeight: '600',
            background: 'rgba(30, 41, 59, 0.8)',
            padding: '6px 14px',
            borderRadius: '12px',
            display: 'inline-block',
            border: '1px solid #475569'
          }}>
            Real-time Monitoring
          </p>
        </div>

        {/* System Health */}
        <div className="system-health" style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '25px',
          backdropFilter: 'blur(10px)',
          border: '2px solid #475569',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
        }}>
          <div className="health-score-display" style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <div className="health-score" style={{
              fontSize: '48px',
              fontWeight: '800',
              color: getHealthColor(systemStatus.healthScore),
              textShadow: `0 4px 20px ${getHealthColor(systemStatus.healthScore)}40`,
              marginBottom: '8px',
              background: `linear-gradient(135deg, ${getHealthColor(systemStatus.healthScore)} 0%, ${getHealthColor(systemStatus.healthScore)}80 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {systemStatus.healthScore}
            </div>
            <div className="health-label" style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#e2e8f0',
              marginBottom: '8px',
              opacity: 0.9
            }}>
              Live System Health
            </div>
            {lastUpdate && (
              <div className="last-update" style={{
                fontSize: '11px',
                color: '#94a3b8',
                fontWeight: '600',
                opacity: 0.8
              }}>
                Updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
          <div className="health-metrics">
            <div className="health-metric" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #475569'
            }}>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0'
              }}>
                <span className="metric-icon" style={{ fontSize: '18px' }}>🔴</span>
                Critical
              </span>
              <span style={{ 
                fontWeight: '800',
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '13px',
                minWidth: '30px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                {systemStatus.criticalAlerts}
              </span>
            </div>
            <div className="health-metric" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #475569'
            }}>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0'
              }}>
                <span className="metric-icon" style={{ fontSize: '18px' }}>🟡</span>
                Warnings
              </span>
              <span style={{ 
                fontWeight: '800',
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '13px',
                minWidth: '30px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                {systemStatus.warningAlerts}
              </span>
            </div>
            <div className="health-metric" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0'
            }}>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0'
              }}>
                <span className="metric-icon" style={{ fontSize: '18px' }}>🔗</span>
                Connections
              </span>
              <span style={{ 
                fontWeight: '800',
                color: '#60a5fa',
                background: 'rgba(96, 165, 250, 0.1)',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '13px',
                minWidth: '30px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(96, 165, 250, 0.3)',
                border: '1px solid rgba(96, 165, 250, 0.3)'
              }}>
                {systemStatus.activeConnections}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map(item => (
              <li key={item.id} style={{ marginBottom: '10px' }}>
                <button 
                  className={`nav-item ${activeModule === item.id ? 'active' : ''}`}
                  onClick={() => setActiveModule(item.id)}
                  style={{
                    width: '100%',
                    background: activeModule === item.id 
                      ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                      : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)',
                    border: 'none',
                    color: activeModule === item.id ? '#1e293b' : '#e2e8f0',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    fontSize: '15px',
                    fontWeight: '700',
                    textAlign: 'left',
                    backdropFilter: 'blur(10px)',
                    border: activeModule === item.id 
                      ? '2px solid rgba(96, 165, 250, 0.5)' 
                      : '2px solid #475569',
                    boxShadow: activeModule === item.id 
                      ? '0 8px 25px rgba(96, 165, 250, 0.4)'
                      : '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <span className="nav-icon" style={{ 
                    fontSize: '22px',
                    filter: activeModule === item.id ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}>{item.icon}</span>
                  <span className="nav-label" style={{
                    textShadow: activeModule === item.id ? 'none' : '0 2px 4px rgba(0,0,0,0.3)'
                  }}>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer" style={{
          marginTop: 'auto',
          paddingTop: '25px',
          borderTop: '2px solid #475569'
        }}>
          <div className="internet-status" style={{
            background: systemStatus.internetStatus === '✅ Connected' 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)'
              : systemStatus.internetStatus.includes('❌') 
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
            padding: '16px',
            borderRadius: '16px',
            marginBottom: '18px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: systemStatus.internetStatus === '✅ Connected' 
              ? '2px solid rgba(16, 185, 129, 0.3)' 
              : systemStatus.internetStatus.includes('❌') 
              ? '2px solid rgba(239, 68, 68, 0.3)'
              : '2px solid rgba(96, 165, 250, 0.3)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: systemStatus.internetStatus === '✅ Connected' 
                ? '#10b981' 
                : systemStatus.internetStatus.includes('❌') 
                ? '#ef4444'
                : '#60a5fa'
            }}>
              <span style={{ fontSize: '18px' }}>
                {systemStatus.internetStatus === '✅ Connected' ? '🌐' : 
                 systemStatus.internetStatus.includes('❌') ? '❌' : '🔍'}
              </span>
              <span>
                {systemStatus.internetStatus === '✅ Connected' ? 'Connected' :
                 systemStatus.internetStatus.includes('❌') ? 'Disconnected' : 'Checking...'}
              </span>
            </div>
          </div>
          <div className="quick-actions">
            <button 
              className="btn btn-secondary"
              onClick={fetchSidebarData}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)',
                color: '#e2e8f0',
                border: '2px solid #475569',
                padding: '14px 20px',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                fontWeight: '800',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
              }}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          scrollbar-width: thin;
          scrollbar-color: #475569 #1e293b;
        }
        
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        
        .sidebar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
          border: 1px solid #64748b;
        }
        
        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        .nav-item:hover {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(167, 139, 250, 0.1) 100%) !important;
          transform: translateX(8px) scale(1.02);
          box-shadow: 0 8px 25px rgba(96, 165, 250, 0.3) !important;
          border-color: #60a5fa !important;
        }
        
        .btn-secondary:hover {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.3) 0%, rgba(167, 139, 250, 0.2) 100%) !important;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 30px rgba(96, 165, 250, 0.4) !important;
          border-color: #60a5fa !important;
          color: #ffffff !important;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;