// components/AlertClassification.js
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AlertClassification = () => {
  const [alerts, setAlerts] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startMonitoring = async () => {
    setIsMonitoring(true);
    setLoading(true);
    setError(null);
    
    try {
      const alertsData = await apiService.getAlerts();
      // Combine all alerts from different severity levels
      const allAlerts = [
        ...(alertsData.CRITICAL || []),
        ...(alertsData.WARNING || []),
        ...(alertsData.INFO || [])
      ];
      setAlerts(allAlerts);
    } catch (err) {
      setError(err.message);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setAlerts([]);
    setError(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '#ff4757';
      case 'WARNING': return '#ffa502';
      case 'INFO': return '#2ed573';
      default: return '#74b9ff';
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

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Invalid time';
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL');
  const warningAlerts = alerts.filter(alert => alert.severity === 'WARNING');
  const infoAlerts = alerts.filter(alert => alert.severity === 'INFO');

  return (
    <div className="alert-classification" style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      minHeight: '100vh',
      color: '#e2e8f0'
    }}>
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '25px',
        padding: '30px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
        border: '1px solid #475569',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="card-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          paddingBottom: '20px',
          borderBottom: '2px solid rgba(255,255,255,0.1)'
        }}>
          <h2 className="card-title" style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>🚨 Automated Alert Classification</h2>
          <div className="monitoring-controls">
            {!isMonitoring ? (
              <button className="btn btn-primary" onClick={startMonitoring} style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(96, 165, 250, 0.4)'
              }}>
                🚀 Start Real Monitoring
              </button>
            ) : (
              <button className="btn btn-danger" onClick={stopMonitoring} style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                color: '#fecaca',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)'
              }}>
                ⏹️ Stop Monitoring
              </button>
            )}
          </div>
        </div>

        <div className="module-description" style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
          padding: '20px',
          borderRadius: '18px',
          marginBottom: '25px',
          border: '2px solid #0369a1'
        }}>
          <p style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: '#e0f2fe',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>Real-time system monitoring with severity-based alert classification and prioritization of critical, warning, and informational alerts.</p>
        </div>

        {error && (
          <div className="error-banner" style={{
            background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
            color: '#fecaca',
            padding: '18px',
            borderRadius: '15px',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 6px 20px rgba(127, 29, 29, 0.4)',
            border: '1px solid #dc2626'
          }}>
            <span className="error-icon" style={{ fontSize: '20px', marginRight: '12px' }}>⚠️</span>
            <span style={{ fontWeight: '600' }}>{error}</span>
          </div>
        )}

        {isMonitoring && (
          <div className="monitoring-results">
            {loading ? (
              <div className="loading-state" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '50px 20px',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '20px',
                marginBottom: '25px',
                border: '1px solid #475569'
              }}>
                <div className="spinner" style={{
                  width: '50px',
                  height: '50px',
                  border: '5px solid rgba(96, 165, 250, 0.3)',
                  borderTop: '5px solid #60a5fa',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '20px'
                }}></div>
                <p style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#e2e8f0',
                  textAlign: 'center'
                }}>Fetching real-time alerts from backend...</p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#94a3b8',
                  marginTop: '8px'
                }}>Analyzing system metrics and patterns</p>
              </div>
            ) : (
              <>
                <div className="grid grid-3" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <div className="card metric-card" style={{
                    background: 'linear-gradient(135deg, #7f1d1d20 0%, #dc262620 100%)',
                    border: '3px solid #dc262640',
                    borderRadius: '20px',
                    padding: '25px',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <div className="metric-value critical" style={{
                      fontSize: '42px',
                      fontWeight: '800',
                      color: '#ff4757',
                      marginBottom: '10px'
                    }}>{criticalAlerts.length}</div>
                    <div className="metric-label" style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#e2e8f0'
                    }}>Critical Alerts</div>
                  </div>
                  <div className="card metric-card" style={{
                    background: 'linear-gradient(135deg, #854d0e20 0%, #d9770620 100%)',
                    border: '3px solid #d9770640',
                    borderRadius: '20px',
                    padding: '25px',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <div className="metric-value warning" style={{
                      fontSize: '42px',
                      fontWeight: '800',
                      color: '#ffa502',
                      marginBottom: '10px'
                    }}>{warningAlerts.length}</div>
                    <div className="metric-label" style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#e2e8f0'
                    }}>Warning Alerts</div>
                  </div>
                  <div className="card metric-card" style={{
                    background: 'linear-gradient(135deg, #064e3b20 0%, #04785720 100%)',
                    border: '3px solid #04785740',
                    borderRadius: '20px',
                    padding: '25px',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <div className="metric-value info" style={{
                      fontSize: '42px',
                      fontWeight: '800',
                      color: '#2ed573',
                      marginBottom: '10px'
                    }}>{infoAlerts.length}</div>
                    <div className="metric-label" style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#e2e8f0'
                    }}>Info Alerts</div>
                  </div>
                </div>

                {criticalAlerts.length > 0 && (
                  <div className="card" style={{
                    background: 'linear-gradient(135deg, #7f1d1d10 0%, #dc262610 100%)',
                    border: '2px solid #dc262630',
                    borderRadius: '20px',
                    padding: '25px',
                    marginBottom: '25px',
                    boxShadow: '0 8px 25px rgba(127, 29, 29, 0.3)'
                  }}>
                    <h3 className="critical-header" style={{
                      fontSize: '22px',
                      fontWeight: '800',
                      color: '#ff4757',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ marginRight: '10px' }}>🔴</span>
                      Critical Alerts (Require Immediate Attention)
                    </h3>
                    <div className="alert-list">
                      {criticalAlerts.map((alert, index) => (
                        <div key={index} className="alert alert-critical" style={{
                          background: 'linear-gradient(135deg, #7f1d1d20 0%, #dc262620 100%)',
                          border: '2px solid #dc262640',
                          borderRadius: '15px',
                          padding: '20px',
                          marginBottom: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.3s ease'
                        }}>
                          <div className="alert-icon" style={{ 
                            fontSize: '24px', 
                            marginRight: '15px' 
                          }}>{getSeverityIcon(alert.severity)}</div>
                          <div className="alert-content" style={{ flex: 1 }}>
                            <div className="alert-message" style={{ 
                              fontWeight: '700',
                              color: '#fca5a5',
                              fontSize: '15px',
                              marginBottom: '8px'
                            }}>{alert.message}</div>
                            <div className="alert-meta" style={{
                              display: 'flex',
                              gap: '20px',
                              fontSize: '13px',
                              color: '#94a3b8'
                            }}>
                              <span className="alert-device" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}>📱 {alert.device}</span>
                              <span className="alert-time" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}>🕒 {formatTime(alert.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {warningAlerts.length > 0 && (
                  <div className="card" style={{
                    background: 'linear-gradient(135deg, #854d0e10 0%, #d9770610 100%)',
                    border: '2px solid #d9770630',
                    borderRadius: '20px',
                    padding: '25px',
                    marginBottom: '25px',
                    boxShadow: '0 8px 25px rgba(133, 77, 14, 0.3)'
                  }}>
                    <h3 className="warning-header" style={{
                      fontSize: '22px',
                      fontWeight: '800',
                      color: '#ffa502',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ marginRight: '10px' }}>🟡</span>
                      Warning Alerts (Monitor Closely)
                    </h3>
                    <div className="alert-list">
                      {warningAlerts.map((alert, index) => (
                        <div key={index} className="alert alert-warning" style={{
                          background: 'linear-gradient(135deg, #854d0e20 0%, #d9770620 100%)',
                          border: '2px solid #d9770640',
                          borderRadius: '15px',
                          padding: '20px',
                          marginBottom: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.3s ease'
                        }}>
                          <div className="alert-icon" style={{ 
                            fontSize: '24px', 
                            marginRight: '15px' 
                          }}>{getSeverityIcon(alert.severity)}</div>
                          <div className="alert-content" style={{ flex: 1 }}>
                            <div className="alert-message" style={{ 
                              fontWeight: '700',
                              color: '#fde68a',
                              fontSize: '15px',
                              marginBottom: '8px'
                            }}>{alert.message}</div>
                            <div className="alert-meta" style={{
                              display: 'flex',
                              gap: '20px',
                              fontSize: '13px',
                              color: '#94a3b8'
                            }}>
                              <span className="alert-device" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}>📱 {alert.device}</span>
                              <span className="alert-time" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}>🕒 {formatTime(alert.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card" style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  borderRadius: '20px',
                  padding: '25px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  border: '1px solid #475569'
                }}>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    marginBottom: '20px',
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>📊 All Monitored Metrics</h3>
                  <div className="metrics-table">
                    <div className="table-header" style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr',
                      gap: '15px',
                      padding: '15px 20px',
                      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                      color: '#e0f2fe',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '14px',
                      marginBottom: '10px',
                      border: '1px solid #3b82f6'
                    }}>
                      <div>Status</div>
                      <div>Metric</div>
                      <div>Message</div>
                      <div>Device</div>
                      <div>Time</div>
                    </div>
                    <div className="table-body">
                      {alerts.map((alert, index) => (
                        <div key={index} className="table-row" style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr',
                          gap: '15px',
                          padding: '18px 20px',
                          background: index % 2 === 0 
                            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                            : 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                          borderRadius: '10px',
                          marginBottom: '8px',
                          transition: 'all 0.3s ease',
                          border: `2px solid ${getSeverityColor(alert.severity)}20`
                        }}>
                          <div className="status-cell" style={{
                            color: getSeverityColor(alert.severity),
                            fontWeight: '700',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            {getSeverityIcon(alert.severity)} {alert.severity}
                          </div>
                          <div className="metric-cell" style={{
                            fontWeight: '600',
                            color: '#e2e8f0',
                            fontSize: '13px'
                          }}>{alert.metric}</div>
                          <div className="message-cell" style={{
                            color: '#e2e8f0',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>{alert.message}</div>
                          <div className="device-cell" style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>{alert.device}</div>
                          <div className="time-cell" style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>{formatTime(alert.timestamp)}</div>
                        </div>
                      ))}
                      {alerts.length === 0 && (
                        <div className="table-row empty-row" style={{
                          padding: '40px 20px',
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #0c4a6e20 0%, #0369a120 100%)',
                          borderRadius: '15px',
                          marginTop: '10px',
                          border: '1px solid #0369a1'
                        }}>
                          <div className="empty-message" style={{
                            color: '#94a3b8',
                            fontSize: '16px',
                            fontWeight: '600'
                          }}>
                            ✅ No alerts detected in the system
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {!isMonitoring && !loading && (
          <div className="empty-state" style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: 'linear-gradient(135deg, #0c4a6e20 0%, #0369a120 100%)',
            borderRadius: '20px',
            marginTop: '20px',
            border: '2px dashed #0369a1'
          }}>
            <div className="empty-icon" style={{ 
              fontSize: '80px', 
              marginBottom: '20px',
              filter: 'grayscale(0.3)'
            }}>🚨</div>
            <h3 style={{ 
              fontSize: '26px', 
              fontWeight: '800', 
              color: '#e2e8f0',
              marginBottom: '15px'
            }}>Real-time Monitoring Not Active</h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#94a3b8',
              marginBottom: '30px',
              maxWidth: '500px',
              margin: '0 auto 30px',
              lineHeight: '1.6'
            }}>Click "Start Real Monitoring" to begin fetching live alerts from the backend system.</p>
            <div className="empty-tips" style={{
              background: 'rgba(30, 41, 59, 0.7)',
              padding: '25px',
              borderRadius: '15px',
              maxWidth: '500px',
              margin: '0 auto',
              border: '2px solid #475569'
            }}>
              <h4 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: '#e2e8f0',
                marginBottom: '15px',
                textAlign: 'center'
              }}>🎯 What you'll see:</h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                textAlign: 'left'
              }}>
                <li style={{ 
                  padding: '10px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>🔴</span>
                  Critical alerts requiring immediate attention
                </li>
                <li style={{ 
                  padding: '10px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>🟡</span>
                  Warning alerts that need monitoring
                </li>
                <li style={{ 
                  padding: '10px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>🔵</span>
                  Informational alerts about system status
                </li>
                <li style={{ 
                  padding: '10px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>📊</span>
                  Real metrics from your actual system
                </li>
              </ul>
            </div>
          </div>
        )}
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
        
        .table-row:hover {
          transform: scale(1.02);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default AlertClassification;