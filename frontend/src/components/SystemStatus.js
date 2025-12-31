// components/SystemStatus.js
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const SystemStatus = () => {
  const [systemInfo, setSystemInfo] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const data = await apiService.getSystemStatus();
      setSystemInfo(data);
    } catch (err) {
      setError(err.message);
      setSystemInfo({});
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getResourceLevel = (value) => {
    if (!value) return 'unknown';
    return value > 80 ? 'high' : value > 50 ? 'medium' : 'low';
  };

  return (
    <div className="system-status" style={{
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
          }}>🔧 Real System Status & Information</h2>
          <button 
            className="btn btn-primary" 
            onClick={refreshData}
            disabled={isRefreshing}
            style={{
              background: isRefreshing ? '#475569' : 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '20px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(96, 165, 250, 0.4)'
            }}
          >
            {isRefreshing ? '🔄 Refreshing...' : '📊 Refresh Real Data'}
          </button>
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
          }}>Comprehensive real system information, resource monitoring, and backend service status.</p>
          {error && (
            <div className="error-banner" style={{
              background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
              color: '#fecaca',
              padding: '18px',
              borderRadius: '15px',
              marginTop: '15px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 6px 20px rgba(127, 29, 29, 0.4)',
              border: '1px solid #dc2626'
            }}>
              <span className="error-icon" style={{ fontSize: '20px', marginRight: '12px' }}>⚠️</span>
              {error}
            </div>
          )}
        </div>

        {Object.keys(systemInfo).length > 0 ? (
          <div className="system-info-grid">
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
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#e2e8f0',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>🖥️ System Information</h3>
                <div className="info-list">
                  <div className="info-item" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '2px solid #475569',
                    transition: 'all 0.3s ease'
                  }}>
                    <span className="info-label" style={{ 
                      fontWeight: '600', 
                      color: '#94a3b8',
                      fontSize: '14px'
                    }}>Platform:</span>
                    <span className="info-value" style={{ 
                      fontWeight: '700', 
                      color: '#60a5fa',
                      fontSize: '14px'
                    }}>{systemInfo.platform || 'Unknown'}</span>
                  </div>
                  <div className="info-item" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '2px solid #475569',
                    transition: 'all 0.3s ease'
                  }}>
                    <span className="info-label" style={{ 
                      fontWeight: '600', 
                      color: '#94a3b8',
                      fontSize: '14px'
                    }}>Processor:</span>
                    <span className="info-value" style={{ 
                      fontWeight: '700', 
                      color: '#60a5fa',
                      fontSize: '14px'
                    }}>{systemInfo.processor || 'Unknown'}</span>
                  </div>
                  <div className="info-item" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '2px solid #475569',
                    transition: 'all 0.3s ease'
                  }}>
                    <span className="info-label" style={{ 
                      fontWeight: '600', 
                      color: '#94a3b8',
                      fontSize: '14px'
                    }}>Memory:</span>
                    <span className="info-value" style={{ 
                      fontWeight: '700', 
                      color: '#60a5fa',
                      fontSize: '14px'
                    }}>{systemInfo.memory || 'Unknown'}</span>
                  </div>
                  <div className="info-item" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    borderRadius: '12px',
                    border: '2px solid #475569',
                    transition: 'all 0.3s ease'
                  }}>
                    <span className="info-label" style={{ 
                      fontWeight: '600', 
                      color: '#94a3b8',
                      fontSize: '14px'
                    }}>Hostname:</span>
                    <span className="info-value" style={{ 
                      fontWeight: '700', 
                      color: '#60a5fa',
                      fontSize: '14px'
                    }}>{systemInfo.hostname || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                border: '1px solid #475569'
              }}>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#e2e8f0',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>🌐 Network Status</h3>
                <div className="service-list">
                  <div className={`service-item ${systemInfo.internet === '✅ Connected' ? 'online' : 'offline'}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px',
                    background: systemInfo.internet === '✅ Connected'
                      ? 'linear-gradient(135deg, #064e3b20 0%, #04785720 100%)'
                      : 'linear-gradient(135deg, #7f1d1d20 0%, #dc262620 100%)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: systemInfo.internet === '✅ Connected'
                      ? '2px solid #04785740'
                      : '2px solid #dc262640',
                    transition: 'all 0.3s ease'
                  }}>
                    <span className="service-status" style={{ 
                      fontSize: '18px', 
                      marginRight: '12px' 
                    }}>
                      {systemInfo.internet === '✅ Connected' ? '✅' : '❌'}
                    </span>
                    <span className="service-name" style={{ 
                      flex: 1,
                      fontWeight: '600',
                      color: systemInfo.internet === '✅ Connected' ? '#86efac' : '#fca5a5',
                      fontSize: '14px'
                    }}>Internet Connectivity</span>
                    <span className="service-version" style={{ 
                      fontWeight: '700',
                      color: systemInfo.internet === '✅ Connected' ? '#10b981' : '#ef4444',
                      fontSize: '13px'
                    }}>
                      {systemInfo.internet === '✅ Connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="service-item online" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #1e40af20 0%, #3b82f620 100%)',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '2px solid #3b82f640',
                    transition: 'all 0.3s ease'
                  }}>
                    <span className="service-status" style={{ 
                      fontSize: '18px', 
                      marginRight: '12px' 
                    }}>✅</span>
                    <span className="service-name" style={{ 
                      flex: 1,
                      fontWeight: '600',
                      color: '#93c5fd',
                      fontSize: '14px'
                    }}>Active Connections</span>
                    <span className="service-version" style={{ 
                      fontWeight: '700',
                      color: '#60a5fa',
                      fontSize: '13px'
                    }}>{systemInfo.active_connections || 0}</span>
                  </div>
                  <div className="service-item online" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #064e3b20 0%, #04785720 100%)',
                    borderRadius: '12px',
                    border: '2px solid #04785740',
                    transition: 'all 0.3s ease'
                  }}>
                    <span className="service-status" style={{ 
                      fontSize: '18px', 
                      marginRight: '12px' 
                    }}>✅</span>
                    <span className="service-name" style={{ 
                      flex: 1,
                      fontWeight: '600',
                      color: '#86efac',
                      fontSize: '14px'
                    }}>Network Health</span>
                    <span className="service-version" style={{ 
                      fontWeight: '700',
                      color: '#10b981',
                      fontSize: '13px'
                    }}>{systemInfo.health_score || 0}%</span>
                  </div>
                </div>
              </div>
            </div>

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
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#e2e8f0',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>⏱️ System Uptime</h3>
                <div className="uptime-info">
                  <div className="uptime-value" style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#f59e0b',
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>{systemInfo.uptime || 'Unknown'}</div>
                  <div className="uptime-details">
                    <div className="info-item" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                      borderRadius: '10px',
                      border: '2px solid #475569'
                    }}>
                      <span className="info-label" style={{ 
                        fontWeight: '600', 
                        color: '#94a3b8',
                        fontSize: '13px'
                      }}>Last Updated:</span>
                      <span className="info-value" style={{ 
                        fontWeight: '700', 
                        color: '#f59e0b',
                        fontSize: '13px'
                      }}>
                        {systemInfo.timestamp ? 
                          new Date(systemInfo.timestamp).toLocaleString() : 
                          'Unknown'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                border: '1px solid #475569'
              }}>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#e2e8f0',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>🔍 System Health</h3>
                <div className="health-score-display" style={{
                  textAlign: 'center'
                }}>
                  <div className={`health-score ${
                    (systemInfo.health_score || 0) > 80 ? 'excellent' : 
                    (systemInfo.health_score || 0) > 60 ? 'good' : 'poor'
                  }`} style={{
                    fontSize: '64px',
                    fontWeight: '800',
                    marginBottom: '10px',
                    background: (systemInfo.health_score || 0) > 80 
                      ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                      : (systemInfo.health_score || 0) > 60
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {systemInfo.health_score || 0}
                  </div>
                  <div className="health-label" style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#e2e8f0'
                  }}>Overall Health Score</div>
                </div>
              </div>
            </div>

            <div className="card" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              border: '1px solid #475569'
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#e2e8f0',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center'
              }}>📈 Real Resource Usage</h3>
              <div className="resource-usage" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div className="resource-bar" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div className="resource-label" style={{
                    width: '120px',
                    fontWeight: '600',
                    color: '#e2e8f0',
                    fontSize: '14px'
                  }}>CPU Usage</div>
                  <div className="resource-bar-container" style={{
                    flex: 1,
                    height: '20px',
                    background: '#1e293b',
                    borderRadius: '10px',
                    border: '2px solid #475569',
                    overflow: 'hidden'
                  }}>
                    <div 
                      className={`resource-bar-fill cpu ${getResourceLevel(systemInfo.cpu_usage)}`} 
                      style={{
                        width: `${systemInfo.cpu_usage || 0}%`,
                        height: '100%',
                        background: getResourceLevel(systemInfo.cpu_usage) === 'high' 
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : getResourceLevel(systemInfo.cpu_usage) === 'medium'
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                        borderRadius: '8px',
                        transition: 'width 0.5s ease'
                      }}
                    ></div>
                  </div>
                  <div className="resource-value" style={{
                    width: '60px',
                    fontWeight: '700',
                    color: '#e2e8f0',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}>{systemInfo.cpu_usage ? `${systemInfo.cpu_usage.toFixed(1)}%` : 'N/A'}</div>
                </div>
                <div className="resource-bar" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div className="resource-label" style={{
                    width: '120px',
                    fontWeight: '600',
                    color: '#e2e8f0',
                    fontSize: '14px'
                  }}>Memory Usage</div>
                  <div className="resource-bar-container" style={{
                    flex: 1,
                    height: '20px',
                    background: '#1e293b',
                    borderRadius: '10px',
                    border: '2px solid #475569',
                    overflow: 'hidden'
                  }}>
                    <div 
                      className={`resource-bar-fill memory ${getResourceLevel(systemInfo.memory_usage)}`} 
                      style={{
                        width: `${systemInfo.memory_usage || 0}%`,
                        height: '100%',
                        background: getResourceLevel(systemInfo.memory_usage) === 'high' 
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : getResourceLevel(systemInfo.memory_usage) === 'medium'
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                        borderRadius: '8px',
                        transition: 'width 0.5s ease'
                      }}
                    ></div>
                  </div>
                  <div className="resource-value" style={{
                    width: '60px',
                    fontWeight: '700',
                    color: '#e2e8f0',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}>{systemInfo.memory_usage ? `${systemInfo.memory_usage.toFixed(1)}%` : 'N/A'}</div>
                </div>
                <div className="resource-bar" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div className="resource-label" style={{
                    width: '120px',
                    fontWeight: '600',
                    color: '#e2e8f0',
                    fontSize: '14px'
                  }}>Disk Usage</div>
                  <div className="resource-bar-container" style={{
                    flex: 1,
                    height: '20px',
                    background: '#1e293b',
                    borderRadius: '10px',
                    border: '2px solid #475569',
                    overflow: 'hidden'
                  }}>
                    <div 
                      className={`resource-bar-fill disk ${getResourceLevel(systemInfo.disk_usage)}`} 
                      style={{
                        width: `${systemInfo.disk_usage || 0}%`,
                        height: '100%',
                        background: getResourceLevel(systemInfo.disk_usage) === 'high' 
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : getResourceLevel(systemInfo.disk_usage) === 'medium'
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                        borderRadius: '8px',
                        transition: 'width 0.5s ease'
                      }}
                    ></div>
                  </div>
                  <div className="resource-value" style={{
                    width: '60px',
                    fontWeight: '700',
                    color: '#e2e8f0',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}>{systemInfo.disk_usage ? `${systemInfo.disk_usage.toFixed(1)}%` : 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
            }}>🔧</div>
            <h3 style={{ 
              fontSize: '26px', 
              fontWeight: '800', 
              color: '#e2e8f0',
              marginBottom: '15px'
            }}>No Real System Data Available</h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#94a3b8',
              marginBottom: '30px',
              maxWidth: '500px',
              margin: '0 auto 30px',
              lineHeight: '1.6'
            }}>Unable to fetch system information from backend.</p>
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
              }}>To get real data:</h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                textAlign: 'left',
                marginBottom: '20px'
              }}>
                <li style={{ 
                  padding: '8px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>✅</span>
                  Start the Python backend server
                </li>
                <li style={{ 
                  padding: '8px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>✅</span>
                  Ensure it's running on port 5000
                </li>
                <li style={{ 
                  padding: '8px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>✅</span>
                  Check network connectivity
                </li>
                <li style={{ 
                  padding: '8px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>✅</span>
                  Verify CORS is enabled in backend
                </li>
              </ul>
              <button className="btn btn-primary" onClick={refreshData} style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '15px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
                width: '100%'
              }}>
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .info-item:hover {
          transform: translateX(5px);
          border-color: #60a5fa !important;
        }
        
        .service-item:hover {
          transform: translateX(5px);
        }
        
        .resource-bar:hover .resource-bar-fill {
          filter: brightness(1.2);
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(96, 165, 250, 0.6) !important;
        }
      `}</style>
    </div>
  );
};

export default SystemStatus;