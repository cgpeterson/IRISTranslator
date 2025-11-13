// Base44 API Client for LLM Integration
class Base44Client {
  constructor() {
    this.baseUrl = import.meta.env.VITE_BASE44_API_URL || 'https://api.base44.com';
    this.apiKey = import.meta.env.VITE_BASE44_API_KEY;
  }

  integrations = {
    Core: {
      InvokeLLM: async ({ prompt }) => {
        try {
          // If no API key is configured, return a helpful error message
          if (!this.apiKey) {
            console.warn('Base44 API key not configured. Set VITE_BASE44_API_KEY in your environment variables.');
            return 'Error: API key not configured. Please set VITE_BASE44_API_KEY in your environment variables.';
          }

          const response = await fetch(`${this.baseUrl}/integrations/core/invoke-llm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({ prompt }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('LLM API error:', response.status, errorText);
            throw new Error(`API request failed: ${response.status}`);
          }

          const data = await response.json();
          return data.result || data.text || data.response || String(data);
        } catch (error) {
          console.error('InvokeLLM error:', error);
          throw error;
        }
      },
    },
  };
}

export const base44 = new Base44Client();
