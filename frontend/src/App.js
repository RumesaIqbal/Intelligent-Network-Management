// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LogSummarization from './components/LogSummarization';
import AlertClassification from './components/AlertClassification';
import ChatOpsAssistant from './components/ChatOpsAssistant';
import SystemStatus from './components/SystemStatus';

// API Service
import { apiService } from './services/apiService';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [systemStatus, setSystemStatus] = useState(null); // Start with null instead of dummy data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch system status periodically
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        setError(null);
        const status = await apiService.getSystemStatus();
        setSystemStatus(status);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch system status. Make sure backend is running on http://localhost:5000');
        setLoading(false);
        console.error('Error fetching system status:', err);
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  const renderActiveModule = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading system data...</p>
        </div>
      );
    }

    if (error && !systemStatus) {
      return (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Connection Error</h3>
          <p>{error}</p>
          <div className="error-tips">
            <h4>To fix this:</h4>
            <ul>
              <li>Ensure the backend server is running</li>
              <li>Check if http://localhost:5000/api/health is accessible</li>
              <li>Verify no other services are using port 5000</li>
              <li>Check browser console for detailed errors</li>
            </ul>
          </div>
        </div>
      );
    }

    const moduleProps = {
      systemStatus: systemStatus || {},
      loading,
      error
    };

    switch (activeModule) {
      case 'dashboard':
        return <Dashboard {...moduleProps} />;
      case 'log-summarization':
        return <LogSummarization {...moduleProps} />;
      case 'alert-classification':
        return <AlertClassification {...moduleProps} />;
      case 'chatops':
        return <ChatOpsAssistant {...moduleProps} />;
      case 'system-status':
        return <SystemStatus {...moduleProps} />;
      default:
        return <Dashboard {...moduleProps} />;
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar 
          activeModule={activeModule} 
          setActiveModule={setActiveModule}
          systemStatus={systemStatus || {}} // Pass empty object if null
          loading={loading}
        />
        <main className="main-content">
          {error && systemStatus && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              Partial connection issue: {error}
              <button onClick={() => setError(null)} className="error-close">×</button>
            </div>
          )}
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default App;