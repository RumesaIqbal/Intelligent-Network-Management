// services/apiService.js
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw new Error(`Backend connection failed: ${error.message}`);
    }
  }

  async getSystemStatus() {
    return this.request('/system-status');
  }

  async getAlerts() {
    return this.request('/alerts');
  }

  async getNetworkStats() {
    return this.request('/network-stats');
  }

  async sendCommand(command, args = []) {
    return this.request('/command', {
      method: 'POST',
      body: JSON.stringify({ 
        command: args.length > 0 ? `${command} ${args.join(' ')}` : command 
      }),
    });
  }

  async healthCheck() {
    try {
      return await this.request('/health');
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

export const apiService = new ApiService();