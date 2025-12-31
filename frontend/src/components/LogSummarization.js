// components/LogSummarization.js
import React, { useState } from 'react';
import { apiService } from '../services/apiService';

const LogSummarization = () => {
  const [logs, setLogs] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getNetworkStats();
      setLogs(response.logs || []);
      setAnalysis({
        total_logs: response.logs?.length || 0,
        patterns_detected: response.analysis?.patterns_detected || {},
        severity_distribution: response.analysis?.severity_distribution || {},
        ...response.summary
      });
    } catch (err) {
      setError(err.message);
      setLogs([]);
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '🔴';
      case 'WARNING': return '🟡';
      case 'INFO': return '🔵';
      case 'ERROR': return '🔴';
      default: return '⚪';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Invalid timestamp';
    }
  };

  return (
    <div className="log-summarization" style={{
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
          }}>📋 Network Log Summarization</h2>
          <button 
            className="btn btn-primary" 
            onClick={analyzeLogs}
            disabled={isLoading}
            style={{
              background: isLoading ? '#475569' : 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '20px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(96, 165, 250, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner-small" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Analyzing Real Logs...
              </>
            ) : (
              'Analyze Real Logs'
            )}
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
          }}>Analyze system logs, detect patterns, and generate comprehensive network insights with health scoring and recommendations.</p>
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
            {error}
          </div>
        )}

        {analysis && (
          <div className="analysis-results">
            <div className="grid grid-3" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div className="card metric-card" style={{
                background: 'linear-gradient(135deg, #1e40af20 0%, #3b82f620 100%)',
                border: '3px solid #3b82f640',
                borderRadius: '20px',
                padding: '25px',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                <div className="metric-value" style={{
                  fontSize: '42px',
                  fontWeight: '800',
                  color: '#60a5fa',
                  marginBottom: '10px'
                }}>{analysis.total_logs}</div>
                <div className="metric-label" style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#e2e8f0'
                }}>Total Log Entries</div>
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
                <div className="metric-value critical" style={{
                  fontSize: '42px',
                  fontWeight: '800',
                  color: '#ffa502',
                  marginBottom: '10px'
                }}>
                  {Object.keys(analysis.patterns_detected).length}
                </div>
                <div className="metric-label" style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#e2e8f0'
                }}>Issue Patterns</div>
              </div>
              <div className="card metric-card" style={{
                background: analysis.health_score > 80 
                  ? 'linear-gradient(135deg, #064e3b20 0%, #04785720 100%)'
                  : analysis.health_score > 60
                  ? 'linear-gradient(135deg, #854d0e20 0%, #d9770620 100%)'
                  : 'linear-gradient(135deg, #7f1d1d20 0%, #dc262620 100%)',
                border: analysis.health_score > 80 
                  ? '3px solid #04785740'
                  : analysis.health_score > 60
                  ? '3px solid #d9770640'
                  : '3px solid #dc262640',
                borderRadius: '20px',
                padding: '25px',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                <div className={`metric-value ${analysis.health_score > 80 ? 'excellent' : analysis.health_score > 60 ? 'good' : 'poor'}`} style={{
                  fontSize: '42px',
                  fontWeight: '800',
                  color: analysis.health_score > 80 
                    ? '#10b981'
                    : analysis.health_score > 60
                    ? '#ffa502'
                    : '#ff4757',
                  marginBottom: '10px'
                }}>
                  {analysis.health_score || 0}%
                </div>
                <div className="metric-label" style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#e2e8f0'
                }}>Health Score</div>
              </div>
            </div>

            {/* Log Analysis Table */}
            <div className="card" style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              borderRadius: '20px',
              padding: '25px',
              marginBottom: '25px',
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
              }}>📊 Real Log Analysis Results</h3>
              <div className="log-table-container" style={{
                overflowX: 'auto',
                borderRadius: '15px',
                border: '1px solid #475569'
              }}>
                <table className="log-table" style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                }}>
                  <thead style={{
                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                    color: '#e0f2fe'
                  }}>
                    <tr>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Time</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Source</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Severity</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={index} className={`log-row severity-${log.severity?.toLowerCase()}`} style={{
                        borderBottom: '1px solid #475569',
                        transition: 'all 0.3s ease'
                      }}>
                        <td className="log-time" style={{ 
                          padding: '12px 15px', 
                          fontSize: '13px',
                          color: '#94a3b8'
                        }}>{formatTimestamp(log.timestamp)}</td>
                        <td className="log-source" style={{ 
                          padding: '12px 15px', 
                          fontSize: '13px',
                          color: '#e2e8f0',
                          fontWeight: '500'
                        }}>{log.source}</td>
                        <td className="log-severity" style={{ padding: '12px 15px' }}>
                          <span className={`severity-badge ${log.severity?.toLowerCase()}`} style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: log.severity === 'CRITICAL' 
                              ? 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)'
                              : log.severity === 'WARNING'
                              ? 'linear-gradient(135deg, #854d0e 0%, #d97706 100%)'
                              : log.severity === 'INFO'
                              ? 'linear-gradient(135deg, #064e3b 0%, #047857 100%)'
                              : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                            color: log.severity === 'CRITICAL' ? '#fecaca' :
                                   log.severity === 'WARNING' ? '#fde68a' :
                                   log.severity === 'INFO' ? '#d1fae5' : '#dbeafe'
                          }}>
                            {getSeverityIcon(log.severity)} {log.severity}
                          </span>
                        </td>
                        <td className="log-message" style={{ 
                          padding: '12px 15px', 
                          fontSize: '13px',
                          color: '#e2e8f0'
                        }}>{log.message}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan="4" className="empty-message" style={{
                          padding: '40px 20px',
                          textAlign: 'center',
                          color: '#94a3b8',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          No logs available from backend
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Patterns and Recommendations */}
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
                }}>🔍 Detected Patterns</h3>
                <div className="pattern-list">
                  {Object.entries(analysis.patterns_detected).map(([pattern, patternLogs]) => (
                    <div key={pattern} className="pattern-item" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px',
                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                      borderRadius: '12px',
                      marginBottom: '10px',
                      border: '2px solid #475569',
                      transition: 'all 0.3s ease'
                    }}>
                      <span className="pattern-name" style={{
                        fontWeight: '600',
                        color: '#e2e8f0',
                        fontSize: '14px'
                      }}>{pattern.replace('_', ' ').toUpperCase()}</span>
                      <span className="pattern-count" style={{
                        background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                        color: '#f3e8ff',
                        padding: '4px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>{patternLogs.length} occurrences</span>
                    </div>
                  ))}
                  {Object.keys(analysis.patterns_detected).length === 0 && (
                    <div className="empty-patterns" style={{
                      textAlign: 'center',
                      padding: '30px 20px',
                      color: '#94a3b8',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}>
                      <span className="success-icon" style={{ fontSize: '20px' }}>✅</span>
                      No issues detected in system logs
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
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#e2e8f0',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>💡 Recommendations</h3>
                <div className="recommendation-list">
                  {analysis.recommendations?.map((rec, index) => (
                    <div key={index} className={`recommendation ${
                      rec.includes('🚨') ? 'critical' : 
                      rec.includes('💡') ? 'warning' : 
                      rec.includes('✅') ? 'success' : 'info'
                    }`} style={{
                      padding: '15px',
                      borderRadius: '12px',
                      marginBottom: '10px',
                      fontSize: '14px',
                      fontWeight: '500',
                      background: rec.includes('🚨') 
                        ? 'linear-gradient(135deg, #7f1d1d20 0%, #dc262620 100%)'
                        : rec.includes('💡')
                        ? 'linear-gradient(135deg, #854d0e20 0%, #d9770620 100%)'
                        : rec.includes('✅')
                        ? 'linear-gradient(135deg, #064e3b20 0%, #04785720 100%)'
                        : 'linear-gradient(135deg, #1e40af20 0%, #3b82f620 100%)',
                      border: rec.includes('🚨') 
                        ? '2px solid #dc262640'
                        : rec.includes('💡')
                        ? '2px solid #d9770640'
                        : rec.includes('✅')
                        ? '2px solid #04785740'
                        : '2px solid #3b82f640',
                      color: rec.includes('🚨') ? '#fca5a5' :
                             rec.includes('💡') ? '#fde68a' :
                             rec.includes('✅') ? '#86efac' : '#93c5fd'
                    }}>
                      {rec}
                    </div>
                  )) || (
                    <div className="recommendation info" style={{
                      padding: '15px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #1e40af20 0%, #3b82f620 100%)',
                      border: '2px solid #3b82f640',
                      color: '#93c5fd',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      📊 Monitor system performance regularly
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!analysis && !isLoading && (
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
            }}>📋</div>
            <h3 style={{ 
              fontSize: '26px', 
              fontWeight: '800', 
              color: '#e2e8f0',
              marginBottom: '15px'
            }}>No Log Analysis Yet</h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#94a3b8',
              marginBottom: '30px',
              maxWidth: '500px',
              margin: '0 auto 30px',
              lineHeight: '1.6'
            }}>Click "Analyze Real Logs" to start analyzing your actual system logs and generate insights.</p>
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
              }}>What this module analyzes:</h4>
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
                  <span style={{ marginRight: '10px' }}>📡</span>
                  Real network interface statistics
                </li>
                <li style={{ 
                  padding: '10px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>🔗</span>
                  Actual connection analysis
                </li>
                <li style={{ 
                  padding: '10px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>🖥️</span>
                  Live process network usage
                </li>
                <li style={{ 
                  padding: '10px 0', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#e2e8f0'
                }}>
                  <span style={{ marginRight: '10px' }}>📊</span>
                  Current system performance metrics
                </li>
              </ul>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="loading-state" style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: '20px',
            marginTop: '20px',
            border: '2px solid #475569'
          }}>
            <div className="spinner" style={{
              width: '60px',
              height: '60px',
              border: '6px solid rgba(96, 165, 250, 0.3)',
              borderTop: '6px solid #60a5fa',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 25px'
            }}></div>
            <p style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#e2e8f0',
              marginBottom: '25px'
            }}>Analyzing real system logs and generating insights...</p>
            <div className="loading-steps" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '300px',
              margin: '0 auto'
            }}>
              <div className="loading-step" style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '10px',
                border: '2px solid #475569',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>📡 Collecting real network statistics...</div>
              <div className="loading-step" style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '10px',
                border: '2px solid #475569',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>🔍 Analyzing actual log patterns...</div>
              <div className="loading-step" style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '10px',
                border: '2px solid #475569',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>📊 Generating real insights...</div>
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
        
        .pattern-item:hover {
          transform: translateX(5px);
          border-color: #60a5fa !important;
        }
        
        .log-row:hover {
          background: linear-gradient(135deg, #334155 0%, #475569 100%) !important;
          transform: scale(1.01);
        }
        
        .recommendation:hover {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
};

export default LogSummarization;