// Base44 API Client for LLM Integration
class Base44Client {
  constructor() {
    this.baseUrl = import.meta.env.VITE_BASE44_API_URL || 'https://api.base44.com';
    this.apiKey = import.meta.env.VITE_BASE44_API_KEY;
  }

  integrations = {
    Core: {
      InvokeLLM: async ({ prompt, provider = 'base44', apiKey = null }) => {
        try {
          // Determine which provider to use
          const effectiveProvider = provider || 'base44';
          
          // For base44, use the configured API key
          if (effectiveProvider === 'base44') {
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
          }

          // For other providers, use their respective APIs
          return await this.invokePremiumLLM(effectiveProvider, prompt, apiKey);
        } catch (error) {
          console.error('InvokeLLM error:', error);
          throw error;
        }
      },
    },
  };

  async invokePremiumLLM(provider, prompt, apiKey) {
    if (!apiKey) {
      throw new Error(`API key required for ${provider}`);
    }

    switch (provider) {
      case 'openai':
        return await this.invokeOpenAI(prompt, apiKey);
      case 'grok':
        return await this.invokeGrok(prompt, apiKey);
      case 'gemini':
        return await this.invokeGemini(prompt, apiKey);
      case 'anthropic':
        return await this.invokeAnthropic(prompt, apiKey);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  async invokeOpenAI(prompt, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async invokeGrok(prompt, apiKey) {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Grok API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async invokeGemini(prompt, apiKey) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gemini API request failed');
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || '';
  }

  async invokeAnthropic(prompt, apiKey) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API request failed');
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }
}

export const base44 = new Base44Client();
