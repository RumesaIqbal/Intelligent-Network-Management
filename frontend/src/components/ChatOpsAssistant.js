// components/ChatOpsAssistant.js
import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/apiService';

const ChatOpsAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "🤖 Hello! I'm your Network Management Assistant. I can help you monitor, troubleshoot, and manage your network. Type 'help' for available commands.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setConnectionError(false);

    try {
      // Send command to backend
      const response = await apiService.sendCommand(inputValue);
      
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: response.response || "Command executed successfully",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: `❌ Error: ${error.message}\n\nMake sure the backend server is running on http://localhost:5000`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setConnectionError(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'assistant',
      content: "🤖 Hello! I'm your Network Management Assistant. I can help you monitor, troubleshoot, and manage your network. Type 'help' for available commands.",
      timestamp: new Date()
    }]);
    setConnectionError(false);
  };

  return (
    <div className="chatops-assistant" style={{
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
          }}>💬 ChatOps Network Assistant</h2>
          <button 
            className="btn btn-secondary"
            onClick={clearChat}
            style={{
              background: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
              color: '#e2e8f0',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '15px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(71, 85, 105, 0.4)'
            }}
          >
            Clear Chat
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
          }}>Interactive troubleshooting interface with real-time diagnostics and step-by-step problem resolution guidance.</p>
          {connectionError && (
            <div className="error-banner" style={{
              background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
              color: '#fecaca',
              padding: '15px',
              borderRadius: '12px',
              marginTop: '15px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 15px rgba(127, 29, 29, 0.4)',
              border: '1px solid #dc2626'
            }}>
              <span className="error-icon" style={{ fontSize: '18px', marginRight: '10px' }}>⚠️</span>
              Backend connection failed. Make sure the Python server is running on port 5000.
            </div>
          )}
        </div>

        <div className="chat-container">
          <div className="chat-messages" style={{
            height: '400px',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            border: '2px solid #475569',
            scrollbarWidth: 'thin',
            scrollbarColor: '#475569 #1e293b'
          }}>
            {messages.map(message => (
              <div key={message.id} className={`message ${message.type}`} style={{
                display: 'flex',
                marginBottom: '20px',
                alignItems: 'flex-start',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
              }}>
                <div className="message-avatar" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  background: message.type === 'user' 
                    ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                  margin: message.type === 'user' ? '0 0 0 15px' : '0 15px 0 0',
                  flexShrink: 0
                }}>
                  {message.type === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content" style={{
                  maxWidth: '70%',
                  background: message.type === 'user'
                    ? 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)'
                    : 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                  color: message.type === 'user' ? '#e0f2fe' : '#e2e8f0',
                  padding: '15px 20px',
                  borderRadius: message.type === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                  border: message.type === 'user' ? '1px solid #60a5fa' : '1px solid #475569',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                  <div className="message-text" style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginBottom: '8px'
                  }}>
                    {message.content.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                  <div className="message-time" style={{
                    fontSize: '11px',
                    opacity: 0.7,
                    textAlign: message.type === 'user' ? 'right' : 'left'
                  }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message assistant" style={{
                display: 'flex',
                marginBottom: '20px',
                alignItems: 'flex-start'
              }}>
                <div className="message-avatar" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                  marginRight: '15px',
                  flexShrink: 0
                }}>
                  🤖
                </div>
                <div className="message-content" style={{
                  background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                  color: '#e2e8f0',
                  padding: '15px 20px',
                  borderRadius: '20px 20px 20px 5px',
                  border: '1px solid #475569'
                }}>
                  <div className="typing-indicator" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#94a3b8',
                      animation: 'typing 1.4s infinite ease-in-out'
                    }}></span>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#94a3b8',
                      animation: 'typing 1.4s infinite ease-in-out 0.2s'
                    }}></span>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#94a3b8',
                      animation: 'typing 1.4s infinite ease-in-out 0.4s'
                    }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container" style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type your command here... (e.g., 'help', 'status', 'troubleshoot internet')"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              style={{
                flex: 1,
                padding: '15px 20px',
                borderRadius: '15px',
                border: '2px solid #475569',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                color: '#e2e8f0',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            <button 
              className="btn btn-primary send-button"
              onClick={handleSendMessage}
              disabled={isTyping || !inputValue.trim()}
              style={{
                background: isTyping || !inputValue.trim() 
                  ? '#475569' 
                  : 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 25px',
                borderRadius: '15px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: isTyping || !inputValue.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
                minWidth: '80px'
              }}
            >
              {isTyping ? '...' : 'Send'}
            </button>
          </div>

          <div className="quick-commands" style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            padding: '20px',
            borderRadius: '18px',
            border: '2px solid #475569'
          }}>
            <h4 style={{
              margin: '0 0 15px 0',
              fontSize: '16px',
              fontWeight: '700',
              color: '#e2e8f0'
            }}>Quick Commands:</h4>
            <div className="command-buttons" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {['status', 'alerts', 'diagnose', 'scan', 'troubleshoot internet', 'processes', 'bandwidth'].map(cmd => (
                <button
                  key={cmd}
                  className="btn btn-secondary"
                  onClick={() => setInputValue(cmd)}
                  disabled={isTyping}
                  style={{
                    background: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
                    color: '#e2e8f0',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '12px',
                    cursor: isTyping ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 10px rgba(71, 85, 105, 0.3)',
                    opacity: isTyping ? 0.6 : 1
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
        
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-messages::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 3px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        .chat-input:focus {
          border-color: #60a5fa !important;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1) !important;
        }
        
        .message-content {
          transition: transform 0.2s ease;
        }
        
        .message:hover .message-content {
          transform: translateY(-2px);
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(96, 165, 250, 0.6) !important;
        }
      `}</style>
    </div>
  );
};

export default ChatOpsAssistant;