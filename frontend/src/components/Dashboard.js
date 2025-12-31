// components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const [statusData, alertsData] = await Promise.all([
        apiService.getSystemStatus(),
        apiService.getAlerts()
      ]);
      
      setSystemStatus(statusData);
      
      // Combine all alerts
      const allAlerts = [
        ...(alertsData.CRITICAL || []),
        ...(alertsData.WARNING || []),
        ...(alertsData.INFO || [])
      ];
      setAlerts(allAlerts);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSystemStatus({});
      setAlerts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Invalid time';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '🔴';
      case 'WARNING': return '🟡';
      case 'INFO': return '🔵';
      default: return '⚪';
    }
  };

  // Calculate metrics from real data
  const metrics = [
    { 
      label: 'CPU Usage', 
      value: systemStatus.cpu_usage ? `${systemStatus.cpu_usage.toFixed(1)}%` : 'N/A', 
      trend: systemStatus.cpu_usage > 80 ? 'up' : systemStatus.cpu_usage > 50 ? 'stable' : 'down', 
      icon: '💻',
      color: systemStatus.cpu_usage > 80 ? '#ff4757' : systemStatus.cpu_usage > 50 ? '#ffa502' : '#2ed573'
    },
    { 
      label: 'Memory Usage', 
      value: systemStatus.memory_usage ? `${systemStatus.memory_usage.toFixed(1)}%` : 'N/A', 
      trend: systemStatus.memory_usage > 80 ? 'up' : systemStatus.memory_usage > 50 ? 'stable' : 'down', 
      icon: '🧠',
      color: systemStatus.memory_usage > 80 ? '#ff4757' : systemStatus.memory_usage > 50 ? '#ffa502' : '#2ed573'
    },
    { 
      label: 'Network Health', 
      value: systemStatus.health_score ? `${systemStatus.health_score}%` : 'N/A', 
      trend: systemStatus.health_score > 80 ? 'up' : systemStatus.health_score > 60 ? 'stable' : 'down', 
      icon: '📊',
      color: systemStatus.health_score > 80 ? '#2ed573' : systemStatus.health_score > 60 ? '#ffa502' : '#ff4757'
    },
  ];

  const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL');
  const warningAlerts = alerts.filter(alert => alert.severity === 'WARNING');

  if (loading) {
    return (
      <div className="loading-state" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#e2e8f0',
        borderRadius: '20px',
        margin: '20px',
        padding: '40px',
        border: '1px solid #334155'
      }}>
        <div className="spinner" style={{
          width: '60px',
          height: '60px',
          border: '6px solid rgba(226, 232, 240, 0.3)',
          borderTop: '6px solid #e2e8f0',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
          Loading real-time system data from backend...
        </p>
        <p style={{ opacity: 0.8, marginTop: '10px', color: '#94a3b8' }}>Initializing network monitoring</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state" style={{
        background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
        color: '#fecaca',
        padding: '40px',
        borderRadius: '20px',
        margin: '20px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(127, 29, 29, 0.4)',
        border: '1px solid #7f1d1d'
      }}>
        <div className="error-icon" style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
        <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#fecaca' }}>Backend Connection Failed</h3>
        <p style={{ fontSize: '16px', marginBottom: '30px', opacity: 0.9 }}>{error}</p>
        <div className="error-tips" style={{
          background: 'rgba(254, 202, 202, 0.1)',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'left',
          maxWidth: '500px',
          margin: '0 auto',
          border: '1px solid rgba(254, 202, 202, 0.2)'
        }}>
          <h4 style={{ marginBottom: '15px', fontSize: '18px', color: '#fecaca' }}>🚀 To fix this:</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '8px 0', fontSize: '15px', color: '#fecaca' }}>✅ Make sure Python backend is running</li>
            <li style={{ padding: '8px 0', fontSize: '15px', color: '#fecaca' }}>✅ Check if port 5000 is available</li>
            <li style={{ padding: '8px 0', fontSize: '15px', color: '#fecaca' }}>✅ Verify Flask server started successfully</li>
            <li style={{ padding: '8px 0', fontSize: '15px', color: '#fecaca' }}>✅ Ensure all dependencies are installed</li>
          </ul>
          <button className="btn btn-primary" onClick={fetchDashboardData} style={{
            background: '#fecaca',
            color: '#7f1d1d',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '25px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(254, 202, 202, 0.3)'
          }}>
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      minHeight: '100vh',
      color: '#e2e8f0'
    }}>
      {/* System Overview Cards */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '25px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '1px solid #475569'
      }}>
        <div className="card-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h2 className="card-title" style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>🌐 Live Network Overview</h2>
          <button 
            className="btn btn-primary" 
            onClick={fetchDashboardData}
            disabled={refreshing}
            style={{
              background: refreshing ? '#475569' : 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '15px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)'
            }}
          >
            {refreshing ? '🔄 Refreshing...' : '📊 Refresh Live Data'}
          </button>
        </div>
        
        <div className="grid grid-3" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '25px'
        }}>
          {metrics.map((metric, index) => (
            <div key={index} className="card metric-card" style={{
              background: `linear-gradient(135deg, ${metric.color}10 0%, ${metric.color}20 100%)`,
              border: `2px solid ${metric.color}30`,
              borderRadius: '18px',
              padding: '25px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}>
              <div className="metric-icon" style={{
                fontSize: '40px',
                marginBottom: '15px',
                opacity: 0.9
              }}>{metric.icon}</div>
              <div className="metric-value" style={{
                fontSize: '32px',
                fontWeight: '800',
                color: metric.color,
                marginBottom: '8px'
              }}>{metric.value}</div>
              <div className="metric-label" style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
                opacity: 0.8
              }}>{metric.label}</div>
              <div className={`metric-trend ${metric.trend}`} style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                fontSize: '20px',
                color: metric.color
              }}>
                {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Network Stats */}
        <div className="grid grid-3" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            color: '#e0f2fe',
            borderRadius: '18px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(30, 64, 175, 0.4)',
            border: '1px solid #3b82f6'
          }}>
            <div className="stat-icon" style={{ fontSize: '30px', marginBottom: '10px' }}>🔗</div>
            <div className="stat-value" style={{ fontSize: '28px', fontWeight: '700', marginBottom: '5px' }}>
              {systemStatus.active_connections || 'N/A'}
            </div>
            <div className="stat-label" style={{ fontSize: '14px', opacity: 0.9 }}>Active Connections</div>
          </div>
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
            color: '#d1fae5',
            borderRadius: '18px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(6, 95, 70, 0.4)',
            border: '1px solid #10b981'
          }}>
            <div className="stat-icon" style={{ fontSize: '30px', marginBottom: '10px' }}>📤</div>
            <div className="stat-value" style={{ fontSize: '20px', fontWeight: '700', marginBottom: '5px' }}>
              {formatBytes(systemStatus.network_sent)}
            </div>
            <div className="stat-label" style={{ fontSize: '14px', opacity: 0.9 }}>Data Sent</div>
          </div>
          <div className="stat-card" style={{
            background: systemStatus.internet === '✅ Connected' 
              ? 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
            color: systemStatus.internet === '✅ Connected' ? '#f3e8ff' : '#fecaca',
            borderRadius: '18px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: systemStatus.internet === '✅ Connected' 
              ? '0 8px 25px rgba(124, 58, 237, 0.4)'
              : '0 8px 25px rgba(153, 27, 27, 0.4)',
            border: systemStatus.internet === '✅ Connected' ? '1px solid #a78bfa' : '1px solid #dc2626'
          }}>
            <div className="stat-icon" style={{ fontSize: '30px', marginBottom: '10px' }}>🌐</div>
            <div className="stat-value" style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              marginBottom: '5px',
              color: systemStatus.internet === '✅ Connected' ? '#86efac' : '#fca5a5'
            }}>
              {systemStatus.internet || 'Unknown'}
            </div>
            <div className="stat-label" style={{ fontSize: '14px', opacity: 0.9 }}>Internet Status</div>
          </div>
        </div>
      </div>

      {/* Alerts Summary */}
      <div className="grid grid-2" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '25px',
        marginBottom: '25px'
      }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid #475569'
        }}>
          <div className="card-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 className="card-title" style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: '700',
              color: '#e2e8f0'
            }}>🚨 Live Alerts</h3>
            <span className="badge" style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              color: '#fecaca',
              padding: '6px 15px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>{alerts.length} alerts</span>
          </div>
          <div className="alert-list">
            {alerts.slice(0, 5).map((alert, index) => (
              <div key={index} className={`alert alert-${alert.severity?.toLowerCase() || 'info'}`} style={{
                background: alert.severity === 'CRITICAL' 
                  ? 'linear-gradient(135deg, #7f1d1d20 0%, #991b1b20 100%)'
                  : alert.severity === 'WARNING'
                  ? 'linear-gradient(135deg, #854d0e20 0%, #a1620720 100%)'
                  : 'linear-gradient(135deg, #1e3a8a20 0%, #1e40af20 100%)',
                border: `2px solid ${
                  alert.severity === 'CRITICAL' 
                    ? '#dc262640'
                    : alert.severity === 'WARNING'
                    ? '#d9770640'
                    : '#3b82f640'
                }`,
                borderRadius: '15px',
                padding: '18px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease'
              }}>
                <span className="alert-icon" style={{ fontSize: '20px', marginRight: '15px' }}>
                  {getSeverityIcon(alert.severity)}
                </span>
                <div className="alert-content" style={{ flex: 1 }}>
                  <div className="alert-message" style={{ 
                    fontWeight: '600',
                    color: alert.severity === 'CRITICAL' ? '#fca5a5' : 
                           alert.severity === 'WARNING' ? '#fde68a' : '#93c5fd',
                    fontSize: '14px'
                  }}>{alert.message}</div>
                  <div className="alert-time" style={{ 
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginTop: '5px'
                  }}>
                    {formatTime(alert.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="empty-state" style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#94a3b8'
              }}>
                <div className="empty-icon" style={{ fontSize: '50px', marginBottom: '15px' }}>✅</div>
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No alerts detected</p>
                <p className="empty-tips" style={{ fontSize: '14px', opacity: 0.7 }}>All systems are operating normally</p>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid #475569'
        }}>
          <div className="card-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h3 className="card-title" style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: '700',
              color: '#e2e8f0'
            }}>📈 Alert Summary</h3>
            <span className="badge" style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              color: '#e0f2fe',
              padding: '6px 15px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>{criticalAlerts.length + warningAlerts.length} active</span>
          </div>
          <div className="alert-summary" style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '25px'
          }}>
            <div className="summary-item critical" style={{
              textAlign: 'center',
              padding: '15px',
              background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
              borderRadius: '15px',
              color: '#fecaca',
              minWidth: '80px',
              boxShadow: '0 6px 20px rgba(127, 29, 29, 0.4)',
              border: '1px solid #dc2626'
            }}>
              <span className="summary-icon" style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🔴</span>
              <span className="summary-count" style={{ fontSize: '24px', fontWeight: '800', display: 'block' }}>{criticalAlerts.length}</span>
              <span className="summary-label" style={{ fontSize: '12px', opacity: 0.9 }}>Critical</span>
            </div>
            <div className="summary-item warning" style={{
              textAlign: 'center',
              padding: '15px',
              background: 'linear-gradient(135deg, #854d0e 0%, #d97706 100%)',
              borderRadius: '15px',
              color: '#fde68a',
              minWidth: '80px',
              boxShadow: '0 6px 20px rgba(133, 77, 14, 0.4)',
              border: '1px solid #d97706'
            }}>
              <span className="summary-icon" style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🟡</span>
              <span className="summary-count" style={{ fontSize: '24px', fontWeight: '800', display: 'block' }}>{warningAlerts.length}</span>
              <span className="summary-label" style={{ fontSize: '12px', opacity: 0.9 }}>Warning</span>
            </div>
            <div className="summary-item info" style={{
              textAlign: 'center',
              padding: '15px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              borderRadius: '15px',
              color: '#dbeafe',
              minWidth: '80px',
              boxShadow: '0 6px 20px rgba(30, 58, 138, 0.4)',
              border: '1px solid #3b82f6'
            }}>
              <span className="summary-icon" style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🔵</span>
              <span className="summary-count" style={{ fontSize: '24px', fontWeight: '800', display: 'block' }}>
                {alerts.length - criticalAlerts.length - warningAlerts.length}
              </span>
              <span className="summary-label" style={{ fontSize: '12px', opacity: 0.9 }}>Info</span>
            </div>
          </div>
          
          {criticalAlerts.length > 0 && (
            <div className="critical-warning" style={{
              background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
              color: '#fecaca',
              padding: '18px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 6px 20px rgba(127, 29, 29, 0.4)',
              border: '1px solid #dc2626'
            }}>
              <div className="warning-icon" style={{ fontSize: '24px', marginRight: '15px' }}>⚠️</div>
              <div className="warning-message" style={{ fontSize: '14px', fontWeight: '600' }}>
                {criticalAlerts.length} critical alert(s) require immediate attention
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Information */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '20px',
        padding: '25px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '1px solid #475569'
      }}>
        <div className="card-header" style={{ marginBottom: '20px' }}>
          <h3 className="card-title" style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: '700',
            color: '#e2e8f0'
          }}>🖥️ System Information</h3>
        </div>
        <div className="system-info-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div className="info-item" style={{
            background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
            padding: '18px',
            borderRadius: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #0369a1'
          }}>
            <span className="info-label" style={{ fontWeight: '600', color: '#e0f2fe' }}>Hostname:</span>
            <span className="info-value" style={{ 
              fontWeight: '700', 
              color: '#7dd3fc',
              background: 'rgba(3, 105, 161, 0.3)',
              padding: '5px 12px',
              borderRadius: '10px',
              fontSize: '14px'
            }}>{systemStatus.hostname || 'Unknown'}</span>
          </div>
          <div className="info-item" style={{
            background: 'linear-gradient(135deg, #581c87 0%, #7e22ce 100%)',
            padding: '18px',
            borderRadius: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #7e22ce'
          }}>
            <span className="info-label" style={{ fontWeight: '600', color: '#f3e8ff' }}>Platform:</span>
            <span className="info-value" style={{ 
              fontWeight: '700', 
              color: '#d8b4fe',
              background: 'rgba(126, 34, 206, 0.3)',
              padding: '5px 12px',
              borderRadius: '10px',
              fontSize: '14px'
            }}>{systemStatus.platform || 'Unknown'}</span>
          </div>
          <div className="info-item" style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
            padding: '18px',
            borderRadius: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #047857'
          }}>
            <span className="info-label" style={{ fontWeight: '600', color: '#d1fae5' }}>Memory:</span>
            <span className="info-value" style={{ 
              fontWeight: '700', 
              color: '#6ee7b7',
              background: 'rgba(4, 120, 87, 0.3)',
              padding: '5px 12px',
              borderRadius: '10px',
              fontSize: '14px'
            }}>{systemStatus.memory || 'Unknown'}</span>
          </div>
          <div className="info-item" style={{
            background: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
            padding: '18px',
            borderRadius: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #d97706'
          }}>
            <span className="info-label" style={{ fontWeight: '600', color: '#fef3c7' }}>Last Updated:</span>
            <span className="info-value" style={{ 
              fontWeight: '700', 
              color: '#fcd34d',
              background: 'rgba(217, 119, 6, 0.3)',
              padding: '5px 12px',
              borderRadius: '10px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {systemStatus.timestamp ? 
                new Date(systemStatus.timestamp).toLocaleString() : 
                'Unknown'
              }
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .metric-card:hover {
          transform: translateY(-5px);
        }
        
        .alert:hover {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;